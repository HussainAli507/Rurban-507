const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt  = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "please enter your name"],
        maxLength : [30, "name cannot exceed more than 30 characters"],
        minLength : [4, "name should be equal or more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "please enter yuor name"],
        unique: true,
        validate: [validator.isEmail, "please enter valid Email"],
    },
    password :{
        type : String,
        required : [true, "please enter your name"],
        minLength : [8, "password should be greater than 8 character"],
        select : false,
    },
    avatar : {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,

});

// password encryption/ hidding method

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password,10);
});

// JWT tokkens

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// compare password

userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

// generating password reset token

userSchema.methods.getResetPasswordToken = function (){

    // generating token 
    const resetToken = crypto.randomBytes(20).toString("hex");
    
    // hashing and adding resetPasswordToken to userschema

    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken).
    digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;

};

module.exports = mongoose.model("User",userSchema);