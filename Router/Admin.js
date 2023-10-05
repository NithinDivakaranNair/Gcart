const express=require("express")
const router=express.Router()
const admincontroller=require("../Controller/Admincontroller")

router.get("/adminlogin",admincontroller.adminlogin)
router.get("/adminhome",admincontroller.adminhome)
router.get("/adminlogout",admincontroller.adminlogout)
router.post("/adminlogin",admincontroller.adminloginpost)


router.get("/prodectdetails",admincontroller.prodectdetails)
router.get("/addprodects",admincontroller.addprodects)
router.get("/categorydetails",admincontroller.categorydetails)
router.get("/addcategorys",admincontroller.addcategorys)
router.post("/addprodects",admincontroller.prodectdata)
router.post("/addcategorys",admincontroller.categorydata)
router.get("/prodectsearch",admincontroller.prodectsearch)
router.get("/categorysearch",admincontroller.categorysearch)
router.post("/deletecategory/:categoryId",admincontroller.deletecategory)
router.post("/deleteprodect/:prodectId",admincontroller.deleteprodect)


module.exports=router