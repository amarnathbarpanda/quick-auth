const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

module.exports = function(passport){
    passport.use(new localStrategy({ usernameField: 'email'}, async (email, password, done) =>{
        try {
            const user = await User.findOne({ email: email });
            // console.log(user)
            if(!user){
                return done(null, false, {message: "User Doesn't Exist !"});
            }
            const isPasswordMatching = bcrypt.compareSync(password, user.password);

            if(!isPasswordMatching){
                return done(null, false, {message: "Password Doesn't Match !"});
            }

            return done(null, user);
        } catch (error) {
            return done(null, false, { message: "Internal Server Error !" });
        }
    }))
}


passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(async function(id, done){
    try {
        const user = await User.findById(id);

        done(null, user);

    } catch (error) {
        
    }
})