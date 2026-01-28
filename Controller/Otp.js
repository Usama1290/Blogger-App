
const User = require("../Model/BlogUser");
const bcrypt = require("bcrypt");

const OTP = require("../Model/OtpVerification");

const sendOtpEmail = require("../Utils/Mailer");





////////////////// OTP verification /////////////////////

async function handleVerifyOtp (req, res){
  try {

    const { userId, otp} = req.body;
    
    console.log(otp)

    const verifyOtp = await OTP.findOne({ userId });
    

     if (!verifyOtp) {
      return res.status(400).json({ message: "OTP not found" });
    }

    const hashedOtp=verifyOtp.otpCode;
    console.log(hashedOtp)

    const newOtp=await bcrypt.compare(otp,hashedOtp)
    console.log(newOtp)
   


    if (Date.now() > verifyOtp.ExpiryDate) {
      return res.status(400).json({ message: "OTP expired" });
    }
    if (!newOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await OTP.deleteOne({ _id: verifyOtp._id });

    return res.status(200).json({
      status:"success",
      message:"otp varified successfully"
    })
  } catch (error) {
    console.log(`error is : ${error}`);
    res.status(500).json({ message: "Server Error" });
  }
};

 async function handleGenerateOtp(req, res){
  try {
    const { name, email, mobileNo, dob, password, confirmPassword } = req.body;

    if (!name || !email || !mobileNo || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      mobileNo,
      dob,
      password: hashedPassword,
    });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    const hashedOtp = await bcrypt.hash(otp, 10);

    await OTP.deleteMany({ userId: newUser._id });

    const otpEntry = await OTP.create({
      userId: newUser._id,
      otpCode: hashedOtp,
      createdAt: new Date(),
      ExpiryDate: new Date(Date.now() + 60 * 60 * 1000),
    });
    console.log("OTP saved:", otpEntry);
    
    await sendOtpEmail(newUser.email, otp, newUser.name);

    return res.status(200).json({
      success: true,
      message: "Signup successful, OTP sent to email",
      userId: newUser._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


async function handleResendOtp(req,res){

  try{

  const {userId}=req.body;
  
  const user = await User.findById(userId);
  if(!user){
    return res.status(404).json({message:"user not found"})
  }

  //otp

  const newOtp=Math.floor(1000+Math.random()*9000).toString();

  const hashedOtp = await bcrypt.hash(newOtp, 10);


  const otpEntry = await OTP.create({
      userId: user._id,
      otpCode: hashedOtp,
      createdAt: new Date(),
      ExpiryDate: new Date(Date.now() + 60 * 60 * 1000),
    });
   
  await sendOtpEmail(user.email, newOtp, user.name);

  return res.status(200).json({
      success: true,
      message: "Otp resend",
      userId: user._id,
    });



  }catch(error){

    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }


}

module.exports={handleGenerateOtp,handleVerifyOtp,handleResendOtp}

