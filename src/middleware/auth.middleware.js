const { User } = require("../models/User.model");
const { ApiError } = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const JWT = require("jsonwebtoken");

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies.AC_TOKEN; 
  // const response = req.cookies;
  console.log("VerifyingToken:", token);
  const response = req.cookies;
  console.log("res",response);
  
  if (!token) {
    throw new ApiError(400, "Token not found!");
  }

  const verifyToken = JWT.verify(token, process.env.SECRET_ACCESS_KEY);
  console.log(verifyToken);

  if (!verifyToken) {
    throw new ApiError(401, "Unauthorized user");
  }
  
  const user = await User.findById(verifyToken._id);
  if(!user){
    throw new ApiError(400,"Unauthorized user!");
  }
  req.token = verifyToken;
  req.user = user;
  next();
});

module.exports = { verifyJWT };
