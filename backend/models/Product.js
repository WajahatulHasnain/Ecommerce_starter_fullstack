const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Product description is required"]
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"]
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
    enum: ["electronics", "clothing", "home", "sports", "books", "other"]
  },
  stock: {
    type: Number,
    required: [true, "Stock quantity is required"],
    min: [0, "Stock cannot be negative"],
    default: 0
  },
  image: {
    type: String,
    default: ""
  },
  onSale: {
    type: Boolean,
    default: false
  },
  saleStart: {
    type: Date
  },
  saleEnd: {
    type: Date
  },
  discountPercent: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better performance
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model("Product", productSchema);
