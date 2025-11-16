const Coupon = require("../../models/Coupon");

exports.list = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { code, type, value, startDate, endDate } = req.body;
    const c = new Coupon({ code, type, value, startDate: startDate || null, endDate: endDate || null, active: true });
    await c.save();
    res.json(c);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.validate = async (req, res) => {
  try {
    const { code } = req.params;
    const now = new Date();
    const c = await Coupon.findOne({
      code,
      active: true,
      $and: [
        { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: null }, { endDate: { $gte: now } }] }
      ]
    });
    if (!c) return res.status(404).json({ msg: "Coupon invalid or expired" });
    res.json(c);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
