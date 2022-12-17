const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const WalletSchema =  new mongoose.Schema({
    balance: {
        type: 'number',
        default: 0
    },
    transactionPin: {
        type: 'string',
        required: [true, "Please add a pin"]
    },
    createdAt: {
		type: Date,
		default: Date.now,
	},
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})

// Prevent User from creating more than one wallet
WalletSchema.index({ user: 1 }, { unique: true });

const encryptTransactionPin = async function (next) {
	if (!this.isModified("transactionPin")) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.transactionPin = await bcrypt.hash(this.transactionPin, salt);
};

WalletSchema.pre("save", encryptTransactionPin);

const Wallet = mongoose.model('Wallet', WalletSchema);

module.exports = Wallet;