console.log("dev tinder backend 1")
const express = require('express');

const app = express();

// app.use((req,res)=>{
//     res.send("hello from server")
// })

app.get("/", (req,res)=>{
    res.json({
        "message" : "basic path"
    })
})




app.listen(3000, ()=>{
    console.log("server listening in port 3000");
})