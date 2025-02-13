const express=require("express");
const router=express.Router();

const {userAuth}=require("../middlewares/auth.js");
const connectionRequest=require("../models/connectionRequest.js");

const USER_SAFE_DATA="firstName LastName skills photoUrl age about gender";



router.get("/user/connections",userAuth,async (req,res)=>{
try{
    const loggedInUser=req.user;
    const connections= await connectionRequest.find({
        $or:[
            {toUserId:loggedInUser._id,  status:"accepted"},
            {fromUserId:loggedInUser._id,  status:"accepted"}
        ]
    }).populate("fromUserId",USER_SAFE_DATA)
    .populate("toUserId",USER_SAFE_DATA);

    const data= connections.map((row)=>{
        if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId; 
    });
    res.json({
        data
    })

}catch(err){
    res.status(400).send("ERROR: "+err.message)
}
})




router.get("/user/requests/recieved",userAuth,async (req,res)=>{
   try{ 
    const loggedInUser=req.user;
    const connectionRequests= await connectionRequest.find({
        toUserId:loggedInUser._id,
        status:"interested",
    })
    .populate("fromUserId",USER_SAFE_DATA);

    res.json({
        message:"Data Fetched Successfully",
        data:connectionRequests
    })

    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})




module.exports=router;