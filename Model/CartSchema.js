const mongoose = require("mongoose")
//Defin schema
const CartSchema = new mongoose.Schema({
     UserId: String,
     ProdectId: String,
     CategoryId: String,
     Image: Array,
     CategoryName: String,
     Price: Number,
     Description: String,
     Model: String,
     Brand: String,
     Count: {
          type: Number,
          default: 1, // Set the default value to 1
     },
})
const Cartcollection = mongoose.model("Cart", CartSchema)
module.exports = Cartcollection;