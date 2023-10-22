const mongoose = require('mongoose')

//Define Schema
const CouponSchema = new mongoose.Schema({
    userid: String,
    CouponCode: String,
    DiscountAmount: Number,
    ExpirationDate: Date,
    Description: String,


})

const Couponcollection = mongoose.model("coupondetails", CouponSchema)

module.exports = Couponcollection;