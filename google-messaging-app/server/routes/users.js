const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get all users (except self)
router.get('/', protect, async (req, res) => {
    try {
        const keyword = req.query.search
            ? {
                $or: [
                    { name: { $regex: req.query.search, $options: 'i' } },
                    { email: { $regex: req.query.search, $options: 'i' } },
                ],
            }
            : {};

        const users = await User.find(keyword).find({ _id: { $ne: req.user.id } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
