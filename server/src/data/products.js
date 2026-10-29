// starter catalog used to initialize a new firestore database
const { apiPublicUrl } = require("../config");

function seededImage(filename) {
  return `${apiPublicUrl}/uploads/product-images/${filename}`;
}

module.exports = [
  {
    id: "home-shirt",
    name: "Timbertop Home Shirt",
    category: "Matchwear",
    price: 79.95,
    colour: "#c1121f",
    imageUrl: seededImage("home-shirt.webp"),
    description:
      "The official Timbertop United home shirt for matchday and every day.",
    available: true,
  },
  {
    id: "training-hoodie",
    name: "Training Ground Hoodie",
    category: "Training",
    price: 59.95,
    colour: "#a30f1a",
    imageUrl: seededImage("training-hoodie.webp"),
    description:
      "A warm club hoodie built for training sessions and cool evenings.",
    available: true,
  },
  {
    id: "supporter-scarf",
    name: "Supporter Scarf",
    category: "Supporter gear",
    price: 29.95,
    colour: "#8f0d17",
    imageUrl: seededImage("supporter-scarf.webp"),
    description: "Show your colours from the first whistle to the final song.",
    available: true,
  },
  {
    id: "club-cap",
    name: "Timbertop Club Cap",
    category: "Accessories",
    price: 24.95,
    colour: "#d8666e",
    imageUrl: seededImage("club-cap.webp"),
    description:
      "A comfortable everyday cap finished with the Timbertop crest.",
    available: true,
  },
];
