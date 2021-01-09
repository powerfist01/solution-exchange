const express = require('express');
const router = express.Router();

// Helper modules here
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const { ensureAuthenticated } = require('../config/auth');


// Routes for the admin side here
router.get('/getAllUsers', ensureAuthenticated, getAllUsers);
router.get('/getAllExperts', ensureAuthenticated, getAllExperts);
router.get('/getAllAssignments',ensureAuthenticated, getAllAssignments);
router.post('/assignAssignment',ensureAuthenticated, assignAssignment);
router.get('/checkAssignment',ensureAuthenticated, checkAssignment);
router.get('/dashboard', ensureAuthenticated, adminDashboard);


// Functions called here
function getAllUsers(req,res,next){
    User.find({role: 'user'})
    .then(function(users){
        res.render("admin_allusers",{
            users: users
        });
    })
}

function getAllExperts(req,res,next){
    User.find({role: 'expert'})
    .then(function(experts){
        res.render("admin_allexperts",{
            experts: experts
        });
    })
}

function getAllAssignments(req,res,next){
    Assignment.find().sort({upload_timestamp: -1})
    .then(function(assignments){
        res.render('admin_allassignments',{
            assignments: assignments
        });
    })
}

function assignAssignment(req,res,next){
    const { assignment_id, expert_id } = req.body;
    console.log(assignment_id);
    Assignment.updateOne({_id: assignment_id},{ expert_id: expert_id, assigned_timestamp: Date.now()}, function(err,result){
        if(err){
            console.log(err);
        } else {
            res.send(result);
        }
    })
}

function checkAssignment(req,res,next){
    const { assignment_id } = req.body;
    Assignment.updateOne({_id: assignment_id}, {isChecked: true}, function(err,result){
        if(err){
            console.log(err);
        } else {
            console.log(result);
            res.send(result);
        }
    })
}

function adminDashboard(req,res,next){
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

module.exports = router;