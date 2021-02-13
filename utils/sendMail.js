const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, ) => {
  try {
      console.log(process.env.EMAIL_USERNAME)
      console.log(process.env.EMAIL_PASSWORD)
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      port: 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
      },
    });

    const source = fs.readFileSync(path.join(__dirname, 'email/request_reset_password.ejs'), "utf8");
    const compiledTemplate = ejs.compile(source);
    const options = () => {
        let temp = {
            from: process.env.FROM_EMAIL,
            to: email,
            subject: subject,
            html: compiledTemplate(payload),
        };
      return temp;
    };
    // Send email
    let info = await transporter.sendMail(options());

  } catch (error) {
      console.log("Error occured hre")
      console.log(error)
    return error;
  }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.ejs"
);
*/

module.exports = sendEmail;