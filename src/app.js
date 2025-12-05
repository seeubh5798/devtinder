console.log("dev tinder backend 1")
require("dotenv").config();
const express = require('express');
const  {connectDb} = require("./config/database");
const {User} = require("./models/user");
const cookieParser = require("cookie-parser");
const { authRouter } = require('./routes/auth');
const { profileRouter } = require('./routes/profile');
const { userRouter } = require('./routes/user');
const {requestRouter} = require("./routes/request");
const cors = require('cors');
// require("./utils/cronJob");
const { createServer } = require("http");
const initializeSocket = require("./utils/socket");
const { chatRouter } = require("./routes/chat");


const app = express();
const httpServer = createServer(app);
initializeSocket(httpServer)
// app.use((req,res)=>{
//     res.send("hello from server")
// })
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }))
app.use(express.json())
app.use(cookieParser());


app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/user", userRouter);
app.use("/request", requestRouter );
app.use("/chat", chatRouter );


connectDb().then((res)=>{
    console.group("DB connected");
    // app.listen(3000, ()=>{
    //     console.log("server listening in port 3000");
    
    // })
    httpServer.listen(3000, ()=>{
        console.log("server listening in port 3000");
    
    })
    
}).catch(e=> console.log(e))


