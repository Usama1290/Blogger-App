const mongoose = require("mongoose");

const BlogUserSchema = new mongoose.Schema(
  {
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
    dob:{
        type:Date,
        require:true,

    },
    password: {
      type: String,
      require: true,
    },
   
  },
  
);

const BlogUser = mongoose.model("BUser", BlogUserSchema);

module.exports = BlogUser;
