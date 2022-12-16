const express = require('express');

const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

dotenv.config({ path: "./config/config.env" });

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Middle≥wares
app.use(express.json());
app.use(helmet());
app.use(xss());

const limiter = rateLimit({
	WindowMs: 10 * 60 * 1000, // 10 Mins
	max: 20, // 20 requests
});
app.use(limiter);

// Enable CORS
app.use(cors());

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});