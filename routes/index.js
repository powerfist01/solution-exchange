const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const subjects = require('../controller/subjects');

const Assignment = require('../models/Assignment');

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

module.exports = router;
