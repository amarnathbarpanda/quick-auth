const User = require("../models/User");
const ResetToken = require("../models/ResetToken");
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('./passportLocal')(passport);
require('./googleAuth')(passport);
const crypto = require('crypto');
const mailer = require('./sendMail');
const router = require("../routes");

// middleware to check whether a user is authenticated or not
module.exports.checkAuth = (req, res, next)=>{
    if(req.isAuthenticated()){
        res.set('Cache-Control', 'no-cache, private, no-store,must-revalidate, post-check=0, pre-check=0')
        next();
    }else{
        req.flash('error_message', 'Please sign in to continue ! ');
        res.redirect('/signin');
    }
}


module.exports.homePage = (req, res) => {
    if(req.isAuthenticated()){
        return res.redirect('/profile');
    }else{
        return res.render('index', {logged: false});
    }
}

module.exports.signUpPage = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/profile');
    } else {
        return res.render('signup', {csrfToken: req.csrfToken()});
    }
};

module.exports.createUser = async (req, res) =>{
    // get all the values
    const {username, email, password, cpassword} = req.body;

    // check if they are empty
    if(!username || !email || !password || !cpassword){
        res.render('signup', {err: "All Fields Are Required!", csrfToken: req.csrfToken()})
    }else if(password !== cpassword){
        res.render('signup', { err: "Passwords Don't Match!", csrfToken: req.csrfToken() })
    }else{
        // validate username, email, and password
        
        // todo: validation
        //check if a user exists

        try {
            const user = await User.findOne({ $or: [{ email: email }, { username: username }]});

            if(user){
                res.render('signup', { err: "User Already Exists, Try Logging In !", csrfToken: req.csrfToken() })
            }else{
                // generate a salt
                const salt = await bcrypt.genSalt(12);

                // hash the password
                const hashPassword = await bcrypt.hash(password, salt);

                // save the user data in db
                const newUser = await User.create({
                    username: username,
                    email: email,
                    password: hashPassword,
                    googleId: null,
                    provider: 'email',
                    isVerified: false
                });

                
                // signin the user or redirect user to sign in page
                return res.redirect('signin');

            }
        } catch (error) {
            res.render('signup', { err: "Unable to Sign Up.", csrfToken: req.csrfToken() })
        }
    }
}

module.exports.signInPage = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/profile');
    } else {
        return res.render('signin', { csrfToken: req.csrfToken() });
    }
};

module.exports.signinUser =  (req, res, next) =>{
    passport.authenticate( 'local', {
        failureRedirect: '/signin',
        successRedirect: '/profile',
        failureFlash: true,
    })(req, res, next);
}

module.exports.profilePage = (req, res) => {
    return res.render('profile', {username: req.user.username, email: req.user.email, verified: req.user.isVerified});
};

module.exports.logout = (req, res) =>{
    req.logout(function (err) {
        if (err) { return next(err); }
        req.session.destroy(function(err){
            res.redirect('/');
        })
    });
}

module.exports.googleCallBack = (req, res) =>{
    res.redirect('/profile');
} 


// send verification email
module.exports.sendVerificationEmail = async (req, res)=>{
    if(req.user.isVerified || req.user.provider == 'google'){
        res.redirect('/profile');
    }else{
        // send a verification
        // generate a token
        let token = crypto.randomBytes(32).toString('hex');
        
        await ResetToken.create({
            token: token,
            email: req.user.email
        })
        mailer.sendVerifyEmail(req.user.email, token);
        res.render('profile', {
            username: req.user.username, 
            verified: req.user.isVerified,
            email: req.user.email,
            emailSent: true
        });

    }
}

// to verify the email
module.exports.verifyEmail = async (req, res) => {
    // getting the token from query
    const token = req.query.token;

    if(token){
        // find the token in ResetToken
        let check = await ResetToken.findOne({token: token});

        if(check){
            let userData = await User.findOne({email: check.email})
            userData.isVerified = true;
            // save the updated userData in the db
            await userData.save();

            // delete the token after varification
            await ResetToken.findOneAndDelete({token: token});

            res.redirect('/profile');
            
        }else{
            
            res.render('profile', {
                username: req.user.username,
                verified: req.user.isVerified,
                email: req.user.email,
                err: "Invalid token or token expired !"
            });
        }
    }else{
        // if the user is verified then then redirect to profile page
        res.redirect('/profile');
    }
}

module.exports.forgotPasswordPage = (req, res) => {
    return res.render('forgot-password', { csrfToken: req.csrfToken() });
}

module.exports.forgotPassword = async (req, res) => {
    const {email} = req.body;

    const userData = await User.findOne({email: email});

    if(userData){
        if(userData.provider == "google"){
            return res.render('forgot-password', { csrfToken: req.csrfToken(), message: "You need to reset your google account's password !", type: "danger" });

        }else{
            // generate a token
            let token = crypto.randomBytes(32).toString('hex');

            await ResetToken.create({
                token: token,
                email: email
            })

            mailer.sendResetEmail(email, token);

            return res.render('forgot-password', { csrfToken: req.csrfToken(), message: "Reset Link Sent !", type: "success" });

        }
    }else{
        return res.render('forgot-password', { csrfToken: req.csrfToken() , message: "No user found !", type: "danger"});

    }
}

module.exports.resetPasswordPage = async (req, res) => {
    // getting the token from query
    const token = req.query.token;

    if (token) {
        // find the token in ResetToken
        let check = await ResetToken.findOne({ token: token });

        if (check) {

            return res.render('forgot-password', { csrfToken: req.csrfToken(), reset: true, email: check.email});

        } else {

            return res.render('forgot-password', { csrfToken: req.csrfToken(), message: "Invalid token or Token Expired !", type: "danger" });

        }
    } else {
        // if the user is verified then then redirect to profile page
        res.redirect('/signin');
    }
}

module.exports.resetPassword = async (req, res) => {
    const {password, cpassword, email} = req.body;

    if(!password || !cpassword || (password != cpassword)){
        return res.render('forgot-password', { csrfToken: req.csrfToken(), reset: true, email: email, message: "Invalid token or Token Expired !", type: "danger" });
    }else{
        let salt = await bcrypt.genSalt(12);
        let hash = await bcrypt.hash(password, salt);
        await User.findOneAndUpdate({email: email}, {$set: {password: hash}});
        res.redirect('/signin');
    }
}