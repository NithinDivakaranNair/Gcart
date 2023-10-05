const mongoose=require('mongoose')

//Define Schema
const CategorySchema=new mongoose.Schema({
     Category:String,
     Image:String,
     Description:String,
    })
    
const categorycollection=mongoose.model("Category",CategorySchema)

module.exports=categorycollection