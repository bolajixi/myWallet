const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user')

module.exports = function (passport) {

    const authenticateUser = (email, pin, done) => {
        
        User.findOne({ email: email }, function (err, user) {

            if (err) { return done(err); }
            if (!user) { return done(null, false, {message: `User [${email}] not found`}); }
            if (!user.verifyPinCode(pin)) { return done(null, false, {message: 'Invalid pin'}); }
            return done(null, user);
        });
    }
    
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'pin' }, authenticateUser));

    // Serialize/Deserialize  user for the session
    passport.serializeUser((user, done) => { 
        done(null, user.id);
    })
    passport.deserializeUser((id, done) => { 
        User.findById(id, function (err, user) {
            done(err, user);
        });
    })

};