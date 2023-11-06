const mongoose = require('mongoose')


//Define Schema
const OrderSchema = new mongoose.Schema({
    customerId: String,
    CustomerName: String,
    date: {
        type: String, // Store the date as a string
        default: () => {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1 and format to 2 digits
            const day = String(currentDate.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    },
    address: Object,
    iteams: Array,
    totalAmount: Number,
    paymentmode: String,
    Coupon: String,
    orderstatus: { type: String, default: "OrderPending" },
    orderactionuser: { type: Boolean, default: true },
    createddate:{
        type: Date, // Store the date as a string
        default: Date.now
    }
})


const Ordercollection = mongoose.model("orderdetails", OrderSchema)

module.exports = Ordercollection