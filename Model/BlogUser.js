const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const BlogUserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  mobileNo: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  dob: {
    type: Date,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  passwordResetToken: {
    type: String,
  },
  passwordTokenExpiry: {
    type: Date,
  },
});

// BlogUserSchema.pre("save", async function () {
// if (!this.isModified("password")) return ;

// const saltRounds = 10;
// this.password = await bcrypt.hash(this.password, saltRounds);

// });

BlogUserSchema.statics.matchedPassword = async function (email, password) {


  const user = await this.findOne({ email });
  if (!user) {
    return null;
  }

  // const isMatch = await bcrypt.compare(password, user.password);
  const isMatch = password === user.password;

  if (!isMatch) {
    return null;
  }
  return user;
};

BlogUserSchema.methods.createResetToken = async function () {

  const resetToken = await crypto.randomBytes(32).toString("hex");
  console.log(resetToken);

  this.passwordResetToken = resetToken;
  this.passwordTokenExpiry = Date.now() + 60 * 60 * 1000; 

  console.log( this.passwordResetToken )

  return resetToken;


};

const BlogUser = mongoose.model("BUser", BlogUserSchema);

module.exports = BlogUser;
