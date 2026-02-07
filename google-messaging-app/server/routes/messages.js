const express = require('express');
const { protect } = require('../middleware/auth');
const Message = require('../models/Message');
const router = express.Router();

// Get chat history with a specific user
router.get('/:userId', protect, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user.id },
            ],
        }).sort({ createdAt: 1 }); // Oldest first

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Send a message
router.post('/', protect, async (req, res) => {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
        return res.status(400).json({ message: 'Invalid data passed into request' });
    }

    try {
        var message = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content: content,
        });

        message = await message.populate('sender', 'name avatar');
        message = await message.populate('receiver', 'name avatar');

        res.json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;

