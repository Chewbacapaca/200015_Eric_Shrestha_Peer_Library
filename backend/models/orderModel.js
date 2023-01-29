const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
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
    bookName:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    image:{
        type: String,
    },
    book:{
        type: mongoose.Schema.ObjectId,
        ref: "Book",
        required: true,
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

module.exports = mongoose.model("Order", orderSchema)