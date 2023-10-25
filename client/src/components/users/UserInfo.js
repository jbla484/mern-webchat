import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import socket from '../../socket/socket';

export default function UserInfo() {
    let navigate = useNavigate();
    const { id } = useParams();

    const [user, setUser] = useState({});
    const [error, setError] = useState('');

    function onUserGet(user) {
        console.log(user);
        setUser(user);
    }

    function onError(error) {
        setError(error);
    }

    useEffect(() => {
        socket.on('user_get', onUserGet);
        socket.on('error', onError);

        socket.emit('user_get', id);

        return function cleanup() {
            socket.removeListener('user_get');
            socket.removeListener('error');
        };
    }, []);

    // function onError(error) {
    //     console.log(error);
    //     document.getElementById('errorMessage').innerHTML = error;
    //     document.getElementById('errorMessage').style.display = 'block';
    // }

    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    return (
        <header id='App-header'>
            <div className='registerContainer'>
                <img
                    src={user.avatar}
                    height={'100px'}
                    width={'100px'}
                    alt='group'
                    style={{ borderRadius: '20px' }}
                ></img>
                <h1>{user.username}</h1>
                <div style={{ marginBottom: '10px' }}>Email: {user.email}</div>
                <div style={{ marginBottom: '10px' }}>
                    Created:{' '}
                    {new Date(user.created).toLocaleDateString(
                        undefined,
                        options
                    )}
                </div>
                <div style={{ marginBottom: '30px' }}>Role: {user.ranking}</div>
                {/* <div style={{ marginBottom: '20px' }}>{user.joinedGroups}</div> */}
                {/* <div
                    className='width802'
                    style={{ textAlign: 'left', width: '100%' }}
                >
                    <div>
                        <b>Owner:</b> <span>{groupOwner.username}</span>
                    </div>
                    <div>
                        <b>User Count:</b> <span>{group.users?.length}</span>
                    </div>
                    <div>
                        <b>Created:</b>{' '}
                        <span>
                            {new Date(group.created).toLocaleDateString(
                                undefined,
                                options
                            )}
                        </span>
                    </div>
                    <div>
                        <b>Ranking:</b> <span>{group.ranking}</span>
                    </div>
                </div> */}
                {error && (
                    <div className='errorContainer'>
                        <p
                            id='errorMessage'
                            style={{ textAlign: 'center' }}
                        >
                            {error}
                        </p>
                    </div>
                )}

                <Link
                    className='joinLink'
                    to={`/users/${id}/edit`}
                >
                    Edit User
                </Link>
            </div>
        </header>
    );
}
