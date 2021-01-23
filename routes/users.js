const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Helper modules here
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const upload = require('../helper/local_upload');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


// Routes for the client side here
router.get('/register', forwardAuthenticated, getRegisterPage);
router.get('/login', forwardAuthenticated, getLoginPage);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/assignments', ensureAuthenticated ,getAssignments);
router.post('/upload', ensureAuthenticated, upload.array('assignment'), uploadAssignment);


// Functions called here
function getRegisterPage(req,res,next){
  res.render('user_register')
}

function getLoginPage(req,res,next){
  res.render('user_login')
}

function registerUser(req, res) {
  const { username, email, phone, password, password2 } = req.body;
  
  User.findOne({ phone: phone }).then(user => {
    if (user) {
      res.render('register', {
        username,
        email,
        phone,
        password,
        password2
      });
    } else {
      const newUser = new User({
        username,
        email,
        phone,
        password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              res.redirect('/user/login');
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
}

function loginUser(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
  })(req, res, next);
}

function logoutUser(req,res,next){
  req.logout();
  res.redirect('/user/login');
}

function getAssignments(req,res,next){
  Assignment.find({user_id: req.user._id, is_paid: true}).sort({upload_timestamp: -1})
  .then(function(assignments){
      console.log(assignments)
      res.render('user_assignments',{
          assignments: assignments
      });
  })
}

function uploadAssignment(req,res,next){
  try {
    return res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
  }
}

module.exports = router;
