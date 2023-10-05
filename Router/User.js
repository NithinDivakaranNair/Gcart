const express=require("express")
const router=express.Router()
const usercontroller=require("../Controller/Usercontroller")

router.get("/mainhomepage",usercontroller.mainhomepage)
router.get("/signup",usercontroller.signup)
router.post("/signup",usercontroller.signupdata)
router.get("/login",usercontroller.login)
router.post("/login",usercontroller.loginpost)
router.get("/home",usercontroller.home)
router.get("/logout",usercontroller.logout)

router.get("/EmailEnteringPage",usercontroller.EmailEnteringPage)
router.post("/EmailPost",usercontroller.EmailPost)
router.get("/otp",usercontroller.otp)
router.post("/OTPPost",usercontroller.OTPPost)
router.get("/Newpassword",usercontroller.Newpassword)
router.post("/NewpasswordPost",usercontroller.NewpasswordPost)

router.get("/smartphonespage",usercontroller.smartphonespage)

module.exports = router 