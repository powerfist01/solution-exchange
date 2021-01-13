const Razorpay = require("razorpay");
const express = require('express')

const router = express.Router();


var instance = new Razorpay({
    key_id: 'rzp_test_zUSc3vnrbpf5dU',
    key_secret: 'YOJRtJMpbRIBg6W0fG6AKxww'
  })

router.get('getOrderNumber', ensureAuthenticated, getOrderNumber);

function getOrderNumber(req,res,next){
    const {amount, currency} = req.body;
    console.log(amount, currency);
    var options = {
        amount: 50000,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
      };
      instance.orders.create(options, function(err, order) {
        console.log(order);
      });
}

module.exports = router;