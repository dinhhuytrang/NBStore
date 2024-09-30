const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colorSchema = new Schema(
  {
    code: { type: String, required: true }, // Mã màu sắc, ví dụ: "#f0f0f0"
  },
  { timestamps: true },
);

const Color = mongoose.model("Color", colorSchema);

module.exports = Color;
