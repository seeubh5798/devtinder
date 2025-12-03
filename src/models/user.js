// defines user schema using mongoose- schema is basically a spahe giver to the document of a particulr collection

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
        firstName : {
            type : String,
            required : true,
            trim : true

        },
        lastName :  {
            type : String,
            
        },
        email : {
            type : String,
            required : true,
            unique: [true, 'Email already exists']
            
        },
        password : {
            type : String,
            required : true
            
        },
        age :{
            type : Number,
            required : true,
            min : 18

        },
        gender : {
            type : String,
            required : true,
            validate(value){
                if(["male","female"].includes(value)){
                    return true
                }
                 throw new Error("either male or female allowed")
            }
            
        },
        photourl :{
            type : String,
            default :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrUBzC-v66B_YI30OMI1r7paQVsIIDW4exdQ&s"
        },
        bio :{
            type : String,
            default:"Default profile"
        },
        skills :{
            type : [String]
        },

},
{ timestamps: true }
);

userSchema.methods.createJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id : user._id}, process.env.JWT_SECRET);
    return token;
}

const User = mongoose.model("User", userSchema);
// console.log(User)
// model is created using schema, model is basically 


module.exports = {User}