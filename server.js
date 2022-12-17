const express = require('express');

const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const connectDb = require('./config/db')

dotenv.config({ path: "./config/config.env" });
connectDb();

// Import routes
const index = require("./routes/index");
const user = require("./routes/users");

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Middleware
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

// Mount Routers
app.use("/api/v1/", index);
app.use("/api/v1/users", user);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});