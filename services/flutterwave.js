const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_TEST_KEY, process.env.FLUTTERWAVE_SECRET_KEY);

module.export = {
    /*****  Collections  *****/
    chargeCard: async (payload) => {
        // Pay directly to someones account
        try {
            const response = await flw.Charge.card(payload)
            let reCallCharge
            console.log(response)

            // Authorizing transactions

            if (response.meta.authorization.mode === 'pin') {
                let authPayload = payload
                authPayload.authorization = {
                    "mode": "pin",
                    "fields": [ "pin" ],
                    "pin": 3310
                }
                reCallCharge = await flw.Charge.card(authPayload)
            }

            console.log(response)
            return reCallCharge
        } catch (error) {
            console.log(error)
        }
    },

    authorizeCardPayment: async (reCallCharge) => {
        // Add the OTP to authorize the transaction
        const callValidate = await flw.Charge.validate({
            otp: "12345",
            flw_ref: reCallCharge.data.flw_ref
        })
        console.log(callValidate)
        return callValidate
    },

    credit: () => {
        // generate link to credit my own wallet
    },
    transfers: () => {
        // transfer directly to another customer using this app
    },
}