const fs = require("fs");

const categoryCount = 20;
const productCount = 10000;

let categories = [];
let products = [];

// Generate Categories
for (let i = 1; i <= categoryCount; i++) {
  categories.push({
    _id: i,
    name: `Category ${i}`,
    description: `Description for category ${i}`,
    createdAt: new Date(),
  });
}

// Generate Products
for (let i = 1; i <= productCount; i++) {
  const randomCategory = Math.floor(Math.random() * categoryCount) + 1;

  products.push({
    _id: i,
    name: `Product ${i}`,
    description: `This is description for product ${i}`,
    price: Number((Math.random() * 1000).toFixed(2)),
    stock: Math.floor(Math.random() * 500),
    categoryId: randomCategory,
    brand: `Brand ${Math.floor(Math.random() * 50) + 1}`,
    rating: Number((Math.random() * 5).toFixed(1)),
    isActive: Math.random() > 0.2,
    createdAt: new Date(),
  });
}

// Save Files
fs.writeFileSync("categories.json", JSON.stringify(categories, null, 2));
fs.writeFileSync("products.json", JSON.stringify(products, null, 2));

console.log("✅ categories.json and products.json created successfully!");
