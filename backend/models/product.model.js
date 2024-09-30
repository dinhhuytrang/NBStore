const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const stockDetailSchema = new mongoose.Schema({
  size: { type: String, required: true },
  quantity: { type: Number, default: 0 },
});

const stockSchema = new mongoose.Schema({
  colorCode: { type: String, required: true },
  // image: { type: String, required: true },
  details: [stockDetailSchema],
  imageLink: { type: String },
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    rating: { type: Number, required: true },
    stock: { type: Number, required: true },
    type: { type: mongoose.Schema.Types.ObjectId, ref: "Type", required: true },
    tag: { type: mongoose.Schema.Types.ObjectId, ref: "Tag" },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    availabilityStatus: { type: String, required: true },
    reviews: [reviewSchema],
    minimumOrderQuantity: { type: Number, required: true },
    images: [{ type: String }],
    thumbnail: { type: String },
    stockDetails: [stockSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
