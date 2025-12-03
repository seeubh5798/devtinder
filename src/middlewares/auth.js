// const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");


const authUser = async (req,res,next)=>{

    
   try{ 
    const {token} = req.cookies;
    if(!token){
        throw new Error("unauthorised access, please log innnnn");
    }
    const userId = await jwt.verify(token,process.env.JWT_SECRET);

    if(!userId){
        throw new Error("user not defined");
    }
    else{
        const user = await User.findById(userId._id);

        req.user = user;
        next();
    }}
    catch(e){
        res.json({"error" : e.message})
    }



}


module.exports = {authUser}