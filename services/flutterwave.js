const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY);

const Transaction = require('../models/transaction');
const ErrorResponse = require('../utils/errorResponse')

module.exports = {
    /*****  Collections  *****/
    chargeCard: async (payload) => {
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

            return reCallCharge
        } catch (error) {
            throw new ErrorResponse(error.message,400)
        }
    },

    authorizeCardPayment: async (payload) => {
        // Add the OTP to authorize the transaction
        let status, transaction;
        let updateQuery = { $set: { 
            reference: '', 
            gatewayReference: '',
            paymentType: '',
            amount: '',
            status: '',
            description: '',
            deviceFingerprint: '',
            currency: '',
            user: '',
        }};

        const response = await flw.Charge.validate({
            otp: payload.otp,
            flw_ref: payload.flw_ref
        })

        updateQuery.$set.reference = response.data.tx_ref
        updateQuery.$set.gatewayReference = response.data.flw_ref;
        updateQuery.$set.paymentType = response.data.payment_type;
        updateQuery.$set.amount = response.data.amount;
        updateQuery.$set.status = response.data.status;
        updateQuery.$set.description = response.data.narration;
        updateQuery.$set.deviceFingerprint = response.data.device_fingerprint;
        updateQuery.$set.currency = response.data.currency;
        updateQuery.$set.user = payload.userId;

        if (response.data.status === 'successful' || response.data.status === 'pending') {
            // Verify the payment
            const transactionId = response.data.id;
            transaction = await flw.Transaction.verify({ id: transactionId });

            const query = { gatewayReference: transaction.data.flw_ref };

            let upsertTransactions = await Transaction.updateOne(query, updateQuery, {upsert: true});
            return transaction;
        }
        
        updateQuery.$set.status = 'failed';
        let upsertTransactions = await Transaction.updateOne(query, updateQuery, {upsert: true});
        return response;
    },

    /*****  Transfers  *****/
    transfer: async (payload) => {
        // transfer directly to another customer using myWallet
        try {
            const response = await flw.Transfer.initiate(payload)
            
            return response;
        } catch (error) {
            throw new ErrorResponse(error.message,400)
        }
    },
}