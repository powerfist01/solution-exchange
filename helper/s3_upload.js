const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const User = require('../models/User');
const Assignment = require('../models/Assignment');

aws.config.update({
    secretAccessKey: 'WYEFLJ4VVBHiUbFULLtDGEstrj/JfTatg6tR6VwC',
    accessKeyId: 'AKIAITAUQPYHV3AJKAUQ',
    region: 'us-east-1'
});

const s3 = new aws.S3();

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

const fileFilter = (req, file, cb) => {
    if(file.originalname.match(/\.(txt|pdf|docx|jpg|jpeg|png)$/)){
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

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'assignments-soluge',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    }),
    fileFilter: fileFilter
});

module.exports = upload;