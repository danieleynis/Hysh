var express = require('express');
var router = express.Router();


module.exports = function(passport){
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.send("Main page");
  });

  router.get('/register', function(req, res){
    res.sendFile(__dirname + '/register.html');
  });

  router.post('/register', passport.authenticate('register', {
    successRedirect: '/login',
    failureRedirect: '/register'
  }));

  router.get('/login', function(req, res){
    res.sendFile(__dirname + '/login.html');
  });

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
