const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, default: "" }, // Đường dẫn đến hình ảnh của thương hiệu, mặc định là rỗng
    status: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
