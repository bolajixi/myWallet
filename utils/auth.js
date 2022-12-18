module.exports = {
    checkAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }

        throw new ErrorResponse(`Please authenticate yourself via the route - /api/v1/login.`, 400)
    },

    checkNotAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            throw new ErrorResponse(`User [${req.body.email}] is already authenticated.`, 400)
        }
        next()
    }
}