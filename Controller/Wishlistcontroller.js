require('dotenv').config()

const Prodectcollection = require("../Model/ProdectSchema")
const Categorycollection = require("../Model/CategorySchema")
const WishlistCollection = require("../Model/WishlistSchema")


///wishlistdisplaying
const wishlistdisplay = async (req, res) => {
    const userdetails = req.session.userId;
    console.log('userdetails:', userdetails)
    // const id = userdetails._id;
    const Userlogin = true;

    const Username = userdetails.username ? userdetails.username : " ";
    try {
        const categoryinfo = await Categorycollection.find({});
        const wishdata = await WishlistCollection.find({ UserId: userdetails._id })
        return res.render("User/Wishlist", { Userlogin, categoryinfo, Username, wishdata })
    } catch (error) {
        console.log("Error due to wishlist detail displaying time:", error)
        return res.status(500).send("Error due to cart detail displaying time")
    }
}


//wishlist database data add methode
const wishlistpost = async (req, res) => {
    const userdetail = req.session.userId;
    console.log('userdetail:', userdetail)
    const UserId = userdetail._id;
    try {
        const ProdectId = req.params.prodectid;
        const prodectdetails = await Prodectcollection.findOne({ _id: ProdectId })
        const { Category, Price, Brand, Model, Description, Image } = prodectdetails;
        const categoryinfo = await Categorycollection.findOne({ Category: prodectdetails.Category });
        const CategoryId = categoryinfo._id;

        const existingCartItem = await WishlistCollection.findOne({ ProdectId });
        if (existingCartItem) {
            return res.redirect("back")
        }
        const NewWishprodect = new WishlistCollection({
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
        await NewWishprodect.save();
        return res.redirect("back")
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error due to  prodect add in wishlist time");
    }
}



///remove the data in wishlist
const Removewishlist = async (req, res) => {
    const prodectId = req.params.prodectid;
    console.log("ProdectId:", prodectId)  //req.params used to Category Id stored in particulr variable 
    try {
        // find the category with categoryid and delete from database
        const deletewishdata = await WishlistCollection.findOneAndRemove({ ProdectId: prodectId })
        if (!deletewishdata) {
            return res.status(404).send("category not found")
        }
        return res.redirect('back')
    }
    catch (error) {
        return res.status(500).send('internal server error')
    }
}



module.exports = {
    wishlistdisplay,
    wishlistpost,
    Removewishlist
}