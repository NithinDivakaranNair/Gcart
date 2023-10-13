const mongoose = require("mongoose")

//Define schema
const AddressSchema = new mongoose.Schema({
   UserId: String,
   Name: String,
   MobileNumber: Number,
   Address: String,
   Landmark: String,
   AternateNumber: Number,
   City: String,
   Pincode: Number,
});

const AddressCollection = mongoose.model("Address", AddressSchema);

module.exports = AddressCollection;