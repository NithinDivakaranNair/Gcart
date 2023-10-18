require('dotenv').config()

const Categorycollection = require("../Model/CategorySchema")
const CartCollection = require("../Model/CartSchema")// cart schema require
const AddressCollection = require("../Model/AddressSchema")
const Ordercollection = require("../Model/OrderSchema")
const nodemailer = require("nodemailer");    //Email sending module
const Razorpay = require('razorpay')
var instance = new Razorpay({
    key_id: 'rzp_test_GCcWdKrz1uFYwx',
    key_secret: 'wsM5ZRlx0XLkOtmq3BBMKDqv',
});

//order sucessful page  
const ordersucessful = async (req, res) => {
    console.log('ordersucessful')
    try {
        const Userlogin = true;
        const userdetail = req.session.userId;
        // const Username = userdetail.username;
        const Username = userdetail.username ? userdetail.username : " ";
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


///order cancel for userside
const ordercanel = async (req, res) => {
    // const Orderid = req.params.orderId;
    // console.log("Orderid;", Orderid)
    // try {
    //     const orderdetails = await Ordercollection.findById(Orderid)
    //     console.log(orderdetails.orderstatus)
    //     if (orderdetails.orderstatus == "Orderpending") {

    //         await Ordercollection.deleteMany({ _id: Orderid });
    //     }
    //     res.redirect("back")
    // } catch (error) {
    //     console.log("Error due to ordercancel time:", error);
    //     res.status(500).send("Error due to ordercancel time");
    // }
    const orderid = req.body.ORDERid
    console.log("orderid:", orderid)
    try {
        const orderid = req.body.ORDERid
        const Orderstatus = await Ordercollection.findById(orderid)
        if ((Orderstatus.orderstatus == "OrderPending") || (Orderstatus.orderstatus == "OrderShipped")) {
            const updateorderstatusinfo = await Ordercollection.updateOne({ _id: orderid }, { $set: { orderactionuser: false } })
            return res.redirect("back")
            //    return res.json("done")
        }
        return res.redirect("back")
    } catch (error) {
        console.log("Error due to ordercanel time:", error);
        res.status(500).send("Error  due to ordercanel time");
    }
}



//each order details
const EachOrderdetailpage = async (req, res) => {
    console.log('ordersucessful')
    try {
        const orderid = req.params.orderid;
        const Userlogin = true;

        const userdetail = req.session.userId;

        const Username = userdetail.username;
        console.log('Username:', Username)

        const categoryinfo = await Categorycollection.find({});
        const selectedorderdetails = await Ordercollection.findById(orderid)
        return res.render("User/EachOrderdetailPage", { categoryinfo, Userlogin, Username, selectedorderdetails })
    } catch (error) {
        console.log("Error due to sucessful page rendering error:", error)
        res.status(500).send("Error due to sucessful page rendering error");
    }
}


//pay
const paypost = (req, res) => {
    console.log(req.body.totalAmount);
    instance.orders.create({
        amount: req.body.totalAmount,
        currency: "INR",
        receipt: "receipt#1",
        notes: {
            key1: "value3",
            key2: "value2"
        }
    }).then((data) => {

        return res.json({ data })
    })
}






module.exports = {
    ordersucessful,
    ordersuccessfulPOST,
    ordercanel,
    EachOrderdetailpage,
    paypost,

}

