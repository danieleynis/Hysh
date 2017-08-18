/**************************************************************** 
  * Copyright (c) 2017 Rudd Johnson, Daniel Eynis, Justin Moore *
  * This program is licensed under the "MIT License".           *
  * Please see the file COPYING in the source                   *
  * distribution of this software for license terms.            *
/****************************************************************/

var express = require('express');
var router = express.Router();
var multer  = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })
var User = require('../models/user.js');

module.exports = function(passport){
  /* GET home page. */
    router.get('/', function(req, res, next) {
    res.send("Main page");
  });

  /*Nunjucks rendering for registration page*/
  router.get('/register', function(req, res){
    res.render('register.njk');
  });
  
  /*post from registration form, validate and authenticate user input*/
  router.post('/register', function(req,res,next) {
	req.check('email','Not a valid email address').isEmail();
	req.check('password','password must be atleast 5 characters').isLength({min:5});
	req.check('reenterpassword','both passwords must match').equals(req.body.password);
	var errors = req.validationErrors();

	if(errors)
	{
		console.log(errors);			
		res.render('register.njk',{errors:errors});
		return;					//do not proceed to authentication if invalid
	}
	//after validating form input, authenticate with passport
	passport.authenticate('register', function(err,proceed,info){
	if(err){
		return next(err);
	}
	if(proceed){
		return res.redirect('/login');	//if username is not present, route to login
	}
	if(!proceed){	
		res.render('register.njk',{usernameStatus: "Username is not available"}); //if username is present, rerender with error msg
	}
	})(req,res,next);
  	});

  /*Nunjucks rendering for login page*/
  router.get('/login', function(req, res){
    res.render('login.njk');
  });

  /*Nunjucks rendering for photos page*/
  router.get('/photos', function(req, res){
    res.render('photos.njk');
  });


  /*Nunjucks rendering for confirmation page page*/
  router.get('/confirmation', function(req, res){
    res.render('confirmation.njk');
  });

/*Validation and authentication for login page*/
  router.post('/login', function(req,res,next) {
	req.check('password','password must be atleast 5 characters').isLength({min:5});
	var errors = req.validationErrors();

	if(errors)
	{
		console.log(errors);			
		res.render('login.njk',{error:"Password must be at least 5 characters"});
		return;					//do not proceed to authentication if invalid
	}
	//after validating form input, authenticate with passport
	passport.authenticate('login', function(err,proceed,info){
	if(err){
		return next(err);
	}
	if(proceed){
		return res.redirect('/home');	//if username is not present, route to home
	}
	if(!proceed){	
		res.render('login.njk',{usernameStatus: "Incorrect username or password"}); //if username is present, rerender with error msg
	}
	})(req,res,next);
 });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  router.get('/home', checkAuth, function(req, res){
    res.send("This is your homepage!");
  });

  /*Nunjucks rendering for upload page*/
  router.get('/upload',function(req,res){
  	res.render('upload.njk');
  });
  
    router.post('/upload', checkAuth, upload.single('picture'), function(req, res) {
    User.findOne({ 'username': req.user.username}, (err, user) => {
      if(err)
        res.end("error!");

      if(!user)
        res.end('error!');

      if(user){
        user.pics.push(req.file.buffer); 
        user.save();
      }
    });
  });
  
  return router;
}
var checkAuth = function(req, res, next) {
  if(req.isAuthenticated())
    return next();
  res.redirect('/');
}
