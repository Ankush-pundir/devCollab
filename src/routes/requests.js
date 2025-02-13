const express=require("express");
const requestRouter=express.Router();
const User = require("../models/user")
const { userAuth }=require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res)=>{
   try{ const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        
        const allowedStatus=["interested","ignored"];
        if(!allowedStatus.includes(status)){
           return res.status(400).json({
                message:"invalid status type "+status,
            })
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId,toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ]
        });
        if(existingConnectionRequest){
            return res.status(400).json(
                {
                    message: "Connection request already exist"
                }
            )
        }

        const toUser= await User.findById(toUserId);
        if(!toUser){
          return  res.status(400).json({
                message:"user not found"
            })
        }
        const connectionRequest= new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        
        const data=await connectionRequest.save();
        res.json({
            message:"Connection Request Send Successfully",
            data
        })
}catch(err){
    res.status(400).send("ERROR: "+err.message);
    }
})
 
 
    requestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{
    try{
        const loggedInUser=req.user;
        const{status,requestId}=req.params;

        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"status not allowed"})
        }

        const connectionRequest=await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser,
            status:"interested"
        })
        if(!connectionRequest){
            return res.status(404).json({
                message:"connection req not found"
            })
        }
        connectionRequest.status=status;

        const data = await connectionRequest.save();


        res.json({
            message:"Connection Request Send Successfully",
            data
        })


    }catch(err){
        res.status(400).send("ERROR: "+err.message);
        }
    })

module.exports=requestRouter;