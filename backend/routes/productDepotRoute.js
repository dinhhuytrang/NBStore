const express = require("express");
const productDepotRouter = express.Router();
const { productDepotController } = require("../controllers");

// Create a new ProductDepot
productDepotRouter.post("/create", productDepotController.createProductDepot);

// Get all ProductDepots
productDepotRouter.get("/get-all-product", productDepotController.getAllProductDepots);

// Get a ProductDepot by ID
productDepotRouter.get("/get-product-detail/:id", productDepotController.getProductDepotById);

// Update a ProductDepot by ID
productDepotRouter.put("/update/:id", productDepotController.updateProductDepot);

// Delete a ProductDepot by ID
productDepotRouter.delete("/delete/:id", productDepotController.deleteProductDepot);

module.exports = productDepotRouter;
