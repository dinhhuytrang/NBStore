const Type = require("../models/type.model");

// GET all types
exports.getAllTypes = async (req, res) => {
  try {
    const types = await Type.find();
    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single type by ID
exports.getTypeById = async (req, res) => {
  try {
    const type = await Type.findById(req.params.id);
    if (!type) {
      return res.status(404).json({ message: "Type not found" });
    }
    res.status(200).json(type);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create a new type
exports.createType = async (req, res) => {
  const type = new Type(req.body);
  try {
    const newType = await type.save();
    res.status(201).json(newType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update a type by ID
exports.updateType = async (req, res) => {
  try {
    const type = await Type.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!type) {
      return res.status(404).json({ message: "Type not found" });
    }
    res.status(200).json(type);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE delete a type by ID
exports.deleteType = async (req, res) => {
  try {
    const type = await Type.findByIdAndUpdate(req.params.id, { status: false }, { new: true });
    if (!type) {
      return res.status(404).json({ message: "Type not found" });
    }
    res.status(200).json({ message: "Type deleted successfully by set status to false" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
