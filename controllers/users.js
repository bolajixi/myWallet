const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require('../models/user');

exports.registerUser = asyncHandler(async (req, res, next) => {
    let data = req.body;
    const existingUser = await User.findOne({email: data.email});
    
    if(existingUser) {
        throw new ErrorResponse(`User [${data.email}] already exists`, 400)
    }

    const user = await User.create(data);

    // Create a wallet for this user
            
    res.status(201).json({
        success: true,
        data: user,
    });
})