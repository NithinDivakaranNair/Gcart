const mongoose = require('mongoose')

//Define Schema
const ProdectSchema = new mongoose.Schema({
    Category: String,
    Brand: String,
    Model: String,
    Image: Array,
    Description: String,
    Quantity: Number,
    Price: Number,
    OfferPrice: Number,
    Discount: Number,
    createddate:{
        type: Date, // Store the date as a string
        default: Date.now
    }
})

const prodectcollection = mongoose.model("Prodects", ProdectSchema)

module.exports = prodectcollection