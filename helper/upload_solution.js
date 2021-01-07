const multer  = require('multer');
const Assignment = require('../models/Assignment');

const storage = multer.diskStorage(
    {
        destination: './uploads/solutions',
        filename: function ( req, file, cb ) {
            cb( null, file.originalname);
        }
    }
);

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

var upload = multer({ storage: storage, fileFilter: fileFilter } );

module.exports = upload;