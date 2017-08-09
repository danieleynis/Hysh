/**************************************************************** 
  * Copyright (c) 2017 Rudd Johnson, Daniel Eynis, Justin Moore *
  * This program is licensed under the "MIT License".           *
  * Please see the file COPYING in the source                   *
  * distribution of this software for license terms.            *
/****************************************************************/

var express = require('express');
var router = express.Router();


module.exports = function(passport){
  /* GET home page. */
    router.get('/', function(req, res, next) {
    res.send("Main page");
  });

/*Nunjucks rendering for registration page*/
  router.get('/register', function(req, res){
    res.render('register.njk');
  });

  router.post('/register', function(req,res,next) {
  req.check('email','Not a valid email address').isEmail();
	req.check('createpassword','password must be atleast 5 characters').isLength({min:5});
	req.check('createpassword','bos passwords must match').equals(req.body.reenterpassword);
	var errors = req.validationErrors();
	if(errors)
	{
		//TODO:Pass error to front end 	
		res.render('register.njk');
	}

	},

	passport.authenticate('register', {
   		successRedirect: '/login',
    		//TODO:output DB error, such as duplicate email address to front end 
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

  /*validation and verification of login information*/
  router.post('/login', passport.authenticate('login', {    
    successRedirect: '/home',
    failureRedirect: '/login'
  }));

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  router.get('/home', function(req, res, next){
    if(req.isAuthenticated())
      return next();
    res.redirect('/');
  }, function(req, res){
    res.send("This is your homepage!");
  });

  return router;
}
