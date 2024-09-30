const db = require("../models");
const Product = db.product;
const Category = db.category;
const Tag = db.tag;
const Brand = db.brand;
const Type = db.type;
const mongoose = require("mongoose");
const uploadToCloudinary = require("../configs/cloudinaryConfig");
const crypto = require("crypto");

// product status : InActive, In Stock
("use strict");

// GET all products
const getAllProducts = async (req, res) => {
  const filters = req.query;

  try {
    const query = {};

    // Process filters
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.brand) {
      query.brand = filters.brand;
    }

    // const products = await Product.find(query).populate("category", "name");
    // res.status(200).json(products);
    const products = await Product.find(query);
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProducts2 = async (req, res) => {
  const filters = req.query;

  try {
    const query = {};

    // Process filters
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.brand) {
      query.brand = filters.brand;
    }

    const products = await Product.find(query).populate("category", "name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name").populate("brand", "name").populate("type", "name").populate("tag", "name");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper functions
function splitImagesLink(imagesString) {
  return imagesString.split("--").filter((image) => image !== "");
}
//function add image to images array
function addImageToImagesArray(imagesArray, image) {
  imagesArray.push(image);
}

// POST create a new product
const createProduct = async (req, res) => {
  try {
    const { title, description, category, price, type, images, thumbnail, tag, brand, availabilityStatus, stock } = req.body;

    // Validate object IDs
    if (!mongoose.Types.ObjectId.isValid(category) || !mongoose.Types.ObjectId.isValid(type) || (tag && !mongoose.Types.ObjectId.isValid(tag)) || (brand && !mongoose.Types.ObjectId.isValid(brand))) {
      console.log("Invalid ID format for category, type, tag, or brand");
      return res.status(400).json({ message: "Invalid ID format for category, type, tag, or brand" });
    }

    const categoryObject = await Category.findById(category);
    const tagObject = await Tag.findById(tag);
    const brandObject = await Brand.findById(brand);
    const typeObject = await Type.findById(type);
    console.log(categoryObject._id._id);
    console.log(tagObject._id);
    console.log(brandObject._id);
    console.log(typeObject._id);

    // if (!categoryObject || !typeObject || (tag && !tagObject) || (brand && !brandObject)) {
    //   console.log("Related category, type, tag, or brand not found");
    //   return res.status(400).json({ message: "Related category, type, tag, or brand not found" });
    // }

    // Generate a unique public_id for Cloudinary uploads
    const public_id = "hlw" + crypto.randomBytes(8).toString("hex");

    // Upload the thumbnail to Cloudinary
    const thumbnailUrl = await uploadToCloudinary(thumbnail, public_id + "_thumbnail");

    // Upload images to Cloudinary and get their URLs
    const imagesUrl = await Promise.all(images.map((image, index) => uploadToCloudinary(image, public_id + "_image" + (index + 1))));

    // Create a new product instance
    const newProduct = new Product({
      title,
      description,
      category: categoryObject._id,
      price: 0,
      discountPercentage: 10,
      rating: 0,
      stock: 0,
      type: typeObject._id,
      tag: tagObject?._id,
      brand: brandObject?._id,
      availabilityStatus,
      minimumOrderQuantity: 1,
      images: imagesUrl,
      thumbnail: thumbnailUrl,
      stockDetails: [],
      reviews: [],
    });

    console.log("Saving new product:", newProduct);

    // Save the product to the database
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ message: error.message });
  }
};

// POST import products
// const importProducts = async (req, res) => {
//   try {
//     const products = req.body.products;
//     const importedProducts = [];
//     for (const productData of products) {
//       const { title, description, category, price, discountPercentage, stock, type, availabilityStatus, minimumOrderQuantity, images, thumbnail, tag, brand, stockDetails } = productData;

//       const categoryObject = await Category.findOne({ name: category });
//       const tagObject = await Tag.findOne({ name: tag });
//       const brandObject = await Brand.findOne({ name: brand });
//       const typeObject = await Type.findOne({ name: type });

//       const newProduct = new Product({
//         title,
//         description,
//         category: categoryObject ? categoryObject._id : null,
//         price: 0,
//         discountPercentage: 0,
//         rating: 0,
//         stock,
//         type: typeObject ? typeObject._id : null,
//         tag: tagObject ? tagObject._id : null,
//         brand: brandObject ? brandObject._id : null,
//         availabilityStatus: "InActive",
//         minimumOrderQuantity: 1,
//         images,
//         thumbnail,
//         reviews: [],
//         stockDetails,
//       });

//       const savedProduct = await newProduct.save();
//       importedProducts.push(savedProduct);
//       // importedProducts.push(newProduct);
//       // console.log(importedProducts);
//     }
//     res.status(201).json({ message: "Products imported successfully", products: importedProducts });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

const importProducts = async (req, res) => {
  try {
    const products = req.body.products;
    const importedProducts = [];

    for (const productData of products) {
      const { title, description, category, price, discountPercentage, stock, type, availabilityStatus, minimumOrderQuantity, images, thumbnail, tag, brand, stockDetails } = productData;

      const categoryObject = await Category.findOne({ name: category });
      const tagObject = await Tag.findOne({ name: tag });
      const brandObject = await Brand.findOne({ name: brand });
      const typeObject = await Type.findOne({ name: type });

      // console.log(categoryObject);
      // console.log(tagObject);
      // console.log(brandObject);
      // console.log(typeObject);
      // console.log("==================");
      // Generate a unique public_id for Cloudinary uploads
      const public_id = "hlw" + crypto.randomBytes(8).toString("hex");

      // Upload the thumbnail to Cloudinary
      const thumbnailUrl = await uploadToCloudinary(thumbnail, public_id + "_thumbnail");

      // Upload images to Cloudinary and get their URLs
      const imagesUrl = await Promise.all(images.map((image, index) => uploadToCloudinary(image, public_id + "_image" + (index + 1))));

      const newProduct = new Product({
        title,
        description,
        category: categoryObject ? categoryObject._id : null,
        price: price || 0,
        discountPercentage: discountPercentage || 0,
        rating: 0,
        stock: stock || 0,
        type: typeObject ? typeObject._id : null,
        tag: tagObject ? tagObject._id : null,
        brand: brandObject ? brandObject._id : null,
        availabilityStatus: availabilityStatus || "InActive",
        minimumOrderQuantity: minimumOrderQuantity || 1,
        images: imagesUrl,
        thumbnail: thumbnailUrl,
        reviews: [],
        stockDetails: stockDetails || [],
      });

      const savedProduct = await newProduct.save();
      importedProducts.push(savedProduct);
    }

    res.status(201).json({ message: "Products imported successfully", products: importedProducts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PUT update a product by ID
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET products by category ID
const getProductByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Kiểm tra xem categoryId có phải là ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Product.find({ category: categoryId }).populate("category", "name");

    if (products.length === 0) {
      return res.status(404).json({ message: "Products not found" });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update product status
const updateProductStatus = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { status } = req.body;
    console.log(productId, status);

    // Find the product by ID and update its status
    const product = await Product.findByIdAndUpdate(productId, { availabilityStatus: status }, { new: true });
    // console.log(product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product status updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//PUT update product price by product id
const updateProductPrice = async (req, res) => {
  try {
    const productId = req.params.productId;
    const newPrice = req.body.newPrice;

    // Find the product by ID
    const productFound = await Product.findById(productId);

    // If the product is not found, throw an error
    if (!productFound) {
      throw new Error("Product not found");
    }

    // Update the price if newPrice is not undefined or null
    if (newPrice !== undefined && newPrice !== null) {
      //line 227 : check xem cái input người dùng có phải là số || null không, ko thì mới update
      productFound.price = newPrice ? newPrice : productFound.price;
    }

    const updatedProduct = await productFound.save();
    res.status(200).json({ message: "Product price updated successfully", updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllProducts2, updateProductPrice, updateProductStatus, getProductByCategoryId, getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, importProducts };
