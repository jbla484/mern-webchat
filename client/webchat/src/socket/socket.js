import { io } from 'socket.io-client';
// var ip = require('ip').address();
const socket = io(`http://10.0.0.45:3001`);

export default socket;
