import { Link } from 'react-router-dom';

import socket from '../../socket/socket';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Groups({ user }) {
    let navigate = useNavigate();

    const [formData, setFormData] = useState({
        search: '',
    });

    const [groupInfo, setGroupInfo] = useState({
        listOfJoinedGroups: [],
        listOfOpenGroups: [],
    });

    function onGroupGet(groups) {
        setGroupInfo((groupInfo) => ({
            ...groupInfo,
            listOfOpenGroups: groups,
        }));
    }

    useEffect(() => {
        if (user.joinedGroups) {
            // update joined groups from user object
            setGroupInfo((groupInfo) => ({
                ...groupInfo,
                listOfJoinedGroups: user.joinedGroups,
            }));
        }

        socket.on('groups_get', onGroupGet);
        socket.emit('groups_get', '');

        return function cleanup() {
            socket.removeListener('groups_get');
        };
    }, []);

    function tConvert(time) {
        // Check correct time format and split into components
        time = time
            .toString()
            .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) {
            // If time format correct
            time = time.slice(1); // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }

    function dateReadable(date) {
        return (
            ('00' + date.getHours()).slice(-2) +
            ':' +
            ('00' + date.getMinutes()).slice(-2)
        );
    }

    return (
        <header id='App-header2'>
            <h1
                style={{
                    margin: '20px 0 0 0',
                }}
            >
                Groups
            </h1>
            <input
                type='search'
                placeholder='Search groups'
                className='sendInput2'
                onChange={(e) => {
                    setFormData({
                        ...formData,
                        search: e.target.value,
                    });
                }}
            ></input>
            {/* JOINED GROUPS */}
            {groupInfo.listOfJoinedGroups.length > 0 && (
                <div
                    style={{
                        color: 'gray',
                    }}
                >
                    <i
                        className='fa-solid fa-thumbtack'
                        style={{ paddingRight: '10px' }}
                    ></i>
                    <span>
                        <h4
                            style={{
                                display: 'inline-block',
                            }}
                        >
                            Joined Groups
                        </h4>
                    </span>
                </div>
            )}
            {groupInfo.listOfOpenGroups &&
                groupInfo.listOfOpenGroups.map((group) => {
                    return groupInfo.listOfJoinedGroups.map((joinedgroup) => {
                        // due to how mongo db stores the object id, we need to add this here...
                        if (
                            joinedgroup?._id === group._id ||
                            joinedgroup === group._id
                        ) {
                            if (formData.search) {
                                if (
                                    group.name
                                        .toLowerCase()
                                        .includes(formData.search.toLowerCase())
                                ) {
                                    return (
                                        <div
                                            className='groupContainer hover2'
                                            onClick={(e) => {
                                                navigate(
                                                    `/groups/${group._id}/chat`
                                                );
                                            }}
                                            key={group._id}
                                        >
                                            <div className='messageUser2'>
                                                <div
                                                    className='userImage column3image'
                                                    style={{
                                                        padding: '10px 0',
                                                    }}
                                                >
                                                    <img
                                                        src={group.avatar}
                                                        height={'40px'}
                                                        width={'40px'}
                                                        alt='img'
                                                        style={{
                                                            borderRadius:
                                                                '10px',
                                                        }}
                                                    ></img>
                                                </div>
                                                <div className='messageUser2name'>
                                                    <div
                                                        style={{
                                                            textAlign: 'left',
                                                            marginLeft: '10px',
                                                        }}
                                                    >
                                                        <b>{group.name}</b>
                                                    </div>
                                                    <div className='groupLastMessage'>
                                                        {group.lastMessage}
                                                    </div>
                                                </div>
                                                <div className='messageUser2messageTime'>
                                                    {tConvert(
                                                        dateReadable(
                                                            new Date(
                                                                group.lastUpdated
                                                            )
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            } else {
                                return (
                                    <div
                                        className='groupContainer hover2'
                                        onClick={(e) => {
                                            navigate(
                                                `/groups/${group._id}/chat`
                                            );
                                        }}
                                        key={group._id}
                                    >
                                        <div className='messageUser2'>
                                            <div
                                                className='userImage column3image'
                                                style={{
                                                    padding: '10px 0',
                                                }}
                                            >
                                                <img
                                                    src={group.avatar}
                                                    height={'40px'}
                                                    width={'40px'}
                                                    alt='img'
                                                    style={{
                                                        borderRadius: '10px',
                                                    }}
                                                ></img>
                                            </div>
                                            <div className='messageUser2name'>
                                                <div
                                                    style={{
                                                        textAlign: 'left',
                                                        marginLeft: '10px',
                                                    }}
                                                >
                                                    <b>{group.name}</b>
                                                </div>
                                                <div className='groupLastMessage'>
                                                    {group.lastMessage}
                                                </div>
                                            </div>
                                            <div className='messageUser2messageTime'>
                                                {tConvert(
                                                    dateReadable(
                                                        new Date(
                                                            group.lastUpdated
                                                        )
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        }
                    });
                })}
            {/* OPEN GROUPS */}
            <>
                <div
                    style={{
                        color: 'gray',
                    }}
                >
                    <i
                        className='fa-solid fa-thumbtack'
                        style={{ paddingRight: '10px' }}
                    ></i>
                    <span>
                        <h4 style={{ display: 'inline-block' }}>Open Groups</h4>
                    </span>
                </div>
            </>
            {groupInfo.listOfOpenGroups.map((group) => {
                if (formData.search) {
                    if (
                        group.name
                            .toLowerCase()
                            .includes(formData.search.toLowerCase())
                    ) {
                        return (
                            <div
                                className='groupContainer hover2'
                                onClick={(e) => {
                                    navigate(`/groups/${group._id}/join`);
                                }}
                                key={group._id}
                            >
                                <div className='messageUser2'>
                                    <div
                                        className='userImage column3image'
                                        style={{ padding: '10px 0' }}
                                    >
                                        <img
                                            src={group.avatar}
                                            height={'40px'}
                                            width={'40px'}
                                            alt='img'
                                            style={{ borderRadius: '10px' }}
                                        ></img>
                                    </div>
                                    <div className='messageUser2name'>
                                        <div
                                            style={{
                                                textAlign: 'left',
                                                marginLeft: '10px',
                                            }}
                                        >
                                            <b>{group.name}</b>
                                        </div>
                                        <div className='groupLastMessage'>
                                            {group.description}
                                        </div>
                                    </div>
                                    <div className='messageUser2messageTime'>
                                        {tConvert(
                                            dateReadable(
                                                new Date(group.lastUpdated)
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    }
                } else {
                    return (
                        <div
                            className='groupContainer hover2'
                            onClick={(e) => {
                                navigate(`/groups/${group._id}/join`);
                            }}
                            key={group._id}
                        >
                            <div className='messageUser2'>
                                <div
                                    className='userImage column3image'
                                    style={{ padding: '10px 0' }}
                                >
                                    <img
                                        src={group.avatar}
                                        height={'40px'}
                                        width={'40px'}
                                        alt='img'
                                        style={{ borderRadius: '10px' }}
                                    ></img>
                                </div>
                                <div className='messageUser2name'>
                                    <div
                                        style={{
                                            textAlign: 'left',
                                            marginLeft: '10px',
                                        }}
                                    >
                                        <b>{group.name}</b>
                                    </div>
                                    <div className='groupLastMessage'>
                                        {group.description}
                                    </div>
                                </div>
                                <div className='messageUser2messageTime'>
                                    {tConvert(
                                        dateReadable(
                                            new Date(group.lastUpdated)
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }
            })}{' '}
            <i
                className='fa-solid fa-square-plus item2 hover'
                style={{ position: 'fixed', right: '15px', bottom: '15px' }}
                onClick={(e) => {
                    navigate('/groups/add');
                }}
            ></i>
        </header>
    );
}

export default Groups;
