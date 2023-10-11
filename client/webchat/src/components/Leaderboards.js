import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import socket from '../socket/socket';
import { useParams, useNavigate } from 'react-router-dom';

function Leaderboards() {
    let navigate = useNavigate();
    const { id } = useParams();

    const [group, setGroup] = useState({});
    const [error, setError] = useState('');

    async function onGroupGet(group) {
        setGroup(group);
        socket.emit('user_get', group.owner);
    }

    useEffect(() => {
        socket.on('group_get', onGroupGet);
        socket.emit('group_get', id);

        return function cleanup() {
            socket.removeListener('group_get');
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
                <div
                    style={{ marginBottom: '20px' }}
                    className='width802'
                >
                    Leaderboards
                </div>
                <div
                    className='width802'
                    style={{ textAlign: 'left', width: '60%' }}
                >
                    <div>
                        {/* <b>Owner:</b> <span>{groupOwner.username}</span> */}
                    </div>
                    <div>
                        <b>User Count:</b> <span>{group.users?.length}</span>
                    </div>
                    <div>
                        <b>Created:</b>{' '}
                        <span>{new Date(group.created).toDateString()}</span>
                    </div>
                    <div>
                        <b>Ranking:</b> <span>{group.ranking}</span>
                    </div>
                </div>

                <Link
                    className='joinLink'
                    onClick={(e) => {
                        // const obj = {
                        //     userId: user._id,
                        //     groupId: id,
                        // };
                        // socket.emit('group_delete', obj);
                    }}
                    style={{ marginTop: '15px' }}
                >
                    Delete Group
                </Link>
            </div>
        </header>
    );
}

export default Leaderboards;
