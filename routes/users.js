const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, getLoginPage);

// Register Page
router.get('/register', forwardAuthenticated, getRegisterPage);

// Register
router.post('/register', (req, res) => {
  const { username, email, password, password2 } = req.body;
  User.findOne({ email: email }).then(user => {
    if (user) {
      res.render('register', {
        username,
        email,
        password,
        password2
      });
    } else {
      const newUser = new User({
        username,
        email,
        password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              res.redirect('/users/login');
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// Login here
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
  })(req, res, next);
});

// Logout here
router.get('/logout', logout);

function getRegisterPage(req,res,next){
  res.render('register')
}

function getLoginPage(req,res,next){
  res.render('login')
}

function logout(req,res,next){
  req.logout();
  res.redirect('/users/login');
}

module.exports = router;
