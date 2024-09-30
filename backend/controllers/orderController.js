const createHttpError = require("http-errors");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const nodeMailer = require("nodemailer");

const db = require("../models");
const Cart = db.cart;
const Product = db.product;
const User = db.user;
const Order = db.order;

//người dùng tạo đơn mua thành công thì tiến hành trừ luôn số lượng sản phẩm trong kho
//cancel order thì trả lại số lượng sản phẩm trong kho

// GET all orders by user ID
const getOrdersByUserId = async (req, res, next) => {
  try {
    const userId = req.params.id;
    // const orders = await Order.find({ userId }).populate("orderItems.productId");
    const orders2 = await Order.find({ userId });
    // // console.log(orders);
    // console.log("=====================================");
    // // console.log(orders2);

    // const image1 = orders2.map((order) => {
    //   return order.orderItems.map((item) => {
    //     return item.thumbnail;
    //   });
    // });
    // console.log("=====================================");

    // console.log(image1);
    if (!orders2.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders2);
  } catch (error) {
    next(error);
  }
};

// GET all order of users in system (for admin/seller)
const getAllOrders = async (req, res, next) => {
  try {
    //get all order in db - nếu có .populate("orderItems.productId") thì sẽ lấy ra thông tin của product ứng với productId
    const orders = await Order.find();

    // console.log(orders);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

async function sendOrderDetailsEmail(order) {
  const transporter = nodeMailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "vanminhtuan2003@gmail.com",
      pass: "zubo aayv abtz kwsb",
    },
  });

  const user = await User.findById(order.userId);

  const emailTemplate = fs.readFileSync(path.join(__dirname, "../templates/orderEmail.html"), "utf8");
  const template = handlebars.compile(emailTemplate);
  const html = template({
    orderId: order._id,
    userName: user.name,
    shippingAddress: {
      fullName: order.shippingAddress.fullName,
      phone: order.shippingAddress.phone,
      address: order.shippingAddress.address,
      specificAddress: order.shippingAddress.specificAddress,
    },
    paymentMethod: order.paymentMethod,
    orderItems: order.orderItems.map((item) => ({
      productTitle: item.productTitle,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    })),
    total: order.totalPrice,
  });

  const mailOptions = {
    from: '"HolaWear" <your-email@gmail.com>',
    to: user.email,
    subject: `Order #${order._id} - HolaWear`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order details email sent successfully");
  } catch (err) {
    console.error("Failed to send order details email:", err);
  }
}

// POST create order for user
const createOrder = async (req, res, next) => {
  try {
    const { userId, orderItems, shippingAddress, totalPrice, orderStatus } = req.body;

    // console.log(orderItems);
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get product IDs from order items
    const productIds = orderItems.map((item) => item.productId);

    // Find products by IDs
    const products = await Product.find({ _id: { $in: productIds } });

    // Check stock availability for each product item
    for (const item of orderItems) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found for item ${item.productTitle}` });
      }
      const stockDetail = product.stockDetails.find((stock) => stock.colorCode === item.color);
      if (!stockDetail) {
        return res.status(400).json({ message: `Color ${item.color} not available for product ${item.productTitle}` });
      }
      const sizeDetail = stockDetail.details.find((detail) => detail.size === item.size);
      if (!sizeDetail || sizeDetail.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for size ${item.size} of product ${item.productTitle}, just have ${sizeDetail ? sizeDetail.quantity : 0} in stock.` });
      }
    }

    // Create a new order
    const newOrder = new Order({
      userId,
      orderItems,
      shippingAddress,
      totalPrice,
      orderStatus: orderStatus || "pending",
      isPayment: false,
    });

    const savedOrder = await newOrder.save();
    // console.log("====================");
    // console.log(savedOrder);
    // Update stock details
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      const stockDetail = product.stockDetails.find((stock) => stock.colorCode === item.color);
      const sizeDetail = stockDetail.details.find((detail) => detail.size === item.size);
      sizeDetail.quantity -= item.quantity;
      product.stock -= item.quantity; // Decrease total stock
      await product.save();
    }

    sendOrderDetailsEmail(savedOrder);

    res.status(201).json(savedOrder);
  } catch (error) {
    next(error);
  }
};
// POST approve order (change status from pending to shipped) - for admin/seller
const approveOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = "shipped";
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// POST cancel order (user cancels their order)
const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Reverse the stock quantity adjustments
    for (const item of order.orderItems) {
      const product = await Product.findById(item.productId);
      const stockDetail = product.stockDetails.find((stock) => stock.colorCode === item.color);
      const sizeDetail = stockDetail.details.find((detail) => detail.size === item.size);
      sizeDetail.quantity += item.quantity;

      console.log("Reversed stock quantity for product", product.title, "size", item.size, "color", item.color, "quantity", item.quantity);
      // await product.save();
    }

    // order.orderStatus = "cancelled";
    // const updatedOrder = await order.save();
    // res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// POST user payment (mark order as completed) - Confirm Received
const completedOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = "completed";
    order.isPayment = true;
    const updatedOrder = await order.save();
    res.status(201).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

//PUT update order status and isPayment by order id
const statusOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (status === "shipping") {
      order.orderStatus = "shipping";
    } else if (status === "completed") {
      order.orderStatus = "completed";
      order.isPayment = true;
    } else if (status === "cancelled") {
      order.orderStatus = "cancelled";
      // Update stock details when an order is cancelled
      for (const item of order.orderItems) {
        const product = await Product.findById(item.productId);
        const stockDetail = product.stockDetails.find((stock) => stock.colorCode === item.color);
        const sizeDetail = stockDetail.details.find((detail) => detail.size === item.size);
        sizeDetail.quantity += item.quantity;
        product.stock += item.quantity; // Restore total stock

        // Add back the size if it was removed (if applicable)
        if (!stockDetail.details.find((detail) => detail.size === item.size)) {
          stockDetail.details.push({ size: item.size, quantity: item.quantity });
        }

        // Add back the color if it was removed (if applicable)
        if (!product.stockDetails.find((stock) => stock.colorCode === item.color)) {
          product.stockDetails.push({ colorCode: item.color, details: [{ size: item.size, quantity: item.quantity }] });
        }

        await product.save();
      }
    }
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// get all orders to find Top Products by Units Sold
const getTopProducts = async (req, res, next) => {
  try {
    const orders = await Order.find({ orderStatus: "completed" }).populate("orderItems.productId");

    const productSales = {};

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const productId = item.productId._id.toString();
        const key = `${productId}_${item.color}_${item.size}`;

        if (!productSales[key]) {
          productSales[key] = {
            productId: productId,
            productTitle: item.productTitle,
            productThumbnail: item.thumbnail,
            productSize: item.size,
            productColor: item.color,
            quantity: 0,
          };
        }

        productSales[key].quantity += item.quantity;
      });
    });

    const sortedProducts = Object.values(productSales).sort((a, b) => b.quantity - a.quantity);
    const topProducts = sortedProducts.slice(0, 10);

    res.status(200).json(topProducts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  getAllOrders,
  approveOrder,
  cancelOrder,
  completedOrder,
  statusOrder,
  getTopProducts,
};
