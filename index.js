const express=require("express")
const mongoose=require("mongoose")
const path=require("path")
const userRoutes=require("./Controller/user")
const cookieParser = require('cookie-parser');



//database connection

mongoose.connect("mongodb://127.0.0.1:27017/blogify")
.then(()=>console.log("database Connected"))
.catch(err=>console.log("connection error"))

const app =express();



app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser())


app.use("/user",userRoutes)

app.listen(8000,()=>{
    console.log("Server running on port 8000")
})