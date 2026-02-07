const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;

        // Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture, sub: googleId } = ticket.getPayload();

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // Update user info if needed
            user.name = name;
            user.avatar = picture;
            user.googleId = googleId; // Ensure googleId is set
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                googleId,
                name,
                email,
                avatar: picture,
            });
        }

        // Generate JWT
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: jwtToken,
        });
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(400).json({ message: 'Google authentication failed' });
    }
});

module.exports = router;
