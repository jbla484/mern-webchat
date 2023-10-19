import { io } from 'socket.io-client';
// var ip = require('ip').address();
const socket = io(`wss://mern-webchat.onrender.com:3001`);

export default socket;
