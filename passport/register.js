var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
  passport.use('register', new LocalStrategy( 
    { passReqToCallback: true },
    function(req, username, password, done) {
      var registerUser = function(){
        User.findOne({'username': username},
          function(err, user){
            if(err){
              console.log("Error in registering user");
              return done(err);
            }
            
            if(user){
              console.log('User already exists');
              return done(null, false);
            }

            if(!user){
              var newUser = new User();
              newUser.username = username;
              newUser.password = bCrypt.hashSync(password);
              newUser.email = req.body.email;
              newUser.save(function(err){
                if(err){
                  throw err;
                }

                return done(null, newUser);
              });
            }
          }
        );
      }

      process.nextTick(registerUser);
    }
  ));
}