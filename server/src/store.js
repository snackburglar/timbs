const bcrypt = require("bcryptjs");
const { getFirestore } = require("firebase-admin/firestore");

const initialProducts = require("./data/products");
const initialNews = require("./data/news");

const { applicationDefault, initializeApp } = require("firebase-admin/app");
initializeApp({
  credential: applicationDefault(),
  ...(process.env.FIREBASE_PROJECT_ID
    ? { projectId: process.env.FIREBASE_PROJECT_ID }
    : {}),
});
const db = getFirestore();

const adminUser = {
  id: "00000000-0000-4000-8000-000000000001",
  name: "Timbertop Admin",
  email: (process.env.ADMIN_EMAIL || "admin@timbertop.com").toLowerCase(),
  passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || "Admin123!", 10),
  role: "admin",
};

const collections = {
  users: "users",
  products: "products",
  news: "news",
  subscriptions: "subscriptions",
  contactMessages: "contactMessages",
};

async function seedCollection(name, records) {
  const collection = db.collection(collections[name]);
  const snapshot = await collection.limit(1).get();
  if (!snapshot.empty) return;
  const batch = db.batch();
  for (const record of records) {
    batch.set(collection.doc(record.id), record);
  }
  await batch.commit();
}

let seedPromise;
async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      await Promise.all([
        seedCollection("products", initialProducts),
        seedCollection("news", initialNews),
        seedCollection("users", [adminUser]),
      ]);
    })();
  }
  await seedPromise;
}

async function list(name) {
  await ensureSeeded();
  const snapshot = await db.collection(collections[name]).get();
  return snapshot.docs.map((document) => document.data());
}

async function listProductsByCategoryAndPrice(category, direction) {
  await ensureSeeded();
  const snapshot = await db
    .collection(collections.products)
    .where("category", "==", category)
    .orderBy("price", direction)
    .get();
  return snapshot.docs.map((document) => document.data());
}

async function get(name, id) {
  await ensureSeeded();
  const document = await db.collection(collections[name]).doc(id).get();
  return document.exists ? document.data() : null;
}

async function create(name, record) {
  await ensureSeeded();
  try {
    await db.collection(collections[name]).doc(record.id).create(record);
    return true;
  } catch (error) {
    if (error.code === 6 || error.code === "already-exists") return false;
    throw error;
  }
}

async function replace(name, id, record) {
  await ensureSeeded();
  const reference = db.collection(collections[name]).doc(id);
  const document = await reference.get();
  if (!document.exists) return null;
  await reference.set(record);
  return record;
}

async function remove(name, id) {
  await ensureSeeded();
  const reference = db.collection(collections[name]).doc(id);
  const document = await reference.get();
  if (!document.exists) return false;
  await reference.delete();
  return true;
}

async function findUserByEmail(email) {
  await ensureSeeded();
  const normalized = email.toLowerCase();
  const snapshot = await db
    .collection(collections.users)
    .where("email", "==", normalized)
    .limit(1)
    .get();
  return snapshot.empty ? null : snapshot.docs[0].data();
}

async function createUser(user) {
  await ensureSeeded();
  return create("users", user);
}

module.exports = {
  create,
  createUser,
  findUserByEmail,
  get,
  list,
  listProductsByCategoryAndPrice,
  remove,
  replace,
};
