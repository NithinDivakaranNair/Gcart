const mongoose = require("mongoose")

//Define schema
const WishlistSchema = new mongoose.Schema({
    UserId: String,
    ProdectId: String,
    CategoryId: String,
    Image: Array,
    CategoryName: String,
    Price: Number,
    OfferPrice:Number,
    Description: String,
    Model: String,
    Brand: String,



});
const WishlistCollection = mongoose.model("Wishlist", WishlistSchema);

module.exports = WishlistCollection;