// Database model for user collection
const mongoose = require('mongoose');

// Create a schema for the user collection
const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default:
            '//www.gravatar.com/avatar/68e0c7b9a411194748dff421e05b925f?s=200&r=pg&d=mm',
    },
    description: {
        type: String,
        default:
            'A default description for the user generated group. To set a custom description, click on the group settings icon within the joined group.',
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
    ],
    messages: {
        type: Array,
    },
    created: {
        type: Date,
        default: new Date(),
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    lastUpdated: {
        type: Date,
        default: new Date(),
    },
    lastMessage: {
        type: String,
        default: 'Welcome to WebChat Groups!',
    },
    ranking: {
        type: Number,
        default: 0,
    },
});

// Create a model out of the schema (will automatically be created)
const GroupModel = mongoose.model('groups', GroupSchema);

// Export to outside of the file
module.exports = GroupModel;
