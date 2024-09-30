const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema(
  {
    productTitle: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    thumbnail: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // Giá mỗi sản phẩm
  },
  { _id: false },
);

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cartItems: [cartItemSchema],
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true },
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
