const express = require("express");
const {handleUserSignUp,handleUserLogin,getUserProfile,updateUserProfile}=require("../Controller/user");
const { authentication } = require("../Middleware/middleware");



const router=express.Router();

/////////////////// user signup login //////////////////////

router.post("/SignUp",handleUserSignUp);
router.post("/LogIn",handleUserLogin);


/////////////////////  user profile  ///////////////////

router.get("/profile",authentication,getUserProfile);
router.put("/profile",authentication,updateUserProfile);



module.exports=router