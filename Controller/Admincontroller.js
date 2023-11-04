
const moment=require('moment')

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
    let newImages=[]
    if (req.files && req.files.length > 0) {
     newImages = req.files.map((file) => file.filename);
    }

    // Update the product with the changed fields
    const updatedProduct = await Prodectcollection.updateOne(
      { _id: productId },
      {
        $set: updatedFields, // Update other fields
        $push: { Image: { $each: newImages } }, // Push new images into the 'Image' array
      }
    );
    console.log(newImages)

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
   
    //Allorderscount for 'OrderPending', 'OrderShipped', 'OrderDelivered'
    const Allorderscount = await Ordercollection.countDocuments({
      orderstatus: { $in: ['OrderPending', 'OrderShipped', 'OrderDelivered'] }
    });
    
    //All cancelled order
    const Allcancelledorderscount = await Ordercollection.countDocuments({
      orderstatus: { $in: ['ordercancelled'] }
    });
    
    //totalsale for  pending , delivery shipping
    const Allorders=await Ordercollection.find({})
    console.log(Allorders)
    const totalsales = Allorders.reduce((total, order) => {
      if (order.orderstatus !== 'ordercancelled') {
        return total + order.totalAmount;
      } else {
        return total; // Exclude orders with 'OrderCancel' status
      }
    }, 0);

    //All orders for allof
    const Allorderstotal = await Ordercollection.countDocuments();

  
  
    //Allusers
    const Allusers = await signupcollection.countDocuments()


    return res.render("Admin/Adminhomepage",{Allorderscount,totalsales,Allusers,Allcancelledorderscount,Allorderstotal})
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


///categorydatachart

// const categorydatachart = async (req, res) => {
//   try {
//     const ALLOrdercollection = await Ordercollection.find({});
//     const ALLcategory = await Categorycollection.find({});
   
//     // Create a map to store category counts
//     const categoryCounts = new Map();

//     // Initialize category counts with 0
//     ALLcategory.forEach(category => {
//       categoryCounts.set(category._id.toString(), 0);
//     });

//     // Iterate through orders to accumulate the item counts in each category
//     ALLOrdercollection.forEach(order => {
//       if (order.orderstatus !== "ordercancelled") {
//         order.iteams.forEach(item => {
//           if (item.CategoryId) {
//             const categoryId = item.CategoryId.toString();
//             const categoryCount = categoryCounts.get(categoryId);
//             const itemCount = item.Count || 0;
//             categoryCounts.set(categoryId, categoryCount + itemCount);
//           }
//         });
//       }
//     });

//     // Prepare the result data
//     const result = Array.from(categoryCounts).map(([categoryId, totalCount]) => {
//       const category = ALLcategory.find(cat => cat._id.toString() === categoryId);
//       return {
//         categoryId,
//         name: category ? category.Category : "Unknown",
//         totalCount,
//       };
//     });
    
//     console.log('Category Counts:', result);
    
//     res.json(result);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'An error occurred while processing your request' });
//   }
// };

const categorydatachart = async (req, res) => {
  try {
    const { timePeriod } = req.query; // Get the time period from the request query
    const ALLOrdercollection = await Ordercollection.find({});
    const ALLcategory = await Categorycollection.find({});
   
    // Create a map to store category counts for the selected time period
    const categoryCounts = new Map();

    // Initialize category counts with 0
    ALLcategory.forEach(category => {
      categoryCounts.set(category._id.toString(), 0);
    });

    // Define the date range based on the selected time period
    const now = new Date();
    const startDate = new Date();

    if (timePeriod === 'daily') {
      // For daily, set the start date to the beginning of the current day
      startDate.setHours(0, 0, 0, 0);
    } else if (timePeriod === 'weekly') {
      // For weekly, set the start date to the beginning of the current week (Sunday)
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else if (timePeriod === 'monthly') {
      // For monthly, set the start date to the beginning of the current month
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    } else if (timePeriod === 'yearly') {
      // For yearly, set the start date to the beginning of the current year
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
    } else {
      // Handle invalid timePeriod values
      throw new Error('Invalid time period');
    }

    // Iterate through orders to accumulate the item counts in each category
    ALLOrdercollection.forEach(order => {
      if (order.orderstatus !== "ordercancelled" && new Date(order.date) >= startDate) {
        order.iteams.forEach(item => {
          if (item.CategoryId) {
            const categoryId = item.CategoryId.toString();
            const categoryCount = categoryCounts.get(categoryId);
            const itemCount = item.Count || 0;
            categoryCounts.set(categoryId, categoryCount + itemCount);
          }
        });
      }
    });

    // Prepare the result data
    const result = Array.from(categoryCounts).map(([categoryId, totalCount]) => {
      const category = ALLcategory.find(cat => cat._id.toString() === categoryId);
      return {
        categoryId,
        name: category ? category.Category : "Unknown",
        totalCount,
      };
    });
    
    console.log('Category Counts:', result);
    
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};



//Paymentdatachart

const paymentdatachart = async (req, res) => {
  try {
    // Assuming you have a mongoose Ordercollection model for fetching data
    const orderdata = await Ordercollection.find({});

    // Initialize an object to store payment mode counts
    const paymentCounts = {};

    // Iterate through the order data and count payment modes
    orderdata.forEach((order) => {
      const paymentMode = order.paymentmode && order.paymentmode.trim(); // Trim whitespace
      if (paymentMode) {
        paymentCounts[paymentMode] = (paymentCounts[paymentMode] || 0) + 1;
      }
    });

    // Log payment mode counts for debugging
    console.log('Payment Mode Counts:', paymentCounts);

    // Return the payment mode counts as JSON response
    res.json(paymentCounts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};


//weekly sales report

const weeklysalesreportdatachart = async (req, res) => {
  try {
    const orders = await Ordercollection.find({});
    const currentDate = new Date();

    // Initialize an array to store weekly sales data
    const weeklySalesData = [];

    // Calculate the start of the current week (Sunday)
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());

    // Calculate the end of the current week (Saturday)
    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    // Calculate the start date for a year ago
    const oneYearAgo = new Date(currentDate);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Loop through each week over the past year
    while (currentDate >= oneYearAgo) {
      const weeklyOrders = orders.filter((order) => {
        const orderDate = new Date(order.date);
        return orderDate >= currentDate && orderDate <= endOfWeek;
      });

      const weeklyTotalSales = weeklyOrders.reduce((total, order) => total + order.totalAmount, 0);

      // Store the weekly sales data
      weeklySalesData.push({
        startDate: new Date(currentDate), // Start of the week
        endDate: new Date(endOfWeek),     // End of the week
        totalSales: weeklyTotalSales,
      });

      // Move to the previous week
      currentDate.setDate(currentDate.getDate() - 7);
      endOfWeek.setDate(endOfWeek.getDate() - 7);
    }

    console.log('Weekly Sales Data:', weeklySalesData);

    // Return the weekly sales report data
    res.json(weeklySalesData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};


//exelsheet
const excel = require('exceljs'); // Import the exceljs library
const stream = require('stream'); // Import the stream module

const excelsheet = async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    console.log();

    // Fetch orders from your database with date filtering
    const query = { date: { $gte: startDate, $lte: endDate } };
    console.log("query:",query)
    const allOrders = await Ordercollection.find(query);
   console.log("allOrdersdate:",allOrders)

    if (!allOrders) {
      return res.status(404).send("No orders found");
    }

    // Create a new Excel workbook and worksheet
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Orders");
console.log("worksheet:",worksheet)
    // Define the columns for your worksheet
    worksheet.columns = [
      { header: "Order ID", key: "id", width: 12 },
      { header: "Customer Name", key: "customerName", width: 20 },
      { header: "Delivery Address", key: "deliveryAddress", width: 30 },
      { header: "Mobile Number", key: "mobileNumber", width: 15 },
      { header: "Alternate Number", key: "alternateNumber", width: 15 },
      { header: "Total Amount", key: "totalAmount", width: 15 },
      { header: "Payment Mode", key: "paymentMode", width: 20 },
      { header: "Order Status", key: "orderStatus", width: 15 },
      { header: "Order Date", key: "orderDate", width: 20 },
      { header: "Item Details", key: "itemDetails", width: 50 }, // Combined item details
      // Add more columns as needed
    ];

    allOrders.forEach((order) => {
      const itemDetails = order.iteams.map((item) => {
        const priceString = item.OfferPrice ? `Offer Price: ${item.OfferPrice}` : `Price: ${item.Price}`;
        return `Model: ${item.Model}, Count: ${item.Count}, ${priceString}`;
      }).join("/");

      worksheet.addRow({
        id: order._id,
        customerName: order.CustomerName,
        deliveryAddress: order.address.Address,
        mobileNumber: order.address.MobileNumber,
        alternateNumber: order.address.AternateNumber,
        totalAmount: order.totalAmount,
        paymentMode: order.paymentmode,
        orderStatus: order.orderstatus,
        orderDate: order.date,
        itemDetails,
      });
    });

    // Create a Stream object
    const streamifier = new stream.PassThrough();

    // Pipe the Excel workbook to the stream
    await workbook.xlsx.write(streamifier);

    // Set response headers for Excel file download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");

    // Pipe the stream to the Express response
    streamifier.pipe(res);
  } catch (error) {
    console.error("Error due to excel:", error);
    res.status(500).send("Error due to excel");
  }
};





// Admin each order detail displaying page

const AdminEachOrderdetailpage=async(req,res)=>{

  const OrderId = req.params.orderId;
  try {
      const data = await Ordercollection.findOne({ _id: OrderId })
  
      return res.render("Admin/AdminEachorderdetails", { data})
  }
  catch (error) {
      console.log("Error due to one prodect detailing time:", error)
      return res.status(500).send("Error fetching product information.");

  }
}


//delete image 
const deleteimage=async (req,res)=>{

try{
  const prodectid=req.query.prodectid;
const imageIndex=req.query.index;

console.log('detals:',prodectid,imageIndex)
const product = await Prodectcollection.findById(prodectid)

if (!product) {
  return res.status(404).send("Product not found.");
}

if (imageIndex < 0 || imageIndex >= product.Image.length) {
  return res.status(400).send("Invalid image index.");
}

product.Image.splice(imageIndex, 1);

await product.save();

res.status(200).send("Image deleted successfully.");
}catch (error) {
  console.log("Error due to image delete time:", error)
  return res.status(500).send("Error due to image delete time.");

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
  updatecategorydata,

  categorydatachart,
  paymentdatachart,
  weeklysalesreportdatachart,
  
  excelsheet,
  AdminEachOrderdetailpage,
  deleteimage
}