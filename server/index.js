// Importing our libraries we installed during setup
const express = require('express');
const mongoose = require('mongoose');

// Connect our API with the react frontend
const cors = require('cors');

// Represents all the express API methods
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: 'http://10.0.0.173:3000',
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

            if (arg.avatar === '') {
                // Create a new user object from the user model
                group = new GroupModel({ name: arg.name });
            } else {
                group = new GroupModel({ name: arg.name, avatar: arg.avatar });
            }

            // // Save the user to the database
            await group.save();

            // Return all groups to all clients
            let groups = await GroupModel.find({});
            io.emit('group_create', groups);
        } catch (err) {
            console.error(err.message);
            socket.emit('error', err.message);
        }
    });

    socket.on('group_get', async (info) => {
        const groupId = info;
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
            socket.emit('error', 'User account does not exist.');
            return;
        }

        if (
            user.joinedGroups.find(
                (joinedgroup) => joinedgroup.toString() === group._id.toString()
            )
        ) {
            socket.emit('error', 'User joined group already.');
            return;
        }

        // Update the users joined groups
        user.joinedGroups.push(group);
        await user.save();

        // Update the groups users
        group.users.push(user);
        await group.save();

        console.log(`User ${user.username} has joined group ${group.name}`);
        socket.emit('group_join', user.joinedGroups);
    });

    // Leaves a specific group
    socket.on('group_leave', async (info) => {
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

        console.log(`User ${user.username} has left group ${group.name}`);
        console.log(user.joinedGroups);
        socket.emit('group_leave', user.joinedGroups);
    });

    // TODO: work on group delete functionality
    socket.on('group_delete', async (info) => {
        // const { username, userId, groupId } = info;
        // // Retrieve all users
        // let group = await GroupModel.findOne({ _id: groupId });
        // if (!group) {
        //     console.log(`No group found with id: ${groupId}`);
        //     socket.emit('error', 'No group found with that id.');
        //     return;
        // }
        // // check if username already exists
        // let user = await UserModel.findOne({ _id: userId });
        // if (!user) {
        //     socket.emit('error', 'User account does not exist.');
        //     return;
        // }
        // if (
        //     user.joinedGroups.find(
        //         (joinedgroup) => joinedgroup.toString() === group._id.toString()
        //     )
        // ) {
        //     socket.emit('error', 'User joined group already.');
        //     return;
        // }
        // // Update the users joined groups
        // user.joinedGroups.push(group);
        // await user.save();
        // // Update the groups users
        // group.users.push(user);
        // await group.save();
        // socket.emit('group_join', user.joinedGroups);
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

    socket.on('group_messages_get', async (groupId) => {
        // Get the data from the request body
        try {
            // check if username already exists
            let group = await GroupModel.findOne({ _id: groupId });

            if (!group) {
                socket.emit('error', 'Group does not exist.');
                return;
            }

            // Return the new user to the client
            socket.emit('group_messages_get', group.messages);
        } catch (err) {
            console.error(err.message);
            socket.emit('error', err.message);
        }
    });

    socket.on('group_edit_name', async (arg) => {
        // Get the data from the request body
        let { userId, groupId, newName } = arg;

        // console.log(groupMessage);

        try {
            let group = await GroupModel.findOne({ name: newName });
            if (group) {
                socket.emit('error', 'Group with that name already exists.');
                return;
            }

            group = await GroupModel.findOne({ _id: groupId });
            if (!group) {
                socket.emit('error', 'Group does not exist.');
                return;
            }

            let user = await UserModel.findOne({ _id: userId });
            if (!user) {
                socket.emit('error', 'User account does not exist.');
                return;
            }

            group.name = newName;
            await group.save();

            console.log(`Group name successfully updated --- ${group.name}`);

            let groups = await GroupModel.find({});

            if (!groups) {
                socket.emit('error', 'Could not get groups.');
                return;
            }

            // Return the new name to the client
            io.emit('group_edit_name', groups);
        } catch (err) {
            console.error(err.message);
            socket.emit('error', err.message);
        }
    });

    socket.on('group_edit_image', async (arg) => {
        // Get the data from the request body
        let { userId, groupId, newUrl } = arg;

        try {
            // check if username already exists
            let group = await GroupModel.findOne({ _id: groupId });

            if (!group) {
                socket.emit('error', 'Group does not exist.');
                return;
            }

            // check if username already exists
            let user = await UserModel.findOne({ _id: userId });

            if (!user) {
                socket.emit('error', 'User account does not exist.');
                return;
            }

            group.avatar = newUrl;
            await group.save();

            console.log(
                `Group avatar successfully updated --- ${group.avatar}`
            );

            let groups = await GroupModel.find({});

            if (!groups) {
                socket.emit('error', 'Could not get groups.');
                return;
            }

            // Return the new name to the client
            io.emit('group_edit_image', groups);
        } catch (err) {
            console.error(err.message);
            socket.emit('error', err.message);
        }
    });

    socket.on('client_user_login', async (arg) => {
        console.log('client_user_login');
        const { email, password } = arg;

        try {
            // check if user already exists and return error if they do
            let user = await UserModel.findOne({ email });
            if (!user) {
                socket.emit('error', 'No account exists with that email.');
                return;
            }

            // compare encrypted password with plain text password and return error if they don't
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                socket.emit('error', 'Invalid password.');
                return;
            }
            console.log(`User successfully logged in: ${user.username}`);

            io.emit('server_user_login', user);
        } catch (err) {
            // print and return caught error
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
                socket.emit(
                    'error',
                    'User account with that email already exists.'
                );
                return;
            }

            // check if username already exists
            user = await UserModel.findOne({ username });

            if (user) {
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
            console.log(`Created a new user: ${user}`);

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
