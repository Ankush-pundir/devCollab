const express = require("express");
const router= express.Router();
const {validateSignUpData}=require("../utils/validation");
const bcrypt = require("bcrypt");
const validator=require("validator");
const User = require("../models/user");



router.post("/signup",async(req,res)=>{
    
    try{

        validateSignUpData(req);

        const {firstName,lastName,emailId,password}=req.body;

        const passwordHash= await bcrypt.hash(password,10);
        

        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash
        });
        
        await user.save();
        res.send("user added successfully...");
    }
    catch(err){
        res.status(400).send("Error in saving user:  "+err.message);
    }
   
 })

 router.post("/login",async (req,res)=>{
    try {
        const {emailId,password}=req.body;
    if(!validator.isEmail(emailId)){
        throw new Error("INVALID CREDENTIALS");
    }
    const user =await User.findOne({emailId:emailId});
    if(!user){
        throw new Error("INVALID CREDENTIALS");
    }
    const isPasswordValid=await user.validatePassword(password);
    if(isPasswordValid){
        const token=await user.getJwt();
        res.cookie("token",token,{
            expires:new Date(Date.now() + 8*3600000),
        });


        res.send("login successful");
    }
    else{
        throw new Error("INVALID CREDENTIALS");
    }

}
    catch(err){
        res.status(400).send("something went wrong... "+err.message);
    }
 })

 router.post("/logout",(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })
    res.send("logout successful");
 })

 module.exports=router;