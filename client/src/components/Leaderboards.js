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
                    margin: '20px 0',
                }}
            >
                Leaderboards
            </h1>
            {groups.map((group) => {
                return (
                    <div
                        className='userContainer'
                        key={group._id}
                        style={{ margin: '10px 0' }}
                        onClick={(e) => {
                            navigate(`/groups/${group._id}/info`);
                        }}
                    >
                        <img
                            src={group.avatar}
                            height={'50px'}
                            width={'50px'}
                            alt='group'
                            style={{
                                borderRadius: '15px',
                                marginRight: '15px',
                            }}
                        ></img>

                        <div className='width802' style={{ textAlign: 'left' }}>
                            <h4 style={{ margin: '0' }}>{group.name}</h4>
                            <div>
                                Rank: <span>{group.ranking}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </header>
    );
}

export default Leaderboards;
