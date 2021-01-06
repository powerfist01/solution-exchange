const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/User');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const Assignment = require('../models/Assignment');
const { route } = require('./admin');

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
              res.redirect('/expert/login');
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
    failureRedirect: '/expert/login',
  })(req, res, next);
});

// Logout
router.get('/logout', ensureAuthenticated, logout);

router.get('/assignments', ensureAuthenticated, getAssignments);

router.get('/dashboard', ensureAuthenticated, myDashboard);

router.post('/acceptAssignment', ensureAuthenticated, acceptAssignment);


function logout(req, res){
  req.logout();
  res.redirect('/expert/login');
}
function getAssignments(req, res, next) {
  Assignment.find({ expert_id: req.user._id, accepted: true })
    .then(function (assignments) {
      res.render('expert_assignments', {
        assignments: assignments
      });
    })
}

function myDashboard(req, res, next) {
  Assignment.find({ expert_id: req.user._id, accepted: false }).sort({ upload_timestamp: -1 })
    .then(function (assignments) {
      return (assignments);
    })
    .then(function (assignments) {
      res.render('expert_dashboard', {
        user: req.user,
        assignments: assignments
      })
    })
}

function acceptAssignment(req,res,next){
  const { assignment_id } = req.body;
  Assignment.updateOne({_id: assignment_id},{ accepted: true}, function(err,result){
    if(err){
        console.log(err);
    } else {
        res.send(result);
    }
})
}

module.exports = router;
