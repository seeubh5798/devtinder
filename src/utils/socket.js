// initialize socket

const { Server } = require("socket.io");
const { Chat } = require("./../models/chat");


function initializeSocket(httpServer){
    const io = new Server(httpServer, { 
        cors: "*"
    });

    io.on("connection", (socket)=>{

        // event handlers

        socket.on("joinchat", ({name, userId, targetUserId})=>{
            
            // const roomId = "uniqueid";
            const roomId = [userId,targetUserId].sort().join("_");
            // console.log(name + "joined room-" + roomId);
            socket.join(roomId)
        });

        socket.on("sendmessage", async ({name,userId,targetUserId,text})=>{
            const roomId = [userId,targetUserId].sort().join("_");
            // console.log(name+ " has sent msg: "+text +" to roomid: "+roomId);

            // save msg to database
            try{
                // 2 cases - 1. it's the first chat message 2. already existing chat

                let chat = await Chat.findOne({
                    participants : {
                        $all : [userId, targetUserId]
                    }
                });

                if(!chat){
                    chat = new Chat({
                        participants : [userId, targetUserId],
                        message : []
                    });
                }

                chat.message.push({
                    senderId : userId,
                    text : text
                });
                const res = await chat.save();
                // console.log("message saved response", res);
            }
            catch(e){
                console.log(e)
            }

            io.to(roomId).emit("msgreceived", { name,text,userId })

        });
        socket.on("starttyping", ({user})=>{
            const roomId = [userId,targetUserId].sort().join("_");
            io.to(roomId).emit("")
        });

        socket.on("disconnect", (data)=>{

        });
    })
}


module.exports = initializeSocket;