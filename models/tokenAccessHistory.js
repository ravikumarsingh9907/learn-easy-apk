const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    otp: {
        type: String,
    },
    email: {
        type: String,
    },
    token: {
        type: String,
    },
    user: {
        type: mongoose.ObjectId,
        ref: 'User',
    },
    expireAt: {
        type: Date,
        expires: 36000
    }
}, {
    timestamps: true,
});

const tokenAccessHistory = new mongoose.model('TokenAccessHistory', tokenSchema);
module.exports = tokenAccessHistory;