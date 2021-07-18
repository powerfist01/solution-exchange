const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const Assignment = require('../models/Assignment');
const subjects = require('../controller/subjects');


aws.config.update({
    secretAccessKey: '',
    accessKeyId: '',
    region: 'us-east-1'
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
    if(file.originalname.match(/\.(txt|pdf|docx|jpg|jpeg|png|zip)$/)){
        cb(null,true);
    } else {
        console.log("Not Uploaded!");
        cb(null,false);
    }
}

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'assignments-soluge/assignments',
        key: function (req, file, cb) {

            const newAssignment = new Assignment({
                filename: file.originalname,
                user_id: req.user._id,
                upload_timestamp: new Date(),
                username: req.user.username,
                due_date: new Date(req.body.due_date),
                subject: getSubject(req.body.subject_id)
            });
            newAssignment.save()
            .catch(err => console.log(err));

            cb(null, file.originalname);
        }
    }),
    fileFilter: fileFilter
});

// https://assignments-soluge.s3.us-east-2.amazonaws.com/


function getSubject(id){
    let subject = subjects.getSubjectUsingKey(id);
    return subject;
}

function getImage(){
    s3.getObject({
        Bucket: 'assignments-soluge',
        Key: 'icpc.pdf'
    }, function(err,data){
        if(err)
            console.log(err);
        else{
            console.log(data);
        }
    });
}

module.exports = upload;
