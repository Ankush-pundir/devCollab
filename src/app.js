const express=require("express");
const connectDB=require("./config/database");
const validator=require("validator");
const app=express();
const User = require("./models/user");
const {validateSignUpData}=require("./utils/validation")
const bcrypt = require("bcrypt");

app.use(express.json());
 app.post("/signup",async(req,res)=>{
    
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
        res.status(400).send("Error in saving user:"+err.message);
    }
   
 })

 app.post("/login",async (req,res)=>{
    try {
        const {emailId,password}=req.body;
    if(!validator.isEmail(emailId)){
        throw new Error("INVALID CREDENTIALS");
    }
    const user =await User.findOne({emailId:emailId});
    if(!user){
        throw new Error("INVALID CREDENTIALS");
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(isPasswordValid){
        res.send("login successful");
    }
    else{
        throw new Error("INVALID CREDENTIALS");
    }

}
    catch(err){
        res.status(400).send("something went wrong..."+err.message);
    }
 })

 app.get("/user",async (req,res)=>{
    const userEmail=req.body.emailId;
    try{
        const user = await User.findOne({emailId:userEmail});
        if(!user){
            res.status(404).send("User not found...");
        }
        else{
            res.send(user);
        }
    }
    catch(err){
        res.status(400).send("Error in finding user:"+err.message);
    }
 })


 app.get("/feed",async (req,res)=>{
    try{
        const users=await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("Error in saving user:"+err.message);
    }
 })

 app.delete("/user", async (req,res)=>{
    const userId=req.body.userId;
    try{
        const user = await User.findByIdAndDelete({_id:userId});
        res.send("user deleted successfully")
    }catch{
        res.status(400).send("something went wrong...")
    }

 })

 app.patch("/user/:userId",async (req,res)=>{
    try{
        const userId= req.params?.userId;
        const data = req.body;
        const ALLOWED_UPDATE=["photoUrl","about","skills","age","gender"];

        const isUpdateAllowed=Object.keys(data).every((k)=>ALLOWED_UPDATE.includes(k));
        if(data?.skills.length>10){
            throw new Error(" Skills cannot be more than 10")
        }
        if(!isUpdateAllowed){
            throw new Error("Updates not Allowed...")
        }


        const user=await User.findByIdAndUpdate({_id:userId},data,{returnDocument:"before",
            runValidators:true,
             
        });
        if(!user){
            throw new Error("invalid user id...");
        }
        else{
            res.send("user updated successfully");
        }
        
        console.log(user);
    }
    catch(err){
        res.status(400).send("UPDATE FAILED"+err.message);
    }
 })

connectDB()
.then(()=>{
    console.log("Database connection established...");
    app.listen(7777,()=>{
        console.log("Server is successfully running on port 7777...");
    });
})
.catch((err)=>{
    console.log("Database cannot be connected!!",err);
});


