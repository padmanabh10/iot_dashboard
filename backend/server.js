const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const User = require('./models/User');
require('dotenv').config();
const userRoutes = require('./routes/users');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) return callback(err);
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token missing' });
    }

    jwt.verify(token, getKey, {
        audience: process.env.AUTH0_AUDIENCE,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ['RS256']
    }, async (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).json({ error: 'Invalid token' });
        }

        try {
            let user = await User.findOne({ auth0Id: decoded.sub });

            if (!user) {
                user = new User({
                    auth0Id: decoded.sub,
                    email: decoded.email || '',
                    name: decoded.name || '',
                    picture: decoded.picture || '',
                    roles: decoded['https://my-app.example.com/roles'] || ['user'],
                    lastLogin: new Date()
                });
                await user.save();
                console.log('✅ New user added:', user.email);
            } else {
                user.lastLogin = new Date();
                await user.save();
            }

            req.user = user;
            next();
        } catch (err) {
            console.error('User DB error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    });
};


const requireAdmin = (req, res, next) => {
    if (!req.user.roles.includes('admin')) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

app.get('/', (req, res) => res.send('🚀 Server is running.'));

app.get('/api/user/profile', authenticateToken, (req, res) => {
    res.json({
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture,
        roles: req.user.roles,
        createdAt: req.user.createdAt
    });
});

app.use('/api/users', userRoutes);
console.log('User route mounted');
app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await User.find({}, '-auth0Id').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.get('/api/devices', authenticateToken, (req, res) => res.json([]));

app.get('/api/dashboard/stats', authenticateToken, (req, res) => res.json([]));

app.get('/api/alerts/active', authenticateToken, (req, res) => res.json({ count: 0, alerts: [] }));

app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => res.json([]));

app.post('/api/analytics/user-activity', authenticateToken, (req, res) => {
    // TODO1: Save user activity to database
    res.json({ success: true, message: 'Activity logged' });
});

app.patch('/api/devices/:id/status', authenticateToken, (req, res) => {
    // TODO2: Update device status in database
    res.json({ success: true, message: 'Device status updated' });
});

app.post('/api/admin/actions', authenticateToken, requireAdmin, (req, res) => {
    // TODO3: Handle admin actions
    res.json({ success: true, message: 'Admin action completed' });
});



app.listen(PORT, () => {
    console.log(`🌐 Server running on http://localhost:${PORT}`);
});
