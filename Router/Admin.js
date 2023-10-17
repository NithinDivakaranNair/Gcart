const express = require("express")
const router = express.Router()
const admincontroller = require("../Controller/Admincontroller")
const multer = require('multer') //require multer middleware module


// multer middleware
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Public/uploads/'); // Specify the destination folder
  },
  filename: (req, file, cb) => {
    // Generate a unique file name (you can use Date.now() or any other method)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); //file path
    // cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  },
});
const upload = multer({ storage: storage }); // stored image detail


router.get("/adminlogin", admincontroller.adminlogin)
router.get("/adminhome", admincontroller.adminhome)
router.get("/adminlogout", admincontroller.adminlogout)
router.post("/adminlogin", admincontroller.adminloginpost)


router.get("/prodectdetails", admincontroller.prodectdetails)
router.get("/addprodects", admincontroller.addprodects)
router.post("/addprodects", upload.array('Image'), admincontroller.prodectdata)
router.get("/categorydetails", admincontroller.categorydetails)
router.get("/addcategorys", admincontroller.addcategorys)
router.post("/addcategorys", upload.single('cImage'), admincontroller.categorydata)// passing multered category image details
router.get("/prodectsearch", admincontroller.prodectsearch)
router.get("/categorysearch", admincontroller.categorysearch)
router.post("/deletecategory/:categoryId", admincontroller.deletecategory)
router.post("/deleteprodect/:prodectId", admincontroller.deleteprodect)

router.post("/updateprodectdetails/:prodectId", admincontroller.updateprodectdetails)
router.post("/updateprodectdata/:prodectId", upload.array('Image'), admincontroller.updateprodectdata)

router.get("/AdminUserpage", admincontroller.AdminUserpage)
router.post("/AdminUserpage/userblock/:userId", admincontroller.userblock)
router.post("/AdminUserpage/userunblock/:userId", admincontroller.userunblock)


router.get("/OrderManagPage", admincontroller.OrderManagPage)
router.post("/Updateorderstatus", admincontroller.Updateorderstatus)

module.exports = router