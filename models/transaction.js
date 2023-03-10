const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    reference: {
        type: 'string',
        required: true, 
        trim: true,
    }, 
    gatewayReference: {
        type: 'string',
        required: true, 
        trim: true,
    }, 
    transactionType: {
        type: 'string',
        required: true,
        enum: ['debit', 'credit'],
        default: 'debit'
    },
    paymentType: {
        type: 'string',
        required: true,
        enum: ['card', 'account']
    },
    amount: {
        type: 'number',
        default: 0,
        required: true,
    },
    currency: {
        type: 'string',
        default: 'NGN'
    },
    recipient: {
        type: 'string',
        required: false,
    },
    status: {
      type: 'string',
      enum: ['pending', 'successful', 'failed', 'flagged'],
      default: 'pending',
    },
    description: {
        type: 'string',
        required: false,
    },
    deviceFingerprint: {
        type: 'string',
        required: false,
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

// Static method to get total sum of transaction balance
TransactionSchema.statics.sumBalances = async function (userId) {
    const obj = await this.aggregate([
		{ $match: { user: userId, status: 'successful' } },
		{ $group: {
				_id: '$user',                           // Group all transaction by userId
				transactionSum: { $sum: '$amount' },    // Sums up all transaction by userId
			}
        },
	]);

    try {
		await this.model("Wallet").findOneAndUpdate({ user: userId }, {
			balance: obj[0].transactionSum,
		});
	} catch (error) {
		console.error(error);
	}
}

// Aggregate transaction balance
TransactionSchema.post("save'", function() {
    this.constructor.sumBalances(this.user);
})

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;