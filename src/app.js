const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {router} = require('./routes/index.js');
const {errorHandler} = require('./middleware/Error.middleware.js'); 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors({
    origin: "https://4bc4f03e-6724-4328-9524-a9a1108eeb02-00-2lbhj86on536i.pike.replit.dev",
    credentials:true
}));
app.use("/api/v1/users",router);
app.use(errorHandler)


module.exports = app;