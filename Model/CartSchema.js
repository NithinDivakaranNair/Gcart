const mongoose=require("mongoose")
//Defin schema
const CartSchema=new mongoose.Schema({
     ProdectId:String,
     CategoryId:String,
     Image:Array,
     CategoryName:String,
     Price:Number,
     Description:String,
     Model:String,
     Brand:String
})
const Cartcollection=mongoose.model("Cart",CartSchema)
module.exports=Cartcollection;