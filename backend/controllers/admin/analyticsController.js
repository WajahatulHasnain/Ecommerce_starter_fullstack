const Order = require("../../models/Order");

exports.summary = async (req, res) => {
  try {
    const totalAgg = await Order.aggregate([
      { $match: { status: { $in: ["shipped", "completed"] } } },
      { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } }
    ]);
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.product", qty: { $sum: "$items.qty" } } },
      { $sort: { qty: -1 } },
      { $limit: 5 },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      { $project: { _id: 1, qty: 1, name: "$product.name" } }
    ]);
    const monthly = await Order.aggregate([
      { $match: { status: { $in: ["shipped", "completed"] } } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, revenue: { $sum: "$total" } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    res.json({
      totalSales: totalAgg[0]?.total || 0,
      ordersCount: totalAgg[0]?.count || 0,
      topProducts,
      monthly
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
