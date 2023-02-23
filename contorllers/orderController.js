const axios = require('axios');
const Product = require('../models/productModel');
const { Order, OrderItem } = require('../models/orderModel');

exports.checkout = async (req, res) => {
  try {
    const { items, ...orderData } = req.body;
    // const orderItemData = await orderItemSchema.validateAsync(items);
    const order = new Order({
      ...orderData.order,
      user: req.user._id,
      total_paid: 0,
      items: [],
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const item of items) {
      // eslint-disable-next-line no-await-in-loop
      const product = await Product.findOne({ _id: item._id });
      if (!product) {
        return res.status(400).json({ error: 'Product not found' });
      }

      const orderItem = new OrderItem({
        product: product.id,
        quantity: item.quantity,
      });

      order.items.push(orderItem);
      order.total_paid += product.price * item.quantity;
    }

    await order.save();

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: req.user.email,
        amount: order.total_paid * 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SK}`,
        },
      }
    );

    await order.save();

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
