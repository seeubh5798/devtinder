const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema({
    fromUserId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    status :{
        type : String,
        required : true,
        enum : {
            values :["ignored", "accepted","rejected", "interested"],
            message : "incorrect enum type"
        }
    }
},
{timestamps : true}
)

connectionRequestSchema.index({fromUserId:1, toUserId: 1})
connectionRequestSchema.pre("save", function(){
    const user = this;
    if(user.fromUserId.equals(user.toUserId)){
        throw new Error(" you cannot send connection request to yourself ");
    }
    // next();
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = {ConnectionRequest}