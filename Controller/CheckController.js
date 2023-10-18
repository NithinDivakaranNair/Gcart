require('dotenv').config()

const CartCollection = require("../Model/CartSchema")// cart schema require
const Categorycollection = require("../Model/CategorySchema")
const AddressCollection = require("../Model/AddressSchema")


//checkoutpage
const checkoutpage = async (req, res) => {

    try {
        const userdetail = req.session.userId;
        // const Username = userdetail.username;
        
    const Username = userdetail.username?userdetail.username:" ";
        const Userlogin = true;
        const categoryinfo = await Categorycollection.find({});
        const cartinfo = await CartCollection.find({ UserId: userdetail._id })
        const AllAddress = await AddressCollection.find({ UserId: userdetail._id })
        let totalprice = 0

        cartinfo.forEach((cartiteam) => {
            totalprice += cartiteam.Price * cartiteam.Count
           }) 
        return res.render("User/checkoutpage", { Userlogin, categoryinfo, totalprice, AllAddress, cartinfo, Username })
    } catch (error) {
        console.log('Error due to checkout time', error);
        return res.status(500).send("Error due to checkout time")
    }
} 


module.exports = { checkoutpage }