const express = require("express");
const typeRouter = express.Router();

const { TypeController } = require("../controllers/index");

// GET all tags
typeRouter.get("/get-all", TypeController.getAllTypes);

// GET a single tag by ID
typeRouter.get("/get-details/:id", TypeController.getTypeById);

// POST create a new tag
typeRouter.post("/create", TypeController.createType);

// PUT update a tag by ID
typeRouter.put("/update/:id", TypeController.updateType);

// DELETE delete a tag by ID
typeRouter.delete("/delete/:id", TypeController.deleteType);

module.exports = typeRouter;
