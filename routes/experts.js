const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');
const Assignment = require('../models/Assignment');
const upload = require('../helper/upload_solution');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

// Expert routes to be called here

router.get('/login', forwardAuthenticated, getLoginPage);
router.post('/login', loginExpert);
router.get('/logout', ensureAuthenticated, logoutExpert);
router.get('/assignments', ensureAuthenticated, getAssignments);
router.get('/dashboard', ensureAuthenticated, myDashboard);
router.post('/acceptAssignment', ensureAuthenticated, acceptAssignment);
router.post('/uploadSolution', ensureAuthenticated, upload.array('solution'), uploadSolution);


// Function to be called here

function getLoginPage(req, res, next){
  res.render('expert_login')
}

function loginExpert(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/expert/login',
  })(req, res, next);
}

function logoutExpert(req, res){
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

function uploadSolution(req,res,next){
  try {
      res.redirect('/expert/assignments');
  } catch (error) {
      console.error(error);
  }
}


module.exports = router;
