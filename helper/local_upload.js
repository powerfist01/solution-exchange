const multer  = require('multer');

const Assignment = require('../models/Assignment');
const User = require('../models/User');

const storage = multer.diskStorage(
    {
        destination: './uploads/assignments',
        filename: function ( req, file, cb ) {
            cb( null, file.originalname);
        }
    }
);

const fileFilter = (req, file, cb) => {
    if(file.originalname.match(/\.(txt|pdf|docx|jpg|jpeg|png|zip)$/)){
        let id = req.session["passport"]["user"];
        let promise = new Promise(function(resolve,reject){
            User.findOne({_id: id}, function(err,user){
                if(err){
                    throw err;
                } else {
                    resolve(user);
                }
            })
        })
        promise.then(function(user){
            const newAssignment = new Assignment({
                filename: file.originalname,
                user_id: id,
                upload_timestamp: new Date(),
                username: user.username,
                subject: getSubject(req.body.category)
            });
            newAssignment.save()
            .catch(err => console.log(err));
            cb(null,true);

        })
        .catch(function(err){
            console.log(err);
        })
    } else {
        console.log("Not Uploaded!");
        cb(null,false);
    }
}

function getSubject(category){
    switch(category){
        case "1": 
            return "Mathematics";
        case "2": 
            return "Physics";
        case "3": 
            return "Chemistry";
        case "4": 
            return "English";
        case "5": 
            return "Hindi";
        case "6": 
            return "Biology";
        case "7": 
            return "Computer";
    }
}

var upload = multer( { storage: storage, fileFilter: fileFilter } );

function getAssignments(req,res,next){
    console.log(req.user)
    Assignment.find({user_id: req.user._id})
    .then(function(assignments){
        res.render('user_assignments',{
            assignments: assignments
        });
    })
}

module.exports = upload;