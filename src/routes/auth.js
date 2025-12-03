const express = require("express");
const { validatesignupdata } = require("../utils/validate");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/signup", async (req,res)=>{

    // validation of data
    // encrypt the password and then store in DB
    // console.log(body);
    try{
        // put valifdate login inside ytry catch to handle errorrs thrown
        validatesignupdata(req);
        const body = req.body;
        const password = body.password;
        body.password = await bcrypt.hash(password, 10);
        const newuser = new User(body);

        const dbres = await newuser.save();
        // console.log(dbres)
        res.json({
            "message" : dbres
        })
    }
    catch(e){
        res.json({"message" : e.message})
    }
    
})

router.post("/login", async (req,res)=>{

    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        
        if(!user){
            throw new Error("invalid credentials");
        }
        else{
            // console.log(user.password, password)
            const isvalidpassword = await bcrypt.compare(password,user.password);
            // console.log(isvalidpassword)
            if(!isvalidpassword){
                throw new Error("invalid credentials");
            }
            else{
                // create a jwt token , add in cookie header and send it to user
                const token = await user.createJWT();
                console.log("token", token);
                res.cookie("token", token,{
                    httpOnly: true,
                    secure: false,        // MUST BE false on localhost
                    sameSite: "lax",      // or "none" ONLY if secure=true
                  })
                res.json({"message" : "logged in", user})
            }
        }
    }
    catch(e){
        res.status(400).json({"message" : e.message})
    }
});

router.get('/logout', (req,res)=>{
    res.cookie("token", null, { expires: new Date(Date.now())});
    res.send("Logout successfull");
})





module.exports = {authRouter : router}