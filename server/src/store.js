const bcrypt = require("bcryptjs");
const { constants } = require("node:fs");
const { copyFile, mkdir } = require("node:fs/promises");
const path = require("node:path");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");

const initialProducts = require("./data/products");
const initialNews = require("./data/news");

const { applicationDefault, initializeApp } = require("firebase-admin/app");
const { adminPassword } = require("./config");
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
  passwordHash: bcrypt.hashSync(adminPassword, 12),
  role: "admin",
};

const collections = {
  users: "users",
  products: "products",
  news: "news",
  subscriptions: "subscriptions",
  contactMessages: "contactMessages",
};

const seededImageDirectory = path.join(__dirname, "data/product-images");
const uploadedImageDirectory = path.join(__dirname, "../uploads/product-images");

async function ensureSeedImages() {
  await mkdir(uploadedImageDirectory, { recursive: true });
  for (const product of initialProducts) {
    const filename = new URL(product.imageUrl).pathname.split("/").pop();
    try {
      await copyFile(
        path.join(seededImageDirectory, filename),
        path.join(uploadedImageDirectory, filename),
        constants.COPYFILE_EXCL,
      );
    } catch (error) {
      // preserve an installed seed image and avoid overwriting admin uploads
      if (error.code !== "EEXIST") throw error;
    }
  }
}

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

async function ensureConfiguredAdmin() {
  // keep the configured bootstrap credentials authoritative for the fixed admin account
  await db.collection(collections.users).doc(adminUser.id).set(adminUser, { merge: true });
}

async function migrateProductImages() {
  // only starter records are migrated so custom products remain unchanged
  const products = db.collection(collections.products);
  const snapshot = await products.get();
  const starterProducts = new Map(initialProducts.map((product) => [product.id, product]));
  const batch = db.batch();
  let hasUpdates = false;

  for (const document of snapshot.docs) {
    const starterProduct = starterProducts.get(document.id);
    if (!starterProduct) continue;

    const data = document.data();
    const updates = {};
    if (!data.imageUrl || data.imageUrl.startsWith("/images/")) {
      updates.imageUrl = starterProduct.imageUrl;
    }
    if (Object.hasOwn(data, "initials")) updates.initials = FieldValue.delete();
    if (Object.keys(updates).length) {
      batch.update(document.ref, updates);
      hasUpdates = true;
    }
  }

  if (hasUpdates) await batch.commit();
}

let seedPromise;
// share one initialization task across concurrent requests
async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      await ensureSeedImages();
      await Promise.all([
        seedCollection("products", initialProducts),
        seedCollection("news", initialNews),
        ensureConfiguredAdmin(),
      ]);
      await migrateProductImages();
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
