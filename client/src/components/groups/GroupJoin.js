import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import socket from '../../socket/socket';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// TODO: need user for joining a group
export default function GroupJoin({ user, setUser }) {
    let navigate = useNavigate();
    const { id } = useParams();
    const [group, setGroup] = useState({});
    const [error, setError] = useState('');

    async function onGroupGet(group) {
        setGroup(group);
    }

    function onError(error) {
        setError(error);
    }

    function onGroupJoin(joinedGroups) {
        setUser((user) => ({
            ...user,
            joinedGroups,
        }));
        navigate(`/groups`);
    }

    useEffect(() => {
        socket.on('group_get', onGroupGet);
        socket.on('group_join', onGroupJoin);
        socket.emit('group_get', id);

        socket.on('error', onError);

        return function cleanup() {
            socket.removeListener('group_get');
            socket.removeListener('group_join');
        };
    }, []);

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
                <div className='width80'>{group.description}</div>
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
                    // to='/groups'
                    className='joinLink'
                    // TODO: handle join group
                    onClick={(e) => {
                        const info = {
                            userId: user._id,
                            groupId: id,
                        };

                        socket.emit('group_join', info);
                    }}
                    style={{ marginTop: '30px' }}
                >
                    Join Group
                </Link>
            </div>
        </header>
    );
}
