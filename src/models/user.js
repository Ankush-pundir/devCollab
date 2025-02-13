const mongoose = require("mongoose");
const validator = require("validator");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required:true,
        index:true,
        minLength:3,
        maxLength:50
    },
    lastName : {
        type : String
    },
    emailId : {
        type : String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address" + value);
            }

    }
},
    password: {
        type: String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password" + value);
            } 
    }
    },
    age : {
        type : Number,
        min:18,
    },
    gender:{
        type : String,
        enum:{
            values:["male","female","others"],
            message:`{VALUE} is not a valid gender type`
        },
    },
    photoUrl:{
        type:String,
       
        default:"https://t3.ftcdn.net/jpg/07/52/62/60/360_F_752626052_dk6phMIfGSesSo6xhgdA2wvscEW9UXGc.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid PhotoURL address" + value);
            } 
    }
},
    about:{
        type:String,
        default:"this is default about user",
    },
    skills:{
        type:[String],
        maxLength:10,
    }
},{timestamps:true})

userSchema.methods.getJwt= async function(){
    const user = this
    const token= await jwt.sign({_id:user._id},"Dev@collab123",{
        expiresIn:"7d"
    });

    return token;

} 

userSchema.methods.validatePassword=async function (userPasswordInput) {
    const user = this;
    const passwordHash=user.password;
    const isPasswordValid=await bcrypt.compare(userPasswordInput,passwordHash);
    return isPasswordValid;
}

module.exports=mongoose.model("User",userSchema);