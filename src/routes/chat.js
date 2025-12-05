const express = require("express");
const { authUser } = require("../middlewares/auth");
const { Chat } = require("../models/chat");

const router = express.Router();

router.get("/:targetUserId", authUser, async (req,res,next)=>{
        const userId = req.user._id;
        const targetUserId = req.params.targetUserId;
    try{
        let chat = await Chat.findOne({
            participants : {
                $all : [userId, targetUserId]
            }
        }).populate({
            path : "message.senderId",
            select : "firstName lastName"
        });
        if(!chat){
            chat = new Chat({
                participants : [userId, targetUserId],
                message : []
            });
            await chat.save();
        }

        res.json({
            "message" : chat
        })

    }
    catch(e){
        res.json({"error" : e.message})
    }

})









module.exports = { chatRouter : router};