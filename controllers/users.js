const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

const User = require('../models/user');
const account = require('../models/settlementAccount');

exports.addSettlementAccount = asyncHandler(async (req, res, next) => {
	const existingUser = await User.findById(req.user.id);

	if (!existingUser) {
		throw new ErrorResponse(`User with the ID [${req.user.id}] does not exist.`, 404)
	}

    req.body.user = existingUser.id;
	const settlementAccount = await account.create(req.body);

	res.status(200).json({
		success: true,
		data: settlementAccount,
	});
})

exports.editSettlementAccount = asyncHandler(async (req, res, next) => {
    let settlementAccount = await account.findById(req.params.id);

	if (!settlementAccount) {
		throw new ErrorResponse(`Settlement Account with ID [${req.params.id}] not found`, 404)
	}

	if (settlementAccount.user.toString() !== req.user.id) {
		throw new ErrorResponse(`Not authorized to update settlement account`, 401)
	}

	settlementAccount = await account.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
        message: 'Successfully updated settlement account.',
		data: settlementAccount,
	});
})

exports.deleteSettlementAccount = asyncHandler(async (req, res, next) => {
    const settlementAccount = await account.findById(req.params.id);

	if (!settlementAccount) {
		throw new ErrorResponse(`Settlement Account with ID [${req.params.id}] not found`, 404)
	}

	if (settlementAccount.user.toString() !== req.user.id) {
		throw new ErrorResponse(`Not authorized to delete settlement account`, 401)
	}

	await account.remove();

	res.status(200).json({
		success: true,
        message: 'Settlement account deleted successfully',
		data: {},
	});
})