const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 },
});

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    full_name: { type: String, required: true, maxlength: 50 },
    address: { type: String, required: true, maxlength: 250 },
    city: { type: String, required: true, maxlength: 250 },
    phone: { type: String, required: true, maxlength: 20 },
    postal_code: { type: String, required: true, maxlength: 20 },
    total_paid: { type: Number, required: true },
    reference_id: { type: String, default: '' },
    billing_status: { type: Boolean, default: false },
    items: [orderItemSchema],
  },
  { timestamps: true }
);

const OrderItem = mongoose.model('OrderItem', orderItemSchema);
const Order = mongoose.model('Order', OrderSchema);

module.exports = { orderItemSchema, Order, OrderItem };
