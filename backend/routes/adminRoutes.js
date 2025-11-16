const express = require("express");
const router = express.Router();
const { auth, adminOnly } = require("../middleware/auth");
const mongoose = require("mongoose");

// Apply auth and admin middleware to all routes
router.use(auth, adminOnly);

// Dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const User = require("../models/User");
    const Product = require("../models/Product");
    const Order = require("../models/Order");
    
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalOrders = await Order.countDocuments();
    
    // Calculate revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts, 
        totalAdmins,
        totalOrders,
        revenue,
        totalSales: totalOrders
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, msg: "Failed to fetch dashboard data" });
  }
});

// Products
router.get("/products", async (req, res) => {
  try {
    const Product = require("../models/Product");
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Failed to fetch products" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const Product = require("../models/Product");
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
});

// Orders
router.get("/orders", async (req, res) => {
  try {
    const Order = require("../models/Order");
    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });
    
    // Transform for frontend compatibility
    const transformedOrders = orders.map(order => ({
      _id: order._id,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      total: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items
    }));
    
    res.json({ success: true, data: transformedOrders });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Failed to fetch orders" });
  }
});

// Users management
router.get("/users", async (req, res) => {
  try {
    const User = require("../models/User");
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Failed to fetch users" });
  }
});

// Coupons
router.get("/coupons", async (req, res) => {
  try {
    const Coupon = require("../models/Coupon");
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Failed to fetch coupons" });
  }
});

router.post("/coupons", async (req, res) => {
  try {
    const Coupon = require("../models/Coupon");
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
});

module.exports = router;
