const mongoose = require("mongoose");


const connectDb = async ()=>{
    const res = await mongoose.connect("mongodb+srv://Shubham:Sunidhi1998@devtinder.d9abdum.mongodb.net/DevTinder");
    // console.log(res);
    return res;

}


module.exports = {connectDb}
