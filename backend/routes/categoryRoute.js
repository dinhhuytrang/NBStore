const express = require("express");
const categoryRouter = express.Router();
const { CategoryController } = require("../controllers");

// GET all categories
categoryRouter.get("/get-all", CategoryController.getAllCategories);

// GET a single category by ID
categoryRouter.get("/get-details/:id", CategoryController.getCategoryById);

// POST create a new category
categoryRouter.post("/create", CategoryController.createCategory);

// PUT update a category by ID
categoryRouter.put("/update/:id", CategoryController.updateCategory);

// DELETE delete a category by ID
categoryRouter.delete("/delete/:id", CategoryController.deleteCategory);

module.exports = categoryRouter;
