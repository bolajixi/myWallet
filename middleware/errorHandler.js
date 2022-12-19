// const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    let stack;

    if (process.env.NODE_ENV !== "production") {
        stack = err.stack
        console.log(stack);
    }

    res.status(err.statusCode || 500).json({
		success: false,
		error: err.message || "Internal Server Error",
        stack
	});
};

module.exports = errorHandler;