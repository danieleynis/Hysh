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

  router.post('/register', passport.authenticate('register', {
    successRedirect: '/confirmation',
    failureRedirect: '/register'
  }));

  /*Nunjucks rendering for login page*/
  router.get('/login', function(req, res){
    res.render('login.njk');
  });

  /*Nunjucks rendering for photos page*/
  router.get('/photos', function(req, res){
    //Change items to whatever is being sent to be rendered
    res.render('photos.njk', /*{items: items} */);
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
