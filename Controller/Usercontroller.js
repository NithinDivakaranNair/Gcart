require('dotenv').config()

const signupcollection = require("../Model/UserSchema")
const bcrypt = require("bcrypt")     //Password encrypting module


const Prodectcollection = require("../Model/ProdectSchema")
const Categorycollection = require("../Model/CategorySchema")

const Walletcollection = require("../Model/WalletSchema")
const AddressCollection = require("../Model/AddressSchema")
const Ordercollection = require("../Model/OrderSchema")
const nodemailer = require("nodemailer");    //Email sending module


//login
const login = (req, res) => {
    console.log('loginpage:')
        if (req.session.user) {
            return res.render("User/loginpage", { msg: "Invalid username " })
        } else if (req.session.passwordMatch) {
            return res.render("User/loginpage", { msg: "Invalid password" })
        } else if (req.session.verifyval) {
            return res.render("User/loginpage", { msg: "user is not valid" })
        }else if(req.session.block){
            return res.render("User/loginpage", { msg: "user is blocked" })
        }
       return  res.render("User/loginpage")
}


//login
// const login = (req, res) => {
//     if (req.session.userId) {
//         return res.redirect("/home")
//     } else if (req.session.user) {
//         return res.render("User/loginpage", { msg: "Invalid username " })
//     } else if (req.session.passwordMatch) {
//         return res.render("User/loginpage", { msg: "Invalid password" })
//     } else if (req.session.verifyval) {
//         return res.render("User/loginpage", { msg: "user is not valid" })
//     }
//     else {
//         res.render("User/loginpage")
//     }
// }






let Userlogin;

let Username;

//user homepage
const home = async (req, res) => {
console.log('homepage:')
      try {
           Userlogin =true;
            const userdetail = req.session.userId;
            const  Username = userdetail.username;
            const prodectinfo = await Prodectcollection.find({});  //prodect colleection
          const  categoryinfo = await Categorycollection.find({});  //category collection

///wallet creation
const wallet=await Walletcollection.findOne({customerid:userdetail._id})
if(!wallet){
const newwallet=new Walletcollection({
    customerid:userdetail._id,
   })
console.log("newwallet:",newwallet)
await newwallet.save();
}
            return res.render("User/homepage", { prodectinfo, categoryinfo, Userlogin, Username });  //Updating Prodect and Category collection
        }
        catch (error) {
            console.error(error);
            return res.status(500).send("Error fetching product information.");
        }
    }
   



//user homepage
// const home = async (req, res) => {

//     if (req.session.userId) {
//         try {
//             Userlogin = req.session.userId;;
//             const userdetail = req.session.userId;
//              username = userdetail.username;
//             const prodectinfo = await Prodectcollection.find({});  //prodect colleection
//           const  categoryinfo = await Categorycollection.find({});  //category collection
//             return res.render("User/homepage", { prodectinfo, categoryinfo, Userlogin, username });  //Updating Prodect and Category collection
//         }
//         catch (error) {
//             console.error(error);
//             return res.status(500).send("Error fetching product information.");
//         }
//     }
//     else {
//         return res.redirect("/login")
//     }
// }





//Mainhomepage
const mainhomepage = async (req, res) => {
  
     Userlogin = false;
        try {
            const prodectinfo = await Prodectcollection.find({});  // updateing prodect and category in MainhomePage side
            const categoryinfo = await Categorycollection.find({});

            return res.render("User/Mainhomepage", { prodectinfo, categoryinfo, Userlogin, Username }); // that deatils are render in Mainhome Page
        } catch (error) {
            console.error(error);
            return res.status(500).send("Error fetching product information.");
        }
    }



//Main homepage
// const mainhomepage = async (req, res) => {
//     if (req.session.userId) {
//         return res.redirect("/home")
//     } else {
//         Userlogin = false;
//         try {
//             const prodectinfo = await Prodectcollection.find({});  // updateing prodect and category in MainhomePage side
//             const categoryinfo = await Categorycollection.find({});

//             return res.render("User/Mainhomepage", { prodectinfo, categoryinfo, Userlogin, username }); // that deatils are render in Mainhome Page
//         } catch (error) {
//             console.error(error);
//             return res.status(500).send("Error fetching product information.");
//         }
//     }
// }






//Logout

const logout = (req, res) => {
   Userlogin = false;
    console.log("destroy");
    req.session.destroy();  //Destroying Session
    return res.redirect("/login")
}



//SignUp
const signup = (req, res) => {
   
    if (req.session.pswd) {
        return res.render("User/signuppage", { msg: "Passwords do not match" });
    }
    else if (req.session.checkinguser) {
        return res.render("User/signuppage", { msg: "User with the same email already exists" })

    }
    else if (req.session.userId) {
        return res.redirect("/home")
    }
    else {
        return res.render("User/signuppage");

    }
}




//SignUp
// const signup = (req, res) => {
//     if (req.session.userId) {   //user has existing
//         return res.render("User/homepage")
//     }
//     if (req.session.pswd) {
//         return res.render("User/signuppage", { msg: "Passwords do not match" });
//     }
//     else if (req.session.checkinguser) {
//         return res.render("User/signuppage", { msg: "User with the same email already exists" })

//     }
//     else if (req.session.userId) {
//         return res.redirect("/home")
//     }
//     else {
//         return res.render("User/signuppage");

//     }
// }




//Signup Creation, Create a new user(SignUp Post Methode)

const signupdata = async (req, res) => {
    try {
        console.log(req.body);
        const { username, email, password, confirmpassword } = req.body; //decoding the data in body and destructing
        const checkinguser = await signupcollection.findOne({ email }); //checking email in  current user database

        if (password !== confirmpassword) {//checking two passwords in the body
            console.log("password not match");
            req.session.pswd = true;
            return res.redirect("/signup")
        }
        if (checkinguser) {
            req.session.checkinguser = true;
            return res.redirect("/signup")
        }
        else {

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds); // Password hashing process

            const newUser = new signupcollection({ //Create a new document and save it to the database
                username,
                email,
                password: hashedPassword,
                verify: false
            })

            req.session.Signuserverification = newUser;
            await newUser.save() // Saving in database

        }
    }
    catch (error) {
        return res.status(500).send("error during user registration");
    }
 return res.redirect("/EmailEnteringPage")
}



//Login validation(Login Post methode)
const loginpost = async (req, res) => {
  
    try {
        const { lusername, lpassword, } = req.body; //decoding the data in body and destructing
        const user = await signupcollection.findOne({ username: lusername }) //checking  username in  current user database
        console.log("loginpost:", user._id)
        const userId = user._id;
    
        const VERIFYuser = user.verify;
        req.session.VERIFYuser = user;

        console.log('VERIFYuser:', VERIFYuser)

        if (!user) { // user name validation
            req.session.user = true;
            return res.redirect("/login")
        }
        const passwordMatch = await bcrypt.compare(lpassword, user.password) //compair enter password and data base store current user password

        if (!passwordMatch) {  // Password validation
            req.session.passwordMatch = true;
            return res.redirect("/login")

        }
        if (user.block === true) {
            req.session.block=true;
            return res.redirect("/login")
        }
        if (VERIFYuser === false) {
            req.session.verifyval = true;
            const DeleteProdect = await signupcollection.findByIdAndRemove(userId)
            return res.redirect("/login")

        }
        //create session for  current User //
        req.session.userId = user
        console.log('loginpost:',req.session.userId )
        return res.redirect("/login")
        
    }
    catch (error) {
        console.error("error during login:", error)
        return res.status(500).send("Error during login")
    }

}




//Email entering Page
const EmailEnteringPage = (req, res) => {
   
    return res.render("User/OTPEmailpage", { msg: "Invalid Email Id" })
}




//Email entering Page
// const EmailEnteringPage = (req, res) => {
//     if (!req.session.emailvalue) {
//         return res.render("User/OTPEmailpage")
//     }
//     return res.render("User/OTPEmailpage", { msg: "Invalid Email Id" })
// }


 //Email Post methode
const EmailPost = async (req, res) => {

    const emailId = req.body.Emailid;
    console.log("Emai:", emailId);
    const checkingEmail = await signupcollection.findOne({ email: emailId }); //find email from current  User and Assign the perticular variable
    console.log("checkingEmail:", checkingEmail)

    if (checkingEmail) {//condition OK  
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail", // Use your email service provider (e.g., Gmail, SMTP)
                port: 587,
                host: 'smtp.gmail.com',
                auth: {
                    user: "nithindivakarannair92@gmail.com", // Your email address (use environment variables)
                    pass: process.env.EMAIL_PASS// Your email password (or an App Password) (use environment variables)
                }
            });
            const generateOTP = () => {
                return Math.floor(100000 + Math.random() * 900000).toString();
            }

            const otp = generateOTP();
            console.log('OTP value:', otp);// OTP assign "OTPvalue" variable


            const mailOptions = {
                from: "nithindivakarannair92@gmail.om",
                to: emailId, // Recipient's email address
                subject: "OTP Verification",
                text: `Your OTP for verification is: ${otp}`
            };
            console.log('Email sending structure:', mailOptions)//email sending structure

            // Send the email
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            const update = await signupcollection.updateOne({ email: checkingEmail.email }, { $set: { OTP: otp } })  // Update OTP field in the user collection
        }
        catch (error) {
            console.error("Error in EmailPost:", error);
            res.status(500).json({ message: "Internal server error" });
        }

        req.session.email = checkingEmail.email//Current user emailId  assigning through Session 

        console.log("verify email:", req.session.email);// Redirect to the OTP entering page
        res.redirect('/otp');
    }
    else {
        req.session.emailvalue = true;
        res.redirect('/EmailEnteringPage'); // Email authentication routing process
    }
};



//OTP entering Page
const otp = (req, res) => {
  
        return res.render("User/otppage", { msg: "Invalid OTP" })

}


//OTP entering Page
// const otp = (req, res) => {
//     if (req.session.otpId) {
//         return res.render("User/otppage", { msg: "Invalid OTP" })
//     }
//     return res.render("User/otppage")
// }




//OTP Post methode
const OTPPost = async (req, res) => {
    try {
        const otpValue = req.body.otp;
        const OTPvalue = await signupcollection.findOne({ OTP: otpValue }) //finding OTP  in current User

        if (req.session.Signuserverification) {
            const userval = req.session.Signuserverification;
            console.log('userval:', userval)
            const uservalupdate = await signupcollection.updateOne({ email: userval.email }, { $set: { verify: true } })
            res.redirect("/login")
        }
        else if (OTPvalue) {
            res.redirect('/Newpassword')
        } else {
            req.session.otpId = true;
            res.redirect('/otp')
        }
    }
    catch (error) {
        return res.status(500).send("Error during OTP posting methode")
    }
}




//New password entering Page
const Newpassword = (req, res) => {
 
        return res.render("User/NewPassword", { msg: "Password not Matching" })
  
}


//New password entering Page
// const Newpassword = (req, res) => {
//     if (req.session.passwordvalue) {
//         return res.render("User/NewPassword", { msg: "Password not Matching" })
//     }
//     return res.render("User/NewPassword")
// }





//New password Post methode
const NewpasswordPost = async (req, res) => {
    try {
        const { newpassword, conformpassword } = req.body

        if (newpassword == conformpassword) { // verifing  for newpassword and conform password

            const Email = req.session.email // Current user Email id is stored(Email Posting time) in this session and assign in vaperticular variable("Email"),this methode is using for New password adding for curren User
            console.log('Email Id:', Email)

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newpassword, saltRounds);

            const update = await signupcollection.updateOne({ email: Email }, { $set: { password: hashedPassword } }) //New password added to current User data base
            res.redirect('/login')
        }
        else {
            req.session.passwordvalue = true;
            res.redirect("/Newpassword")
        }
    }
    catch {
        return res.status(500).send("Error due to Newpassword creation.");
    }
}




//category based rendering field
const categorybasedrender = async (req, res) => {
    const Id = req.params.CategoryId;
    const categoryId = await Categorycollection.findOne({ _id: Id })
    try {
        const prodectinfo = await Prodectcollection.find({ Category: categoryId.Category });  //prodect colleection
       const categoryinfo = await Categorycollection.find({});  //category collection
        return res.render("User/CategoryRenderingCommonPage", { categoryinfo, prodectinfo, Userlogin, Username });  //Updating Prodect and Category collection
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error fetching product information.");
    }
}



//one prodect details//
const oneprodectdetails = async (req, res) => {
    const prodectId = req.params.prodectId;
    try {
        const prodectdata = await Prodectcollection.findOne({ _id: prodectId })
      const  categoryinfo = await Categorycollection.find({});  //category collection
        return res.render("User/ProdectDetails", { categoryinfo, prodectdata, Userlogin, Username })
    }
    catch (error) {
        console.log("Error due to one prodect detailing time:", error)
        return res.status(500).send("Error fetching product information.");

    }
}


//Address add to database
const AddAddress = async (req, res) => {
    const addressdetails = req.body
    try {
        console.log("addressdetails:", req.body)
        const { name, mobilenumber, address, landmark, alternatenumber, city, pincode } = addressdetails;
        const userdetails = req.session.userId
        const userId = userdetails._id;
        const newaddressdetails = new AddressCollection({
            UserId: userId,
            Name: name,
            MobileNumber: mobilenumber,
            Address: address,
            Landmark: landmark,
            AternateNumber: alternatenumber,
            City: city,
            PincodeL: pincode
        })
        console.log(newaddressdetails)
        await newaddressdetails.save();
        res.redirect("/checkoutpage")
    }
    catch (error) {
        console.log("Error due to address details add time:", error);
        res.status(500).sned("Error due to address details add time")
    }

}




// profile detail page
const userprofile = async (req, res) => {
   
    try {
        const userdetail = req.session.userId;    
       const userdetails = await signupcollection.findById({ _id: userdetail._id })
        const AllAddress = await AddressCollection.find({ UserId: userdetail._id })
        const Allorders = await Ordercollection.find({ customerId: userdetail._id })
         const  categoryinfo = await Categorycollection.find({});
         const walletdetails=await Walletcollection.find({ customerid: userdetail._id })
       console.log('walletdetails:',walletdetails)
        if(req.session.password){
           return res.render("User/Userfulldetails", { categoryinfo, Userlogin, AllAddress, userdetails, Allorders, Username ,walletdetails,msg: "Old Password not correct"})
        }else if( req.session.repeatpassword){
          return res.render("User/Userfulldetails", { categoryinfo, Userlogin, AllAddress, userdetails, Allorders, Username ,walletdetails, msg: "Password not match"})
        }else if(req.session.NewpasswordUpdated){
        return res.render("User/Userfulldetails", { categoryinfo, Userlogin, AllAddress, userdetails, Allorders, Username ,walletdetails,msg: "New password Updated"})
         }
        return res.render("User/Userfulldetails", { categoryinfo, Userlogin, AllAddress, userdetails, Allorders, Username,walletdetails })
       } catch (error) {
        console.log("Error due to user profile page rendering error:", error)
        res.status(500).send("Error due to profile page rendering error");

    }
}


// Update user details

const Updateuserdetails=async(req,res)=>{
    const userId=req.params.userid
    console.log('userId:',userId)
    const{username,email}=req.body;
    console.log('username,email:',username,email)
    try{
        const updateddata = await signupcollection.findByIdAndUpdate(userId, {username,email}, { new: true })
        if (!updateddata) {
            return res.status(404).send("user not found")
          }
      
          return res.redirect("back")
        }
        catch (error) {
          console.error("Error updating user:", error);
          res.status(500).send("Internal server Error");
      
        }
      }



//update user password Postmethode

const UpdatePassword=async(req,res)=>{  
    const userId=req.params.userid
    console.log('UserId:',userId)
    const{currentpassword,newpassword,repeatedpassword}=req.body;
    console.log('Currentpassword,Newpassword,Nepeatedpassword:',currentpassword,newpassword,repeatedpassword)
    try{
        const user=await signupcollection.findById(userId)
        const PasswordMatch = await bcrypt.compare(currentpassword, user.password)
        if(!PasswordMatch){
          req.session.password=true;
           res.redirect("/userprofile")
        }else if(newpassword!==repeatedpassword){
            req.session.repeatpassword=true;
             res.redirect("/userprofile")
        }else{
             const saltRounds = 10;
              const hashedPassword = await bcrypt.hash(newpassword, saltRounds); // Password hashing process
              const updatepassword = await signupcollection.updateOne({ _id: userId }, { $set: { password: hashedPassword } })
              req.session.NewpasswordUpdated=true;
              req.session.destroy();
              res.redirect("/login")
            }

       }catch (error) {
          console.error("Error updating user Password:", error);
          res.status(500).send("Internal server Error");
      
        }
}


//prodect search in home page
const prodectsearch = async (req, res) => {
const { searchQuery } = req.query; // searched value store in paticular variable , used for destructure methode
    console.log(searchQuery);
    try {
      // Check if the searchQuery is empty
      if (!searchQuery) {
        return res.redirect("back");
      }

            Userlogin =true;
            const userdetail = req.session.userId;
            const  Username = userdetail.username;
          
          const  categoryinfo = await Categorycollection.find({});  //category collection

  
      // Perform a search using MongoDB
      const prodectinfo = await Prodectcollection.find({  // serched value is Search all field
        $or: [
          { Category: { $regex: searchQuery, $options: "i" } },
          { Brand: { $regex: searchQuery, $options: "i" } },
          { Model: { $regex: searchQuery, $options: "i" } },
          { Description: { $regex: searchQuery, $options: "i" } },
        ]
      });
  
      return res.render("User/homepage", { prodectinfo,Userlogin,Username,categoryinfo });    // Render the search results in Prodect list
    } catch (error) {
      console.error(error);
      res.status(500).send("Data searching error");
    }
  };







module.exports = {
    mainhomepage,
    signup,
    signupdata,
    login,
    loginpost,
    home,
    logout,

    EmailEnteringPage,
    EmailPost,
    otp,
    OTPPost,
    Newpassword,
    NewpasswordPost,

    categorybasedrender,
    oneprodectdetails,

   userprofile,

    AddAddress,

    Updateuserdetails,
    UpdatePassword,
 
    prodectsearch
   
}






///////////////////////////////////old
// {

//     require('dotenv').config()
    
//     const signupcollection = require("../Model/UserSchema")
//     const bcrypt = require("bcrypt")     //Password encrypting module
    
    
//     const Prodectcollection = require("../Model/ProdectSchema")
//     const Categorycollection = require("../Model/CategorySchema")
    
//     const CartCollection = require("../Model/CartSchema")// cart schema require
    
//     const AddressCollection = require("../Model/AddressSchema")
//     const Ordercollection = require("../Model/OrderSchema")
//     const nodemailer = require("nodemailer");    //Email sending module
    
    
    
    
    
    
//     //login
//     const login = (req, res) => {
//         if (req.session.userId) {
//             return res.redirect("/home")
//         } else if (req.session.user) {
//             return res.render("User/loginpage", { msg: "Invalid username " })
//         } else if (req.session.passwordMatch) {
//             return res.render("User/loginpage", { msg: "Invalid password" })
//         } else if (req.session.verifyval) {
//             return res.render("User/loginpage", { msg: "user is not valid" })
//         }
//         else {
//             res.render("User/loginpage")
//         }
//     }
    
//     let categoryinfo;
//     let Userlogin;
//     let num = 0;
//     let username;
//     //user homepage
//     const home = async (req, res) => {
    
//         if (req.session.userId) {
//             try {
//                 Userlogin = true;
//                 const userdetail = req.session.userId;
//                 const username = userdetail.username;
//                 const prodectinfo = await Prodectcollection.find({});  //prodect colleection
//                 categoryinfo = await Categorycollection.find({});  //category collection
//                 return res.render("User/homepage", { prodectinfo, categoryinfo, Userlogin, username });  //Updating Prodect and Category collection
//             }
//             catch (error) {
//                 console.error(error);
//                 return res.status(500).send("Error fetching product information.");
//             }
//         }
//         else {
//             return res.redirect("/login")
//         }
//     }
    
    
    
//     //Mainhomepage
//     const mainhomepage = async (req, res) => {
//         if (req.session.userId) {
//             return res.redirect("/home")
//         } else {
//             Userlogin = false;
//             try {
//                 const prodectinfo = await Prodectcollection.find({});  // updateing prodect and category in MainhomePage side
//                 const categoryinfo = await Categorycollection.find({});
    
//                 return res.render("User/Mainhomepage", { prodectinfo, categoryinfo, Userlogin, username }); // that deatils are render in Mainhome Page
//             } catch (error) {
//                 console.error(error);
//                 return res.status(500).send("Error fetching product information.");
//             }
//         }
//     }
    
    
    
    
//     //Logout
//     const logout = (req, res) => {
//         Userlogin = false;
//         console.log("destroy");
//         req.session.destroy();  //Destroying Session
//         return res.redirect("/login")
//     }
    
    
    
//     //SignUp
//     const signup = (req, res) => {
//         if (req.session.userId) {   //user has existing
//             return res.render("User/homepage")
//         }
//         if (req.session.pswd) {
//             return res.render("User/signuppage", { msg: "Passwords do not match" });
//         }
//         else if (req.session.checkinguser) {
//             return res.render("User/signuppage", { msg: "User with the same email already exists" })
    
//         }
//         else if (req.session.userId) {
//             return res.redirect("/home")
//         }
//         else {
//             return res.render("User/signuppage");
    
//         }
//     }
    
    
    
//     //Signup Creation, Create a new user(SignUp Post Methode)
//     const signupdata = async (req, res) => {
//         try {
//             console.log(req.body);
//             const { username, email, password, confirmpassword } = req.body; //decoding the data in body and destructing
//             const checkinguser = await signupcollection.findOne({ email }); //checking email in  current user database
    
//             if (password !== confirmpassword) {//checking two passwords in the body
//                 console.log("password not match");
//                 req.session.pswd = true;
//                 return res.redirect("/signup")
//             }
//             if (checkinguser) {
//                 req.session.checkinguser = true;
//                 return res.redirect("/signup")
//             }
//             else {
    
//                 const saltRounds = 10;
//                 const hashedPassword = await bcrypt.hash(password, saltRounds); // Password hashing process
    
//                 const newUser = new signupcollection({ //Create a new document and save it to the database
//                     username,
//                     email,
//                     password: hashedPassword,
//                     verify: false
//                 })
    
//                 req.session.Signuserverification = newUser;
//                 await newUser.save() // Saving in database
    
//             }
//         }
//         catch (error) {
//             return res.status(500).send("error during user registration");
//         }
    
    
//         return res.redirect("/EmailEnteringPage")
//     }
    
    
    
//     //Login validation(Login Post methode)
//     const loginpost = async (req, res) => {
//         try {
//             const { lusername, lpassword, } = req.body; //decoding the data in body and destructing
//             const user = await signupcollection.findOne({ username: lusername }) //checking  username in  current user database
//             console.log("loginpost:", user._id)
//             const userId = user._id;
//             const VERIFYuser = user.verify;
//             req.session.VERIFYuser = user;
    
//             console.log('VERIFYuser:', VERIFYuser)
    
//             if (!user) { // user name validation
//                 req.session.user = true;
//                 return res.redirect("/login")
//             }
//             const passwordMatch = await bcrypt.compare(lpassword, user.password) //compair enter password and data base store current user password
    
//             if (!passwordMatch) {  // Password validation
//                 req.session.passwordMatch = true;
//                 return res.redirect("/login")
    
//             }
//             if (user.block === true) {
//                 return res.redirect("/login")
//             }
//             if (VERIFYuser === false) {
//                 req.session.verifyval = true;
//                 const DeleteProdect = await signupcollection.findByIdAndRemove(userId)
//                 return res.redirect("/login")
    
//             }
//             //create session for  current User //
//             req.session.userId = user
//             return res.redirect("/login")
    
//         }
//         catch (error) {
//             console.error("error during login:", error)
//             return res.status(500).send("Error during login")
//         }
    
//     }
    
    
    
    
//     //Email entering Page
//     const EmailEnteringPage = (req, res) => {
//         if (!req.session.emailvalue) {
//             return res.render("User/OTPEmailpage")
//         }
//         return res.render("User/OTPEmailpage", { msg: "Invalid Email Id" })
//     }
    
    
    
//     // Email Post methode
//     const EmailPost = async (req, res) => {
    
//         const emailId = req.body.Emailid;
//         console.log("Emai:", emailId);
//         const checkingEmail = await signupcollection.findOne({ email: emailId }); //find email from current  User and Assign the perticular variable
//         console.log("checkingEmail:", checkingEmail)
    
//         if (checkingEmail) {//condition OK  
//             try {
//                 const transporter = nodemailer.createTransport({
//                     service: "gmail", // Use your email service provider (e.g., Gmail, SMTP)
//                     port: 587,
//                     host: 'smtp.gmail.com',
//                     auth: {
//                         user: "nithindivakarannair92@gmail.com", // Your email address (use environment variables)
//                         pass: process.env.EMAIL_PASS// Your email password (or an App Password) (use environment variables)
//                     }
//                 });
//                 const generateOTP = () => {
//                     return Math.floor(100000 + Math.random() * 900000).toString();
//                 }
    
//                 const otp = generateOTP();
//                 console.log('OTP value:', otp);// OTP assign "OTPvalue" variable
    
    
//                 const mailOptions = {
//                     from: "nithindivakarannair92@gmail.om",
//                     to: emailId, // Recipient's email address
//                     subject: "OTP Verification",
//                     text: `Your OTP for verification is: ${otp}`
//                 };
//                 console.log('Email sending structure:', mailOptions)//email sending structure
    
//                 // Send the email
//                 transporter.sendMail(mailOptions, function (error, info) {
//                     if (error) {
//                         console.log(error);
//                     } else {
//                         console.log('Email sent: ' + info.response);
//                     }
//                 });
    
//                 const update = await signupcollection.updateOne({ email: checkingEmail.email }, { $set: { OTP: otp } })  // Update OTP field in the user collection
//             }
//             catch (error) {
//                 console.error("Error in EmailPost:", error);
//                 res.status(500).json({ message: "Internal server error" });
//             }
    
//             req.session.email = checkingEmail.email//Current user emailId  assigning through Session 
    
//             console.log("verify email:", req.session.email);// Redirect to the OTP entering page
//             res.redirect('/otp');
//         }
//         else {
//             req.session.emailvalue = true;
//             res.redirect('/EmailEnteringPage'); // Email authentication routing process
//         }
//     };
    
    
    
//     //OTP entering Page
//     const otp = (req, res) => {
//         if (req.session.otpId) {
//             return res.render("User/otppage", { msg: "Invalid OTP" })
//         }
//         return res.render("User/otppage")
//     }
    
    
//     //OTP Post methode
//     const OTPPost = async (req, res) => {
//         try {
//             const otpValue = req.body.otp;
//             const OTPvalue = await signupcollection.findOne({ OTP: otpValue }) //finding OTP  in current User
    
//             if (req.session.Signuserverification) {
//                 const userval = req.session.Signuserverification;
//                 console.log('userval:', userval)
//                 const uservalupdate = await signupcollection.updateOne({ email: userval.email }, { $set: { verify: true } })
//                 res.redirect("/login")
//             }
//             else if (OTPvalue) {
//                 res.redirect('/Newpassword')
//             } else {
//                 req.session.otpId = true;
//                 res.redirect('/otp')
//             }
//         }
//         catch (error) {
//             return res.status(500).send("Error during OTP posting methode")
//         }
//     }
    
    
    
    
//     //New password entering Page
//     const Newpassword = (req, res) => {
//         if (req.session.passwordvalue) {
//             return res.render("User/NewPassword", { msg: "Password not Matching" })
//         }
//         return res.render("User/NewPassword")
//     }
    
    
    
    
//     //New password Post methode
//     const NewpasswordPost = async (req, res) => {
//         try {
//             const { newpassword, conformpassword } = req.body
    
//             if (newpassword == conformpassword) { // verifing  for newpassword and conform password
    
//                 const Email = req.session.email // Current user Email id is stored(Email Posting time) in this session and assign in vaperticular variable("Email"),this methode is using for New password adding for curren User
//                 console.log('Email Id:', Email)
    
//                 const saltRounds = 10;
//                 const hashedPassword = await bcrypt.hash(newpassword, saltRounds);
    
//                 const update = await signupcollection.updateOne({ email: Email }, { $set: { password: hashedPassword } }) //New password added to current User data base
//                 res.redirect('/login')
//             }
//             else {
//                 req.session.passwordvalue = true;
//                 res.redirect("/Newpassword")
//             }
//         }
//         catch {
//             return res.status(500).send("Error due to Newpassword creation.");
//         }
//     }
    
    
    
    
//     //category based rendering field
//     const categorybasedrender = async (req, res) => {
//         const Id = req.params.CategoryId;
//         const categoryId = await Categorycollection.findOne({ _id: Id })
//         try {
//             const prodectinfo = await Prodectcollection.find({ Category: categoryId.Category });  //prodect colleection
//             categoryinfo = await Categorycollection.find({});  //category collection
//             return res.render("User/CategoryRenderingCommonPage", { categoryinfo, prodectinfo, Userlogin, username });  //Updating Prodect and Category collection
//         }
//         catch (error) {
//             console.error(error);
//             return res.status(500).send("Error fetching product information.");
//         }
//     }
    
    
    
//     //one prodect details//
//     const oneprodectdetails = async (req, res) => {
//         const prodectId = req.params.prodectId;
//         try {
//             const prodectdata = await Prodectcollection.findOne({ _id: prodectId })
//             categoryinfo = await Categorycollection.find({});  //category collection
//             return res.render("User/ProdectDetails", { categoryinfo, prodectdata, Userlogin, username })
//         }
//         catch (error) {
//             console.log("Error due to one prodect detailing time:", error)
//             return res.status(500).send("Error fetching product information.");
    
//         }
//     }
    
    
    
//     //cartpagepageGET methode
//     const cartpagedetails = async (req, res) => {
//         const userdetails = req.session.userId;
//         const userid = userdetails._id
    
//         try {
//             categoryinfo = await Categorycollection.find({});
//             const cartinfo = await CartCollection.find({ UserId: userid })
    
//             let totalprice = 0
//             cartinfo.forEach((cartiteam) => {
//                 totalprice += cartiteam.Price * cartiteam.Count;
//             })
//             return res.render("User/Shoppingcartpage", { Userlogin, categoryinfo, cartinfo, totalprice, num, username })
//         } catch (error) {
//             console.log("Error due to cart detail displaying time:", error)
//             return res.status(500).send("Error due to cart detail displaying time")
//         }
//     }
    
    
//     //cartpagepagepost methode
//     const cartpage = async (req, res) => {
    
//         try {
//             const ProdectId = req.params.prodectId;
//             const prodectdetails = await Prodectcollection.findOne({ _id: ProdectId })
    
//             const userdetails = req.session.userId
//             const UserId = userdetails._id;
    
//             const categoryinfo = await Categorycollection.findOne({ Category: prodectdetails.Category });
//             const CategoryId = categoryinfo._id;
//             const { Category, Price, Brand, Model, Description, Image } = prodectdetails;
    
//             const existingCartItem = await CartCollection.findOne({ ProdectId });
//             if (existingCartItem) {
//                 num++;
//                 existingCartItem.Count += 1; // You can adjust this as needed
    
//                 await existingCartItem.save();
//                 return res.redirect("back")
//             }
    
//             const NewCartProdect = new CartCollection({
//                 UserId,
//                 ProdectId,
//                 CategoryId,
//                 Category,
//                 Price,
//                 Description,
//                 Model,
//                 Brand,
//                 Image,
//             })
//             num++;
//             await NewCartProdect.save();
//             return res.redirect("back")
//         }
//         catch (error) {
//             console.log("Error due to  prodect add in cart time");
//             return res.status(500).send("Error due to  prodect add in cart time");
//         }
//     }
    
    
//     // + button working  for  count in cart
    
//     const CartPluseButton = async (req, res) => {
//         const ProdectId = req.params.prodectId;
//         try {
//             const existingCartItem = await CartCollection.findOne({ ProdectId });
//             if (existingCartItem) {
//                 num++;
//                 existingCartItem.Count += 1; // You can adjust this as needed
    
//                 await existingCartItem.save();
//                 return res.redirect("back")
//             }
//         } catch (error) {
//             console.log("Error due to  + button click time");
//             return res.status(500).send("Error due to  + button click time");
//         }
//     }
    
    
    
//     // - button working  for  count in cart
//     const CartMinusebutton = async (req, res) => {
//         const ProdectId = req.params.prodectId;
//         try {
//             const existingCartItem = await CartCollection.findOne({ ProdectId });
//             if (existingCartItem) {
//                 num = num - 1;
//                 existingCartItem.Count -= 1; // You can adjust this as needed
    
//                 await existingCartItem.save();
//                 return res.redirect("back")
//             }
//         } catch (error) {
//             console.log("Error due to  + button click time");
//             return res.status(500).send("Error due to  + button click time");
//         }
//     }
    
    
    
    
    
//     //remove  prodect the cart 
//     const IteamRemoveCart = async (req, res) => {
//         const prodectid = req.params.iteam;
//         console.log('prodectid:', prodectid)
//         try {
    
//             const DeleteCartiteam = await CartCollection.findOneAndRemove({ ProdectId: prodectid })
//             return res.redirect("back")
    
//         } catch (error) {
//             console.log('Error due to cart iteam delete time', error);
//             return res.status(500).send("Error due to cart iteam delete time")
//         }
//     }
    
    
    
    
    
    
    
//     //checkoutpage
//     const checkoutpage = async (req, res) => {
//         try {
//             const userdetail = req.session.userId;
//             const cartinfo = await CartCollection.find({ UserId: userdetail._id })
//             const AllAddress = await AddressCollection.find({ UserId: userdetail._id })
//             let totalprice = 0
    
//             cartinfo.forEach((cartiteam) => {
//                 totalprice += cartiteam.Price * cartiteam.Count
    
//             })
//             return res.render("User/checkoutpage", { Userlogin, categoryinfo, totalprice, num, AllAddress, cartinfo, username })
//         } catch (error) {
//             console.log('Error due to checkout time', error);
//             return res.status(500).send("Error due to checkout time")
//         }
//     }
    
    
    
//     //Address add to database
//     const AddAddress = async (req, res) => {
//         const addressdetails = req.body
//         try {
//             console.log("addressdetails:", req.body)
//             const { name, mobilenumber, address, landmark, alternatenumber, city, pincode } = addressdetails;
//             const userdetails = req.session.userId
//             const userId = userdetails._id;
//             const newaddressdetails = new AddressCollection({
//                 UserId: userId,
//                 Name: name,
//                 MobileNumber: mobilenumber,
//                 Address: address,
//                 Landmark: landmark,
//                 AternateNumber: alternatenumber,
//                 City: city,
//                 PincodeL: pincode
//             })
//             console.log(newaddressdetails)
//             await newaddressdetails.save()
//             res.redirect("/checkoutpage")
//         }
//         catch (error) {
//             console.log("Error due to address details add time:", error);
//             res.status(500).sned("Error due to address details add time")
//         }
    
//     }
    
    
    
    
//     // profile detail page
//     const userprofile = async (req, res) => {
//         try {
//             const userdetail = req.session.userId;
//             console.log('userprofile', userdetail);
    
//             const userdetails = await signupcollection.findById({ _id: userdetail._id })
//             const AllAddress = await AddressCollection.find({ UserId: userdetail._id })
//             const Allorders = await Ordercollection.find({ customerId: userdetail._id })
     
//             categoryinfo = await Categorycollection.find({});
//             console.log('adresssss', AllAddress)
//             console.log('Allorders', Allorders)
//             return res.render("User/Userfulldetails", { categoryinfo, Userlogin, AllAddress, userdetails, Allorders, username })
//         } catch (error) {
//             console.log("Error due to user profile page rendering error:", error)
//             res.status(500).send("Error due to sucessful page rendering error");
    
//         }
//     }
    
    
//     //order sucessful page
//     const ordersucessful = async (req, res) => {
//         console.log('ordersucessful')
//         try {
    
//             categoryinfo = await Categorycollection.find({});
//             return res.render("User/ORDERSUCESSFUL", { categoryinfo, Userlogin, username })
//         } catch (error) {
//             console.log("Error due to sucessful page rendering error:", error)
//             res.status(500).send("Error due to sucessful page rendering error");
//         }
//     }
    
    
//     //order sucessfulpage post methode
//     const ordersuccessfulPOST = async (req, res) => {
//         console.log("datas:", req.body)
    
//         const addressId = req.body.address;
//         const address = await AddressCollection.findById(addressId)
    
//         const userdetails = req.session.userId;
//         const customerId = userdetails._id;
//         const CustomerName = userdetails.username;
//         const paymentmode = req.body.paymentMethod;
//         const totalAmount = req.body.totalAmount;
    
//         try {
//             const cartinf = await CartCollection.find({ UserId: customerId })
//             // Save the order with the total amount to your database using the Order model
//             const newOrder = new Ordercollection({
//                 customerId,
//                 CustomerName,
//                 totalAmount: totalAmount,
//                 address,
//                 iteams: cartinf,
//                 paymentmode
//             });
//             await newOrder.save();
    
//             res.redirect("/ordersucessful");
//             await CartCollection.deleteMany({ UserId: customerId });
//         } catch (error) {
//             console.log("Error due to successful page rendering error:", error);
//             res.status(500).send("Error due to successful page rendering error");
//         }
//     };
    
    
    
    
    
    
//     module.exports = {
//         mainhomepage,
//         signup,
//         signupdata,
//         login,
//         loginpost,
//         home,
//         logout,
    
//         EmailEnteringPage,
//         EmailPost,
//         otp,
//         OTPPost,
//         Newpassword,
//         NewpasswordPost,
    
//         categorybasedrender,
//         oneprodectdetails,
    
//         cartpage,
//         cartpagedetails,
//         CartPluseButton,
//         CartMinusebutton,
    
//         checkoutpage,
    
//         IteamRemoveCart,
//         userprofile,
    
//         AddAddress,
    
    
//         ordersucessful,
//         ordersuccessfulPOST,
//     }
//     }