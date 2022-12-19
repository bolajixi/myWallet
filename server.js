const express = require('express');

const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const session = require('express-session');
const passport = require('passport');

const connectDb = require('./config/db');
const errorHandler = require('./middleware/errorHandler')

dotenv.config({ path: "./config/config.env" });
connectDb();

// Import routes
const auth = require("./routes/auth");
const wallet = require("./routes/wallets");
const user = require("./routes/users");

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
// Passport config
require("./config/passport")(passport);


// Middleware
app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

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
app.use("/api/v1/wallet", wallet);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", user);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});