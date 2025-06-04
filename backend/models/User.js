const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    auth0Id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    picture: {
        type: String,
        validate: {
            validator: function(v) {
                return !v || /^https?:\/\//.test(v);
            },
            message: 'Picture must be a valid URL'
        }
    },
    roles: [{
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    loginCount: {
        type: Number,
        default: 0
    },
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'auto'],
            default: 'light'
        },
        notifications: {
            type: Boolean,
            default: true
        },
        refreshInterval: {
            type: Number,
            default: 30000 // 30 seconds
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();

    // Increment login count when lastLogin is modified
    if (this.isModified('lastLogin') && !this.isNew) {
        this.loginCount += 1;
    }

    next();
});

// Create indexes for better query performance
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ roles: 1 });
userSchema.index({ createdAt: -1 });

// Instance methods
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    // Remove sensitive data when converting to JSON
    delete user.__v;
    return user;
};

userSchema.methods.hasRole = function(role) {
    return this.roles.includes(role);
};

userSchema.methods.isAdmin = function() {
    return this.roles.includes('admin');
};

// Static methods
userSchema.statics.findActiveUsers = function() {
    return this.find({ isActive: true });
};

userSchema.statics.findAdmins = function() {
    return this.find({ roles: 'admin', isActive: true });
};

userSchema.statics.getUserStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                activeUsers: {
                    $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                },
                adminUsers: {
                    $sum: { $cond: [{ $in: ['admin', '$roles'] }, 1, 0] }
                },
                averageLoginCount: { $avg: '$loginCount' }
            }
        }
    ]);

    return stats.length > 0 ? stats[0] : {
        totalUsers: 0,
        activeUsers: 0,
        adminUsers: 0,
        averageLoginCount: 0
    };
};

module.exports = mongoose.model('User', userSchema);