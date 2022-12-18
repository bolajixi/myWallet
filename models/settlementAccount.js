const mongoose = require('mongoose');

const SettlementAccountSchema =  new mongoose.Schema({
    accountNumber: {
        type: 'number',
        required: true
    },
    accountName: {
        type: 'string',
        required: true
    },
    default: {
        type: 'boolean',
        required: true,
        default: false
    },
    currency: {
        type: 'string',
        default: 'NGN'
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

const SettlementAccount = mongoose.model('SettlementAccount', SettlementAccountSchema);

module.exports = SettlementAccount;