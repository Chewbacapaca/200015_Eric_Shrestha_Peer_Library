const mongoose = require("mongoose")

const orderCoinSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    additionalAddressInfo:{
        type: String,
    },
    phone: {
        type: Number,
        required: true
    },
    bookName:{
        type: String,
        required: true,
    },
    coins:{
        type: Number,
        default: 3,
        required: true,
    },
    image:{
        type: String,
    },
    book:{
        type: mongoose.Schema.ObjectId,
        ref: "CoinBook",
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    paymentInfo:{
        id:{
            type: String,
        },
        status:{
            type: String,
        }
    },
    paidAt:{
        type: Date,
        required: true,
    },
    orderStatus:{
        type: String,
        required: true,
        default: "Processing"
    },
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    }
    
})

module.exports = mongoose.model("OrderCoin", orderCoinSchema)