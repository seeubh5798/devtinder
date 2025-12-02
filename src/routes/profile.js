const express = require("express");
const { authUser } = require("../middlewares/auth");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();



router.get("/view",authUser ,(req,res)=>{

    res.json({"user" : req.user})
})
function cleanUpdateBody(body) {
    const forbiddenFields = ["email", "_id"]; // email not allowed to change
  
    return Object.fromEntries(
      Object.entries(body).filter(([key, value]) => {
        // Skip forbidden fields
        if (forbiddenFields.includes(key)) return false;
  
        // Ignore undefined or empty string
        if (value === "" || value === undefined) return false;
  
        return true;
      })
    );
  }
  
router.patch('/edit', authUser, async (req,res)=>{
    const {email, ...body} = req.body;

    const user = req.user;
    try{
        let updateData = cleanUpdateBody(body);

        // Hash password if present
        if (updateData.password) {
          updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        const dbres = await User.findByIdAndUpdate(user._id,updateData, {new : true, runValidators:true} );
        res.json({"message" : dbres});
    }
    catch(e){
        res.json({"error" : e.message})
    }
    
})





module.exports = { profileRouter : router}