const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const subjects = require('../controller/subjects');

const crypto = require("crypto");
const bcrypt = require('bcryptjs');

const sendMail = require('../utils/sendMail')
const Assignment = require('../models/Assignment');

const User = require('../models/User');

const Token = require('../models/Token');

const Feedback = require('../models/Feedback');

router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, (req, res) =>{
    if(req.user.role === 'user'){
      Assignment.find({is_paid: false},function(err, assignments){
        res.render('user_dashboard', {
          user: req.user,
          subjects: subjects.getAllSubjects(),
          assignments: assignments
        })
      })
    }
    else if(req.user.role === 'expert'){
      res.redirect('/expert/dashboard');
    }
    else{
      res.redirect('/admin/dashboard');
    }
  }
);

router.get('/begin_password_reset', function(req,res,next){
  let email = '';
  res.render('begin_password_reset',{email});
})

router.post('/begin_password_reset', function(req,res,next){
  const email = req.body.email;

  User.findOne({ email: email }).then(user => {
    if (user) {
      Token.findOne({ userId: user._id }).then(function(token){
        if (token) {
          token.deleteOne();
        }

        let resetToken = crypto.randomBytes(32).toString("hex");
        console.log(resetToken)
        const hash = bcrypt.hash(resetToken, 10);
        hash.then(async function(hash){
          await new Token({
            userId: user._id,
            token: hash,
            createdAt: Date.now(),
          }).save();
          
          let clientURL = 'http://localhost:7000'
          const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
          console.log(link);
          sendMail(user.email,"Password Reset Request",{name: user.username, link: link,})
          let success_msg = 'Check you email for reset link';
          res.render('begin_password_reset',{success_msg, email});
        })
      });
    } else {
      let errors = [];
      errors.push({ msg: 'Email not found!!!' });
      res.render('begin_password_reset', {errors})
    }
  });

})

router.get('/passwordReset', function(req,res,next){
  let token = req.query.token;
  let userId = req.query.id;
  res.render('reset_password',{token,userId});
})

router.post('/resetPassword', resetPassword);

async function resetPassword (req,res,next) {
  const {userId, token, password, password2} = req.body;
  console.log(userId, token, password, password2);

  let errors = [];
  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('reset_password', {
      errors,
      userId,
      token,
      password,
      password2
    });
  } else {
    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) {
      throw new Error("Invalid or expired password reset token");
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      throw new Error("Invalid or expired password reset token");
    }
    const hash = await bcrypt.hash(password, 10);
    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );
    const user = await User.findById({ _id: userId });
    // sendEmail(
    //   user.email,
    //   "Password Reset Successfully",
    //   {
    //     name: user.name,
    //   },
    //   "./template/resetPassword.handlebars"
    // );
    await passwordResetToken.deleteOne();
    req.flash(
      'success_msg',
      'Password has been changed.'
    );
    if(user.role == 'user')
      res.redirect('/user/login');
    else if(user.role == 'expert')
      res.redirect('/expert/login');
  }
};


router.post('/feedback',async function(req,res,next){
  const {name, email, message} = req.body;

  await new Feedback({
    name: name,
    email: email,
    message: message,
  }).save();

  res.render('welcome');

})
module.exports = router;
