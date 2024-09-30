const express = require("express");
const brandRouter = express.Router();

const { BrandController } = require("../controllers");
// GET all tags
brandRouter.get("/get-all", BrandController.getAllBrands);

// GET a single tag by ID
brandRouter.get("/get-details/:id", BrandController.getBrandById);

// POST create a new tag
brandRouter.post("/create", BrandController.createBrand);

// PUT update a tag by ID
brandRouter.put("/update/:id", BrandController.updateBrand);

// DELETE delete a tag by ID
brandRouter.delete("/delete/:id", BrandController.deleteBrand);

module.exports = brandRouter;
