const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require('../models/user');
const Wallet = require('../models/wallet');

exports.registerUser = asyncHandler(async (req, res, next) => {
    let data = req.body;
    const existingUser = await User.findOne({email: data.email});
    
    if(existingUser) {
        throw new ErrorResponse(`User [${data.email}] already exists`, 400)
    }

    const user = await User.create(data);

    // Create a wallet for this user alongside transaction pin
    const wallet = await Wallet.create({transactionPin: req.body.transactionPin, user: user.id});
            
    res.status(201).json({
        success: true,
        data: {user, wallet},
    });
})

exports.logout = asyncHandler(async (req, res) => {
	res.status(200).json({
		success: true,
		data: {},
	});
});