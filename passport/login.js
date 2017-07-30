var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');
var bCrypt = require('bcrypt-nodejs');

var validPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}

module.exports = function(passport){
  passport.use('login', new LocalStrategy(
    function(username, password, done) {
      User.findOne({ 'username': username },
        function(err, user){
          if(err)
            return done(err);
          
          if(!user){
            console.log('User not found');
            return done(null, false);
          }

          if(!validPassword(user, password)){
            console.log('Invalid password');
            return done(null, false);	
          }

          return done(null, user);
        }
      );
    }
  ));
}