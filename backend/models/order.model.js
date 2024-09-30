const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    specificAddress: { type: String, required: true },
  },
  { _id: false },
);

const orderItemSchema = new Schema(
  {
    thumbnail: { type: String },
    productTitle: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // Giá mỗi sản phẩm
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    totalPrice: { type: Number, required: true },
    orderStatus: { type: String, enum: ["pending", "completed", "shipping", "cancelled"], default: "pending" },
    isPayment: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
