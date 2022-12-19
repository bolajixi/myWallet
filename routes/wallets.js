const express = require('express');
const morx = require('morx');

const auth = require("../utils/auth");
const controllers = require('../controllers');

const router = express.Router();

router.get('/', auth.checkAuthenticated, (req, res, next)=> {
    next();
}, controllers.wallet.getWallet)

router.get('/balance', auth.checkAuthenticated, (req, res, next)=> {
    next();
}, controllers.wallet.getBalance)

router.get('/transactions/:ref', auth.checkAuthenticated, (req, res, next)=> {
    next();
}, controllers.wallet.getTransaction)

router.get('/transactions', auth.checkAuthenticated, (req, res, next)=> {
    next();
}, controllers.wallet.getTransactions)

router.post('/deposit', auth.checkAuthenticated, (req, res, next)=> {
    var spec = morx.spec()
        .build('cardNumber', 'required:true')
        .build('cvv', 'required:true')
        .build('expiryMonth', 'required:true')
        .build('expiryYear', 'required:true')
        .build('currency', 'required:true')
        .build('amount', 'required:true')
        .build('email', 'required:true')
        .build('fullName', 'required:true')
        .build('phoneNumber', 'required:false')
        .build('pin', 'required:true')
        .end();

    req.body = morx.validate(req.body, spec, {throw_error: true}).params;

    if (req.body.pin.length !== 4) {
        throw Error('Invalid PIN. Please enter a 4-digit PIN, e.g 1111')
    }

    next();
}, controllers.wallet.deposit)

router.post('/deposit/authorize', auth.checkAuthenticated, (req, res, next)=> {
    next();
}, controllers.wallet.authorize)

router.post('/transfer', auth.checkAuthenticated, (req, res, next)=> {
    var spec = morx.spec()
        .build('accountBank', 'required:true')
        .build('accountNumber', 'required:true')
        .build('amount', 'required:true')
        .build('description', 'required:true')
        .build('currency', 'required:true')
        .build('transactionPin', 'required:true')
        .end();

    if (req.body.transactionPin.length !== 4) {
        throw Error('Invalid transaction PIN. Please enter a 4-digit PIN, e.g 1111')
    }

    if(req.body.accountNumber.length < 8 || req.body.accountNumber.length > 12){
        throw Error("Invalid account number (Expected length of account number must be with 8 to 12)");
    } 

    if(req.body.amount <= 0) { throw new Error('Invalid transfer amount'); }

    req.body = morx.validate(req.body, spec, {throw_error: true}).params;

    next();
}, controllers.wallet.transfer)

module.exports = router;