const db = require("../models");
const Cart = db.cart;
const User = db.user;

// GET cart by user ID
const getCartByUserId = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const cart = await Cart.findOne({ userId }).populate("cartItems.productId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const data = {
      id: cart._id,
      userId: cart.userId,
      cartItems: cart.cartItems.map((item) => {
        // Find the color detail for the selected color
        const colorDetail = item.productId.stockDetails.find((detail) => detail.colorCode === item.color);
        // Determine the correct thumbnail
        const thumbnail = colorDetail && colorDetail.imageLink ? colorDetail.imageLink : item.productId.thumbnail;

        return {
          id: item._id,
          productTitle: item.productId.title,
          productId: item.productId._id,
          thumbnail: thumbnail, // Use the determined thumbnail
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        };
      }),
      totalPrice: cart.totalPrice,
    };
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// POST create cart for user
const createCart = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newCart = new Cart({ userId, cartItems: [], totalPrice: 0 });
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    next(error);
  }
};

// POST add product to cart
const addProductToCart = async (req, res, next) => {
  try {
    const { cartItem, userId, totalPrice } = req.body;

    // Find the cart by userId
    let cart = await Cart.findOne({ userId });
    if (cart) {
      // Update existing cart
      const productIndex = cart.cartItems.findIndex((item) => item.productId.toString() === cartItem.productId && item.color === cartItem.color && item.size === cartItem.size);

      if (productIndex > -1) {
        // If product with the same color and size already exists in cart, update the quantity
        cart.cartItems[productIndex].quantity += cartItem.quantity;
      } else {
        // If product does not exist in cart, add new item
        cart.cartItems.push(cartItem);
      }

      // Update the total price of the cart
      cart.totalPrice += cartItem.price * cartItem.quantity;
    } else {
      // Create a new cart if it doesn't exist
      cart = new Cart({ userId, cartItems: [cartItem], totalPrice });
    }

    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    next(error);
  }
};

// POST: remove 1 item from cart
const deleteOneItemFromCart = async (req, res, next) => {
  try {
    const { userId, productId, color, size } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.cartItems.findIndex((item) => item.productId.toString() === productId && item.color === color && item.size === size);

    if (itemIndex > -1) {
      const [removedItem] = cart.cartItems.splice(itemIndex, 1);
      cart.totalPrice -= removedItem.price * removedItem.quantity;
      const updatedCart = await cart.save();
      res.status(200).json(updatedCart);
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    next(error);
  }
};

// POST remove ordered items from cart
const removeOrderedItemsFromCart = async (req, res, next) => {
  try {
    const { userId, orderedItems } = req.body;
    console.log(orderedItems + " " + userId);
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    // Remove ordered items from cart
    cart.cartItems = cart.cartItems.filter(
      (cartItem) => !orderedItems.some((orderedItem) => orderedItem.productId === cartItem.productId.toString() && orderedItem.color === cartItem.color && orderedItem.size === cartItem.size),
    );
    // Recalculate total price
    cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

module.exports = { addProductToCart, getCartByUserId, createCart, removeOrderedItemsFromCart, deleteOneItemFromCart };
