


const LoginAuthentication=(req,res,next)=>{
    if(req.session.userId){
        return res.redirect("/home")
    }
    
    else{
        next();
    }
    }


    const HomepageAuthentication=(req,res,next)=>{
        if(!req.session.userId){
            return res.redirect("/login");
    }else{
        next();
    }
    }


//     const MainhomepageAuthentication=(req,res,next)=>{
//         if (req.session.userId) {
//             return res.redirect("/home")
//         }else{
//             next();
//         }
// }



const SignUpAuthentication=(req,res,next)=>{
    if (req.session.userId) {   //user has existing
        return res.render("User/homepage")
    }else{
        next();
    }
}

// const EmailpageAuthentication=(req,res,next)=>{
//     if (req.session.userId) {   //user has existing
//         return res.render("User/homepage")
//     }else{
//         next();
//     }
// }


const otpAuthentication=(req,res,next)=>{
    if (!req.session.otpId) {   
        return res.render("User/otppage")
    }else{
        next();
    }
}


const  NewpasswordAuthentication=(req,res,next)=>{
    if (!req.session.passwordvalue) { 
        return res.render("User/NewPassword")
    }else{
        next();
    }
}



const BlockAuthenticationHomepage=(req,res,next)=>{
    if (req.session.userblock) { 
        req.session.destroy();
        return res.redirect("/mainhomepage")
    }else{
        next();
    }
}




    module.exports={
        LoginAuthentication,
        HomepageAuthentication,
        // MainhomepageAuthentication,
        SignUpAuthentication,
        // EmailpageAuthentication,
        otpAuthentication,
        NewpasswordAuthentication,
      
        BlockAuthenticationHomepage
    }