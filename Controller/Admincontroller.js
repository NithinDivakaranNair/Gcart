const Admincollection = require("../Model/AdminSchema")
const signupcollection = require("../Model/UserSchema")


const Prodectcollection = require("../Model/ProdectSchema")
const Categorycollection = require("../Model/CategorySchema")


const Ordercollection = require("../Model/OrderSchema")


//AddCategory rout
const addcategorys = (req, res) => {
  return res.render("Admin/AddCategory")
}



//Categorydata add to mongodb
const categorydata = async (req, res) => {
  try {
    // Destructure request body
    const { Category, Description } = req.body;

    // Check if the category already exists in the database
    const categoryVal = await Categorycollection.findOne({ Category: Category });
    console.log(categoryVal)
    if (categoryVal) {
      // Handle the case where the category already exists (you may want to redirect or send an error response)
      return res.render("Admin/AddCategory", { msg: "Category already added" });
    }

    // Assuming req.file.filename contains the image filename
    const Image = req.file.filename; // category image path assigned to 'Image' variable

    // Create a new category document
    const newCategory = new Categorycollection({
      Category,
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
    const { Category, Brand, Model, Description, Quantity, Price } = req.body; // req.body data destructured process
    // const Image = req.file.filename; // multered image stored path assign 'Image' variable
    const Image = req.files.map((file) => file.filename);
    console.log('Image:', Image)
    const newProdects = new Prodectcollection({
      Category,
      Brand,
      Model,
      Image,
      Description,
      Quantity,
      Price,
    });
    console.log('newProdects:', newProdects)
    await newProdects.save(); // Store the product details in the product database
    return res.redirect("/prodectdetails");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error during product data insertion");
  }
};




//Display prodectdetails
const prodectdetails = async (req, res) => {
  try {
    const prodectinfo = await Prodectcollection.find({}); // All prodect deatails are stored in 'prodectinfo'
    return res.render("Admin/AdminProdectManage", { iteam: prodectinfo });  //Then data render prodectlisting page
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
    return res.redirect('/prodectdetails')
  } catch (error) {
    return res.status(500).send('internal server error')
  }
}


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
  const ProdectId = req.params.prodectId;
  console.log("updated data:", ProdectId)
  console.log("body:", req.body)
  const { Category, Brand, Model, Description, Quantity, Price } = req.body;
  const Image = req.files.map((file) => file.filename);
  console.log(Category, Brand, Model, Image, Description, Quantity, Price)
  try {
    const updateddata = await Prodectcollection.findByIdAndUpdate(ProdectId, { Category, Brand, Model, Image, Description, Quantity, Price }, { new: true })
    if (!updateddata) {
      return res.status(404).send("user not found")
    }
    return res.redirect("/prodectdetails")
  }
  catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal server Error");

  }
}


//AdminUserpage
const AdminUserpage = async (req, res) => {
  const userdetails = await signupcollection.find({})
  return res.render("Admin/UserMangement", { userdetails })
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
    req.session.userblock=true;
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
    req.session.userblock=false;
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
  const orderdetails = await Ordercollection.find({});

  return res.render("Admin/OrderManagement", { orderdetails })
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


  OrderManagPage
}