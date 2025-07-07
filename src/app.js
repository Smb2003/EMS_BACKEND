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
    origin: "http://localhost:5173",
    credentials:true
}));
app.use("/api/v1/users",router);
app.use(errorHandler)


module.exports = app;