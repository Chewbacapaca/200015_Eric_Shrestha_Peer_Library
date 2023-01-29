const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
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
    price: {
        type: Number,
        required: [true, "Please Enter Price"],
        maxLength: [5, "Price set too high"]
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
    stock: {
        type: Number,
        required: true,
        default: 1
    },
    questions: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ], 

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

module.exports = mongoose.model("Book", bookSchema)