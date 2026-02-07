const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String
    },
    isOnline: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
