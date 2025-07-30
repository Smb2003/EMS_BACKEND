const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const mongooseAggregation = require("mongoose-aggregate-paginate-v2");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowerCase: true, 
        index: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowerCase: true,
        unique: true
    },
    password:{
        type: String,
        required: [true, "Password is required."],
        lowerCase: true,
        minlength: 6
    },
    role: {
        type: String,
        enum : ["Admin","Employee"],
        required: true
    },
    profileImage: {
        type: String   // Cloudinary URL..
    },
    refreshToken: {
        type: String
    }
},{timestamps: true});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    console.log("this->",this.password);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("After this->",this.password);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
     console.log("Entered password:", password);         
    console.log("Hashed password from DB:", this.password);   

  if (!password || !this.password) {
    throw new Error("Missing password or hash in isPasswordCorrect");
  }
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken = async function () {
    const payload = {
        _id: this._id,
        name: this.name
    }
    const token = jwt.sign(payload, process.env.SECRET_ACCESS_KEY,{expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
    return token;
}
userSchema.methods.generateRefreshToken = async function () {
    const payload = {
        _id: this._id,
    }
    const token = jwt.sign(payload, process.env.SECRET_REFRESH_TOKEN,{expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
    return token;
}
userSchema.plugin(mongooseAggregation);
const User = mongoose.model("User",userSchema);
module.exports = {User};