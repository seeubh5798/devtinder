const express = require("express");
const { User } = require("../models/user");
const { authUser } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");

const router = express.Router();



router.get("/feed", authUser ,async (req,res)=>{
    // user should see all cards except
    // 1. his/her own card, 2. accepted cards 3. already interested/ignored cards

    try{
        const loggedIn = req.user;
        const pageNum = req.query.page;
        const limit = req.query.limit;
        const skip = (pageNum-1)*limit;
        const connectionstouser = await ConnectionRequest.find({
            $or : [ {fromUserId : loggedIn._id}, {toUserId : loggedIn._id}]
        }).select("fromUserId toUserId");
        // console.log(connectionstouser);
        const set = new Set();
        connectionstouser.forEach((connection)=>{
            set.add(connection.fromUserId.toString());
            set.add(connection.toUserId.toString());
        });

        const feedList = await User.find({
            $and : [
                {_id : {$nin : Array.from(set)}},
                {_id : {$ne : loggedIn._id}}
            ]
        }).skip(skip).limit(limit);
        res.json(feedList)

    }
    catch(e){
        res.status(404).json({"error" : e.message})
    }


    
})

router.get("/requests", authUser, async (req,res)=>{

    try{
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId", ["firstName", "lastName", "gender", "bio", "gender"]);

        if(!connections){
            res.status(400).send("no connections found")
        }
        res.status(200).json({
            "message" : "List on requests send to you",
            connections
        })

    }
    catch(e){
        res.status(404).json({"error" : e.message})
    }
})

router.get("/connections", authUser, async (req,res)=>{

    try{
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or : [
                {toUserId : loggedInUser._id, status : "accepted"},
                {fromUserId : loggedInUser._id, status : "accepted"}
            ]
        }).populate("fromUserId", ["firstName", "lastName", "gender"]).populate("toUserId", ["firstName", "lastName", "gender"]);
        
        const resData = connections.map((row)=>{

            if(row.fromUserId._id.equals(loggedInUser._id)){
                return row.toUserId;
            }
            return row.fromUserId;
        })
        if(!connections){
            res.status(400).send("no connections found")
        }
        res.status(200).json({
            "message" : "List on requests accepted by you",
            resData
        })

    }
    catch(e){
        res.status(404).json({"error" : e.message})
    }
})

router.get("/sent", authUser, async (req,res)=>{

    const loggedInUser = req.user;
    try{
        const sentData = await ConnectionRequest.find({
            $and : [
                {fromUserId : loggedInUser._id},
                {status : "interested"}
            ]
            
        }).populate("toUserId", ["firstName", "lastName", "gender", "bio"])
        console.log(sentData)
        if(!sentData){
            res.status(200).json({"message" : "No sent user found"});
        }
        res.status(200).json({
            "data" : sentData
        })
    }
    catch(e){
        res.status(404).json({"error" : e.message})
    }

});

router.post("/withdraw/:reqId", authUser,  async (req, res)=>{

    try{
        // const loggedInUser = req.user;
        const reqId = req.params.reqId;
        // console.log("logged user", loggedInUser._id)
        // console.log("reqId", reqId)
        const dbres = await ConnectionRequest.findByIdAndDelete({ _id : reqId
        });

        // console.log(dbres);
        res.status(200).json({
            "message" : "removed successfully"
        })
    }
    catch(e){
        res.status(404).json({"error" : e.message})
    }
})



module.exports = { userRouter : router};