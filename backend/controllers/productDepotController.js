const createHttpError = require("http-errors");
const db = require("../models");
const ProductDepot = db.productDepot;
const Product = db.product;
// Create a new ProductDepot
const createProductDepot = async (req, res) => {
  try {
    const { productId, importPrice, stock, stockDetails, importTotal } = req.body;

    // Transform stockDetails to match the required schema
    const transformedStockDetails = stockDetails.map((detail) => ({
      imageLink: detail.imageLink,
      colorCode: detail.colorCode,
      details: Object.keys(detail.details).map((size) => ({
        size,
        quantity: detail.details[size],
      })),
    }));

    // Create a new ProductDepot instance
    const newProductDepot = new ProductDepot({
      productId,
      importPrice,
      stock,
      stockDetails: transformedStockDetails,
      importTotal,
    });

    // Save the new ProductDepot instance to the database
    await newProductDepot.save();
    console.log(newProductDepot);

    // Update the stock and stock details in the Product model
    const product = await Product.findById(productId);
    if (!product) {
      throw createHttpError(404, "Product not found");
    }

    // Update the stock in the Product model
    product.stock += stock;

    // Update the stock details in the Product model
    transformedStockDetails.forEach((detail) => {
      const existingDetail = product.stockDetails.find((d) => d.colorCode === detail.colorCode);
      if (existingDetail) {
        detail.details.forEach((sizeDetail) => {
          const existingSizeDetail = existingDetail.details.find((sd) => sd.size === sizeDetail.size);
          if (existingSizeDetail) {
            existingSizeDetail.quantity += sizeDetail.quantity;
          } else {
            existingDetail.details.push(sizeDetail);
          }
        });
      } else {
        product.stockDetails.push(detail);
      }
    });

    // Save the updated product
    await product.save();
    console.log(product);
    res.status(201).json({ message: "Product depot created and product stock updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all ProductDepots
const getAllProductDepots = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filters = req.query;

  try {
    const query = {};
    const skip = (page - 1) * limit;
    const productDepots = await ProductDepot.find(query).populate("_id").skip(skip).limit(limit);
    // const productFound = await ProductDepot.find(query).populate("productId");
    // console.log(productFound);

    const totalProductDepots = await ProductDepot.countDocuments(query);
    const totalPages = Math.ceil(totalProductDepots / limit);

    res.status(200).json({
      productDepots,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a ProductDepot by ID
const getProductDepotById = async (req, res) => {
  try {
    const productDepot = await ProductDepot.findById(req.params.id).populate("productId");
    if (!productDepot) {
      return res.status(404).json({ message: "ProductDepot not found" });
    }
    res.status(200).json(productDepot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a ProductDepot by ID
const updateProductDepot = async (req, res) => {
  try {
    const updatedProductDepot = await ProductDepot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProductDepot) {
      return res.status(404).json({ message: "ProductDepot not found" });
    }
    res.status(200).json(updatedProductDepot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a ProductDepot by ID
const deleteProductDepot = async (req, res) => {
  try {
    const deletedProductDepot = await ProductDepot.findByIdAndDelete(req.params.id);
    if (!deletedProductDepot) {
      return res.status(404).json({ message: "ProductDepot not found" });
    }
    res.status(200).json({ message: "ProductDepot deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createProductDepot,
  getAllProductDepots,
  getProductDepotById,
  updateProductDepot,
  deleteProductDepot,
};
