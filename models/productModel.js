const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      trim: true,
      unique: true,
    },
    brand: {
      type: String,
    },
    averageRating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price'],
    },
    priceDiscount: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: [true, 'A product must have an available quantity'],
    },
    summary: {
      type: String,
      trim: true,
    },
    color: [String],
    category: {
      type: [String],
      required: [true, 'A product must have a category'],
    },
    space: {
      type: String,
    },
    reviewsQuantity: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
        },
        secure_url: {
          type: String,
        },
      },
    ],
    specs: {
      type: String,
      trim: true,
    },
    productInfo: {
      type: String,
      trim: true,
    },
    boxContent: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);
productSchema.index({ name: 'text', brand: 'text', summary: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
