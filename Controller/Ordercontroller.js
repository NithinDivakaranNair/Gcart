

require('dotenv').config()

const Categorycollection = require("../Model/CategorySchema")

const CartCollection = require("../Model/CartSchema")// cart schema require

const AddressCollection = require("../Model/AddressSchema")
const Ordercollection = require("../Model/OrderSchema")
const nodemailer = require("nodemailer");    //Email sending module


//order sucessful page
const ordersucessful = async (req, res) => {
    console.log('ordersucessful')
    try {
        const Userlogin = true;
        const userdetail = req.session.userId;
       const  Username = userdetail.username;

        const categoryinfo = await Categorycollection.find({});
        return res.render("User/ORDERSUCESSFUL", { categoryinfo, Userlogin, Username })
    } catch (error) {
        console.log("Error due to sucessful page rendering error:", error)
        res.status(500).send("Error due to sucessful page rendering error");
    }
}


//order sucessfulpage post methode
const ordersuccessfulPOST = async (req, res) => {
    console.log("datas:", req.body)

    const addressId = req.body.address;
    const address = await AddressCollection.findById(addressId)

    const userdetails = req.session.userId;
    const customerId = userdetails._id;
    const CustomerName = userdetails.username;
    const paymentmode = req.body.paymentMethod;
    const totalAmount = req.body.totalAmount;

    try {
        const cartinf = await CartCollection.find({ UserId: customerId })
        // Save the order with the total amount to your database using the Order model
        const newOrder = new Ordercollection({
            customerId,
            CustomerName,
            totalAmount: totalAmount,
            address,
            iteams: cartinf,
            paymentmode
        });
        await newOrder.save();

        res.redirect("/ordersucessful");
        await CartCollection.deleteMany({ UserId: customerId });
    } catch (error) {
        console.log("Error due to successful page rendering error:", error);
        res.status(500).send("Error due to successful page rendering error");
    }
};

module.exports = {
    ordersucessful,
    ordersuccessfulPOST,
}

