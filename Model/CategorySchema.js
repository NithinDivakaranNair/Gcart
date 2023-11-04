const mongoose = require('mongoose')

//Define Schema
const CategorySchema = new mongoose.Schema({
   Category: {
      type: String,
      unique: true,
      require: true,
      isLowercase: false
   },
   Image: String,
   Description: String,
   Discount: Number,
})

const categorycollection = mongoose.model("Category", CategorySchema)

module.exports = categorycollection