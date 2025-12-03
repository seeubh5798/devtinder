const mongoose = require("mongoose");


const connectDb = async ()=>{
    const res = await mongoose.connect(process.env.MONGODB_URL);
    // console.log(res);
    return res;

}


module.exports = {connectDb}
