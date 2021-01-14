const Razorpay = require("razorpay");
const express = require('express')

const router = express.Router();


var instance = new Razorpay({
    key_id: 'rzp_test_zUSc3vnrbpf5dU',
    key_secret: 'YOJRtJMpbRIBg6W0fG6AKxww'
  })

router.get('/order', ensureAuthenticated, getOrderNumber);

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


      try {
        const options = {
          amount: 10 * 100,
          currency: "INR",
          receipt: "order_rcptid_11",
          payment_capture: 0,
        };
      instance.orders.create(options, async function (err, order) {
        if (err) {
          return res.status(500).json({
            message: "Something Went Wrong",
          });
        }
      return res.status(200).json(order);
     });
    } catch (err) {
      return res.status(500).json({
        message: "Something Went Wrong",
      });
     }
}

module.exports = router;