require('dotenv').config()

const Prodectcollection = require("../Model/ProdectSchema")
const Categorycollection = require("../Model/CategorySchema")
const CartCollection = require("../Model/CartSchema")// cart schema require
const WishlistCollection = require("../Model/WishlistSchema")

//cartpagepageGET methode
const cartpagedetails = async (req, res) => {
    const userdetails = req.session.userId;
    // const id = userdetails._id;
    const Userlogin = true;

    const Username = userdetails.username ? userdetails.username : " ";
    try {
        const categoryinfo = await Categorycollection.find({});
        const cartinfo = await CartCollection.find({ UserId: userdetails._id })

        let totalprice = 0
        cartinfo.forEach((cartiteam) => {
            totalprice += cartiteam.Price * cartiteam.Count;
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

        const userdetails = req.session.userId
        const UserId = userdetails._id;

        const categoryinfo = await Categorycollection.findOne({ Category: prodectdetails.Category });
        const CategoryId = categoryinfo._id;
        const { Category, Price, Brand, Model, Description, Image } = prodectdetails;

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
    try {
        const existingCartItem = await CartCollection.findOne({ ProdectId });
        if (existingCartItem) {

            existingCartItem.Count += 1; // You can adjust this as needed

            await existingCartItem.save();
            return res.redirect("back")
        }
    } catch (error) {
        console.log("Error due to  + button click time");
        return res.status(500).send("Error due to  + button click time");
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
            return res.redirect("back")
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


module.exports = {

    cartpage,
    cartpagedetails,
    CartPluseButton,
    CartMinusebutton,
    IteamRemoveCart,

}