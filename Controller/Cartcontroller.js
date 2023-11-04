require('dotenv').config()

const Prodectcollection = require("../Model/ProdectSchema")
const Categorycollection = require("../Model/CategorySchema")
const CartCollection = require("../Model/CartSchema")// cart schema require
const WishlistCollection = require("../Model/WishlistSchema")
const CouponCollection = require("../Model/CouponSchema")

//cartpagepageGET methode
const cartpagedetails = async (req, res) => {
    const userdetails = req.session.userId;
    // const id = userdetails._id;
    const Userlogin = true;

    const Username = userdetails.username ? userdetails.username : " ";
    try {
        const categoryinfo = await Categorycollection.find({});
        const cartinfo = await CartCollection.find({ UserId: userdetails._id })

        let totalprice = 0;
        cartinfo.forEach((cartiteam) => {
            if (cartiteam.OfferPrice) {
                totalprice += cartiteam.OfferPrice * cartiteam.Count;
            } else {
                totalprice += cartiteam.Price * cartiteam.Count;
            }
        })


        return res.render("User/Shoppingcartpage", { Userlogin, categoryinfo, cartinfo, totalprice, Username })
    } catch (error) {
        console.log("Error due to cart detail displaying time:", error)
        return res.status(500).send("Error due to cart detail displaying time")
    }
}


//cartpagepagepost methode
const cartpage = async (req, res) => {

    try { 
        const ProdectId = req.params.prodectId;
        const prodectdetails = await Prodectcollection.findOne({ _id: ProdectId })
        console.log("prodectdetails:", prodectdetails)
        const userdetails = req.session.userId
        const UserId = userdetails._id;

        const categoryinfo = await Categorycollection.findOne({ Category: prodectdetails.Category });
        const CategoryId = categoryinfo._id;
        const { Category, Price, Brand, Model, Description, Image, OfferPrice } = prodectdetails;

        const existingCartItem = await CartCollection.findOne({ ProdectId });
        if (existingCartItem) {

            existingCartItem.Count += 1; // You can adjust this as needed

            await existingCartItem.save();
            const deletewishdata = await WishlistCollection.findOneAndRemove({ ProdectId: ProdectId })
            return res.redirect("back")
        }

        const NewCartProdect = new CartCollection({
            UserId,
            ProdectId,
            CategoryId,
            Category,
            Price,
            Description,
            Model,
            Brand,
            Image,
            OfferPrice
        })

        await NewCartProdect.save();
        const deletewishdata = await WishlistCollection.findOneAndRemove({ ProdectId: ProdectId })


        return res.redirect("back")
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Error due to  prodect add in cart time");
    }
}



// + button working  for  count in cart


const CartPluseButton = async (req, res) => {
    const ProdectId = req.params.prodectId;
    // console.log('product id', ProdectId);
    try {
        const existingCartItem = await CartCollection.findOne({ ProdectId });
        if (existingCartItem) {
            existingCartItem.Count += 1; // You can adjust this as needed
            await existingCartItem.save();
            return res.status(200).json("success");
        }
    } catch (error) {
        console.log("Error due to + button click time");
        return res.status(500).send("Error due to + button click time");
    }
}



// - button working  for  count in cart
const CartMinusebutton = async (req, res) => {
    const ProdectId = req.params.prodectId;
    try {
        const existingCartItem = await CartCollection.findOne({ ProdectId });
        if (existingCartItem) {

            existingCartItem.Count -= 1; // You can adjust this as needed

            await existingCartItem.save();
            return res.status(200).json("success");
        }
    } catch (error) {
        console.log("Error due to  + button click time");
        return res.status(500).send("Error due to  + button click time");
    }
}


//remove  prodect the cart 
const IteamRemoveCart = async (req, res) => {
    const prodectid = req.params.iteam;
    console.log('prodectid:', prodectid)
    try {

        const DeleteCartiteam = await CartCollection.findOneAndRemove({ ProdectId: prodectid })
        return res.redirect("back")

    } catch (error) {
        console.log('Error due to cart iteam delete time', error);
        return res.status(500).send("Error due to cart iteam delete time")
    }
}



//Add coupon and all authentication process
const addcouponcart = async (req, res) => {
    const userdetail = req.session.userId;
    const Userid = userdetail._id;
    try { 
        console.log('coupon controller');
        const addedcoupon = req.body.coupon;


        /// check to coupon  not found
        const couponvalue = await CouponCollection.findOne({ CouponCode: addedcoupon })
        console.log('couponvalue',couponvalue);
        if (!couponvalue) {
            return res.status(400).json("Coupon not found.");
        }
        if ((couponvalue.userid == Userid) || couponvalue.userid) {
            return res.status(403).json("Coupon not found.");   
        }    
        /// check to coupon is expire or not
        const currentDate = new Date();
        const couponExpirationDate = new Date(couponvalue.ExpirationDate);
        if (currentDate > couponExpirationDate) {
            return res.status(404).json("Coupon has expired.");
        }
        req.session.coupon = couponvalue.CouponCode; //this session using for order placing time add to order schema
        const discountamount = couponvalue.DiscountAmount;
        console.log('discountamount',discountamount);
        return res.status(200).json(discountamount)

    } catch (error) {
        console.log('Error due to coupon add to cart', error);
        return res.status(500).json("Error due to coupon add cart")
    }

}



module.exports = {

    cartpage,
    cartpagedetails,
    CartPluseButton,
    CartMinusebutton,
    IteamRemoveCart,
    addcouponcart

}