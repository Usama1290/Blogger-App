const express = require("express");
const User = require("../Model/BlogUser");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const JWT_SECRET = 'MySecretKey';
const jwt = require('jsonwebtoken');



const route = express.Router();

// route.get("/SignIn", (req, res) => {

//     res.render("SignIn")
// })
// route.get("/SignUp", (req, res) => {

//     res.render("SignUp")
// })

route.post("/LogIn", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    const dbUser = await User.findOne({ email });
    if (!dbUser) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const hashedPassword = dbUser.password;
    const checkPassword = await bcrypt.compare(password, hashedPassword);

    if (!checkPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const payload={

        name:dbUser.name,
        email:dbUser.email,
        mobileNo:dbUser.mobileNo,

    }

    const token=jwt.sign(payload,JWT_SECRET);

    res.cookie("token",token,{

    maxAge:360000,
    httpOnly:true,
    secure:false,

   })

    return res.status(200).json({ success: true, message: "Authorized User" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});





route.post("/SignUp", async (req, res) => {

try{
  const { name, email, mobileNo, password } = req.body;


  if (!name || !email || !mobileNo || !password) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }


  const FindUser = await User.findOne({ email });
    if (FindUser) {
      return res.status(409).json({ error: "User already exists" });
    }

  const Salt = await crypto.randomBytes(10).toString("hex");
  const hashedPassword = await bcrypt.hash(password, Salt);

  const newUser = await User.create({
    name,
    email,
    mobileNo,
    password: hashedPassword,
  });
  

  return res.status(201).json({
    data: {
      name: newUser.name,
      email: newUser.email,
      mobileNo: newUser.mobileNo,
      password: hashedPassword,
    },
  });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

route.post("/LogOut",async (req,res)=>{

    res.clearCookie("token",{    
       httpOnly: true,
       secure: false,
    })

    res.status(200).json({
    success: true,
    message: "Logged out successfully"
    });


})

module.exports = route;


