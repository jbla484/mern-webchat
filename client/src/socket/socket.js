import { io } from 'socket.io-client';
// var ip = require('ip').address();
const socket = io(`https://mern-webchat.onrender.com:3001`);

export default socket;
