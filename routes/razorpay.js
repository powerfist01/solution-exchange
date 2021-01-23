const Razorpay = require("razorpay");
const express = require('express')
const crypto = require("crypto");

const router = express.Router();

const Order = require('../models/Order');
const Assignment = require('../models/Assignment');

const { ensureAuthenticated } = require('../config/auth');

var instance = new Razorpay({
    key_id: 'rzp_test_zUSc3vnrbpf5dU',
    key_secret: 'YOJRtJMpbRIBg6W0fG6AKxww'
  })

router.post('/order', ensureAuthenticated, getOrderNumber);
router.post('/checkout', ensureAuthenticated, checkout);

function getOrderNumber(req,res,next){
  const { amount, currency } = req.body;
  var options = {
      amount: amount,
      currency: currency,
      receipt: "order_rcptid_11"
    };
    instance.orders.create(options, function(err, order) {

      const newOrder = new Order({
        order_id : order["id"]
      });
      req.session.order_id = order["id"];
      req.session.assignment_id = req.body.assignment_id;
      req.session.amount = req.body.amount;
      newOrder.save();
      res.json({
        order: order,
        name: req.user.fullname,
        email: req.user.email,
        phone: req.user.phone
      })
    });
}

function checkout(req,res,next){
  let order_id = req.session.order_id;

  razorpay_payment_id = req.body.razorpay_payment_id;
  razorpay_order_id = req.body.razorpay_order_id;
  razorpay_signature = req.body.razorpay_signature;

  const hmac = crypto.createHmac('sha256', "YOJRtJMpbRIBg6W0fG6AKxww");
  hmac.update(order_id + "|" + razorpay_payment_id);
  let generated_signature = hmac.digest('hex');

  if (generated_signature == razorpay_signature) {
    Order.updateOne({order_id: order_id},{ razorpay_payment_id: razorpay_payment_id, razorpay_order_id: razorpay_order_id, razorpay_signature: razorpay_signature}, function(err){
        if(err){
            console.log(err);
        } else {
          let assignment_id = req.session.assignment_id;
          let amount = req.session.amount;
          Assignment.updateOne({_id: assignment_id},{ is_paid: true, amount_paid: amount}, function(err){
            if(err){
                console.log(err);
            } else {
              req.session.assignment_id = null;
              req.session.amount = null;
              res.redirect("/dashboard");
            }
          })
        }
    })
  } else {
    res.redirect("/dashboard");
  }
}

module.exports = router;