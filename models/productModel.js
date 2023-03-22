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
      max: [5, 'Rating must be 5.0 or below'],
      set: (val) => Math.round(val * 10) / 10,
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
        filename: {
          type: String,
        },
        secureUrl: {
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
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);
productSchema.index({ name: 'text', brand: 'text', summary: 'text' });

// Virtual populate
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
