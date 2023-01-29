const mongoose = require("mongoose")

const coinBookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Book Name"],
        trim: true
    },
    author:{
        type: String
    },
    description:{
        type: String,
        required: [true, "Please Enter Book Description"]
    },
    coins: {
        type: Number,
        required: true,
        default: 3
    },
    images: [
        {
            public_id:{
                type: String,
                required: true
            },
            url:{
                type: String,
                required: true
            }
        }
    ],
    genre: {
        type: String,
        required: [true, "Please Enter Book Genre"],
    },
    question: [
        {
            name:{
                type: String,
                required: true
            },
            comment:{
                type: String,
                required: true,
            }
        }
    ],

    stock: {
        type: Number,
        required: true,
        default: 1
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },

    username: {
        type: String,
        ref: "User",
        required: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("CoinBook", coinBookSchema)