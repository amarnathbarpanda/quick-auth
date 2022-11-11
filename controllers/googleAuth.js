let GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('../models/User');
const clientId = require('../config/googleData').clientId;
const passport = require("passport");
const clientSecreT = require('../config/googleData').clientSecret;

// 1. Authentication
// - this user / user data exists

// - third party services (google, facebook etc.)

// 2. Autherization

// - this data can be accessed/changed by this user

// google login
// if this email exists or not
// if (true) : old user
// -> update data
// if (false) : create a user

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: clientId,
        clientSecret: clientSecreT,
        callbackURL: 'http://localhost:8000/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        console.log(profile.emails[0].value);

        // find if a user exists with this email or not
        User.findOne({ email: profile.emails[0].value })
            .then((data) => {
                if (data) {
                    //user exists
                    // update data
                    return done(null, data);
                } else {
                    // create a user
                    User({
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        password: null,
                        provider: 'google',
                        isVerified: true,
                    }).save(function (err, data) {
                        return done(null, data)
                    })
                }
            })
    }
    ))
}


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
        const user = await User.findById(id);
        done(null, user);

})