const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
        // it is not require as the user signs in using Google then no need to store password 
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String
    },
    provider: {
        // to store the sign in provider email/google
        type: String,
        required: true
    }
},{
    timestamps: true
})

const User = mongoose.model("User", userSchema);
module.exports = User;