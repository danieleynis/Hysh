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

  router.post('/register', passport.authenticate('register', {
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

  router.get('/home', function(req, res, next){
    if(req.isAuthenticated())
      return next();
    res.redirect('/');
  }, function(req, res){
    res.send("This is your homepage!");
  });

  return router;
}
