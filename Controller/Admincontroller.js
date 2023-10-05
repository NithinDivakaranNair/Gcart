const Admincollection=require("../Model/AdminSchema")


const Prodectcollection=require("../Model/ProdectSchema")
const Categorycollection=require("../Model/CategorySchema")


//AddCategory rout
     const addcategorys=(req,res)=>{
     return res.render("Admin/AddCategory")
    }

//Categorydata add to mongodb
       const categorydata=async(req,res)=>{
       try{
        const{Category,Image,Description}=req.body;
        const newCategory=new Categorycollection({
            Category,
            Image,
            Description
        })
        await newCategory.save(); // New category save in Category databasw
        return res.redirect("/categorydetails");

    }catch(error){
        return res.status(500).send("Error during category data insertion ")
    }
}


//Display categorydetails
      const categorydetails = async (req, res)=> {
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
  
      
      res.render("Admin/Admincategorymanag", { iteam:CatDetails }); // Render the search results to a view
    } 
    catch (error) {
      
      console.error(error);
      res.status(500).send("Data searching error"); // Handle errors
    }
  };

 
  //DELECT CATEGORY ITEAM
     const deletecategory=async (req,res)=>{
      console.log("deletecategory");
   
        const categoryId=req.params.categoryId;  //req.params used to Category Id stored in particulr variable 
        try{
    // find the category with categoryid and delete from database
      const deleteCategory=await Categorycollection.findByIdAndRemove(categoryId)
      if(!deleteCategory){
        return res.status(404).send("category not found")
      }
      res.redirect('/categorydetails')
     }
     catch(error){
      return res.status(500).send('internal server error')
    }
     }


  //CATEGEORY RENDER ADD PRODECT PAGE  AND DISPLAYING ADDPRODECT PAGE
    const addprodects=async(req,res)=>{
      try{
    const Cdetails= await Categorycollection.find(); //All category stored in  'Cdetails' variable
    console.log(Cdetails)
     return res.render("Admin/Addprodects",{Cdetails}) //then render the add prodect page

    }catch(error){
    return res.status(500).send('internal server error')
  }
  
}








//Prodectdata add to mongodb
const prodectdata =  async (req, res) => {
  try {
    console.log(req.body);
    const { Category, Brand, Model, Description, Quantity, Price } = req.body; // req.body data destructured process
    const Image = req.file.filename; // multered image stored path assign 'Image' variable

    const newProdects = new Prodectcollection({
      Category,
      Brand,
      Model,
      Image,  
      Description,
      Quantity,
      Price,
    });

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
  
     res.render("Admin/AdminProdectManage", { iteam:ProDetails });    // Render the search results in Prodect list
    } catch (error) {
       console.error(error);
      res.status(500).send("Data searching error");
    }
  };


  //DELETE PRODECT ITEAMS
  const deleteprodect=async (req,res)=>{
    console.log("deleteprodect");
   
        const prodectId=req.params.prodectId; // deleting prodect id stored in 'ProdectId' variable
        try{
    const DeleteProdect=await Prodectcollection.findByIdAndRemove(prodectId) // find the prodect with prodectid and delete from database
      if(!DeleteProdect){
        return res.status(404).send("prodect not found")
      }
      res.redirect('/prodectdetails')
  }catch(error){
    return res.status(500).send('internal server error')
  }
  }

  
///////---------Admin side details----------//////

  //Adminlogin 
const adminlogin=(req,res)=>{
    if(req.session.AdminId){
        return res.redirect("/adminhome")
    }else if(req.session.adminname){
        return res.render("Admin/Adminlogin",{msg:"Invalid AdminName"})
    }else if(req.session.adminpassword){
        return res.render("Admin/Adminlogin",{msg:"Invalide Password"})
    }else{
    console.log("adminlogin");
    res.render("Admin/Adminlogin")
    }
}


//AdminHomepage
  const adminhome=async (req,res)=>{
   if(req.session.AdminId){
        console.log("adminhome");
        return res.render("Admin/Adminhomepage")
    }else{
return res.redirect("/adminlogin")
    }
 }

//Adminlogout
const adminlogout=(req,res)=>{
    console.log("adminlogout");
    req.session.destroy();
    res.redirect("/adminlogin")
}

//Admin post
 const adminloginpost=async(req,res)=>{
    try{
        const{Ausername,Apassword}=req.body;
        const adminname=await Admincollection.findOne({username:Ausername})
        const adminpass=await Admincollection.findOne({password:Apassword})

        // console.log(admin)

        if(!adminname){
            // return res.render("Admin/Adminlogin",{msg:"Invalid username"})
            req.session.adminname=true;
            return res.redirect("/adminlogin")
        }

        if(!adminpass){
            // return res.render("Admin/Adminlogin",{msg:"invalide password"})
            
            req.session.adminpassword=true;
            return res.redirect("/adminlogin")
        }
        req.session.AdminId=adminname

    }
    catch(error){
        console.error("error during login:",error)
        return res.status(500).send("Error during login")
    }
    return res.redirect("/adminhome")
}








 
module.exports={
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
    deletecategory


}