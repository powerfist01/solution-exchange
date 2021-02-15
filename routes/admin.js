const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Helper modules here
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const { ensureAuthenticated } = require('../config/auth');

// Routes for the admin side here
router.get('/registerExpert', ensureAuthenticated, getRegisterPage);
router.post('/registerExpert', registerExpert);

router.get('/getAllUsers', ensureAuthenticated, getAllUsers);
router.get('/getAllExperts', ensureAuthenticated, getAllExperts);
router.get('/getAllAssignments',ensureAuthenticated, getAllAssignments);
router.post('/assignAssignment',ensureAuthenticated, assignAssignment);
router.get('/checkAssignment',ensureAuthenticated, checkAssignment);
router.get('/dashboard', ensureAuthenticated, adminDashboard);

router.get('/profile', ensureAuthenticated, getProfilePage);
router.post('/profile', ensureAuthenticated, updateProfile);


function getProfilePage(req,res,next){
  res.render('admin_profile',{user: req.user});
}

function updateProfile(req,res,next){
  const {username, fullname, email, phone } = req.body;

  User.updateOne({_id:req.user.id}, {username: username, fullname: fullname, email: email, phone: phone}, function(err){
    if(err)
      throw err;
    else
      res.redirect('/admin/profile');
  })
}

// Functions called here
function getRegisterPage(req, res, next){
    res.render('expert_register')
}

function registerExpert(req, res){
    const { username, phone, email, password, password2 } = req.body;

    let errors = [];

  if (!username || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('expert_register', {
      errors,
      username,
      email,
      phone,
      password,
      password2
    });
  } else {
    User.findOne({ phone: phone }).then(user => {
      if (user) {
        errors.push({ msg: 'User already exists' });
        res.render('expert_register', {
          errors,
          username,
          email,
          phone,
          password,
          password2
        });
      } else {
        let role = 'expert';
        const newUser = new User({
          username,
          email,
          phone,
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
                req.flash(
                  'success_msg',
                  'Expert has been registered.'
                );
                res.redirect('/admin/registerExpert');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
    }
  }

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
    Assignment.find({is_paid: true}).sort({upload_timestamp: -1})
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
    Assignment.find({isSolved: false, expert_id: null, is_paid: true}).sort({upload_timestamp: -1})
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