const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('expert_login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('expert_register'));

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
      let role = 'expert';
      const newUser = new User({
        username,
        email,
        password,
        role
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              res.redirect('/experts/login');
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/experts/login',
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/experts/login');
});

module.exports = router;
