const Color = require("../models/color.model");

// GET all color
exports.getAllColor = async (req, res) => {
  try {
    const colors = await Color.find();
    res.status(200).json(colors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single color by ID
exports.getColorById = async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) {
      return res.status(404).json({ message: "Color not found" });
    }
    res.status(200).json(color);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create a new tag
exports.createColor = async (req, res) => {
  const color = new Color(req.body);
  try {
    const newColor = await color.save();
    res.status(201).json(newColor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update a color by ID
exports.updateColor = async (req, res) => {
  try {
    const color = await Color.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!color) {
      return res.status(404).json({ message: "Color not found" });
    }
    res.status(200).json(color);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE delete a color by ID
exports.deleteColor = async (req, res) => {
  try {
    const color = await Color.findByIdAndUpdate(req.params.id, { status: false }, { new: true });
    if (!color) {
      return res.status(404).json({ message: "Color not found" });
    }
    res.status(200).json({ message: "Color deleted successfully by set status to false" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
