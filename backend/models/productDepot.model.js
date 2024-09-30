const mongoose = require("mongoose");

const stockDetailSchema = new mongoose.Schema({
  size: { type: String, required: true },
  quantity: { type: Number, default: 0 },
});

const stockSchema = new mongoose.Schema({
  colorCode: { type: String, required: true },
  details: [stockDetailSchema],
});

const productDepotSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    importPrice: { type: Number, required: true },
    stock: { type: Number, required: true },
    stockDetails: [stockSchema],
    importTotal: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

const ProductDepot = mongoose.model("ProductDepot", productDepotSchema);

module.exports = ProductDepot;
