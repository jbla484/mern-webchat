import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import socket from '../../socket/socket';
import { useParams, useNavigate } from 'react-router-dom';

function GroupInfo({ user, setUser }) {
    let navigate = useNavigate();
    const { id } = useParams();

    const [group, setGroup] = useState({});
    const [groupOwner, setGroupOwner] = useState({});
    const [error, setError] = useState('');

    async function onGroupGet(group) {
        setGroup(group);
        socket.emit('user_get', group.owner);
    }

    function onError(error) {
        setError(error);
    }

    function onGroupDelete(joinedGroups) {
        setUser((user) => ({
            ...user,
            joinedGroups,
        }));
        navigate('/groups');
    }

    function onUserGet(user) {
        setGroupOwner(user);
    }

    useEffect(() => {
        socket.on('group_get', onGroupGet);
        socket.on('user_get', onUserGet);
        socket.on('group_delete', onGroupDelete);
        socket.emit('group_get', id);

        socket.on('error', onError);

        return function cleanup() {
            socket.removeListener('group_get');
            socket.removeListener('group_join');
            socket.removeListener('user_get');
            socket.removeListener('error');
        };
    }, []);

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return (
        <header id='App-header'>
            <div className='joinContainer'>
                <img
                    src={group.avatar}
                    height={'100px'}
                    width={'100px'}
                    alt='group'
                    style={{ borderRadius: '20px' }}
                ></img>
                <h1>{group.name}</h1>
                <div
                    style={{ marginBottom: '20px' }}
                    className='width802'
                >
                    {group.description}
                </div>
                <div
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
                </div>
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
                    onClick={(e) => {
                        const obj = {
                            userId: user._id,
                            groupId: id,
                        };
                        socket.emit('group_delete', obj);
                    }}
                    style={{ marginTop: '15px' }}
                >
                    Delete Group
                </Link>
            </div>
        </header>
    );
}

export default GroupInfo;
