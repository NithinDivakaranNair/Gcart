const mongoose = require('mongoose')

//Define Schema
const WalletSchema = new mongoose.Schema({
    customerid: String,
    Amount: { type: Number, default: 0 },

})

const Walletcollection = mongoose.model("Walletdetails", WalletSchema)

module.exports = Walletcollection