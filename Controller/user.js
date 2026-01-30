const express = require("express");
const User = require("../Model/BlogUser");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const JWT_SECRET = "MySecretKey";
const jwt = require("jsonwebtoken");
const { authentication } = require("../Middleware/middleware");

const {sendEmailPassword} = require("../Utils/Mailer");

const sendOtpEmail = require("../Utils/Mailer");

const route = express.Router();


/////            LOGIN API         /////////
 async function handleUserLogin (req, res) {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    const  dbUser = await User.matchedPassword(email, password);

    if (!dbUser) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const payload = {
      _id: dbUser._id,
      name: dbUser.name,
      email: dbUser.email,
      mobileNo: dbUser.mobileNo,
    };

    const token = jwt.sign(payload, JWT_SECRET);

    return res.status(200).json({
      success: true,
      token: token,
      message: "Authorized User",
      User: {
        name: dbUser.name,
        email: dbUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/////            SIGNUP API         /////////

async function handleUserSignUp (req, res){
  try {
    const { name, email, mobileNo, dob, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    console.log(req.body);

    if (!name || !email || !mobileNo || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const FindUser = await User.findOne({ email });
    if (FindUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      mobileNo,
      dob,
      password,
      passwordResetToken: undefined,   
      passwordTokenExpiry: undefined,
    });


    return res.status(201).json({
      success: true,
      User: {
        name: newUser.name,
        email: newUser.email,
        mobileNo: newUser.mobileNo,
        dob: newUser.dob,
        password:newUser.password,
        confirmPassword: confirmPassword,
      },
      message: "User Register Successfully ",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



/////            PROFILE API         /////////

 async function getUserProfile (req, res){
  try {
    const user = await User.findById(req.user._id);

    console.log(user);

    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }

    res.status(200).json({
      success: true,
      User: {
        name: user.name,
        email: user.email,
        mobileNo: user.mobileNo,
        dob: user.dob,
        password:user.password,
        confirmPassword:user.password,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "profile get Server Error" });
  }
};

async function updateUserProfile (req, res) {
  try {
    const { name, email, mobileNo, dob,} = req.body;
    console.log(req.body);


    if (name !== undefined && name.trim() === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    if (mobileNo !== undefined && mobileNo.trim() === "") {
      return res.status(400).json({ message: "Mobile number cannot be empty" });
    }

    if (dob !== undefined && dob.trim() === "") {
      return res.status(400).json({ message: "Date of birth cannot be empty" });
    }


    const updateData = {};
    
    if (name) {
      updateData.name = name;
    }
     if (email) {
      updateData.email = email;
    }
    if (dob) {
      updateData.dob = dob;
    }
    if (mobileNo) {
      updateData.mobileNo = mobileNo;
    }

    // if (password) {
    //   // const hashedPassword = await bcrypt.hash(password, 10);
    //   updateData.password = password;
    // }

    

    const updatedUser = await User.findByIdAndUpdate(req.user._id,  {$set: updateData }, {
      new: true,
      runValidators: true,
    });

    console.log(updatedUser);

    res.json({ message: "Profile updated successfully", User: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "profile update Server error" });
  }
};


async function handleResetPassword(req,res){
try{
  const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
  if (!user) {
      return res.status(400).json({ message: "User not Found" });
  }

  const resetToken=await User.createResetToken()
    
    await user.save({ validateBeforeSave: false });

    const frontendUrl = "http://localhost:4200";  
    const resetUrl = `${frontendUrl}/user/resetPassword/${resetToken}`;
    await sendEmailPassword({
      email: user.email,
      name: user.name,
      resetUrl: resetUrl,
    });

  return res.status(200).json({message:"email is send to reset password",Token:resetToken});


}catch(error){
    console.log(error)
    res.status(500).json({ message: "password reset error" });
  }
     


}


async function ResetPasswordWithId(req,res){

  try{

  const {password,confirmPassword}=req.body;

  const token=req.params.id;
  const user=await User.findOne({passwordResetToken:token,passwordTokenExpiry:{$gt:Date.now()}})
  
  if (!user) {
      return res.status(400).json({ message: "User not Found" });
  }

  if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    //const hashedPassword = await bcrypt.hash(password, 10);

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordTokenExpiry = undefined;

   await user.save({ validateBeforeSave: false });

    return res.status(200).json({message:"password is reset"});
  
  }catch(error){

    console.log(error)
    res.status(500).json({ message: "password reset error" });
  }
}

module.exports = {handleUserLogin,handleUserSignUp,updateUserProfile,getUserProfile,
  ResetPasswordWithId,handleResetPassword};
