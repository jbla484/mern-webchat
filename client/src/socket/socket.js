import { io } from 'socket.io-client';
// var ip = require('ip').address();
const socket = io(`https://jamesb-webchat.netlify.app/:3001`);

export default socket;
