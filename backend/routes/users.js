const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
    const { auth0Id, name, email, picture, roles } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { auth0Id },
            { name, email, picture, roles },
            { new: true, upsert: true }
        );
        res.status(200).json(user);
    } catch (err) {
        console.error('User save error:', err);
        res.status(500).json({ error: 'Failed to save user' });
    }
});

module.exports = router;
