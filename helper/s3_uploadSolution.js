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

const fileFilter = (req, file, cb) => {
    if(file.originalname.match(/\.(txt|pdf|docx|jpg|jpeg|png|zip)$/)){
        const { assignment_id } = req.body;
        Assignment.updateOne({_id: assignment_id},{ solution_filename: file.originalname, solved_timestamp: Date.now()}, function(err,result){
            if(err){
                console.log(err);
            } else {
                cb(null,true);
            }
          })
    } else {
        console.log("Not Uploaded!");
        cb(null,false);
    }
}
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'assignments-soluge/solutions',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    }),
    fileFilter: fileFilter
});

// https://assignments-soluge.s3.us-east-2.amazonaws.com/

module.exports = upload;