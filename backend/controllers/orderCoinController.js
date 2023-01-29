const OrderCoin = require("../models/orderCoinModel")
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const CoinBook = require("../models/coinBookModel")
const User = require("../models/userModel")

// Create New Order
exports.newOrderCoin = catchAsyncErrors(async(req,res,next)=>{
    const {
        address, 
        additionalAddressInfo,
        phone,
        bookName,
        coins,
        image,
        book, 
        paymentInfo, 
        
    } = req.body

    const user = req.user.id
    const peer_coins = req.user.peer_coins
    if(peer_coins<3){
        return next(new ErrorHandler("Not Enough Peer Coins", 404))
    }else{
        await User.findOneAndUpdate(
            {_id: user}, 
            {$inc:{peer_coins: -3}},
            {new: true}
        )
    } 

    // const book = req.body.orderItems.book

    // const seller = CoinBook.findOne({book}, user)

    // await User.findOneAndUpdate(
    //     {_id: seller},
    //     {$inc:{peer_coins: 3}},
    //     {new: true}
    // )

    const order = await OrderCoin.create({
        address, 
        additionalAddressInfo,
        phone,
        bookName,
        coins,
        image,
        book, 
        paymentInfo, 
        paidAt: Date.now(),
        user: req.user._id,
    })
    
    res.status(201).json({
        success: true,
        order
    })
})

// Get Single Coin Order
exports.getSingleOrderCoin = catchAsyncErrors(async(req, res, next)=>{
    const order = await OrderCoin.findById(req.params.id).populate("user", "name email ")

    if(!order){
        return next(new ErrorHandler("Order not found", 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})


// Get Logged In User's Orders
exports.myOrderCoins = catchAsyncErrors(async(req, res, next)=>{
    const orders = await OrderCoin.find({user: req.user._id})

    res.status(200).json({
        success: true,
        orders
    })
})

// Get Seller Orders
exports.sellerOrderCoins = catchAsyncErrors(async(req, res, next)=>{
    const user = req.user.id
    const book = await CoinBook.find({user: user})
    
    const orders = await OrderCoin.find({book: book}).populate("user", "name email ")

    res.status(200).json({
        success: true,
        orders
    })
})

// Get Orders --- Admin
exports.getAllOrderCoins = catchAsyncErrors(async(req, res, next)=>{
    const orders = await OrderCoin.find()

    res.status(200).json({
        success: true,
        orders
    })
})

// Update Order Status
exports.updateOrderCoin = catchAsyncErrors(async(req, res, next)=>{
    const order = await OrderCoin.findById(req.params.id)
    const user = await User.findById(req.user.id)

    if(!order){
        return next(new ErrorHandler("Order not found with this id", 404));
    }

    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("You have already delivered the book", 404))
    }

    const book = await CoinBook.findById(order.book)

    if(req.body.status==="Shipped"){
        book.stock -= 1

        await book.save()
    }

    order.orderStatus = req.body.status

    if(req.body.status==="Delivered"){
        order.deliveredAt = Date.now()

        user.peer_coins += 3
    
        await user.save()
    }

    await order.save()
    

    res.status(200).json({
        success: true,
    })
})



// Delete Orders --- Admin
exports.deleteOrderCoins = catchAsyncErrors(async(req, res, next)=>{
    const order = await OrderCoin.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("Order not found", 404))
    }

    await order.remove()

    res.status(200).json({
        success: true,
    })
})

