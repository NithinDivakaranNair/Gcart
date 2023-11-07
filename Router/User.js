const express = require("express")
const router = express.Router()
const usercontroller = require("../Controller/Usercontroller")
const cartcontroller = require("../Controller/Cartcontroller")

const ordercontroller = require("../Controller/Ordercontroller")
const checkoutcontroller = require("../Controller/CheckController")
const wishlistcontroller = require("../Controller/Wishlistcontroller")

const multer = require('multer') //require multer middleware module

const authentication = require("../Middilewares/authentication")



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


router.get('/',(req,res)=>res.redirect('/mainhomepage'))
router.get("/mainhomepage", authentication.LoginAuthentication, usercontroller.mainhomepage)
router.get("/signup", authentication.SignUpAuthentication, usercontroller.signup)
router.post("/signup", usercontroller.signupdata)
router.get("/login", authentication.LoginAuthentication, usercontroller.login)
router.post("/login", usercontroller.loginpost)
router.get("/home", authentication.HomepageAuthentication, usercontroller.home)
router.get("/logout", usercontroller.logout)

router.get("/EmailEnteringPage", authentication.SignUpAuthentication, usercontroller.EmailEnteringPage)
router.post("/EmailPost", usercontroller.EmailPost)
router.get("/otp", authentication.otpAuthentication, usercontroller.otp)
router.post("/OTPPost", usercontroller.OTPPost)
router.get("/Newpassword", authentication.NewpasswordAuthentication, usercontroller.Newpassword)
router.post("/NewpasswordPost", usercontroller.NewpasswordPost)

router.get("/categorybasedrender/:CategoryId",authentication.HomepageAuthentication, authentication.BlockAuthenticationHomepage, usercontroller.categorybasedrender) //category based rendering route

router.get("/oneprodectdetails/:prodectId",authentication.HomepageAuthentication, authentication.BlockAuthenticationHomepage, usercontroller.oneprodectdetails)

router.get("/cartpage/:prodectId", authentication.HomepageAuthentication,authentication.BlockAuthenticationHomepage,  cartcontroller.cartpage)
router.get("/cartpagedetails",authentication.HomepageAuthentication, authentication.BlockAuthenticationHomepage, cartcontroller.cartpagedetails)
router.get("/CartPluseButton/:prodectId/:quantity",authentication.HomepageAuthentication, authentication.BlockAuthenticationHomepage, cartcontroller.CartPluseButton)
router.get("/CartMinusebutton/:prodectId",authentication.HomepageAuthentication, authentication.BlockAuthenticationHomepage, cartcontroller.CartMinusebutton)

router.get("/checkoutpage",authentication.HomepageAuthentication, authentication.BlockAuthenticationHomepage, checkoutcontroller.checkoutpage)
router.get("/IteamRemoveCart/:iteam",authentication.HomepageAuthentication, authentication.BlockAuthenticationHomepage, cartcontroller.IteamRemoveCart)

router.get("/userprofile",authentication.HomepageAuthentication, authentication.BlockAuthenticationHomepage, usercontroller.userprofile)
router.post("/Updateuserdetails/:userid",authentication.HomepageAuthentication, authentication.BlockAuthenticationHomepage, usercontroller.Updateuserdetails)
router.post("/UpdatePassword/:userid",authentication.HomepageAuthentication, authentication.BlockAuthenticationHomepage, usercontroller.UpdatePassword)


router.post("/AddAddress",authentication.HomepageAuthentication, authentication.BlockAuthenticationHomepage, usercontroller.AddAddress)
router.get("/editAddress/:id",authentication.HomepageAuthentication, authentication.BlockAuthenticationHomepage, usercontroller.editAddress)
router.post("/editAddressData/:id", usercontroller.editAddressData)
router.get("/deleteaddress/:id", usercontroller.deleteaddress)



router.get("/ordersucessful",authentication.HomepageAuthentication, ordercontroller.ordersucessful)
router.post("/ordersuccessfulPOST", authentication.BlockAuthenticationHomepage, ordercontroller.ordersuccessfulPOST)
router.post("/ordercanel", ordercontroller.ordercanel)
router.get("/EachOrderdetailpage/:orderid",authentication.HomepageAuthentication, authentication.BlockAuthenticationHomepage, ordercontroller.EachOrderdetailpage)

router.post("/paypost", ordercontroller.paypost)

router.get("/wishlistpost/:prodectid",authentication.HomepageAuthentication, wishlistcontroller.wishlistpost)
router.get("/wishlistdisplay",authentication.HomepageAuthentication, authentication.BlockAuthenticationHomepage, wishlistcontroller.wishlistdisplay)

router.get("/Removewishlist/:prodectid", wishlistcontroller.Removewishlist)

router.get("/prodectsearch", usercontroller.prodectsearch)

router.post("/filter", usercontroller.filter)

router.post("/addcouponcart", cartcontroller.addcouponcart)

router.get("/invoice", ordercontroller.invoice)

// router.get("/errorpage", usercontroller.errorpage)

module.exports = router






/////////////////////old
// {
// const express = require("express")
// const router = express.Router()
// const usercontroller = require("../Controller/Usercontroller")
// const multer = require('multer') //require multer middleware module

// const bodyParser = require('body-parser');

// const app = express();
// app.use(bodyParser.json());

// // multer middleware
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'Public/uploads/'); // Specify the destination folder
//   },
//   filename: (req, file, cb) => {
//     // Generate a unique file name (you can use Date.now() or any other method)
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + '-' + file.originalname); //file path
//     // cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
//   },
// });
// const upload = multer({ storage: storage }); // stored image detail



// router.get("/mainhomepage", usercontroller.mainhomepage)
// router.get("/signup", usercontroller.signup)
// router.post("/signup", usercontroller.signupdata)
// router.get("/login", usercontroller.login)
// router.post("/login", usercontroller.loginpost)
// router.get("/home", usercontroller.home)
// router.get("/logout", usercontroller.logout)

// router.get("/EmailEnteringPage", usercontroller.EmailEnteringPage)
// router.post("/EmailPost", usercontroller.EmailPost)
// router.get("/otp", usercontroller.otp)
// router.post("/OTPPost", usercontroller.OTPPost)
// router.get("/Newpassword", usercontroller.Newpassword)
// router.post("/NewpasswordPost", usercontroller.NewpasswordPost)

// router.get("/categorybasedrender/:CategoryId", usercontroller.categorybasedrender) //category based rendering route

// router.get("/oneprodectdetails/:prodectId", usercontroller.oneprodectdetails)

// router.get("/cartpage/:prodectId", usercontroller.cartpage)
// router.get("/cartpagedetails", usercontroller.cartpagedetails)
// router.get("/CartPluseButton/:prodectId", usercontroller.CartPluseButton)
// router.get("/CartMinusebutton/:prodectId", usercontroller.CartMinusebutton)

// router.get("/checkoutpage", usercontroller.checkoutpage)
// router.get("/IteamRemoveCart/:iteam", usercontroller.IteamRemoveCart)

// router.get("/userprofile", usercontroller.userprofile)

// router.post("/AddAddress", usercontroller.AddAddress)

// router.get("/ordersucessful", usercontroller.ordersucessful)

// router.post("/ordersuccessfulPOST", usercontroller.ordersuccessfulPOST)

// module.exports = router

// }