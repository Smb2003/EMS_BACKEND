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
const allowedOrigins = [
  "http://localhost:5173",
  "https://ems-frontend-gamma-gray.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use("/api/v1/users",router);
app.use(errorHandler)


module.exports = app;