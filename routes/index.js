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
    else if(req.user.role === 'expert'){
      res.redirect('/expert/dashboard');
    }
    else{
      res.redirect('/admin/dashboard');
    }
  }
);

module.exports = router;
