const express = require('express');
const morx = require('morx');

const auth = require("../utils/auth");
const controllers = require('../controllers');

const router = express.Router();

var spec = morx.spec()
    .build('firstname', 'required:true, map:firstName')
    .build('lastname', 'required:true, map:lastName')
    .build('email', 'required:true')
    .build('pin', 'required:true')
    .build('transactionPin', 'required:true')
    .end();

// Get profile for current logged in user
router.get('/profile', auth.checkAuthenticated, (req, res, next)=> {
    next();
}, controllers.users.getProfile)

// Create a new settlement account
router.post('/settlementAccount', auth.checkAuthenticated, (req, res, next)=> {
    next();
}, controllers.users.addSettlementAccount)

// Edit an existing settlement account
router.patch('/settlementAccount/:id', auth.checkAuthenticated, (req, res, next)=> {
    next();
}, controllers.users.editSettlementAccount)

// Delete an existing settlement account
router.delete('/settlementAccount/:id', auth.checkAuthenticated, (req, res, next)=> {
    next();
}, controllers.users.deleteSettlementAccount)

module.exports = router;