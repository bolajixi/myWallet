const express = require('express');
const router = express.Router();
const morx = require('morx');
const passport = require('passport');

const ErrorResponse = require("../utils/errorResponse");
const controllers = require('../controllers');

// Login user
router.post('/login', checkNotAuthenticated,  passport.authenticate('local'), function(req, res){

    res.status(201).json({
        success: true,
        user: req.user,
    });
});

// Logout user
router.get('/logout', checkAuthenticated, (req, res, next) => {
    next();
}, controllers.users.logout)

// Register a new user
router.post('/register', checkNotAuthenticated, (req, res, next) => {
    var spec = morx.spec()
        .build('firstname', 'required:true, map:firstName')
        .build('lastname', 'required:true, map:lastName')
        .build('email', 'required:true')
        .build('pin', 'required:true')
        .end();
    
    req.body = morx.validate(req.body, spec, {throw_error: true}).params;

    if (req.body.pin.length < 4 || req.body.pin.length > 6) {
        throw Error('Invalid pin number. Must be between 4 and 6 characters')
    }
    next();
}, controllers.users.registerUser);

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    throw new ErrorResponse(`Please authenticate yourself via the route - /api/v1/login.`, 400)
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        throw new ErrorResponse(`User [${req.body.email}] is already authenticated.`, 400)
    }
    next()
}

module.exports = router;