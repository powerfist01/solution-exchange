const multer  = require('multer');

const Assignment = require('../models/Assignment');
const subjects = require('../controller/subjects');


const storage = multer.diskStorage(
    {
        destination: './uploads/assignments',
        filename: function ( req, file, cb ) {
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

            cb( null, file.originalname);
        }
    }
);

const fileFilter = (req, file, cb) => {
    if(file.originalname.match(/\.(txt|pdf|docx|jpg|jpeg|png|zip)$/)){
        cb(null,true);
    } else {
        console.log("Not Uploaded!");
        cb(null,false);
    }
}

function getSubject(id){
    let subject = subjects.getSubjectUsingKey(id);
    return subject;
}

var upload = multer( { storage: storage, fileFilter: fileFilter } );


module.exports = upload;