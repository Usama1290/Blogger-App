const express = require("express");
const User = require("../Model/BlogUser");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const JWT_SECRET = 'MySecretKey';
const jwt = require('jsonwebtoken');
const {authentication}=require("../Middleware/middleware");
const optverification=require("../Model/OtpVerification")

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
      confirmPassword:confirmPassword
    },
    message:"User Register Successfully ",

  });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

/////////////// Logout ///////////////////

route.post("/Logout",async (req,res)=>{

    res.status(200).json({
    success: true,
    message: "Logged out successfully"
    });

})

/////            PROFILE API         /////////

route.get("/profile",authentication,async (req,res)=>{

   try {
      const user = await User.findById(req.user._id)
      console.log(user)
      if (!user) {
        return res.status(400).json({ message: "User not Found" });
      }

      res.status(200).json({
        success: true,
        User: user,
      });
    } catch (error) {
      res.status(500).json({ message: "profile get Server Error" });
    }

})

route.put("/profile", authentication, async (req, res) => {
  try {
    const { name, email, dob, password } = req.body;
    console.log(req.body)

    const updateData={};
    if(name){
      updateData.name=name;

    }
    if(email){
      updateData.email=email

    }
    if(dob){

      updateData.dob=dob

    }


    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }



    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    console.log(updatedUser)

    res.json({ message: "Profile updated successfully", User: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "profile update Server error" });
  }
});

/////////////////// OTP verification /////////////////////

route.put("",(req,res)=>{

  try {

    otp=Math.floor(1000+Math.random()*9000);


    
  } catch (error) {
    
  }


  


})

module.exports = route;

