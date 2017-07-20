var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var index = require('./routes/index');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

//nunjucjs configuration
nunjucks.configure('views',{
	autoescape: true,
 	express: app
 });
 app.set('view engine','nunjucks');

 //set index page
 app.use('/',index);

 //render login page
 app.get('/login',function(req,res){
 	res.render('login.njk');
 });

 //render register page
 app.get('/register',function(req,res){
 	res.render('register.njk');
 });

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
  res.send("Error!");
});
//listen on localhost port 8080
app.listen(8080,function(){console.log("Server running");})
module.exports = app;
