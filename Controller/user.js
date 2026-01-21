const express = require("express");
const User = require("../Model/BlogUser");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const JWT_SECRET = 'MySecretKey';
const jwt = require('jsonwebtoken');



const route = express.Router();


/////            LOGIN API         /////////
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

        _id: dbUser._id,
        name:dbUser.name,
        email:dbUser.email,
        mobileNo:dbUser.mobileNo,

    }

    const token=jwt.sign(payload,JWT_SECRET);


    return res.status(200).json({ success: true, token:token,message: "Authorized User" ,User:{
      name: dbUser.name,
      email: dbUser.email,
    }});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});



/////            SIGNUP API         /////////

route.post("/SignUp", async (req, res) => {

try{
  const { name, email, mobileNo,dob, password,confirmPassword } = req.body;

  if(password!==confirmPassword){

    return res.status(400).json({ message: "Passwords do not match" });
  }
  

  console.log(req.body)

  if (!name || !email || !mobileNo || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }


  const FindUser = await User.findOne({ email });
    if (FindUser) {
      return res.status(409).json({ message: "User already exists" });
    }

  const Salt = 10;
  const hashedPassword = await bcrypt.hash(password, Salt);

  const newUser = await User.create({
    name,
    email,
    mobileNo,
    dob,
    password: hashedPassword,
  });
  

  return res.status(201).json({
    success: true,
    User: {
      name: newUser.name,
      email: newUser.email,
      mobileNo: newUser.mobileNo,
      dob:newUser.dob,
      password: hashedPassword,
    },
    message:"User Register Successfully ",
   
    
  });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

route.post("/Logout",async (req,res)=>{


    res.status(200).json({
    success: true,
    message: "Logged out successfully"
    });


})


/////            PROFILE API         /////////

route.get("/profile",async (req,res)=>{

   try {
      const user = await User.findById(req.params.id)
      if (!user) {
        return res.status(400).json({ message: "Blog not Found" });
      }
  
      res.status(200).json({
        success: true,
        user: user,
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }


})

module.exports = route;


