const Admincollection = require("../Model/AdminSchema")
const signupcollection = require("../Model/UserSchema")
const Prodectcollection = require("../Model/ProdectSchema")
const Categorycollection = require("../Model/CategorySchema")
const Ordercollection = require("../Model/OrderSchema")
const Couponcollection = require("../Model/CouponSchema")

//AddCategory rout
const addcategorys = (req, res) => {
  return res.render("Admin/AddCategory")
}



//Categorydata add to mongodb
const categorydata = async (req, res) => {
  try {
    // Destructure request body
    const { Category, Description } = req.body;

    // Normalize the category name by converting it to lowercase and removing spaces
    const normalizedCategory = Category.toLowerCase().replace(/\s+/g, '');

    // Check if the normalized category already exists in the database
    const categoryVal = await Categorycollection.findOne({
      Category: { $regex: new RegExp('^' + normalizedCategory + '$', 'i') },
    });

    if (categoryVal) {
      // Handle the case where the category already exists (you may want to redirect or send an error response)
      return res.render("Admin/AddCategory", { msg: "Category already added" });
    }

    // Assuming req.file.filename contains the image filename
    const Image = req.file.filename; // category image path assigned to 'Image' variable

    // Create a new category document
    const newCategory = new Categorycollection({
      Category: normalizedCategory, // Store the normalized category name
      Image,
      Description,
    });

    // Save the new category to the database
    await newCategory.save();

    // Redirect to a success page or send a success response
    return res.redirect("/categorydetails");
  } catch (error) {
    // Handle errors gracefully by sending an error response and logging the error
    console.error("Error during category data insertion:", error);
    return res.status(500).send("Error during category data insertion");
  }
};









//Display categorydetails
const categorydetails = async (req, res) => {
  try {
    const categoryinfo = await Categorycollection.find({}); //All categorys are  store in "categoryinfo" variable
    return res.render("Admin/Admincategorymanag", { iteam: categoryinfo }); //Thet stored data render through the categery detail page
  }
  catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching category information.");
  }
};


//Category search
const categorysearch = async (req, res) => {
  const { searchQuery } = req.query; // Searhing for paticular category'field'
  console.log(searchQuery);
  try {
    // Check if the searchQuery is empty
    if (!searchQuery) {
      return res.redirect("/categorydetails");
    }


    const CatDetails = await Categorycollection.find({  //Searching allfield   value
      $or: [
        { Category: { $regex: searchQuery, $options: "i" } },
        { Image: { $regex: searchQuery, $options: "i" } },
        { Description: { $regex: searchQuery, $options: "i" } }
      ]
    });


    res.render("Admin/Admincategorymanag", { iteam: CatDetails }); // Render the search results to a view
  }
  catch (error) {

    console.error(error);
    res.status(500).send("Data searching error"); // Handle errors
  }
};


//DELECT CATEGORY ITEAM
const deletecategory = async (req, res) => {
  console.log("deletecategory");

  const categoryId = req.params.categoryId;  //req.params used to Category Id stored in particulr variable 
  try {
    // find the category with categoryid and delete from database
    const deleteCategory = await Categorycollection.findByIdAndRemove(categoryId)
    if (!deleteCategory) {
      return res.status(404).send("category not found")
    }
    return res.redirect('/categorydetails')
  }
  catch (error) {
    return res.status(500).send('internal server error')
  }
}

//update updatecategorydetails page for admin
const updatecategorydetails = async (req, res) => {
  const catergoryId = req.params.categoryId;
  console.log('catergoryId;', catergoryId)
  try {
    const category = await Categorycollection.findOne({ _id: catergoryId })

    console.log('category:', category)
    if (!category) {
      return res.status(404).send("category not found");
    }
    return res.render("Admin/AdminUpdateCategoryDetails", { category })
  } catch (error) {
    console.error("Error rendering edit category :", error);
    res.status(500).send("Internal server Error");
  }
}



//update updatecategorydata detail data
const updatecategorydata = async (req, res) => {
  const categoryId = req.params.categoryId;
  console.log("updated data:", categoryId);
  console.log("body:", req.body);
  const { Category, Description } = req.body;

  let Image = req.file ? req.file.filename : req.body.Image; // Use the new filename if a file is uploaded, otherwise use the existing value

  console.log("Category:", Category);
  console.log("Image:", Image);
  console.log("Description:", Description);

  try {
    const updatedData = await Categorycollection.findByIdAndUpdate(
      categoryId,
      { Category, Image, Description },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).send("Category not found");
    }

    return res.redirect("/categorydetails");
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).send("Internal server error");
  }
}




//CATEGEORY RENDER ADD PRODECT PAGE  AND DISPLAYING ADDPRODECT PAGE
const addprodects = async (req, res) => {
  try {
    const Cdetails = await Categorycollection.find(); //All category stored in  'Cdetails' variable

    console.log(Cdetails)
    return res.render("Admin/Addprodects", { Cdetails }) //then render the add prodect page

  } catch (error) {
    return res.status(500).send('internal server error')
  }

}




//Prodectdata add to mongodb
const prodectdata = async (req, res) => {
  try {
    console.log(req.body);

    const { Category, Brand, Model, Description, Quantity, Price, OfferPrice, Discount } = req.body; // req.body data destructured process
    const Image = req.files.map((file) => file.filename);
    console.log('Image:', Image);

    // Save the new product
    const newProdects = new Prodectcollection({
      Category,
      Brand,
      Model,
      Image,
      Description,
      Quantity,
      Price,
      OfferPrice,
      Discount
    });

    await newProdects.save(); // Store the product details in the product database

    // Find the largest discount in the category
    const largestDiscountResult = await Prodectcollection.aggregate([
      {
        $match: {
          Category: Category
        }
      },
      {
        $group: {
          _id: null,
          maxDiscount: {
            $max: "$Discount"
          }
        }
      }
    ]);

    if (largestDiscountResult.length > 0) {
      const largestDiscount = largestDiscountResult[0].maxDiscount;
      console.log(`The largest discount in the '${Category}' category is: `, largestDiscount);

      // Update the category with the largest discount
      const catdiscountmax = await Categorycollection.updateOne(
        { Category },
        { $set: { Discount: largestDiscount } }
      );
      console.log('Category updated with the largest discount.');
    } else {
      console.log(`No data found for the largest discount in the '${Category}' category.`);
    }

    const Catdetails = await Categorycollection.find();
    console.log('Catdetails:', Catdetails);

    return res.redirect("/prodectdetails");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error during product data insertion");
  }
};





//Display prodectdetails
const prodectdetails = async (req, res) => {
  try {
    const prodectinfo = await Prodectcollection.find({});
    console.log("prodectinfo:", prodectinfo);
 
    return res.render("Admin/AdminProdectManage", { iteam: prodectinfo });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching product information.");
  }
};



//prodect search
const prodectsearch = async (req, res) => {
  const { searchQuery } = req.query; // searched value store in paticular variable , used for destructure methode
  console.log(searchQuery);
  try {
    // Check if the searchQuery is empty
    if (!searchQuery) {
      return res.redirect("/prodectdetails");
    }

    // Perform a search using MongoDB
    const ProDetails = await Prodectcollection.find({  // serched value is Search all field
      $or: [
        { Category: { $regex: searchQuery, $options: "i" } },
        { Brand: { $regex: searchQuery, $options: "i" } },
        { Model: { $regex: searchQuery, $options: "i" } },
        { Description: { $regex: searchQuery, $options: "i" } },
      ]
    });

    return res.render("Admin/AdminProdectManage", { iteam: ProDetails });    // Render the search results in Prodect list
  } catch (error) {
    console.error(error);
    res.status(500).send("Data searching error");
  }
};


//DELETE PRODECT ITEAMS
const deleteprodect = async (req, res) => {
  console.log("deleteprodect");

  const prodectId = req.params.prodectId; // deleting prodect id stored in 'ProdectId' variable
  try {
    const DeleteProdect = await Prodectcollection.findByIdAndRemove(prodectId) // find the prodect with prodectid and delete from database
    if (!DeleteProdect) {
      return res.status(404).send("prodect not found")
    }
    ///Category updated with the largest discount
    const largestDiscountResult = await Prodectcollection.aggregate([
      {
        $match: {
          Category: Category
        }
      },
      {
        $group: {
          _id: null,
          maxDiscount: {
            $max: "$Discount"
          }
        }
      }
    ]);

    if (largestDiscountResult.length > 0) {
      const largestDiscount = largestDiscountResult[0].maxDiscount;
      console.log(`The largest discount in the '${Category}' category is: `, largestDiscount);

      // Update the category with the largest discount
      const catdiscountmax = await Categorycollection.updateOne(
        { Category },
        { $set: { Discount: largestDiscount } }
      );
      console.log('Category updated with the largest discount.');
    } else {
      console.log(`No data found for the largest discount in the '${Category}' category.`);
    }
    return res.redirect('/prodectdetails')
  } catch (error) {
    return res.status(500).send('internal server error')
  }
}


//update prodect detail page for admin
const updateprodectdetails = async (req, res) => {
  const prodectId = req.params.prodectId;
  console.log('prodectId;', prodectId)
  try {
    const prodect = await Prodectcollection.findOne({ _id: prodectId })
    const Cdetails = await Categorycollection.find(); //All category stored in  'Cdetails' variable

    console.log(Cdetails)

    console.log('prodect:', prodect)
    if (!prodect) {
      return res.status(404).send("prodect not found");
    }
    return res.render("Admin/AdminUpdateProdectDetail", { prodect, Cdetails })
  } catch (error) {
    console.error("Error rendering edit user form:", error);
    res.status(500).send("Internal server Error");
  }
}



//update prodect detail data
const updateprodectdata = async (req, res) => {
  const productId = req.params.prodectId;

  try {
    // Retrieve the existing product data from the database
    const existingProduct = await Prodectcollection.findById(productId);

    if (!existingProduct) {
      return res.status(404).send("Product not found");
    }

    // Extract the fields submitted in the form
    const { Category, Brand, Model, Description, Quantity, Price,OfferPrice,Discount } = req.body;

    // Create an object to store the updated fields
    const updatedFields = {};

    // Compare and update only the changed fields
    if (Category !== existingProduct.Category) {
      updatedFields.Category = Category;
    }
    if (Brand !== existingProduct.Brand) {
      updatedFields.Brand = Brand;
    }
    if (Model !== existingProduct.Model) {
      updatedFields.Model = Model;
    }
    if (Description !== existingProduct.Description) {
      updatedFields.Description = Description;
    }
    if (Quantity !== existingProduct.Quantity) {
      updatedFields.Quantity = Quantity;
    }
    if (Price !== existingProduct.Price) {
      updatedFields.Price = Price;
    }
    if (OfferPrice !== existingProduct.OfferPrice) {
      updatedFields.OfferPrice = OfferPrice;
    }
    if (Discount !== existingProduct.Discount) {
      updatedFields.Discount = Discount;
    }

    // Handle image updates if needed (assuming 'Image' is an array of image filenames)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.filename);
      updatedFields.Image = newImages;
    }

    // Update the product with the changed fields
    const updatedProduct = await Prodectcollection.findByIdAndUpdate(
      productId,
      updatedFields,
      { new: true }
    );

  ///Category updated with the largest discount
  const largestDiscountResult = await Prodectcollection.aggregate([
    {
      $match: {
        Category: Category
      }
    },
    {
      $group: {
        _id: null,
        maxDiscount: {
          $max: "$Discount"
        }
      }
    }
  ]);

  if (largestDiscountResult.length > 0) {
    const largestDiscount = largestDiscountResult[0].maxDiscount;
    console.log(`The largest discount in the '${Category}' category is: `, largestDiscount);

    // Update the category with the largest discount
    const catdiscountmax = await Categorycollection.updateOne(
      { Category },
      { $set: { Discount: largestDiscount } }
    );
    console.log('Category updated with the largest discount.');
  } else {
    console.log(`No data found for the largest discount in the '${Category}' category.`);
  }


    return res.redirect("/prodectdetails");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal server error");
  }
};









///////---------Admin side details----------//////

//Adminlogin 
const adminlogin = (req, res) => {
  if (req.session.AdminId) {
    return res.redirect("/adminhome")
  } else if (req.session.adminname) {
    return res.render("Admin/Adminlogin", { msg: "Invalid AdminName" })
  } else if (req.session.adminpassword) {
    return res.render("Admin/Adminlogin", { msg: "Invalide Password" })
  } else {
    console.log("adminlogin");
    res.render("Admin/Adminlogin")
  }
}


//AdminHomepage
const adminhome = async (req, res) => {
  if (req.session.AdminId) {
    console.log("adminhome");
    return res.render("Admin/Adminhomepage")
  } else {
    return res.redirect("/adminlogin")
  }
}

//Adminlogout
const adminlogout = (req, res) => {
  console.log("adminlogout");
  req.session.destroy();
  return res.redirect("/adminlogin")
}

//Admin post
const adminloginpost = async (req, res) => {
  try {
    const { Ausername, Apassword } = req.body;
    const adminname = await Admincollection.findOne({ username: Ausername })
    const adminpass = await Admincollection.findOne({ password: Apassword })

    // console.log(admin)

    if (!adminname) {
      // return res.render("Admin/Adminlogin",{msg:"Invalid username"})
      req.session.adminname = true;
      return res.redirect("/adminlogin")
    }

    if (!adminpass) {
      // return res.render("Admin/Adminlogin",{msg:"invalide password"})
      req.session.adminpassword = true;
      return res.redirect("/adminlogin")
    }
    req.session.AdminId = adminname
  } catch (error) {
    console.error("error during login:", error)
    return res.status(500).send("Error during login")
  }
  return res.redirect("/adminhome")
}





//AdminUserpage
const AdminUserpage = async (req, res) => {
  try {
    const userdetails = await signupcollection.find({})
    return res.render("Admin/UserMangement", { userdetails })
  } catch (error) {
    console.log("error due to AdminUserpage:", error)
    return res.status(404).send("internal server error due to AdminUserpage")
  }
}



//user block
const userblock = async (req, res) => {
  const userid = req.params.userId
  console.log('userid:', userid)
  try {
    const userdata = await signupcollection.findOne({ _id: userid })
    console.log('userdata:', userdata)
    if (!userdata) {
      return res.status(404).send("user is not found")
    }
    userdata.block = true;

    await userdata.save();
    console.log('userdata:', userdata)
    req.session.userblock = true;
    return res.redirect("/AdminUserpage")
  }
  catch (error) {
    console.log("error due to use blocking time:", error)
    return res.status(404).send("internal server error")
  }
}



//user unblock
const userunblock = async (req, res) => {
  try {
    const userid = req.params.userId;
    const userdata = await signupcollection.findOne({ _id: userid })
    console.log('userdata:', userdata)
    if (!userdata) {
      return res.status(404).send("user is not found")
    }
    userdata.block = false;

    await userdata.save();
    req.session.userblock = false;
    console.log('userdata:', userdata)
    return res.redirect("/AdminUserpage")
  }
  catch (error) {
    console.log("error due to user unblocking time:", error)
    return res.status(404).send("internal error")
  }
}



//admin ordermanagement
const OrderManagPage = async (req, res) => {
  try {
    const orderdetails = await Ordercollection.find({});
    return res.render("Admin/OrderManagement", { orderdetails })
  } catch (error) {
    console.log("error due to ordermangepage:", error)
    return res.status(404).send("internal error due to ordermangepage")
  }
}



//upadate order status
const Updateorderstatus = async (req, res) => {
  const orderStatus = req.body.selectedValue;
  const orderid = req.body.ORDERid;
  console.log('orderStatus:', orderStatus)
  console.log('userid:', req.body.orderid);
  try {
    const updateorderstatusinfo = await Ordercollection.updateOne({ _id: orderid }, { $set: { orderstatus: orderStatus } })
    console.log(updateorderstatusinfo);
    return res.status(200).json("updated")
  } catch (error) {
    console.log("error due to orderstatus update:", error)
    return res.status(404).send("internal error due to orderstatus update")
  }
}


/// coupon management
const CouponManagent = async (req, res) => {
  try {
    const Allcoupons = await Couponcollection.find({})
    return res.render("Admin/CouponManagement", { Allcoupons })
  } catch (error) {
    console.log("error due to coupondisplaying:", error)
    return res.status(404).send("internal error due to coupon displaying")
  }
}


//add new coupon
const Addnewcoupon = async (req, res) => {
  try {

    return res.render("Admin/AddNewCoupon")
  } catch (error) {
    console.log("error due to coupondisplaying:", error)
    return res.status(404).send("internal error due to new coupon displaying")
  }
}



//add new coupon data add
const coupondata = async (req, res) => {
  console.log('req.body:', req.body)
  const { CouponCode, DiscountAmount, ExpirationDate, Description } = req.body;
  try {
    const newcoupon = new Couponcollection({
      CouponCode,
      DiscountAmount,
      ExpirationDate,
      Description,

    });
    console.log('newcoupon:', newcoupon)
    await newcoupon.save(); // Store the product details in the product database
    return res.redirect("/CouponManagent");
  } catch (error) {
    console.log("error due to coupondisplaying:", error)
    return res.status(404).send("internal error due to new coupon data add ")
  }
}



//DELETE Coupon
const deletecoupon = async (req, res) => {
  const couponId = req.params.couponid; // deleting prodect id stored in 'ProdectId' variable
  try {
    const DeleteCoupon = await Couponcollection.findByIdAndRemove(couponId) // find the prodect with prodectid and delete from database
    console.log("DeleteCoupon:", DeleteCoupon)
    if (!DeleteCoupon) {
      return res.status(404).send("prodect not found")
    }
    return res.redirect('/CouponManagent')
  } catch (error) {
    return res.status(500).send('internal server error')
  }
}



//Edit  Coupon admin
const Editcoupon = async (req, res) => {
  const couponId = req.params.couponid;
  console.log("editcouponId:", couponId)
  const { CouponCode, DiscountAmount, ExpirationDate, Description } = req.body;
  try {
    const updatedcoupon = await Couponcollection.findByIdAndUpdate(couponId, { CouponCode, DiscountAmount, ExpirationDate, Description }, { new: true })
    if (!updatedcoupon) {
      return res.status(404).send("coupon not found")
    }
    return res.redirect("/CouponManagent")
  }
  catch (error) {
    console.error("Error coupon updating admin:", error);
    res.status(500).send("Internal server Error");

  }
}


//update prodect detail page for admin
const couponeditpage = async (req, res) => {
  const couponId = req.params.couponid;

  try {
    const coupon = await Couponcollection.findOne({ _id: couponId })
    console.log("page couponId:", coupon)
    if (!coupon) {
      return res.status(404).send("coupon not found");
    }
    return res.render("Admin/AdminEditCoupon", { coupon })
  } catch (error) {
    console.error("Error rendering edit user form:", error);
    res.status(500).send("Internal server Error");
  }
}







module.exports = {
  adminlogin,
  adminhome,
  adminlogout,
  adminloginpost,

  prodectdetails,
  addprodects,
  prodectdata,
  prodectsearch,
  deleteprodect,

  categorydetails,
  addcategorys,
  categorydata,
  categorysearch,
  deletecategory,

  updateprodectdetails,
  updateprodectdata,

  AdminUserpage,
  userblock,
  userunblock,


  OrderManagPage,
  Updateorderstatus,

  CouponManagent,
  Addnewcoupon,
  coupondata,
  deletecoupon,
  Editcoupon,
  couponeditpage,

  updatecategorydetails,
  updatecategorydata

}