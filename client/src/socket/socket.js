import { io } from 'socket.io-client';
const socket = io(`https://mern-webchat.onrender.com`, {
    autoConnect: false,
    transports: ['websocket'],
});
export default socket;
