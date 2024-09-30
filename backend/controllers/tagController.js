const Tag = require("../models/tag.model");

// GET all tags
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single tag by ID
exports.getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create a new tag
exports.createTag = async (req, res) => {
  const tag = new Tag(req.body);
  try {
    const newTag = await tag.save();
    res.status(201).json(newTag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update a tag by ID
exports.updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE delete a tag by ID
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, { status: false }, { new: true });
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json({ message: "Tag deleted successfully by set status to false" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
