const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  razorpay_payment_id: {
    type:  String,
  },
  razorpay_order_id: {
    type: String,
  },
  razorpay_signature: {
      type: String,
  }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
