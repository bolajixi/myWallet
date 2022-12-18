const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY);

const Transaction = require('../models/transaction');
const ErrorResponse = require('../utils/errorResponse')

module.exports = {
    /*****  Collections  *****/
    chargeCard: async (payload) => {
        // Pay directly to someones account
        try {
            const response = await flw.Charge.card(payload)
            let reCallCharge
            
            if(response.status == 'error'){
                throw new Error(response.message)
            }

            // Authorizing transactions
            if (response.meta.authorization.mode === 'pin') {
                let chargePayload = payload
                chargePayload.authorization = {
                    "mode": "pin",
                    "fields": [ "pin" ],
                    "pin": payload.pin
                }
                reCallCharge = await flw.Charge.card(chargePayload)
            }

            // Store reCallCharge in session
            return reCallCharge
        } catch (error) {
            throw new ErrorResponse(error.message,400)
        }
    },

    authorizeCardPayment: async (reCallCharge) => {
        // Add the OTP to authorize the transaction
        let status, transaction;

        const response = await flw.Charge.validate({
            otp: req.body.otp,
            flw_ref: reCallCharge.data.flw_ref
        })

        if (response.data.status === 'successful' || response.data.status === 'pending') {
            // Verify the payment
            const transactionId = response.data.id;
            transaction = flw.Transaction.verify({ id: transactionId });

            status = transaction.data.status;

            transactions = await Transaction.createOrUpdate({ transaction: transaction}); // Update the transaction
            return transactions;
        }
        
        transaction.status = 'failed';
        const transactions = await Transaction.createOrUpdate(transaction);
        return transactions;
    },

    /*****  Transfers  *****/
    transfers: () => {
        // transfer directly to another customer using this app
    },
}