// Database model for user collection
const mongoose = require('mongoose');

// Create a schema for the user collection
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    joinedGroups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'groups',
        },
    ],
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    created: {
        type: Date,
        default: new Date(),
    },
    ranking: {
        type: Number,
        default: 0,
    },
});

// Create a model out of the schema (will automatically be created)
const UserModel = mongoose.model('users', UserSchema);

// Export to outside of the file
module.exports = UserModel;
