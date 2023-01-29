const Book = require("../models/bookModel")
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ApiFeatures = require("../utils/apifeatures")
const { query } = require("express")
const cloudinary = require("cloudinary")

// --------- CREATE BOOK -----------
exports.createBook = catchAsyncErrors(async (req, res, next)=>{

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
            folder: "books"
        })  

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks

    const book = await Book.create(req.body)

    res.status(201).json({
        success: true,
        book
    })

})


// ---------- GET ALL BOOKS --------------
exports.getAllBooks = catchAsyncErrors(async(req, res)=>{

    const resultPerPage = 8
    const bookCount = await Book.countDocuments()

    const apiFeature = new ApiFeatures(Book.find({stock: {$in:["1"]}}), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)

    const books = await apiFeature.query

    res.status(200).json({
        success: true,
        books,
        bookCount,
        resultPerPage
    })
})

// ----------- GET USER'S BOOKS ----------------
exports.getUserBooks = catchAsyncErrors(async(req, res)=>{

    const user = req.user.id
    


    const books = await Book.find({user: user})
    
    res.status(200).json({
        success: true,
        books,
    })
})

//Get All Books -- Admin
exports.getAdminBooks = catchAsyncErrors(async(req, res, next)=>{
    const books = await Book.find()

    res.status(200).json({
        success: true,
        books,
    })
})

// ------------- GET BOOK DETAILS --------------
exports.getBookDetails = catchAsyncErrors(async(req, res, next)=>{
    const book = await Book.findById(req.params.id)

    if(!book){
        return next(new ErrorHandler("Book not found", 404))
    }

    res.status(200).json({
        success: true,
        book
    })

})


// ---------------- UPDATE BOOK ----------
exports.updateBook = catchAsyncErrors(async(req, res, next)=>{
    let book = await Book.findById(req.params.id)

    if(!book){
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
    for (let i = 0; i < book.images.length; i++) {
        await cloudinary.v2.uploader.destroy(book.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "books",
        });

        imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        book
    })
})

// ------------- DELETE BOOK ----------------
exports.deleteBook = catchAsyncErrors(async(req, res, next)=>{
    const book = await Book.findById(req.params.id)

    if(!book){
        return next(new ErrorHandler("Book not found", 404))
    }

    await book.remove()

    res.status(200).json({
        success: true,
        message: "Book deleted successfully"
    })
})


// ------------- ASK QUESTIONS ---------------
exports.askQuestion = catchAsyncErrors(async(req, res, next)=>{

    const { comment, bookId } = req.body;

    const question = {
      user: req.user._id,
      name: req.user.name,
      comment,
    }
  
    const book = await Book.findById(bookId);

    book.questions.push(question);

    await book.save();
  
    res.status(200).json({
      success: true,
    });
})

// ------------- ANSWER QUESTIONS -------------
// exports.answerQuestion = catchAsyncErrors(async(req, res, next)=>{
//     const {answer, bookId} = req.body

//     const question = {
//         answer
//     }

//     await Book.findByIdAndUpdate(question.id)

//     book.question.push(question)
// })