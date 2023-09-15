// Database model for user collection
const mongoose = require('mongoose');

// Create a schema for the user collection
const MessageSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: new Date(),
    },
    avatar: {
        type: String,
        required: true,
    },
});

// Create a model out of the schema (will automatically be created)
const MessageModel = mongoose.model('messages', MessageSchema);

// Export to outside of the file
module.exports = MessageModel;
