
const dotenv=require("dotenv").config();

const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const userRoutes=require("./Router/User");
const cookieParser = require('cookie-parser');
const BlogRoutes=require("./Router/Blog");
const OtpRoutes=require("./Router/Otp");

const cors=require("cors");




//database connection

mongoose.connect("mongodb://127.0.0.1:27017/blogify")
.then(()=>console.log("database Connected"))
.catch(err=>console.log("connection error"))

const app =express();




app.use(cors())
//app.use(cors({  origin: 'http://localhost:4200', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  allowedHeaders: ['Content-Type', 'Authorization'],  credentials: true}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use((req, res, next) => {
  req.url = req.url.trim(); 
  next()
});
//app.use(cookieParser());
app.use('/BlogImages', express.static(path.join(__dirname, 'BlogImages')));


app.use("/user",userRoutes)
app.use("/blog",BlogRoutes)
//app.use("/otp",OtpRoutes)


app.listen(8000,()=>{
    console.log("Server running on port 8000")
})