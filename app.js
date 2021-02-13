const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
var path = require('path');
const session = require('express-session');
const moment = require("moment");

const app = express();

// Dotenv configuration
require('dotenv').config();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB database connection established'))
  .catch(err => console.log(err));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
app.use((req, res, next)=>{
  res.locals.moment = moment;
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/user', require('./routes/users.js'));
app.use('/expert', require('./routes/experts.js'));
app.use('/admin', require('./routes/admin.js'));
app.use('/payments', require('./routes/razorpay.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on  http://localhost:${PORT}`));