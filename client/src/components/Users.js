import { useState, useEffect } from 'react';

import socket from '../socket/socket';
import { useNavigate } from 'react-router-dom';

export default function Users() {
    let navigate = useNavigate();

    const [users, setUsers] = useState([]);

    async function onUsersGet(users) {
        console.log(users);
        setUsers(users);
    }

    useEffect(() => {
        socket.on('users_get', onUsersGet);
        socket.emit('users_get');

        return function cleanup() {
            socket.removeListener('users_get');
        };
    }, []);

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return (
        <header id='App-header2'>
            <h1
                style={{
                    margin: '20px 0',
                }}
            >
                Users
            </h1>
            {users.map((user) => {
                return (
                    <div
                        className='userContainer'
                        key={user._id}
                        style={{ margin: '10px 0' }}
                    >
                        <img
                            src={user.avatar}
                            height={'50px'}
                            width={'50px'}
                            alt='group'
                            style={{
                                borderRadius: '15px',
                                marginRight: '15px',
                            }}
                        ></img>
                        <div
                            className='width802'
                            style={{
                                textAlign: 'left',
                            }}
                        >
                            <h4 style={{ margin: '0' }}>{user.username}</h4>
                            <div>{user.role}</div>
                        </div>
                    </div>
                );
            })}
        </header>
    );
}
