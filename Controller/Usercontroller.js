require('dotenv').config()

const signupcollection = require("../Model/UserSchema")
const bcrypt = require("bcrypt")     //Password encrypting module


const Prodectcollection = require("../Model/ProdectSchema")
const Categorycollection = require("../Model/CategorySchema")

const nodemailer = require("nodemailer");    //Email sending module




//login
   const login = (req, res) => {
    if (req.session.userId) {
        return res.redirect("/home")
    } else if (req.session.user) {
        return res.render("User/loginpage", { msg: "Invalid username " })
    } else if (req.session.passwordMatch) {
        return res.render("User/loginpage", { msg: "Invalid password" })
    } else if (req.session.verifyval) {
        return res.render("User/loginpage", { msg: "user is not valid" })
    } 
     else {
        res.render("User/loginpage")
    }
}


let   categoryinfo ;
//user homepage
   const home = async (req, res) => {
    if (req.session.userId) {
        try {
            const prodectinfo = await Prodectcollection.find({});  //prodect colleection
             categoryinfo = await Categorycollection.find({});  //category collection
            return res.render("User/homepage", { prodectinfo, categoryinfo });  //Updating Prodect and Category collection
        } 
        catch (error) {
            console.error(error);
            return res.status(500).send("Error fetching product information.");
        }}
        else {
        return res.redirect("/login")
    }
}



//Mainhomepage
    const mainhomepage = async(req, res) => {
    if (req.session.userId){
        return res.redirect("/home")
    }else{
         try {
        const prodectinfo = await Prodectcollection.find({});  // updateing prodect and category in MainhomePage side
        const categoryinfo = await Categorycollection.find({});

        return res.render("User/Mainhomepage", { prodectinfo, categoryinfo }); // that deatils are render in Mainhome Page
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error fetching product information.");
    }
}
}




//Logout
 const logout = (req, res) => {
    console.log("destroy");
    req.session.destroy();  //Destroying Session
    return res.redirect("/login")
}



//SignUp
  const signup = (req, res) => {
    if (req.session.userId) {   //user has existing
        return res.render("User/homepage")
    }
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
                verify:false
            })
            console.log('User:',newUser)
            req.session.Signuserverification=newUser;
              await newUser.save() // Saving in database
           
        }
    }
    catch (error) {
        return res.status(500).send("error during user registration");
    }
    // return res.redirect("/login")
   
    return res.redirect("/EmailEnteringPage")
}



//Login validation(Login Post methode)
  const loginpost = async (req, res) => {
    try {
        const { lusername, lpassword, } = req.body; //decoding the data in body and destructing
        const user = await signupcollection.findOne({ username: lusername }) //checking  username in  current user database
        console.log("loginpost:", user._id)
        const userId=user._id
        req.session.VERIFYuser=user;

        const VERIFYuser = user.verify;
        console.log('VERIFYuser:',VERIFYuser)
        
        if (!user) { // user name validation
            req.session.user = true;
            return res.redirect("/login")
        }
        const passwordMatch = await bcrypt.compare(lpassword, user.password) //compair enter password and data base store current user password

        if (!passwordMatch) {  // Password validation
            req.session.passwordMatch = true;
            return res.redirect("/login")

        }
        if(user.block===true){
            return res.redirect("/login")
          }
        if(VERIFYuser===false){
            req.session.verifyval = true;
            const DeleteProdect=await signupcollection.findByIdAndRemove(userId) 
            return res.redirect("/login")
           
        }
        //create session for  current User //
       req.session.userId=user
       return res.redirect("/login")

    }
    catch (error) {
        console.error("error during login:", error)
        return res.status(500).send("Error during login")
    }
   
}




//Email entering Page
   const EmailEnteringPage = (req, res) => {
    if (!req.session.emailvalue) {
        return res.render("User/OTPEmailpage")
    }
    return res.render("User/OTPEmailpage", { msg: "Invalid Email Id" })
}



// Email Post methode
   const EmailPost = async (req, res) => {

    const emailId = req.body.Emailid;
    console.log("Emai:",emailId);
        const checkingEmail = await signupcollection.findOne({email:emailId}); //find email from current  User and Assign the perticular variable
     console.log("checkingEmail:",checkingEmail)

      if(checkingEmail){//condition OK  
       try { 
           const transporter = nodemailer.createTransport({
            service: "gmail", // Use your email service provider (e.g., Gmail, SMTP)
            port:587,
            host:'smtp.gmail.com',
            auth: {
                user: "nithindivakarannair92@gmail.com", // Your email address (use environment variables)
                pass: process.env.EMAIL_PASS// Your email password (or an App Password) (use environment variables)
            }
        });
        const generateOTP = () => {
            return Math.floor(100000 + Math.random() * 900000).toString();
        }
        
        const otp = generateOTP();
         console.log('OTP value:',otp);// OTP assign "OTPvalue" variable
       
        
        const mailOptions = {
            from: "nithindivakarannair92@gmail.om",
            to: emailId, // Recipient's email address
            subject: "OTP Verification",
            text: `Your OTP for verification is: ${otp}`
        };
        console.log('Email sending structure:',mailOptions)//email sending structure

     // Send the email
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    
          const update =await signupcollection.updateOne({email:checkingEmail.email},{$set:{OTP:otp}})  // Update OTP field in the user collection
       } 
         catch (error) {
        console.error("Error in EmailPost:", error);
        res.status(500).json({ message: "Internal server error" });
        }
    
    req.session.email =checkingEmail.email//Current user emailId  assigning through Session 
    
    console.log("verify:",req.session.email);// Redirect to the OTP entering page
   res.redirect('/otp');
    }
      else{
        req.session.emailvalue=true;
    res.redirect('/EmailEnteringPage'); // Email authentication routing process
        }
    };



//OTP entering Page
   const otp = (req, res) => {
     if(req.session.otpId){
        return res.render("User/otppage",{ msg: "Invalid OTP" })
    }
    return res.render("User/otppage")
}


//OTP Post methode
  const OTPPost=async(req,res)=>{
    try{
        const otpValue=req.body.otp;
        const OTPvalue=await signupcollection.findOne({OTP:otpValue}) //finding OTP  in current User

        if(req.session.Signuserverification){
            const userval=req.session.Signuserverification;
            console.log('userval:',userval)
            const uservalupdate=await signupcollection.updateOne({email:userval.email},{$set:{verify:true}})
          res.redirect("/login")
        }
       else if(OTPvalue){ 
         res.redirect('/Newpassword')
        }else{
            req.session.otpId=true;
            res.redirect('/otp')
        }
    }
    catch(error){
        return res.status(500).send("Error during OTP posting methode")
        }
     }




//New password entering Page
  const Newpassword=(req,res)=>{
    if(req.session.passwordvalue){
        return res.render("User/NewPassword",{ msg: "Password not Matching" })  
    }
    return res.render("User/NewPassword")
   }




//New password Post methode
    const NewpasswordPost=async(req,res)=>{
    try{
     const{newpassword,conformpassword}=req.body
     
     if(newpassword==conformpassword){ // verifing  for newpassword and conform password
     
        const Email= req.session.email // Current user Email id is stored(Email Posting time) in this session and assign in vaperticular variable("Email"),this methode is using for New password adding for curren User
     console.log('Email Id:',Email)
     
     const saltRounds = 10;
     const hashedPassword = await bcrypt.hash(newpassword, saltRounds);
     
     const update =await signupcollection.updateOne({email:Email},{$set:{password:hashedPassword}}) //New password added to current User data base
          res.redirect('/login')
         }
         else{
           req.session.passwordvalue=true;
           res.redirect("/Newpassword")
           }}
          catch{
            return res.status(500).send("Error due to Newpassword creation.");
                  }
                   }




//category based rendering field
    const categorybasedrender=async(req,res)=>{
       const Id=req.params.CategoryId;
       console.log('Id:',Id)
       const categoryId=await Categorycollection.findOne({_id:Id})
       console.log('categoryId:',categoryId)
        try {
            const prodectinfo = await Prodectcollection.find({Category:categoryId.Category});  //prodect colleection
            console.log('prodectinfo:',prodectinfo)
          return res.render("User/CategoryRenderingCommonPage", { prodectinfo });  //Updating Prodect and Category collection
        } 
        catch (error) {
            console.error(error);
            return res.status(500).send("Error fetching product information.");
        }}
               

//one prodect details//
const oneprodectdetails=async(req,res)=>{
    categoryinfo = await Categorycollection.find({});  //category collection
   return  res.render("User/ProdectDetails",{categoryinfo })
}




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
    oneprodectdetails

  
}