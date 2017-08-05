var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var index = require('./routes/index');
var passport = require('passport');
var session = require('express-session');
var dbConfig = require('./db.js');
var mongoose = require('mongoose');
var User = require('./models/user.js');
mongoose.connect(dbConfig.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'sessionSecret',
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
require('./passport/login.js')(passport);
require('./passport/register.js')(passport);

//nunjucks configuration
nunjucks.configure('views',{
	autoescape: true,
	express: app
});

app.set('view engine','nunjucks');

var index = require('./routes/index.js')(passport);

//set index page
app.use('/',index);

app.set('view engine','nunjucks');
var index = require('./routes/index.js')(passport);

//set index page
app.use('/',index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
