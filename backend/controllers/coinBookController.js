const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const CoinBook = require("../models/coinBookModel")
const ApiFeatures = require("../utils/apifeatures")
const cloudinary = require("cloudinary")

// --------- CREATE BOOK -----------
exports.createCoinBook = catchAsyncErrors(async (req, res, next)=>{
    
    req.body.user = req.user.id
    req.body.username = req.user.name

    let images=[]

    if(typeof req.body.images==="string"){
        images.push(req.body.images)
    }else{
        images=req.body.images
    }

    const imagesLinks = []

    for(let i = 0; i< images.length; i++){
        const result = await cloudinary.v2.uploader.upload(images[i],{
            folder: "coinBooks"
        })  

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks

    const coinBook = await CoinBook.create(req.body)

    res.status(201).json({
        success: true,
        coinBook
    })

})

// ---------- GET ALL PEER-COIN BOOKS --------------
exports.getAllCoinBooks = catchAsyncErrors(async(req, res)=>{

    const resultPerPage = 8
    const coinBookCount = await CoinBook.countDocuments()

    const apiFeature = new ApiFeatures(CoinBook.find({stock: {$in:["1"]}}), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)

    const coinBooks = await apiFeature.query
    res.status(200).json({
        success: true,
        coinBooks,
        coinBookCount,
        resultPerPage
    })
})

// ----------- GET USER'S COIN BOOKS ----------------
exports.getUserCoinBooks = catchAsyncErrors(async(req, res)=>{

    const user = req.user.id
    
    const coinBooks = await CoinBook.find({user: user})
    
    res.status(200).json({
        success: true,
        coinBooks,
    })
})

//Get All Coin Books -- Admin
exports.getAdminCoinBooks = catchAsyncErrors(async(req, res, next)=>{
    const coinBooks = await CoinBook.find()

    res.status(200).json({
        success: true,
        coinBooks,
    })
})

// ---------------- GET PRODUCT DETAILS --------------
exports.getCoinBookDetails = catchAsyncErrors(async(req, res, next)=>{
    const coinBook = await CoinBook.findById(req.params.id)
    
    if(!coinBook){
        return next(new ErrorHandler("Book not found", 404))
    }

    res.status(200).json({
        success: true,
        coinBook
    })
})

// ---------------- UPDATE COIN BOOK ----------
exports.updateCoinBook = catchAsyncErrors(async(req, res, next)=>{
    let coinBook = await CoinBook.findById(req.params.id)

    if(!coinBook){
        return next(new ErrorHandler("Book not found", 404))
    }

     // Images Start Here
     let images = [];

     if (typeof req.body.images === "string") {
     images.push(req.body.images);
     } else {
     images = req.body.images;
     }
 
     if (images !== undefined) {
     // Deleting Images From Cloudinary
     for (let i = 0; i < coinBook.images.length; i++) {
         await cloudinary.v2.uploader.destroy(coinBook.images[i].public_id);
     }
 
     const imagesLinks = [];
 
     for (let i = 0; i < images.length; i++) {
         const result = await cloudinary.v2.uploader.upload(images[i], {
         folder: "coinBooks",
         });
 
         imagesLinks.push({
         public_id: result.public_id,
         url: result.secure_url,
         });
     }
 
     req.body.images = imagesLinks;
     }

    coinBook = await CoinBook.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        coinBook
    })
})

// ------------- DELETE COIN BOOK ----------------

exports.deleteCoinBook = catchAsyncErrors(async(req, res, next)=>{
    const coinBook = await CoinBook.findById(req.params.id)

    if(!coinBook){
        return next(new ErrorHandler("Book not found", 404))
    }

    await coinBook.remove()

    res.status(200).json({
        success: true,
        message: "Book deleted successfully"
    })

})