const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema(
  {
    name: { type: String, required: true },
    status: { type: Boolean, default: true, required: true },
  },
  { timestamps: true },
);

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
