const { User } = require("../models/User.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { uploadToCloudinary } = require("../utils/cloudinary");
const JWT = require('jsonwebtoken');

const generateAccessAndRefreshToken = async (userID) => {
    try {
        const user = await User.findById(userID);
        const accessToken = await user.generateAccessToken();
  
        const refreshToken = await user.generateRefreshToken();    
    
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false} );
        return {
            refreshToken,
            accessToken
        }
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh token.");
    }
}

const register = asyncHandler( async (req,res) => {

    const {name,email,password,role} = req.body;
    
    if([name,email,password,role].some(item => item?.trim() == "")){
        throw new ApiError(404,"All fields are required.")
    }

    const existingUser = await User.findOne({
        $or:[{name},{email}]
    });

    if(existingUser){
        throw new ApiError(409,"User already exists!");
    }
    
    let check = req.files;
    console.log("Xek",check);
    
    let profilePhoto;
    if(req.files && Array.isArray(req.files.profileImage) && req.files.profileImage.length > 0){
        profilePhoto = req.files.profileImage[0].path;
    }

    // cloudinary pr upload krna ha 
    const uploadedURL = uploadToCloudinary(profilePhoto);
    
    const user = await User.create({
        name,
        email,
        password,
        role,
        profilePhoto: uploadedURL?.url || ""
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500,"Failed to register user!")
    }

    res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully!")
    )
})

const login = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    console.log(email," ",password);
    
    if(!email){
        throw new ApiError(400,"Email Addres is required!");
    }
    
    const user = await User.findOne({email})
    console.log(user);
    
    if(!user){
        throw new ApiError(400,"Invalid Credentials.");
    }
    const cmpPassword = await user.isPasswordCorrect(password);
    console.log(cmpPassword);
    if(!cmpPassword){
        throw new ApiError(400,"Invalid Credentials");
    }
    
    const {refreshToken, accessToken} = await generateAccessAndRefreshToken(user._id);
    console.log("Ac",accessToken);
    console.log("RF",refreshToken)
    
    const loggedUser = await User.findById(user._id).select(" -password -refreshToken ");
    req.user = loggedUser;
    const options = {
        httpOnly: true,
        secure: false,
        sameSite:"Lax"
    }
    res
    .status(200)
    .cookie("AC_TOKEN",accessToken,options)
    .cookie("RFSH_TOKEN",refreshToken,options)
    .json(new ApiResponse(
        200,
        {
            user: loggedUser,
            refreshToken,
            accessToken
        },
        "User has been loggenIn."
    ))

});

const logOut = asyncHandler(async (req,res)=>{
    const token = req.cookies.AC_TOKEN;
    const verifyJWTACCESSTOKEN = JWT.verify(token,process.env.SECRET_ACCESS_KEY);
    if(!verifyJWTACCESSTOKEN){
        throw new ApiError(500,"Unauthorized user!");
    }
    await User.findByIdAndUpdate(verifyJWTACCESSTOKEN?._id,{
        $set:{
            refreshToken: undefined
        }},
        {
            new: true
        }  
    )
    const options = {
        httpOnly: true,
        secure: false,
        sameSite:"Lax"
    }
    return res
    .status(200)
    .clearCookie("AC_TOKEN",options)
    .clearCookie("RFSH_TOKEN",options)
    .json(new ApiResponse(
        200,{},"User loggedOut successfully!"
    ))
})

const RefreshAccessToken = asyncHandler(async (req,res)=>{
    const incomingRefreshToken = req.cookies.RFSH_TOKEN  || req.body.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError(400,"Refresh Token not found.");
    }
    const verifyRefreshToken = JWT.verify(incomingRefreshToken,process.env.SECRET_REFRESH_TOKEN);
    if(!verifyRefreshToken){
        throw new ApiError(500,"Unauthorized user");
    }
    const user = await User.findById(verifyRefreshToken._id);
    if(!user){
       throw new ApiError(400,"User not found.");
    }
    if(verifyRefreshToken !== user.refreshToken){
        throw new ApiError(400,"RefreshToken not matched!");
    }
    const {refreshToken,accessToken} = await generateAccessAndRefreshToken(user._id);
    await User.findByIdAndUpdate(user._id,{
        $set:{
            refreshToken: refreshToken
        }
    })
    const options = {
        httpOnly: true,
        secure: false,
        sameSite:"None"
    }

    res
    .status(200)
    .cookie("AC_TOKEN",accessToken,options)
    .cookie("RFSH_TOKEN",refreshToken,options)
    .json(new ApiResponse(
        200,
        "Access Token has been refresed."
    ))
    
})
const updatePassword = asyncHandler(async (req,res)=>{
    const {password,NewPassword} = req.body;
    console.log(password," ",NewPassword);
    
    if([password,NewPassword].some((field)=>{
        field?.trim() === "" 
    })){
        throw new ApiError(400,"All fields are required.")
    }

    const user = await User.findById(req.user?._id);
    console.log(user);
    if(!user){
        throw new ApiError(404,"User not found");
    }

    const cmpPassword = await user.isPasswordCorrect(password);
    console.log(cmpPassword);
    
    if(!cmpPassword){
        throw new ApiError(401,"Invalid old Password!");
    }

    user.password = NewPassword;
    await user.save()
    
    res
    .status(200)
    .json(new ApiResponse(
        200,
        user,
        "Password updated successfully."
    ))
})

module.exports = {
    register,
    login,
    logOut,
    RefreshAccessToken,
    updatePassword
}