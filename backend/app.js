const express = require("express");
const app = express()
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser");
const errorMiddleware = require("./middleware/error")
const dotenv = require('dotenv');
const fileUpload = require("express-fileupload");


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

//---------------ROUTE IMPORTS ------------------

const book = require("./routes/bookRoute")
const coinBook = require("./routes/coinBookRoute")
const user = require("./routes/userRoute")
const order = require("./routes/orderRoute")
const orderCoin = require("./routes/orderCoinRoute")

app.use("/api/v1", book)
app.use("/api/v1", coinBook)
app.use("/api/v1", user)
app.use("/api/v1", order)
app.use("/api/v1", orderCoin)

// --------------- MIDDLEWARE FOR ERRORS -------------
app.use(errorMiddleware)

module.exports = app