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
router.get('/profile', ensureAuthenticated ,getProfilePage);
router.post('/profile', ensureAuthenticated, updateProfile);
router.get('/forgotPassword', forgotPassword);

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
  req.flash('success_msg', 'You are logged out');
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

function getProfilePage(req,res,next){
  res.render('user_profile',{user: req.user});
}

function updateProfile(req,res,next){
  const {username, fullname, school, email, phone } = req.body;

  User.updateOne({_id:req.user.id}, {username: username, fullname: fullname, school: school, email: email, phone: phone}, function(err){
    if(err)
      throw err;
    else
      res.redirect('/user/profile');
  })
}

function forgotPassword(req,res,next){
  res.send("I know for now!!!");
}

module.exports = router;
