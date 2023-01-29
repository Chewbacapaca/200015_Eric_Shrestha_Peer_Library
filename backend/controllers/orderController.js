const Order = require("../models/orderModel")
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const Book = require("../models/bookModel")
const User = require("../models/userModel")

// Create New Order
exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
    const {
        address,
        additionalAddressInfo,
        phone,
        bookName,
        price,
        image,
        book,
        paymentInfo,      
    } = req.body

    const order = await Order.create({
        address,
        additionalAddressInfo,
        phone,
        bookName,
        price,
        image,
        book, 
        paymentInfo, 
        paidAt: Date.now(),
        user: req.user._id,
    })

    const user = req.user.id
    await User.findOneAndUpdate(
        {_id: user}, 
        {$inc:{peer_coins: 1}},
        {new: true})
    

    res.status(201).json({
        success: true,
        order
    })
})

// Get Single Order
exports.getSingleOrder = catchAsyncErrors(async(req, res, next)=>{
    const order = await Order.findById(req.params.id).populate("user", "name email ")

    if(!order){
        return next(new ErrorHandler("Order not found", 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})


// Get Logged In User's Orders
exports.myOrders = catchAsyncErrors(async(req, res, next)=>{
    const orders = await Order.find({user: req.user._id})

    res.status(200).json({
        success: true,
        orders
    })
})

// Get Seller Orders
exports.sellerOrders = catchAsyncErrors(async(req, res, next)=>{
    const user = req.user.id
    const book = await Book.find({user: user})
    
    const orders = await Order.find({book: book}).populate("user", "name email ")

    let totalAmount = 0

    orders.forEach((order)=>{
        totalAmount+=order.price
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

// Get Orders --- Admin
exports.getAllOrders = catchAsyncErrors(async(req, res, next)=>{
    const orders = await Order.find()

    let totalAmount = 0;

    orders.forEach((order)=>{
        totalAmount+=order.price
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

// Update Order Status
exports.updateOrder = catchAsyncErrors(async(req, res, next)=>{
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("Order not found with this id", 404));
    }

    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("You have already delivered the book", 404))
    }
    

    const book = await Book.findById(order.book)

    book.stock -= 1

    order.orderStatus = req.body.status

    if(req.body.status==="Delivered"){
        order.deliveredAt = Date.now()
    }

    await order.save()
    await book.save()
    

    res.status(200).json({
        success: true,
    })
})



// Delete Orders --- Admin
exports.deleteOrders = catchAsyncErrors(async(req, res, next)=>{
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("Order not found", 404))
    }

    await order.remove()

    res.status(200).json({
        success: true,
    })
})
