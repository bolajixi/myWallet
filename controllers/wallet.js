const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

const User = require('../models/user');
const Transaction = require('../models/transaction');
const Wallet = require('../models/wallet');

const flutterwave = require('../services/flutterwave');

exports.getBalance = asyncHandler(async (req, res, next) => {
    const wallet = await Wallet.findOne({reference: req.params.ref}).populate({
		path: "bootcamp",
		select: "balance",
	});

	if (!wallet) {
		throw new ErrorResponse(`You don't have a wallet. Please contact the administrator`, 404)
	}

	res.status(200).json({
		success: true,
		data: wallet.balance,
	});
})

exports.getTransaction = asyncHandler(async (req, res, next) => {
    const transaction = await Transaction.findOne({reference: req.params.ref}).populate({
		path: "bootcamp",
		// select: "name description",
	});

	if (!transaction) {
		throw new ErrorResponse(`No transaction with the ref [${req.params.ref}]`, 404)
	}

	res.status(200).json({
		success: true,
		data: transaction,
	});
})

exports.getTransactions = asyncHandler(async (req, res, next) => {
    const transactions = await Transaction.find({user: req.user.id}).populate({
		path: "bootcamp",
		// select: "name description",
	});

	if (!transactions) {
		throw new ErrorResponse(`You don't have any transactions`, 404)
	}

	res.status(200).json({
		success: true,
		data: transactions,
	});
})

exports.deposit = asyncHandler(async (req, res, next) => {
    let payload = {
        card_number: req.body.cardNumber,
        cvv: req.body.cvv,
        expiry_month: req.body.expiryMonth,
        expiry_year: req.body.expiryYear,
        currency: req.body.currency,
        amount: req.body.amount,
        email: req.body.email || req.user.email,
        fullname: req.body.fullName,
        tx_ref: generateTransactionReference(),
        redirect_url: process.env.APP_BASE_URL + '/pay/redirect',
        enckey: process.env.FLUTTERWAVE_ENCRYPTION_KEY,
        pin: req.body.pin
    }

    const response = await flutterwave.chargeCard(payload);

    res.status(200).json({
		success: true,
		data: response,
	});    
})

exports.authorize = asyncHandler(async (req, res, next) => {
    req.body.flw_ref = req.session.reCallCharge.data.flw_ref || req.body.flw_ref

    const response = await flutterwave.authorizeCardPayment(req.body);  

    res.status(200).json({
		success: true,
        message: 'Charge on card initiated',
		data: response,
	});    
})

exports.transfer = asyncHandler(async (req, res, next) => {})


let generateTransactionReference = () => {
    return `myWALLT-TRANS-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}