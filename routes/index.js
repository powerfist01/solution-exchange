const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const subjects = require('../controller/subjects');

router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, (req, res) =>{
    if(req.user.role === 'user'){
      res.render('user_dashboard', {
        user: req.user,
        subjects: subjects.getAllSubjects()
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
