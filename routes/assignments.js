const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../config/auth');
const Assignment = require('../models/Assignment');

var upload = require('../helper/s3_upload');

// Upload
router.post('/upload', ensureAuthenticated, upload.array('assignment'), (req,res,next) => {
    try {
        return res.redirect('/dashboard')
    } catch (error) {
        console.error(error);
    }
})

router.get('/assignments', ensureAuthenticated ,getAssignments);

function getAssignments(req,res,next){
    console.log(req.user)
    Assignment.find({user_id: req.user._id})
    .then(function(assignments){
        res.render('user_assignments',{
            assignments: assignments
        });
    })
}

module.exports = router;