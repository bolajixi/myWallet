const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    reference: {
        type: 'string',
        required: true, 
        trim: true,
    }, 
    type: {
        type: 'string',
        required: true,
        enum: ['deposit', 'withdraw', 'transfer']
    },
    amount: {
        type: Number,
        default: 0,
        required: true,
    },
    sender: {
        type: 'number',
        required: true,
        ref: 'SettlementAccount',
    },
    recipient: {
        type: 'number',
        required: true,
    },
    description: {
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
TransactionSchema.statics.aggregateBalances = async function (userId) {
    const obj = await this.aggregate([
		{ $match: { user: userId } },
		{ $group: {
				_id: "$user",                           // Group all transaction by userId
				transactionSum: { $sum: "$amount" },    // Sums up all transaction by userId
			}
        },
	]);

    try {
		await this.model("Wallet").findByIdAndUpdate(userId, {
			balance: obj[0].transactionSum,
		});
	} catch (error) {
		console.error(error);
	}
}

// Aggregate transaction balance
TransactionSchema.post('save', function() {
    this.constructor.aggregateBalances(this.user);
})

const Transaction = mongoose.model('User', TransactionSchema);

module.exports = Transaction;