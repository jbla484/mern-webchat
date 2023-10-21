import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import socket from '../socket/socket';
import { useParams, useNavigate } from 'react-router-dom';

function Leaderboards() {
    let navigate = useNavigate();

    const [groups, setGroups] = useState([]);

    async function onGroupsGet(groups) {
        let sortedGroups = groups.sort(function (first, second) {
            return first.ranking > second.ranking ? 1 : -1;
        });
        setGroups(sortedGroups);
    }

    useEffect(() => {
        socket.on('groups_get', onGroupsGet);
        socket.emit('groups_get');

        return function cleanup() {
            socket.removeListener('groups_get');
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
            <h1
                style={{
                    margin: '20px 0 0 0',
                }}
            >
                Leaderboards
            </h1>
            {groups.map((group) => {
                return (
                    <div
                        className='joinContainer'
                        key={group._id}
                        style={{ margin: '40px 0 20px 0' }}
                    >
                        <img
                            src={group.avatar}
                            height={'100px'}
                            width={'100px'}
                            alt='group'
                            style={{ borderRadius: '20px' }}
                        ></img>
                        <h2>{group.name}</h2>
                        <div
                            className='width802'
                            style={{ textAlign: 'left', width: '100%' }}
                        >
                            <div>
                                <b>User Count:</b>{' '}
                                <span>{group.users?.length}</span>
                            </div>
                            <div>
                                <b>Message Count:</b>{' '}
                                <span>{group.messages?.length}</span>
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
                    </div>
                );
            })}
        </header>
    );
}

export default Leaderboards;
