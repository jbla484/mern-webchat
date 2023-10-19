// Importing our libraries we installed during setup
const express = require('express');
const mongoose = require('mongoose');

// Connect our API with the react frontend
const cors = require('cors');

var ip = require('ip').address();

// Represents all the express API methods
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: `*:*`,
        methods: ['GET', 'POST'],
    },
});

// We use this so we dont get errors with cors
app.use(cors());

// We use this so we can parse the json responses
app.use(express.json());

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// Import UserModel
const UserModel = require('./models/Users.js');
const MessageModel = require('./models/Messages.js');
const GroupModel = require('./models/Groups.js');

// Start the application
server.listen(3001, () => {
    console.log('Server is running on port 3001');
});

let clients = [];

io.on('connection', (socket) => {
    socket.on('connection', (arg) => {
        clients.push(arg); // username
        // console.log(`${arg} connected`);
    });

    socket.on('disconnection', (arg) => {
        clients.map((client) => {
            // console.log(client);
        });
    });

    // GETS all groups
    socket.on('groups_get', async () => {
        // Retrieve all users
        let groups = await GroupModel.find({});

        if (!groups) {
            socket.emit('error', 'Error retrieving groups from database.');
            return;
        }
        socket.emit('groups_get', groups);
    });

    socket.on('group_create', async (arg) => {
        try {
            // check if username already exists
            let group = await GroupModel.findOne({ name: arg.name });

            if (group) {
                socket.emit('error', 'Group with that name already exists.');
                return;
            }

            if (!arg.owner) {
                socket.emit('error', 'User must be logged in first.');
                return;
            }

            let user = await UserModel.findOne({ _id: arg.owner });

            if (!user) {
                socket.emit('error', 'No user exists with that id.');
                return;
            }

            if (arg.avatar === '') {
                // Create a new user object from the user model
                if (arg.description) {
                    group = new GroupModel({
                        name: arg.name,
                        owner: arg.owner,
                        description: arg.description,
                    });
                } else {
                    group = new GroupModel({
                        name: arg.name,
                        owner: arg.owner,
                    });
                }
            } else {
                if (arg.description) {
                    group = new GroupModel({
                        name: arg.name,
                        avatar: arg.avatar,
                        owner: arg.owner,
                        description: arg.description,
                    });
                } else {
                    group = new GroupModel({
                        name: arg.name,
                        avatar: arg.avatar,
                        owner: arg.owner,
                    });
                }
            }

            // // Save the user to the database
            await group.save();

            console.log(
                `User (${user.username}) created group (${group.name}).`
            );

            // Return all groups to all clients
            let groups = await GroupModel.find({});
            io.emit('group_create', groups);
        } catch (err) {
            console.error(err.message);
            socket.emit('error', err.message);
        }
    });

    socket.on('group_get', async (groupId) => {
        // Retrieve all users
        let group = await GroupModel.findOne({ _id: groupId });

        if (!group) {
            console.log(`No group found with id: ${groupId}`);
            socket.emit('error', 'No group found with that id.');
            return;
        }

        socket.emit('group_get', group);
    });

    // Joins a specific group
    socket.on('group_join', async (info) => {
        const { userId, groupId } = info;

        // Retrieve all users
        let group = await GroupModel.findOne({ _id: groupId });

        if (!group) {
            console.log(`No group found with id: ${groupId}`);
            socket.emit('error', 'No group found with that id.');
            return;
        }

        // check if username already exists
        let user = await UserModel.findOne({ _id: userId });

        if (!user) {
            socket.emit('error', 'Not logged into an account.');
            return;
        }

        if (
            user.joinedGroups.find(
                (joinedgroup) => joinedgroup.toString() === group._id.toString()
            )
        ) {
            console.log(
                `User (${user.username}) has already joined group (${group.name}).`
            );
            socket.emit('error', 'User joined group already.');
            return;
        }

        // Update the users joined groups
        user.joinedGroups.push(group);
        await user.save();

        // Update the groups users
        group.users.push(user);
        await group.save();

        console.log(
            `User (${user.username}) has joined group (${group.name}).`
        );
        socket.emit('group_join', user.joinedGroups);
    });

    // Leaves a specific group
    socket.on('group_leave', async (info) => {
        console.log('group_leave');
        const { userId, groupId } = info;
        // Retrieve all users
        let group = await GroupModel.findOne({ _id: groupId });

        if (!group) {
            console.log(`No group found with id: ${groupId}`);
            socket.emit('error', 'No group found with that id.');
            return;
        }

        // check if username already exists
        let user = await UserModel.findOne({ _id: userId });
        if (!user) {
            socket.emit('error', 'User account does not exist.');
            return;
        }

        if (
            !user.joinedGroups.find(
                (joinedgroup) => joinedgroup.toString() === group._id.toString()
            )
        ) {
            console.log(
                `User (${user.username}) has not joined group (${group.name}).`
            );
            socket.emit('error', 'User has not joined that group.');
            return;
        }

        console.log(user.joinedGroups);
        // Update the users joined groups
        user.joinedGroups = user.joinedGroups.filter((joinedgroupid) => {
            console.log(group.name, joinedgroupid, group._id);
            return joinedgroupid.toString() !== group._id.toString();
        });
        await user.save();

        // Update the groups users
        group.users = group.users.filter((groupuserid) => {
            // console.log(groupuserid, group._id);
            return groupuserid.toString() !== user._id.toString();
        });
        await group.save();

        // TODO: navigate away to group home screen instead of showing the chats

        console.log(`User (${user.username}) has left group (${group.name}).`);
        console.log(user.joinedGroups);
        socket.emit('group_leave', user.joinedGroups);
    });

    socket.on('group_delete', async ({ userId, groupId }) => {
        // Retrieve all users
        let group = await GroupModel.findOne({ _id: groupId });
        if (!group) {
            console.log(`No group found with id: ${groupId}`);
            socket.emit('error', 'No group found with that id.');
            return;
        }

        // check if username already exists
        let user = await UserModel.findOne({ _id: userId });
        if (!user) {
            socket.emit('error', 'User account does not exist.');
            return;
        }

        // check if username already exists
        if (user._id.toString() !== group.owner.toString()) {
            socket.emit('error', 'User is not owner.');
            return;
        }

        user.joinedGroups = user.joinedGroups.filter(
            (group) => group.toString() !== groupId
        );
        user.save();

        let deleted = await GroupModel.deleteOne({ _id: groupId });
        console.log(deleted);

        console.log(
            `User (${user.username}) has deleted group (${group.name}).`
        );
        socket.emit('group_delete', user.joinedGroups);
    });

    socket.on('group_message_add', async (arg) => {
        // Get the data from the request body
        let groupMessage = arg;

        try {
            // check if username already exists
            let group = await GroupModel.findOne({ _id: groupMessage.groupId });

            if (!group) {
                socket.emit('error', 'Group does not exist.');
                return;
            }

            // check if username already exists
            let user = await UserModel.findOne({ _id: groupMessage.userId });

            if (!user) {
                socket.emit('error', 'User account does not exist.');
                return;
            }

            groupMessage.avatar = user.avatar;
            groupMessage.created = new Date();

            group.messages.push(groupMessage);

            group.lastMessage = groupMessage.message;
            group.lastUpdated = new Date();

            await group.save();

            console.log(
                `Group message successfully logged --- ${groupMessage.username} : ${groupMessage.message}`
            );

            // Return the new user to the client
            io.emit('group_message_add', group.messages);
        } catch (err) {
            console.error(err.message);
            socket.emit('error', err.message);
        }
    });

    socket.on('group_messages', async (groupId) => {
        // Get the data from the request body
        try {
            // check if username already exists
            let group = await GroupModel.findOne({ _id: groupId });

            if (!group) {
                socket.emit('error', 'Group does not exist.');
                return;
            }

            // Return the new user to the client
            socket.emit('group_messages', group.messages);
        } catch (err) {
            console.error(err.message);
            socket.emit('error', err.message);
        }
    });

    socket.on('group_edit', async (arg) => {
        // Get the data from the request body
        let { userId, groupId, newName, newUrl, newDescription } = arg;

        try {
            let group = await GroupModel.findOne({ name: newName });
            if (group) {
                console.error('Group with that name already exists.');
                socket.emit('error', 'Group with that name already exists.');
                return;
            }

            group = await GroupModel.findOne({ _id: groupId });
            if (!group) {
                console.error('Group does not exist.');
                socket.emit('error', 'Group does not exist.');
                return;
            }

            let user = await UserModel.findOne({ _id: userId });
            if (!user) {
                console.error('User account does not exist.');
                socket.emit('error', 'User account does not exist.');
                return;
            }

            if (newName) {
                group.name = newName;
            }
            if (newUrl) {
                group.avatar = newUrl;
            }
            if (newDescription) {
                group.description = newDescription;
            }
            await group.save();

            console.log(`Group name successfully updated --- ${group.name}`);

            let groups = await GroupModel.find({});

            if (!groups) {
                socket.emit('error', 'Could not get groups.');
                return;
            }

            // Return the new name to the client
            io.emit('group_edit', groups);
        } catch (err) {
            console.error(err.message);
            socket.emit('error', err.message);
        }
    });

    socket.on('client_user_login', async (arg) => {
        const { email, password } = arg;

        try {
            // check if user already exists and return error if they do
            let user = await UserModel.findOne({ email });
            if (!user) {
                console.log(`No account exists with that email (${email}).`);
                socket.emit('error', 'No account exists with that email.');
                return;
            }

            // compare encrypted password with plain text password and return error if they don't
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('Invalid password.');
                socket.emit('error', 'Invalid password.');
                return;
            }

            console.log(`User (${user.username}) successfully logged in.`);
            io.emit('server_user_login', user);
        } catch (err) {
            // print and return caught error
            console.error(err.message);
            socket.emit('error', err.message);
        }
    });

    socket.on('user_get', async (userId) => {
        try {
            let user = await UserModel.findOne({ _id: userId });

            if (!user) {
                console.log(`User account does not exist.`);
                socket.emit('error', `User account does not exist.`);
                return;
            }

            socket.emit('user_get', user);
        } catch (err) {
            console.error(err.message);
            socket.emit('error', err.message);
        }
    });

    socket.on('user_register', async (arg) => {
        // Get the data from the request body
        const { username, email, password } = arg;

        try {
            // check if user email already exists
            let user = await UserModel.findOne({ email });

            if (user) {
                console.log(
                    `User account with that email (${email}) already exists.`
                );
                socket.emit(
                    'error',
                    'User account with that email already exists.'
                );
                return;
            }

            // check if username already exists
            user = await UserModel.findOne({ username });

            if (user) {
                console.log(`Username (${username}) already exists.`);
                socket.emit('error', 'Username already exists.');
                return;
            }

            // get gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm',
            });

            // create user object
            user = new UserModel({
                username,
                email,
                password,
                avatar,
            });

            // encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            // insert the user object into the database
            await user.save();
            console.log(`User (${user.username}) successfully created.`);
            socket.emit('user_register', user);
        } catch (err) {
            console.error(err.message);
            socket.emit('error', err.message);
        }
    });
});

try {
    // Connect to the database
    mongoose
        .connect(
            'mongodb+srv://user:coding123@cluster0.u1pwu83.mongodb.net/webchat?retryWrites=true&w=majority'
        )
        .then((res) => {
            console.log('Established a connection to the MongoDB database');
        })
        .catch((err) => {
            console.log('Failed to connect to MongoDB database');
        });
} catch (e) {
    console.log(e);
}

// NOT IN USE
app.get('/users/get', (req, res) => {
    // Retrieve all users
    UserModel.find({} /* Empty object to find all rows */).then(
        (err, result) => {
            // Send the results back to the client
            if (err) res.json(err);
            else res.json(result);
            // could be used to show all users? what about active users? maybe even friends?
        }
    );
});

app.post('/users/login', async (req, res) => {
    // Get the data from the request body
    const { email, password } = req.body;

    console.log(email, password);

    try {
        // check if user already exists and return error if they do
        let user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                errors: [{ msg: 'Invalid credentials' }],
            });
        }

        console.log(user);

        // compare encrypted password with plain text password and return error if they don't
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                errors: [{ msg: 'Invalid credentials' }],
            });
        }

        res.json(user);
    } catch (err) {
        // print and return caught error
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/users/create', async (req, res) => {
    // Get the data from the request body
    const { username, email, password } = req.body;

    try {
        // check if user email already exists
        let user = await UserModel.findOne({ email });

        if (user) {
            return res.status(400).json({
                errors: [
                    { msg: 'User account with that email already exists.' },
                ],
            });
        }

        // check if username already exists
        user = await UserModel.findOne({ username });

        if (user) {
            return res.status(400).json({
                errors: [{ msg: 'Username already exists.' }],
            });
        }

        // get gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm',
        });

        // create user object
        user = new UserModel({
            username,
            email,
            password,
            avatar,
        });

        // encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // insert the user object into the database
        await user.save();
        console.log(`Created a new user: ${user}`);

        // Return the new user to the client
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/messages/get', (req, res) => {
    // Retrieve all users
    MessageModel.find({} /* Empty object to find all rows */).then(
        (err, result) => {
            // Send the results back to the client
            if (err) res.json(err);
            else res.json(result);
            // could be used to show all users? what about active users? maybe even friends?
        }
    );
});

app.post('/messages/create', async (req, res) => {
    // Get the data from the request body
    let message = req.body;

    try {
        // check if username already exists
        let user = await UserModel.findOne({ _id: message.userId });

        if (!user) {
            return res.status(400).json({
                errors: [{ msg: 'User account does not exist.' }],
            });
        }

        message.avatar = user.avatar;

        console.log(message);

        // Create a new user object from the user model
        const newMessage = new MessageModel(message);

        // // Save the user to the database
        await newMessage.save();
        console.log(message);

        // Return the new user to the client
        res.json(message);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/groups/create', async (req, res) => {
    try {
        // check if username already exists
        let group = await GroupModel.findOne({ name: req.body.name });

        if (group) {
            return res.status(400).json({
                errors: [{ msg: 'Group with that name already exists.' }],
            });
        }

        // Create a new user object from the user model
        group = new GroupModel({ ...req.body });

        // // Save the user to the database
        await group.save();

        // Return the new user to the client
        res.json(group);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/groups/messages/create', async (req, res) => {
    // Get the data from the request body
    let groupMessage = req.body;

    try {
        // check if username already exists
        let group = await GroupModel.findOne({ _id: groupMessage.groupId });

        if (!group) {
            return res.status(400).json({
                errors: [{ msg: 'Group does not exist.' }],
            });
        }

        // check if username already exists
        let user = await UserModel.findOne({ _id: groupMessage.userId });

        if (!user) {
            return res.status(400).json({
                errors: [{ msg: 'User account does not exist.' }],
            });
        }

        groupMessage.avatar = user.avatar;
        groupMessage.created = new Date();

        group.messages.push(groupMessage);

        // group.messages = { ...group.messages, groupMessage };
        group.lastMessage = groupMessage.message;
        group.lastUpdated = new Date();

        // Create a new user object from the user model
        const newGroupMessage = new GroupModel(group);

        // // Save the user to the database
        await newGroupMessage.save();

        // Return the new user to the client
        res.json(groupMessage);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
