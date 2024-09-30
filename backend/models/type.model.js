const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const typeSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    status: { type: Boolean, default: true, required: true },
  },
  { timestamps: true },
);

const Type = mongoose.model("Type", typeSchema);

module.exports = Type;
