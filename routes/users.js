const express = require('express');
const router = express.Router();
const morx = require('morx');

const controllers = require('../controllers') 

//Login user
router.get('/login', (req, res, next) => {
    res.send('Login');
});

// Register a new user
router.post('/register', (req, res, next) => {
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

module.exports = router;