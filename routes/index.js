const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>{
    if(req.user.role === 'user')
      res.render('user_dashboard', {
        user: req.user
      })
    else if(req.user.role === 'expert')
      res.render('expert_dashboard', {
        user: req.user
      })
    else{
      Assignment.find({isSolved: false, expert_id: null}).sort({upload_timestamp: -1})
      .then(function(assignments){
          return(assignments);
      })
      .then(function(assignments){
        
        let promise = new Promise(function(resolve,reject){
          User.find({role: 'expert'})
          .then(function(experts){
              resolve(experts)
          })
        })
        
        promise.then(function(experts){
          res.render('admin_dashboard', {
            user: req.user,
            assignments: assignments,
            experts: experts
          })
        })
        .catch(function(err){
          console.log(err);
        })
      })
    }
  }
);

module.exports = router;
