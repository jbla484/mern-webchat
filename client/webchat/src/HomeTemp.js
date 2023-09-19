import './App.css';
import Landing from './Landing';
import Login from './Login';
import Register from './Register';
import Navbar from './Navbar';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import socket from './socket/socket';

function HomeTemp() {
    function onConnect() {
        console.log('Websocket connection established');
    }

    function onDisconnect() {
        console.log('Disconnected from websockets');
    }

    function onUserLogin(arg) {
        console.log('onUserLogin');
        console.log(arg);

        // window.open('/dashboard');

        // setUserInfo((userInfo) => ({
        //     ...userInfo,
        //     userId: arg._id,
        //     username: arg.username,
        //     currentPage: 'dashboard',
        //     loggedIn: true,
        // }));
        // setServerInfo((serverInfo) => ({
        //     ...serverInfo,
        //     listOfJoinedGroups: arg.joinedGroups,
        // }));
    }

    function onUserRegister(arg) {
        console.log(`Created user: ${arg.username}, ${arg._id}`);
        window.open('/login');
        // setUserInfo((userInfo) => ({
        //     ...userInfo,
        //     currentPage: 'login',
        // }));
    }

    useEffect(() => {
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        // user actions
        socket.on('user_register', onUserRegister);
        socket.on('server_user_login', onUserLogin);

        return function cleanup() {
            socket.removeListener('connect');
            socket.removeListener('disconnect');

            // user actions
            socket.removeListener('server_user_login');
            socket.removeListener('user_register');
        };
    }, []);

    return (
        <BrowserRouter>
            <Navbar />
            <header className='App-header'>
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <Routes>
                        <Route index element={<Landing />} />
                        <Route exact path='/login' element={<Login />} />
                        <Route exact path='/register' element={<Register />} />
                        {/* <Route exact path='/dashboard' element={<Register />} /> */}
                    </Routes>
                </div>
            </header>
        </BrowserRouter>
    );
}

export default HomeTemp;
