require('dotenv').config()
const Walletcollection = require("../Model/WalletSchema")
const Categorycollection = require("../Model/CategorySchema")
const CartCollection = require("../Model/CartSchema")// cart schema require
const AddressCollection = require("../Model/AddressSchema")
const Ordercollection = require("../Model/OrderSchema")
const CouponCollection = require("../Model/CouponSchema")
const Prodectcollection = require("../Model/ProdectSchema")
const nodemailer = require("nodemailer");    //Email sending module
const pdfService = require('../service/pdf-service');

const { KEY_ID, KEY_SECRET } = process.env
const Razorpay = require('razorpay')//Razorpay
var instance = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
});

//order sucessful page  
const ordersucessful = async (req, res) => {

    try {
        const Userlogin = true;
        const userdetail = req.session.userId;
        const Userid = userdetail._id;

        // Find the latest order for the user and decrease the  prodect quandity
        const latestOrder = await Ordercollection.findOne({ customerId: Userid }).sort({ date: -1 });

        if (latestOrder) {
            latestOrder.iteams.forEach(async (item) => {
                const productId = item.ProdectId;
                const productCount = item.Count;

                // Use await inside this loop to ensure each product is updated before moving to the next one.
                await Prodectcollection.findByIdAndUpdate(
                    { _id: productId },
                    { $inc: { Quantity: -productCount } }
                );
            });
        } else {
            console.log('No orders found for the user.');
        }

        const Username = userdetail.username ? userdetail.username : " ";
        const categoryinfo = await Categorycollection.find({});
        return res.render("User/ORDERSUCESSFUL", { categoryinfo, Userlogin, Username });
    } catch (error) {
        console.log("Error due to successful page rendering error:", error);
        res.status(500).send("Error due to successful page rendering error");
    }
};



//order sucessfulpage post methode
// const ordersuccessfulPOST = async (req, res) => {

//     console.log("datas:", req.body)

//     const addressId = req.body.address;
//     const address = await AddressCollection.findById(addressId)
//     const userdetails = req.session.userId;
//     const customerId = userdetails._id;
//     const CustomerName = userdetails.username;
//     const paymentmode = req.body.paymentMethod;
//     const totalAmount = req.body.totalAmount;

//     try {
//         const cartinf = await CartCollection.find({ UserId: customerId })
//         // Save the order with the total amount to your database using the Order model
//         const newOrder = new Ordercollection({
//             customerId,
//             CustomerName,
//             totalAmount: totalAmount,
//             address,
//             iteams: cartinf,
//             paymentmode
//         });
//         await newOrder.save();

//         res.redirect("/ordersucessful");
//         await CartCollection.deleteMany({ UserId: customerId });
//     } catch (error) {
//         console.log("Error due to successful page rendering error:", error);
//         res.status(500).send("Error due to successful page rendering error");
//     }
// };


//order sucessfulpage post methode
const ordersuccessfulPOST = async (req, res) => {
    const userdetail = req.session.userId;
    const Userid = userdetail._id;
    const coupon = req.session.coupon;
    const updatecoupon = await CouponCollection.updateOne({ CouponCode: coupon }, { $set: { userid: Userid } })
    if (req.body.razorpay_payment_id) {
        const payorderid = req.body.razorpay_payment_id
        var instance = new Razorpay({ key_id: 'rzp_test_GCcWdKrz1uFYwx', key_secret: 'wsM5ZRlx0XLkOtmq3BBMKDqv' })

        instance.payments.fetch(payorderid).then(async (data) => {
            const addressId = data.notes.address;
            const address = await AddressCollection.findById(addressId)
            const userdetails = req.session.userId;
            const customerId = userdetails._id;
            const CustomerName = userdetails.username;
            const paymentmode = data.notes.paymethode;
            const totalAmount = data.notes.totalamount;

            try {
                const cartinf = await CartCollection.find({ UserId: customerId })
                // Save the order with the total amount to your database using the Order model
                const newOrder = new Ordercollection({
                    customerId,
                    CustomerName,
                    totalAmount: totalAmount,
                    address,
                    iteams: cartinf,
                    paymentmode,
                    Coupon: coupon
                });
                await newOrder.save();
                req.session.order = newOrder;
                res.redirect("/ordersucessful");
                await CartCollection.deleteMany({ UserId: customerId });
            } catch (error) {
                console.log("Error due to successful page rendering error:", error);
                res.status(500).send("Error due to successful page rendering error");
            }
        })
    } else if (req.body.paymentMethod == "Cash on Delivery") {

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
                paymentmode,
                Coupon: coupon
            });

            await newOrder.save();
            req.session.order = newOrder;
            res.redirect("/ordersucessful");
            await CartCollection.deleteMany({ UserId: customerId });
        } catch (error) {
            console.log("Error due to successful page rendering error:", error);
            res.status(500).send("Error due to successful page rendering error");
        }
    } else if (req.body.paymentMethod == "Wallet") {
        const addressId = req.body.address;
        const address = await AddressCollection.findById(addressId)
        const userdetails = req.session.userId;
        const customerId = userdetails._id;
        const CustomerName = userdetails.username;
        const paymentmode = req.body.paymentMethod;
        const totalAmount = req.body.totalAmount;

        try {
            const cartinf = await CartCollection.find({ UserId: customerId })
            const walletinfo = await Walletcollection.find({ customerid: customerId })

            if (walletinfo[0].Amount < Number(totalAmount)) {
                return res.redirect("back");
            }
            const balancewallet = walletinfo[0].Amount - Number(totalAmount);
            console.log("typeofwallet:", typeof (balancewallet))
            console.log("typeoftotal:", typeof (Number(totalAmount)))
            console.log("typeof:", typeof (walletinfo[0].Amount))
            const updatedwalletamount = await Walletcollection.updateOne({ customerid: customerId }, { $set: { Amount: balancewallet } })
            // Save the order with the total amount to your database using the Order model
            const newOrder = new Ordercollection({
                customerId,
                CustomerName,
                totalAmount: totalAmount,
                address,
                iteams: cartinf,
                paymentmode,
                Coupon: coupon
            });
            await newOrder.save();
            req.session.order = newOrder;
            res.redirect("/ordersucessful");
            await CartCollection.deleteMany({ UserId: customerId });
        } catch (error) {
            console.log("Error due to successful page rendering error:", error);
            res.status(500).send("Error due to successful page rendering error");
        }



    }

}


///order cancel for userside
// const ordercanel = async (req, res) => {
//     // const Orderid = req.params.orderId;
//     // console.log("Orderid;", Orderid)
//     // try {
//     //     const orderdetails = await Ordercollection.findById(Orderid)
//     //     console.log(orderdetails.orderstatus)
//     //     if (orderdetails.orderstatus == "Orderpending") {

//     //         await Ordercollection.deleteMany({ _id: Orderid });
//     //     }
//     //     res.redirect("back")
//     // } catch (error) {
//     //     console.log("Error due to ordercancel time:", error);
//     //     res.status(500).send("Error due to ordercancel time");
//     // }
//     const orderid = req.body.ORDERid
//     console.log("orderid:", orderid)
//     try {
//         const orderid = req.body.ORDERid
//         const Orderstatus = await Ordercollection.findById(orderid)
//         if ((Orderstatus.orderstatus == "OrderPending") || (Orderstatus.orderstatus == "OrderShipped")) {
//             const updateorderstatusinfo = await Ordercollection.updateOne({ _id: orderid }, { $set: { orderactionuser: false } })
//             return res.redirect("back")

//         }
//         return res.redirect("back")
//     } catch (error) {
//         console.log("Error due to ordercanel time:", error);
//         res.status(500).send("Error  due to ordercanel time");
//     }
// }


///order cancel for userside
const ordercanel = async (req, res) => {

    const orderid = req.body.ORDERid
    try {
        const Orderdetails = await Ordercollection.findById(orderid)
        const orderamount = Orderdetails.totalAmount;

        if ((Orderdetails.orderstatus == "OrderPending") || (Orderdetails.orderstatus == "OrderShipped")) {

            const updateorderstatusinfo = await Ordercollection.updateOne({ _id: orderid }, { $set: { orderactionuser: false, orderstatus: "ordercancelled" } })

            //wallet amount update
            const Walletdetails = await Walletcollection.findOne({ customerid: Orderdetails.customerId })

            const walletamount = Walletdetails.Amount;


            const totalamount = walletamount + orderamount;
            const updatedwalletamount = await Walletcollection.updateOne({ customerid: Orderdetails.customerId }, { $set: { Amount: totalamount } })

            return res.status(200).json({ "status": "ordercancelled" })


        } else if (Orderdetails.orderstatus == "OrderDelivered") {
            const updateorderstatusinfo = await Ordercollection.updateOne({ _id: orderid }, { $set: { orderactionuser: false, orderstatus: "Order is returned" } })

            //wallet amount update
            const Walletdetails = await Walletcollection.findOne({ customerid: Orderdetails.customerId })
            const walletamount = Walletdetails.Amount;

            const totalamount = walletamount + orderamount;
            const updatedwalletamount = await Walletcollection.updateOne({ customerid: Orderdetails.customerId }, { $set: { Amount: totalamount } })

            return res.status(200).json({ "status": "Order is returned" })
        } else {
            return res.status(404).json("error")
        }

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

    instance.orders.create({
        amount: req.body.totalAmount,
        currency: "INR",
        receipt: "receipt#1",
        notes: {
            key1: "value3",
            key2: "value2"
        }
    }).then((data) => {

        return res.json(data)
    })
}

//invoice
const invoice = async (req, res, next) => {
    try {
        const userdetail = req.session.userId;
        const Userid = userdetail._id;
        const orderdata = req.session.order;
        const latestOrder = await Ordercollection.findById(orderdata._id);

        const orderdetail = {
            orderid: latestOrder._id,
            username: latestOrder.CustomerName,
            Mobilenumber: latestOrder.MobileNumber,
            adress: latestOrder.address,
            landmark: latestOrder.Landmark,
            city: latestOrder.City,
            pincode: latestOrder.Pincode,
            alliteams: latestOrder.iteams,
            alltotal: latestOrder.totalAmount,
            paymentmode: latestOrder.paymentmode,
            ordereddate: latestOrder.date,
            orderid: latestOrder._id
        }
        const stream = res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment;filename=invoice.pdf',
        });

        pdfService.buildPDF(
            (chunk) => stream.write(chunk),
            () => stream.end(), orderdetail
        );
    } catch (error) {
        console.log("Error due to invoce:", error)
        res.status(500).send("Error due to invoce");
    }

}



module.exports = {
    ordersucessful,
    ordersuccessfulPOST,
    ordercanel,
    EachOrderdetailpage,
    paypost,
    invoice

}

