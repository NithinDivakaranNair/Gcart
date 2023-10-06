const mongoose = require("mongoose");

//Define schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  OTP:String,
  verify:{type:Boolean,default:true},
  
});


const UserCollection = mongoose.model("User", userSchema);

module.exports = UserCollection;
