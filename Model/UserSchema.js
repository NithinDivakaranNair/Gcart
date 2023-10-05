const mongoose = require("mongoose");

//Define schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  OTP:String
  
});


const UserCollection = mongoose.model("User", userSchema);

module.exports = UserCollection;
