const express = require("express");
const colorRouter = express.Router();
const { ColorController } = require("../controllers");

// GET all colors
colorRouter.get("/get-all", ColorController.getAllColor);

// GET a single colors by ID
colorRouter.get("/get-details/:id", ColorController.getColorById);

// POST create a new colors
colorRouter.post("/create", ColorController.createColor);

// PUT update a colors by ID
colorRouter.put("/update/:id", ColorController.updateColor);

// DELETE delete a colors by ID
colorRouter.delete("/delete/:id", ColorController.deleteColor);

module.exports = colorRouter;
