import './styles/App.css';
import Landing from './components/Landing';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Leaderboards from './components/Leaderboards';

// Auth components
import Login from './components/accounts/Login';
import Register from './components/accounts/Register';

// Group components
import Groups from './components/groups/Groups';
import GroupAdd from './components/groups/GroupAdd';
import GroupChat from './components/groups/GroupChat';
import GroupJoin from './components/groups/GroupJoin';
import GroupInfo from './components/groups/GroupInfo';
import GroupEdit from './components/groups/GroupEdit';

// User components
import UserInfo from './components/users/UserInfo';
import UserEdit from './components/users/UserEdit';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import socket from './socket/socket';

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
            <Navbar user={user} />
            <Routes>
                <Route
                    index
                    element={<Landing />}
                />
                <Route
                    exact
                    path='/login'
                    element={<Login setUser={setUser} />}
                />
                <Route
                    exact
                    path='/register'
                    element={<Register />}
                />
                <Route
                    exact
                    path='/leaderboards'
                    element={<Leaderboards />}
                />
                <Route
                    exact
                    path='/dashboard'
                    element={<Dashboard />}
                />
                <Route
                    exact
                    path='/groups'
                    element={
                        <Groups
                            user={user}
                            setGroup={setGroup}
                        />
                    }
                />
                <Route
                    exact
                    path='/groups/add'
                    element={<GroupAdd user={user} />}
                />
                <Route
                    exact
                    path='/groups/:id/info'
                    element={
                        <GroupInfo
                            setUser={setUser}
                            user={user}
                        />
                    }
                />
                <Route
                    exact
                    path='/groups/:id/chat'
                    element={
                        <GroupChat
                            setUser={setUser}
                            user={user}
                        />
                    }
                />
                <Route
                    exact
                    path='/groups/:id/edit'
                    element={
                        <GroupEdit
                            setUser={setUser}
                            user={user}
                        />
                    }
                />
                <Route
                    exact
                    path='/groups/:id/join'
                    element={
                        <GroupJoin
                            setUser={setUser}
                            user={user}
                        />
                    }
                />
                <Route
                    exact
                    path='/users/:id/info'
                    element={<UserInfo />}
                />
                <Route
                    exact
                    path='/users/:id/edit'
                    element={<UserEdit />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
