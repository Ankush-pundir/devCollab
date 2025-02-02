const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required:true,
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
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid");
            }
        }
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

module.exports=mongoose.model("User",userSchema);