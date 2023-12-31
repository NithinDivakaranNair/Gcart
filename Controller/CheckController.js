require('dotenv').config()

const CartCollection = require("../Model/CartSchema")// cart schema require
const Categorycollection = require("../Model/CategorySchema")
const AddressCollection = require("../Model/AddressSchema")


//checkoutpage
const checkoutpage = async (req, res) => {

    try {
        const userdetail = req.session.userId;
        const Username = userdetail.username ? userdetail.username : " ";
        const Userlogin = true;
        const categoryinfo = await Categorycollection.find({});
        const cartinfo = await CartCollection.find({ UserId: userdetail._id })

        if (cartinfo.length == 0) {
            return res.redirect('back');

        } else {
            let totalAmount = 0

            cartinfo.forEach((product) => {
                const productCount = product.Count;
                const productPrice = product.OfferPrice !== null ? product.OfferPrice : product.Price;
                const productTotal = productCount * productPrice;
                totalAmount += productTotal;
            });

            let Amount = totalAmount - (totalAmount * 20 / 100);
            if (req.query.totalAmount) {
                Amount = req.query.totalAmount
            }

            const AllAddress = await AddressCollection.find({ UserId: userdetail._id })

            return res.render("User/checkoutpage", { Userlogin, categoryinfo, AllAddress, cartinfo, Username, Amount })
        }
    } catch (error) {
        console.log('Error due to checkout time', error);
        return res.status(500).send("Error due to checkout time")
    }
}



module.exports = {
    checkoutpage,

}