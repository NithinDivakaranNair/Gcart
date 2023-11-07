

const LoginAuthentication = (req, res, next) => {
    try {
        if (req.session.userId) {
            return res.redirect("/home");
        } else {
            next();
        }
    } catch (error) {
        // Handle any errors here, for example, log the error and send an error response.
        console.error(error);
        return res.status(500).send("An error occurred during login authentication.");
    }
};



const HomepageAuthentication = (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.redirect("/login");
        } else {
            next();
        }
    } catch (error) {
        // Handle any errors here, for example, log the error and send an error response.
        console.error(error);
        return res.status(500).send("An error occurred during homepage authentication.");
    }
};







const SignUpAuthentication = (req, res, next) => {
    try {
        if (req.session.userId) { // User has an existing session
            return res.render("User/homepage");
        } else {
            next();
        }
    } catch (error) {
        // Handle any errors here, for example, log the error and send an error response.
        console.error(error);
        return res.status(500).send("An error occurred during signup authentication.");
    }
};




const otpAuthentication = (req, res, next) => {
    try {
        if (!req.session.otpId) {
            return res.render("User/otppage");
        } else {
            next();
        }
    } catch (error) {
        // Handle any errors here, for example, log the error and send an error response.
        console.error(error);
        return res.status(500).send("An error occurred during OTP authentication.");
    }
};


const NewpasswordAuthentication = (req, res, next) => {
    try {
        if (!req.session.passwordvalue) {
            return res.render("User/NewPassword");
        } else {
            next();
        }
    } catch (error) {
        // Handle any errors here, for example, log the error and send an error response.
        console.error(error);
        return res.status(500).send("An error occurred during New Password authentication.");
    }
};




const BlockAuthenticationHomepage = (req, res, next) => {
    try {
        if (req.session.userblock) {
            req.session.destroy();
            return res.redirect("/mainhomepage");
        } else {
            next();
        }
    } catch (error) {
        // Handle any errors here, for example, log the error and send an error response.
        console.error(error);
        return res.status(500).send("An error occurred during Block Authentication Homepage.");
    }
};





module.exports = {
    LoginAuthentication,
    HomepageAuthentication,

    SignUpAuthentication,

    otpAuthentication,
    NewpasswordAuthentication,

    BlockAuthenticationHomepage
}