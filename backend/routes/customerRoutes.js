const express = require("express");
const router = express.Router();
const { auth, customerOnly } = require("../middleware/auth");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Apply auth and customer middleware to all routes
router.use(auth, customerOnly);

// Dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get real data from database
    const totalOrders = await Order.countDocuments({ customer: userId });
    const totalSpent = await Order.aggregate([
      { $match: { customer: mongoose.Types.ObjectId(userId), status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    
    const recentOrders = await Order.find({ customer: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('items.product', 'name');
    
    const dashboardData = {
      recentOrders,
      wishlistCount: 5, // Mock for now
      cartCount: 3,     // Mock for now
      totalOrders,
      totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0
    };
    
    res.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, msg: "Failed to fetch dashboard data" });
  }
});

// Products (browsing)
router.get("/products", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ success: false, msg: "Failed to fetch products" });
  }
});

// Profile
router.get("/profile", async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Failed to fetch profile" });
  }
});

router.put("/profile", async (req, res) => {
  try {
    const User = require("../models/User");
    const { name, email, phone, address } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, address },
      { new: true, runValidators: true }
    ).select("-password");
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
});

// Orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image');
    
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Failed to fetch orders" });
  }
});

module.exports = router;
