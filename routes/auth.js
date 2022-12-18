const express = require('express');
const router = express.Router();
const morx = require('morx');
const passport = require('passport');

const ErrorResponse = require("../utils/errorResponse");
const auth = require("../utils/auth");
const controllers = require('../controllers');

// Login user
router.post('/login', auth.checkNotAuthenticated,  passport.authenticate('local'), function(req, res){

    res.status(201).json({
        success: true,
        user: req.user,
    });
});

// Logout user
router.get('/logout', auth.checkAuthenticated, (req, res, next) => {
    next();
}, controllers.auth.logout)

// Register a new user
router.post('/register', auth.checkNotAuthenticated, (req, res, next) => {
    var spec = morx.spec()
        .build('firstname', 'required:true, map:firstName')
        .build('lastname', 'required:true, map:lastName')
        .build('email', 'required:true')
        .build('pin', 'required:true')
        .build('transactionPin', 'required:true')
        .end();
    
    req.body = morx.validate(req.body, spec, {throw_error: true}).params;

    if (req.body.pin.length < 4 || req.body.pin.length > 6) {
        throw Error('Invalid pin number. Must be between 4 and 6 characters')
    }
    next();
}, controllers.auth.registerUser);

module.exports = router;