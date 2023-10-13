const mongoose=require('mongoose')

//Define Schema
const OrderSchema=new mongoose.Schema({
    date: {
          type: Date,
           default: Date.now
            },
    customerId:String,
    CustomerName:String,
    address:Object,
    iteams:Array,
    totalAmount:Number,
    paymentmode:String,
    })


    // const { Schema } = mongoose;

//Define Schema
// const OrderSchema = new mongoose.Schema({
//     date: {
//         type: Date,
//         default: Date.now
//     },
//     customerId: String,
//     CustomerName: String,
//     address: {
//         type: Schema.Types.ObjectId,
//         ref: 'Address',
//         required: true

//     },
//     iteams: Array,
//     totalAmount: Number,
//     status: String

// })
    
const Ordercollection=mongoose.model("orderdetails",OrderSchema)

module.exports=Ordercollection