import '../styles/App.css';
import Landing from './Landing';
import Login from './Login';
import Register from './Register';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Groups from './Groups';
import GroupAdd from './GroupAdd';
import GroupChat from './GroupChat';
import GroupJoin from './GroupJoin';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import socket from '../socket/socket';

function App() {
    const [user, setUser] = useState({});
    const [group, setGroup] = useState({});

    function onConnect() {
        console.log('Websocket connection established');
    }

    function onDisconnect() {
        console.log('Disconnected from websockets');
    }

    useEffect(() => {
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return function cleanup() {
            socket.removeListener('connect');
            socket.removeListener('disconnect');
        };
    }, []);

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route index element={<Landing />} />
                <Route
                    exact
                    path='/login'
                    element={<Login setUser={setUser} />}
                />
                <Route exact path='/register' element={<Register />} />
                <Route exact path='/dashboard' element={<Dashboard />} />
                <Route
                    exact
                    path='/groups'
                    element={<Groups setGroup={setGroup} />}
                />
                <Route exact path='/groups/add' element={<GroupAdd />} />
                <Route
                    exact
                    path='/groups/:id/chat'
                    element={<GroupChat user={user} />}
                />
                <Route
                    exact
                    path='/groups/:id/join'
                    element={<GroupJoin user={user} />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
