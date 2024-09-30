const mongoose = require("mongoose");

const User = require("./user.model");
const Role = require("./role.model");
const Order = require("./order.model");
const Cart = require("./cart.model");
const Product = require("./product.model");
const ProductDepot = require("./productDepot.model");
const Category = require("./category.model");
const Tag = require("./tag.model");
const Type = require("./type.model");
const Brand = require("./brand.model");
const Color = require("./color.model");

mongoose.Promise = global.Promise;
const db = {};
db.user = User;
db.role = Role;
db.order = Order;
db.cart = Cart;
db.product = Product;
db.productDepot = ProductDepot;
db.category = Category;
db.tag = Tag;
db.type = Type;
db.brand = Brand;
db.color = Color;

db.connectDB = async () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    })
    .then(() => {
      console.log("Successfully connect to MongoDB. -> " + process.env.DB_NAME);
    })
    .catch((err) => {
      console.error(err.message);
      process.exit();
    });
};
module.exports = db;
