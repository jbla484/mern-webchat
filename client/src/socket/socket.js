import { io } from 'socket.io-client';
const socket = io(`mern-webchat.onrender.com`, {
    transports: ['websocket'],
});
export default socket;
