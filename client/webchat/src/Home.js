import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import Register from './Register';
import Login from './Login';
import GroupAdd from './GroupAdd';

import socket from './socket/socket';

function Home() {
    const [userInfo, setUserInfo] = useState({
        userId: '',
        loggedIn: false,
        username: '',
        currentPage: 'dashboard',
        selectedGroupId: '',
        selectedSubGroup: '',
        columnSizes: ['15%', '0%', '85%'],
        fullScreen: false,
        groupSettingsVisible: false,
    });

    const [serverInfo, setServerInfo] = useState({
        listOfUsers: [],
        listOfMessages: [],
        listOfJoinedGroups: [],
        listOfOpenGroups: [],
    });

    const messagesEndRef = useRef(null);

    function onConnect() {
        console.log('Websocket connection established');
        socket.emit('connection', 'username');
        socket.emit('groups_get', '');
    }

    function onDisconnect() {
        console.log('Disconnected from websockets');
        socket.emit('disconnection', 'username');
    }

    function onGroupMessage(messages) {
        console.log(messages);
        setServerInfo((serverInfo) => ({
            ...serverInfo,
            listOfMessages: messages,
        }));
    }

    function onGroupCreate(groups) {
        setServerInfo((serverInfo) => ({
            ...serverInfo,
            listOfOpenGroups: groups,
        }));
    }

    function onError(arg) {
        console.error(arg);
    }

    function onUserLogin(arg) {
        console.log('onUserLogin');
        setUserInfo((userInfo) => ({
            ...userInfo,
            userId: arg._id,
            username: arg.username,
            currentPage: 'dashboard',
            loggedIn: true,
        }));
        setServerInfo((serverInfo) => ({
            ...serverInfo,
            listOfJoinedGroups: arg.joinedGroups,
        }));
    }

    function onUserRegister(arg) {
        console.log(`Created user: ${arg.username}, ${arg._id}`);
        setUserInfo((userInfo) => ({
            ...userInfo,
            currentPage: 'login',
        }));
    }

    function onGroupGet(arg) {
        setServerInfo((serverInfo) => ({
            ...serverInfo,
            listOfOpenGroups: arg,
        }));
    }

    function onGroupJoin(arg) {
        console.log(arg);
        setServerInfo((serverInfo) => ({
            ...serverInfo,
            listOfJoinedGroups: arg,
        }));
    }

    function onGroupMessagesGet(arg) {
        console.log(arg);
        setServerInfo((serverInfo) => ({
            ...serverInfo,
            listOfMessages: arg,
        }));
    }

    useEffect(() => {
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('group_message_add', onGroupMessage);
        socket.on('group_create', onGroupCreate);
        socket.on('groups_get', onGroupGet);
        socket.on('error', onError);
        socket.on('server_user_login', onUserLogin);
        socket.on('user_register', onUserRegister);
        socket.on('group_join', onGroupJoin);
        socket.on('group_leave', onGroupJoin);
        socket.on('group_messages_get', onGroupMessagesGet);

        return function cleanup() {
            socket.removeListener('connect');
            socket.removeListener('disconnect');
            socket.removeListener('group_message_add');
            socket.removeListener('group_create');
            socket.removeListener('groups_get');
            socket.removeListener('error');
            socket.removeListener('server_user_login');
            socket.removeListener('user_register');
            socket.removeListener('group_join');
            socket.removeListener('group_leave');
            socket.removeListener('group_messages_get');
        };
    }, []);

    // const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // };

    // useEffect(() => {
    //     scrollToBottom();
    // }, [serverInfo.listOfMessages]);

    const [formData, setFormData] = useState({
        attatchment: '',
        message: '',
    });

    function switchToFullScreen(e) {
        if (userInfo.fullScreen) userInfo.fullScreen = false;
        else userInfo.fullScreen = true;
        // todo: needs work
        setUserInfo((userInfo) => ({
            ...userInfo,
            columnSizes: ['15%', '0%', '85%'],
            fullScreen: userInfo.fullScreen,
        }));
    }

    async function onSubmit(e) {
        e.preventDefault();

        const message = {
            username: userInfo.username,
            message: formData.message,
            userId: userInfo.userId,
            groupId: userInfo.selectedGroupId,
        };

        socket.emit('group_message_add', message);
    }

    async function onJoinGroup(e) {
        e.preventDefault();
        if (!userInfo.userId) console.error('Please login!'); //

        const info = {
            userId: userInfo.userId,
            groupId: userInfo.selectedGroupId,
        };

        socket.emit('group_join', info);
    }

    async function onLeaveGroup(e) {
        e.preventDefault();
        if (!userInfo.userId) console.error('Please login!'); //

        const info = {
            userId: userInfo.userId,
            groupId: userInfo.selectedGroupId,
        };

        socket.emit('group_leave', info);
    }

    async function setGroupSettings(e) {
        e.preventDefault();
        let value = !userInfo.groupSettingsVisible;

        setUserInfo((userInfo) => ({
            ...userInfo,
            groupSettingsVisible: value,
        }));

        console.log(userInfo);
    }

    function dateReadable(date) {
        return (
            ('00' + date.getHours()).slice(-2) +
            ':' +
            ('00' + date.getMinutes()).slice(-2)
        );
    }

    function setActive(targetElement) {
        for (const child of targetElement.parentElement.children) {
            child.classList.remove('active');
        }
        targetElement.classList.add('active');
    }

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

    return (
        <div className='testing'>
            <div
                className='column1'
                style={{ flex: `0 0 ${userInfo.columnSizes[0]}` }}
            >
                <div
                    className='columnItems companyLogo'
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                    <i
                        className='fa-solid fa-comments'
                        style={{ paddingRight: '5px' }}
                    ></i>{' '}
                    WebChat
                </div>
                <div
                    className='columnItems hover2 active'
                    onClick={(e) => {
                        setActive(e.currentTarget);
                        setUserInfo((userInfo) => ({
                            ...userInfo,
                            currentPage: 'dashboard',
                            columnSizes: [userInfo.columnSizes[0], '0%', '85%'],
                        }));
                    }}
                >
                    <i
                        className='fa-solid fa-house'
                        style={{ paddingRight: '10px' }}
                    ></i>
                    <h4 style={{ display: 'inline-block' }}>Dashboard</h4>
                </div>

                <div
                    className='columnItems hover2'
                    onClick={(e) => {
                        setActive(e.currentTarget);
                        setUserInfo((userInfo) => ({
                            ...userInfo,
                            currentPage: 'messages',
                            columnSizes: [userInfo.columnSizes[0], '0%', '85%'],
                        }));
                    }}
                >
                    <i
                        className='fa-solid fa-inbox'
                        style={{ paddingRight: '10px' }}
                    ></i>
                    <h4 style={{ display: 'inline-block' }}>Messages</h4>
                </div>

                <div
                    className='columnItems hover2'
                    onClick={(e) => {
                        if (userInfo.currentPage !== 'groups') {
                            setActive(e.currentTarget);
                            setUserInfo((userInfo) => ({
                                ...userInfo,
                                currentPage: 'groups',
                                selectedGroupId: '',
                                columnSizes: [
                                    userInfo.columnSizes[0],
                                    '24%',
                                    '61%',
                                ],
                            }));
                        }
                    }}
                >
                    <i
                        className='fa-solid fa-user-group'
                        style={{ paddingRight: '10px' }}
                    ></i>
                    <h4 style={{ display: 'inline-block' }}>Groups</h4>
                </div>

                <div
                    className='columnItems hover2'
                    onClick={(e) => {
                        setActive(e.currentTarget);
                        setUserInfo((userInfo) => ({
                            ...userInfo,
                            currentPage: 'friends',
                            columnSizes: [userInfo.columnSizes[0], '0%', '85%'],
                        }));
                    }}
                >
                    <i
                        className='fa-regular fa-face-smile'
                        style={{ paddingRight: '10px' }}
                    ></i>
                    <h4 style={{ display: 'inline-block' }}>Friends</h4>
                </div>

                <div
                    className='columnItems hover2'
                    onClick={(e) => {
                        setActive(e.currentTarget);
                        setUserInfo((userInfo) => ({
                            ...userInfo,
                            currentPage: 'calander',
                            columnSizes: [userInfo.columnSizes[0], '0%', '85%'],
                        }));
                    }}
                >
                    <i
                        className='fa-regular fa-calendar'
                        style={{ paddingRight: '10px' }}
                    ></i>
                    <h4 style={{ display: 'inline-block' }}>Calender</h4>
                </div>

                <div
                    className='columnItems hover2'
                    onClick={(e) => {
                        setActive(e.currentTarget);
                        setUserInfo((userInfo) => ({
                            ...userInfo,
                            currentPage: 'logout',
                            columnSizes: [userInfo.columnSizes[0], '0%', '85%'],
                        }));
                    }}
                    style={{ marginTop: 'auto' }}
                >
                    <i
                        className='fa-solid fa-door-open'
                        style={{ paddingRight: '10px' }}
                    ></i>
                    <span>
                        <h4 style={{ display: 'inline-block' }}>Log Out</h4>
                    </span>
                </div>
            </div>
            <div
                className='column2'
                style={{ flex: `0 0 ${userInfo.columnSizes[1]}` }}
            >
                {(userInfo.currentPage === 'groups' ||
                    userInfo.currentPage === 'group_add') &&
                    !userInfo.fullScreen && (
                        <div className='columnItems2'>
                            <h1
                                className='item1'
                                style={{
                                    paddingLeft: '30px',
                                    margin: '0px',
                                }}
                            >
                                Groups
                            </h1>
                            <i
                                className='fa-solid fa-square-plus item2 hover'
                                style={{
                                    paddingRight: '20px',
                                    transform: 'translateY(8px)',
                                }}
                                onClick={(e) => {
                                    setUserInfo((userInfo) => ({
                                        ...userInfo,
                                        currentPage: 'group_add',
                                    }));
                                }}
                            ></i>
                        </div>
                    )}
                {userInfo.currentPage === 'messages' &&
                    [1].map((throwaway) => {
                        return (
                            <div className='columnItems2'>
                                <h1
                                    className='item1'
                                    style={{
                                        paddingLeft: '30px',
                                        margin: '0px',
                                    }}
                                >
                                    Messages
                                </h1>
                                <i
                                    className='fa-solid fa-square-plus item2 hover'
                                    style={{
                                        paddingRight: '20px',
                                        transform: 'translateY(8px)',
                                    }}
                                ></i>
                            </div>
                        );
                    })}
                <div className='messageUser'>
                    {(userInfo.currentPage === 'groups' ||
                        userInfo.currentPage === 'group_add') &&
                        !userInfo.fullScreen && (
                            <>
                                <input
                                    type='search'
                                    placeholder='Search groups'
                                    className='sendInput2'
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            message: e.target.value,
                                        })
                                    }
                                ></input>
                                {serverInfo.listOfJoinedGroups.length > 0 && (
                                    <div
                                        style={{
                                            paddingLeft: '20px',
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
                            </>
                        )}

                    {(userInfo.currentPage === 'groups' ||
                        userInfo.currentPage === 'group_add') &&
                        !userInfo.fullScreen &&
                        serverInfo.listOfOpenGroups.map((group) => {
                            return serverInfo.listOfJoinedGroups.map(
                                (joinedgroup) => {
                                    // due to how mongo db stores the object id, we need to add this here...
                                    if (
                                        joinedgroup?._id === group._id ||
                                        joinedgroup === group._id
                                    ) {
                                        return (
                                            <div
                                                className='groupContainer hover2'
                                                onClick={(e) => {
                                                    setActive(e.currentTarget);
                                                    setUserInfo((userInfo) => ({
                                                        ...userInfo,
                                                        selectedGroupId:
                                                            group._id,
                                                        selectedSubGroup:
                                                            'chat',
                                                        currentPage: 'groups',
                                                        groupSettingsVisible: false,
                                                    }));

                                                    socket.emit(
                                                        'group_messages_get',
                                                        group._id
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
                                                            alt='group'
                                                            style={{
                                                                borderRadius:
                                                                    '20px',
                                                            }}
                                                        ></img>
                                                    </div>
                                                    <div className='messageUser2name'>
                                                        <div
                                                            style={{
                                                                textAlign:
                                                                    'left',
                                                                marginLeft:
                                                                    '10px',
                                                            }}
                                                        >
                                                            <b>{group.name}</b>
                                                        </div>
                                                        <div
                                                            style={{
                                                                textAlign:
                                                                    'left',
                                                                marginLeft:
                                                                    '10px',
                                                                textOverflow:
                                                                    'ellipsis',
                                                            }}
                                                        >
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
                                    } else {
                                        return <></>;
                                    }
                                }
                            );
                        })}
                    {(userInfo.currentPage === 'groups' ||
                        userInfo.currentPage === 'group_add') &&
                        !userInfo.fullScreen && (
                            <>
                                <div
                                    style={{
                                        paddingLeft: '20px',
                                        color: 'gray',
                                    }}
                                >
                                    <i
                                        className='fa-solid fa-thumbtack'
                                        style={{ paddingRight: '10px' }}
                                    ></i>
                                    <span>
                                        <h4 style={{ display: 'inline-block' }}>
                                            Open Groups
                                        </h4>
                                    </span>
                                </div>
                            </>
                        )}

                    {(userInfo.currentPage === 'groups' ||
                        userInfo.currentPage === 'group_add') &&
                        !userInfo.fullScreen &&
                        serverInfo.listOfOpenGroups.map((group) => {
                            return (
                                <div
                                    className='groupContainer hover2'
                                    onClick={(e) => {
                                        console.log('open group clicked');

                                        setActive(e.currentTarget);
                                        setUserInfo((userInfo) => ({
                                            ...userInfo,
                                            selectedGroupId: group._id,
                                            selectedSubGroup: 'info', // if not within users joined groups else
                                            currentPage: 'groups',
                                            groupSettingsVisible: false,
                                        }));
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
                                                alt='group'
                                                style={{ borderRadius: '20px' }}
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
                                            <div
                                                style={{
                                                    textAlign: 'left',
                                                    marginLeft: '10px',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {group.lastMessage}
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
                        })}
                    {/* {page === 'messages' &&
                        props.messages.map((message) => {
                            return (
                                <div
                                    className='groupContainer hover2' // todo: fix active highlighting
                                    onClick={(e) => {
                                        setselectedGroupId(message._id);
                                        setActive(e.currentTarget);
                                    }}
                                >
                                    <div className='messageUser2'>
                                        <div
                                            className='userImage column3image'
                                            style={{ padding: '10px 0' }}
                                        >
                                            <img
                                                src={message.avatar}
                                                height={'40px'}
                                                width={'40px'}
                                                alt='group'
                                                style={{ borderRadius: '20px' }}
                                            ></img>
                                        </div>
                                        <div className='messageUser2name'>
                                            <div
                                                style={{
                                                    textAlign: 'left',
                                                    marginLeft: '10px',
                                                }}
                                            >
                                                <b>{message.name}</b>
                                            </div>
                                            <div
                                                style={{
                                                    textAlign: 'left',
                                                    marginLeft: '10px',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {message.lastMessage}
                                            </div>
                                        </div>
                                        <div className='messageUser2messageTime'>
                                            {tConvert(
                                                dateReadable(
                                                    new Date(
                                                        message.lastUpdated
                                                    )
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })} */}
                </div>
            </div>
            {userInfo.currentPage === 'dashboard' && (
                <div
                    className='column3dash'
                    style={{ flex: `0 0 ${userInfo.columnSizes[2]}` }}
                >
                    <div
                        style={{
                            fontFamily: "'Oswald', sans-serif",
                            textDecoration: 'none',
                            color: '#282c34',
                            fontSize: '80px',
                            marginBottom: '20px',
                        }}
                    >
                        <i
                            className='fa-solid fa-comments'
                            style={{ paddingRight: '5px' }}
                        ></i>{' '}
                        WebChat
                    </div>
                    <p>
                        Create a profile, join chat rooms, chat with others, and
                        climb the leaderboards with this unique chat
                        application.
                    </p>
                    <div style={{ marginTop: '40px' }}>
                        <Link
                            // to='/register'
                            className='landingRegisterLink'
                            onClick={(e) => {
                                setUserInfo((userInfo) => ({
                                    ...userInfo,
                                    currentPage: 'register',
                                }));
                            }}
                        >
                            Sign Up
                        </Link>
                        <Link
                            // to='/login'
                            className='landingLoginLink'
                            onClick={(e) => {
                                setUserInfo((userInfo) => ({
                                    ...userInfo,
                                    currentPage: 'login',
                                }));
                            }}
                        >
                            Login
                        </Link>
                    </div>
                </div>
            )}
            {userInfo.currentPage === 'register' && (
                <div
                    className='column3dash'
                    style={{ flex: `0 0 ${userInfo.columnSizes[2]}` }}
                >
                    <Register />
                </div>
            )}
            {userInfo.currentPage === 'login' && (
                <div
                    className='column3dash'
                    style={{ flex: `0 0 ${userInfo.columnSizes[2]}` }}
                >
                    <Login />
                </div>
            )}
            {userInfo.currentPage === 'groups' &&
                userInfo.selectedSubGroup === 'chat' &&
                // TODO NOW: group messages are coming in, but not being updated due to the list of open groups not being updated. need to grab the group messages when clicked on, store them in the list of messages, and iterate through there. we can remove this map here to clean up the ui
                serverInfo.listOfOpenGroups.map((group) => {
                    if (group._id === userInfo.selectedGroupId) {
                        return (
                            <div
                                className='column3'
                                style={{
                                    flex: `0 0 ${userInfo.columnSizes[2]}`,
                                }}
                                key={group._id}
                            >
                                <div className='messageGroup'>
                                    <div className='userImage column3image'>
                                        <img
                                            src={group.avatar}
                                            height={'40px'}
                                            width={'40px'}
                                            alt='group'
                                            style={{ borderRadius: '20px' }}
                                        ></img>
                                    </div>
                                    <div className='userName'>
                                        <b>{group.name}</b>
                                    </div>
                                    <div
                                        className='chatExpandButton'
                                        onClick={(e) => switchToFullScreen(e)}
                                    >
                                        <i className='fa-solid fa-expand hover'></i>
                                    </div>
                                    <div
                                        className='chatSettingsButton'
                                        onClick={(e) => setGroupSettings(e)}
                                    >
                                        <i className='fa-solid fa-gear hover'></i>
                                    </div>
                                </div>

                                <div className='messageBody'>
                                    {userInfo.groupSettingsVisible && (
                                        <div className='dialogWindow'>
                                            <div
                                                className='hover'
                                                style={{ padding: '10px' }}
                                                onClick={(e) =>
                                                    console.log(
                                                        'TODO: Edit group name'
                                                    )
                                                }
                                            >
                                                <i
                                                    className='fa-solid fa-signature'
                                                    style={{
                                                        paddingRight: '10px',
                                                    }}
                                                ></i>
                                                Edit group name
                                            </div>

                                            <div
                                                className='hover'
                                                style={{ padding: '10px' }}
                                                onClick={(e) =>
                                                    console.log(
                                                        'TODO: Edit group image'
                                                    )
                                                }
                                            >
                                                <i
                                                    className='fa-solid fa-image'
                                                    style={{
                                                        paddingRight: '10px',
                                                    }}
                                                ></i>
                                                Edit group image
                                            </div>

                                            <div
                                                className='hover'
                                                style={{ padding: '10px' }}
                                                onClick={(e) => onLeaveGroup(e)}
                                            >
                                                <i
                                                    className='fa-solid fa-door-open'
                                                    style={{
                                                        paddingRight: '10px',
                                                    }}
                                                ></i>
                                                Leave Group
                                            </div>

                                            <div
                                                className='hover'
                                                style={{ padding: '10px' }}
                                                onClick={(e) =>
                                                    console.log(
                                                        'TODO: Delete group clicked'
                                                    )
                                                }
                                            >
                                                <i
                                                    className='fa-solid fa-trash'
                                                    style={{
                                                        paddingRight: '10px',
                                                    }}
                                                ></i>
                                                Delete group
                                            </div>
                                        </div>
                                    )}
                                    {group.messages.map((message) => {
                                        console.log(message);
                                        return (
                                            <div>
                                                <div
                                                    className='incomingMessage'
                                                    key={message._id}
                                                >
                                                    <div
                                                        style={{
                                                            display:
                                                                'inline-block',
                                                        }}
                                                    >
                                                        <img
                                                            src={message.avatar}
                                                            height={'40px'}
                                                            width={'40px'}
                                                            alt='profile'
                                                            style={{
                                                                borderRadius:
                                                                    '20px',
                                                                marginRight:
                                                                    '10px',
                                                            }}
                                                        ></img>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display:
                                                                'inline-block',
                                                        }}
                                                    >
                                                        <h3
                                                            style={{
                                                                padding: '0px',
                                                                margin: '0',
                                                            }}
                                                        >
                                                            {message.username}
                                                        </h3>
                                                        <p
                                                            style={{
                                                                padding: '0px',
                                                                margin: '0',
                                                            }}
                                                        >
                                                            {message.message}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className='incomingMessageTime'>
                                                    <div>
                                                        {tConvert(
                                                            dateReadable(
                                                                new Date(
                                                                    message.created
                                                                )
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div
                                        className='scroll'
                                        ref={messagesEndRef}
                                    />
                                </div>

                                <form
                                    onSubmit={(e) => {
                                        onSubmit(e);
                                    }}
                                >
                                    <div className='messageInput'>
                                        <div className='emojiButton'>
                                            <i className='fa-regular fa-face-smile hover'></i>
                                        </div>
                                        <div className='attatchmentButton'>
                                            <i className='fa-solid fa-paperclip hover'></i>
                                        </div>
                                        <input
                                            type='text'
                                            placeholder='Type in your message'
                                            className='sendInput'
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    message: e.target.value,
                                                })
                                            }
                                        ></input>
                                        <div className='sendButton'>
                                            <i className='fa-regular fa-paper-plane hover'></i>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        );
                    } else {
                        return <></>;
                    }
                })}

            {userInfo.currentPage === 'groups' &&
                userInfo.selectedSubGroup === 'info' &&
                serverInfo.listOfOpenGroups.map((group) => {
                    if (group._id === userInfo.selectedGroupId) {
                        return (
                            <div
                                className='column3dash'
                                style={{
                                    flex: `0 0 ${userInfo.columnSizes[2]}`,
                                }}
                                key={group._id}
                            >
                                <div
                                    style={{
                                        fontFamily: "'Oswald', sans-serif",
                                        textDecoration: 'none',
                                        color: '#282c34',
                                        fontSize: '80px',
                                        marginBottom: '20px',
                                    }}
                                >
                                    <i
                                        className='fa-solid fa-user-group'
                                        style={{ paddingRight: '10px' }}
                                    ></i>{' '}
                                    {group.name}
                                </div>
                                <p
                                    style={{
                                        textAlign: 'center',
                                        width: '60%',
                                    }}
                                >
                                    {group.description}
                                </p>
                                <div style={{ marginTop: '40px' }}>
                                    <Link
                                        className='landingRegisterLink'
                                        onClick={(e) => {
                                            onJoinGroup(e);
                                        }}
                                    >
                                        Join Group
                                    </Link>
                                </div>
                            </div>
                        );
                    } else {
                        return <></>;
                    }
                })}

            {userInfo.currentPage === 'groups' &&
                userInfo.selectedGroupId === '' &&
                [1].map((throwaway) => {
                    return (
                        <div
                            className='column3dash'
                            style={{ flex: `0 0 ${userInfo.columnSizes[2]}` }}
                        >
                            <div
                                style={{
                                    fontFamily: "'Oswald', sans-serif",
                                    textDecoration: 'none',
                                    color: '#282c34',
                                    fontSize: '80px',
                                    marginBottom: '20px',
                                }}
                            >
                                <i
                                    className='fa-solid fa-comments'
                                    style={{ paddingRight: '5px' }}
                                ></i>{' '}
                                WebChat Groups
                            </div>
                            <p style={{ textAlign: 'center', width: '60%' }}>
                                WebChat has introduced a new feature called
                                WebChat Groups that gives users the ability to
                                create and join message groups, allowing them to
                                share attachments and messages with their closet
                                friends at once.
                            </p>
                            <div style={{ marginTop: '40px' }}>
                                <Link
                                    // to='/register'
                                    className='landingRegisterLink'
                                    onClick={(e) => {
                                        // setUserInfo((userInfo) => ({
                                        //     ...userInfo,
                                        //     currentPage: 'register',
                                        // }));
                                    }}
                                >
                                    Search Groups
                                </Link>
                            </div>
                        </div>
                    );
                })}
            {userInfo.currentPage === 'group_add' &&
                [1].map((throwaway) => {
                    return (
                        <div
                            className='column3dash'
                            style={{
                                flex: `0 0 ${userInfo.columnSizes[2]}`,
                            }}
                        >
                            <GroupAdd />
                        </div>
                    );
                })}
        </div>
    );
}

export default Home;
