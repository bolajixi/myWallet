const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: 'string',
        required: [true, "Please enter your first name"]
    },
    lastName: {
        type: 'string',
        required: [true, "Please enter your last name"]
    },
    email: {
        type: 'string',
        required: [true, "Please enter your email address"],
        unique: true,
        match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please enter a valid email address",
		],
    },
    pin: {
        type: 'string',
        required: [true, "Please add a pin"]
    },
    createdAt: {
		type: Date,
		default: Date.now,
	},
});

const encryptPin = async function (next) {
	// if (!this.isModified("pin")) {
	// 	next();
	// }

	const salt = await bcrypt.genSalt(10);
	this.pin = await bcrypt.hash(this.pin, salt);
};

UserSchema.pre("save", encryptPin);

const User = mongoose.model('User', UserSchema);

module.exports = User;