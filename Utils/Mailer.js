const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
 host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "6142ad02e92125",
    pass: "4a2e0b925c0104",
  }
});

const sendOtpEmail = async (email, otp, name) => {
  try {
    await transporter.sendMail({       
      from: "sandbox.smtp.mailtrap.io",          
      to: email,                       
      subject: "Your OTP for Signup Verification",
      html: `
        <h3>Hello ${name}</h3>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP will expire in 5 minutes.</p>
      `
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendOtpEmail;
