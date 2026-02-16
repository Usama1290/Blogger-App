const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
 host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
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
        <p>This OTP will expire in 1 hour.</p>
      `
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendEmailPassword = async ({ email, name, resetUrl }) => {
  try {

    await transporter.sendMail({
      from: "sandbox.smtp.mailtrap.io",
      to: email,
      subject: "Reset Your Password",
      html: `
        <h3>Hello ${name},</h3>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>This link will expire in 1 hour minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    console.log("Reset password email sent successfully!");
  } catch (error) {
    console.error("Error sending reset password email:", error);
  }
};


module.exports = {sendOtpEmail,sendEmailPassword};
