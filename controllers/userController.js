const User = require("../models/User");
const bcrypt = require('bcryptjs');

module.exports.homePage = (req, res) => {
    return res.render('index');
}

module.exports.signUpPage = (req, res) => {
    return res.render('signup', {csrfToken: req.csrfToken()});
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
                    provider: 'email'
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
    return res.render('signin');
};

module.exports.profilePage = (req, res) => {
    return res.render('profile');
};