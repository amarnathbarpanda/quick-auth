const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    expires_at: {
        type: Date,
        default: Date.now,
        expires: 600,
    }
});

const ResetToken = mongoose.model("ResetToken", resetTokenSchema);

module.exports = ResetToken;