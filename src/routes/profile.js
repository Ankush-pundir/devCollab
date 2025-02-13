const express = require("express");
const profileRouter= express.Router();
const {userAuth}=require("../middlewares/auth");
const {validateEditProfileData}=require("../utils/validation");
const validator=require("validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view",userAuth,async (req,res)=>{
    try{ 
     const user = req.user;
      if(!user){
         throw new Error("User Doesn't exist")
      }
     res.send(user);}
     catch(err){
         res.status(400).send("ERROR: "+err.message)
     }
 })
profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser=req.user;
        
        Object.keys(req.body).forEach((key)=>{
            loggedInUser[key]=req.body[key];
        })

        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, Your profile is updated successfully`,
            Data : loggedInUser,
        })
        
    }catch(err){
         res.status(400).send("ERROR: "+err.message)
     }
})

profileRouter.patch("/profile/password", async (req, res) => {
    try {
        const { emailId, oldPassword, newPassword } = req.body;

        if (!validator.isEmail(emailId)) {
            throw new Error("INVALID EMAIL");
        }

        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("USER NOT FOUND");
        }

        const isPasswordValid = await user.validatePassword(oldPassword);
        if (!isPasswordValid) {
            throw new Error("INCORRECT OLD PASSWORD");
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        user.password = newPasswordHash;
        await user.save();

        res.send("Password updated successfully");
    } catch (err) {
        res.status(400).send("Error updating password: " + err.message);
    }
});
 module.exports=profileRouter;