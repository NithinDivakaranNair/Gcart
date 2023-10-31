
const mongoose = require('mongoose')

const ReferralCodeSchema = new mongoose.Schema ({
  
    userId: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        unique: true,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now, // Use Date.now for the current date
    },
    expirationDate: {
        type: Date,
        required: true,
        default: function () {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 30); // 30 days from now
            return currentDate;
        }
    },
    referrerCredit: {
        type: Number,
        default: 100, // Amount credited to the referrer's wallet
    },
    referredUserCredit: {
        type: Number,
        default: 50, // Amount credited to the referred user's wallet
    },
    referredUser: {
        type: String,
       
    },

  });
  

  
const ReferralCodecollection = mongoose.model("ReferralCodedetails", ReferralCodeSchema)

module.exports = ReferralCodecollection;