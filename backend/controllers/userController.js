const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const User = require("../models/userModel")
const sendToken = require("../utils/jwtToken")
const cloudinary = require("cloudinary");

// ---------    REGISTER USER   ------------
exports.registerUser = catchAsyncErrors(async(req, res, next)=>{
    const myCloud= await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width: 150,
        crop: "scale",
    })

    const {name, email, password} = req.body

    const user = await User.create({
        name, 
        email, 
        password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url
      }
    })

    sendToken(user, 201, res)
})

// ---------------  LOGIN USER  ----------------
exports.loginUser = catchAsyncErrors(async(req, res, next)=>{
    const {email, password} = req.body

    // Checking if user has given password and email

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email and Passowrd", 400))
    }

    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    sendToken(user, 200, res)

})

//Logout User
exports.logout = catchAsyncErrors(async(req, res, next)=>{

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message:"Logged Out",
    })
})

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async(req, res, next)=>{
    const user = await User.findById(req.user.id)
    
    res.status(200).json({
        success: true,
        user
    })
})

// Update User Password
exports.updatePassword = catchAsyncErrors(async(req, res, next)=>{

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save()

    sendToken(user, 200, res);
})

// Update User Profile
exports.updateProfile = catchAsyncErrors(async(req, res, next)=>{

    const newUserData={
        name: req.body.name,
        email: req.body.email,
    }

    if (req.body.avatar !== ""){
        const user = await User.findById(req.user.id)
        const imageId = user.avatar.public_id

        await cloudinary.v2.uploader.destroy(imageId)

        const myCloud= await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"avatars",
            width: 150,
            crop: "scale",
        })

        newUserData.avatar={
        public_id: myCloud.public_id,
           url: myCloud.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        user
    })
})


// Get All Users -- Admin
exports.getAllUser = catchAsyncErrors(async (req, res, next)=>{
    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })
})

//Get Single User -- Admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next)=>{
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})

// Update User Role --- Admin
exports.updateUserRole = catchAsyncErrors(async(req, res, next)=>{

    const newUserData={
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        user
    })
})

// Delete User Role --- Admin
exports.deleteUser = catchAsyncErrors(async(req, res, next)=>{

    const user = await User.findById(req.params.id)

    // Remove from cloudinary later

    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
    }

    await user.remove()

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    })
})


