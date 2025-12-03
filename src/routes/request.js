const express = require("express");
const { authUser } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

const { sendEmail } = require("./../utils/sendEmail")
const router = express.Router();



router.post("/send/:status/:toUserId", authUser, async (req,res)=>{

    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // check for edge cases 1. avoid duplicate request 1. check if touserid exists in our db or not 3. avoid when touserid has request send to fromuserid, 4. avoid when from userid === touserid
        const allowedstatus = ["interested", "ignored"];
        if(!allowedstatus.includes(status)){
            throw new Error("invalid status, try again");
        }

        const toUserExist = await User.findById(toUserId);

        if(!toUserExist){
            throw new Error("User does not exist, check before sending request");
        }

        const interchangeRequest = await ConnectionRequest.findOne({
            $or : [{fromUserId, toUserId}, {fromUserId: toUserId , toUserId : fromUserId}]
        })

        if(interchangeRequest){
            throw new Error("Connection request already exist, check again");
        }
        
        const dbobj = new ConnectionRequest({fromUserId, toUserId, status});

        const data = await dbobj.save();
        const emailres = await sendEmail();
        console.log(emailres)

        res.status(202).json({"message": `${req.user.firstName} ${status} ${toUserExist.firstName}`,
            data});


    }
    catch(e){
        res.status(404).json({"error" : e.message})
    }
});


router.post("/review/:status/:requestId", authUser, async (req,res)=>{

    try{
        const loggedInUser = req.user; 
        const {status, requestId} = req.params;

        const allowedstatus = ["accepted", "rejected"];
        if(!allowedstatus.includes(status)){
            throw new Error("invalid status, try again");
        }

        const dbRes = await ConnectionRequest.findOne({
            _id : requestId,
            status : "interested",
            toUserId : loggedInUser._id
        });

        if(!dbRes){
             throw new Error("connection request not found");
        }
         dbRes.status = status;
         const db= await dbRes.save();
         res.status(200).json({
            "message" : status,
            dbRes
         })
        // shubham => elon musk
        // => loggedIn should be elon musk and only he can accept or reject the request sent to him
        // status should be interested only in db
        // requestId should be valid
    }
    catch(e){
        res.status(404).json({"error" : e.message})
    }
    

});

module.exports = { requestRouter : router};