const mongoose=require('mongoose')

//Define Schema
const OrderSchema=new mongoose.Schema({
    date:Number,
    customerId:String,
    username:String,
    address:String,
    iteams:String,
    totalAmount:Number

    })
    
const Ordercollection=mongoose.model("orderdetails",OrderSchema)

module.exports=Ordercollection