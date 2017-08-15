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
  	req.check('email','Not a valid email address').isEmail();				//validate real email address 
	req.check('password','password must be atleast 5 characters').isLength({min:5}); 	//validate password length
	req.check('password','both passwords must match').equals(req.body.reenterpassword); 	//validate that passwords match 
	var invalid = req.validationErrors();
	if(invalid)
	{
		res.send(invalid);		//if invalid, output errors on page and redirect to same page
		res.redirect('register');
		return;					//do not proceed to authentication if invalid
	}
	next();						//pass to input to passport authentication
	},
		passport.authenticate('register', {
		successRedirect: '/login',
		failureRedirect: '/register'
  	}));

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

  router.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/login'
  }));

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  router.get('/home', checkAuth, function(req, res){
    res.send("This is your homepage!");
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

  router.get('/upload', checkAuth, (req, res) => {
    res.sendFile(__dirname + '/upload.html'); // TODO change this to render nunjuck file!
  });

  return router;
}

var checkAuth = function(req, res, next) {
  if(req.isAuthenticated())
    return next();
  res.redirect('/');
}
