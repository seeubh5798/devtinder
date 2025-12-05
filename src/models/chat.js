const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    text :{
        type : String,
        required : true
    }

}, {timestamps: true});

// const Msgmodel = mongoose.model('Msg', messageSchema);

const chatSchema = new mongoose.Schema({

    participants :[{
        type : mongoose.Schema.Types.ObjectId , 
        required : true, 
        ref : 'User'
    }],
    message : [messageSchema]
}, {timestamps: true});


const Chat = mongoose.model("Chat", chatSchema);

module.exports = {Chat}

