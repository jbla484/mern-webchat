import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import socket from '../../socket/socket';
import EmojiPicker from 'emoji-picker-react';

import GroupChatMessage from './GroupChatMessage';

function GroupChat({ user, setUser }) {
    let navigate = useNavigate();
    const { id } = useParams();
    const messagesEndRef = useRef(null);
    const [message, setMessage] = useState('');

    const userInfoModal = useRef(null);

    const [groupInfo, setGroupInfo] = useState({
        group: {},
        groupMessages: [],
    });

    const [userInfo, setUserInfo] = useState({
        visible: false,
        clickedX: 0,
        clickedY: 0,
    });

    const [clickPos, setClickPos] = useState({
        clickedX: 0,
        clickedY: 0,
    });

    const [settingsVisible, setSettingsVisible] = useState(false);
    const [emojiVisible, setEmojiVisible] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    };

    function dateReadable(date) {
        return (
            ('00' + date.getHours()).slice(-2) +
            ':' +
            ('00' + date.getMinutes()).slice(-2)
        );
    }

    async function onLeaveGroup(e) {
        e.preventDefault();
        if (!user._id) console.error('Please login!'); //

        const info = {
            userId: user._id,
            groupId: id,
        };

        socket.emit('group_leave', info);
    }

    function onEmojiClick(emojiData, event) {
        setMessage(
            (message) =>
                message +
                (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
        );
        // console.log(event);
        document.getElementById('sendInput').focus();
        document.getElementById('sendInput').setSelectionRange(-1, -1);
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

    function addNewMessage() {
        if (message === '') {
            return;
        }

        const newMessage = {
            username: user.username,
            message,
            userId: user._id,
            groupId: id,
        };

        socket.emit('group_message_add', newMessage);
        setMessage('');
    }

    function onGroupGet(group) {
        setGroupInfo((groupInfo) => ({
            ...groupInfo,
            group,
            groupMessages: group.messages,
        }));
    }

    function onGroupMessages(messages) {
        setGroupInfo((groupInfo) => ({
            ...groupInfo,
            groupMessages: messages,
        }));
    }

    function onGroupLeave(joinedGroups) {
        setUser((user) => ({
            ...user,
            joinedGroups,
        }));
        navigate('/groups');
    }

    function onUserGet(user) {
        setUserInfo({
            ...user,
            visible: !userInfo.visible,
        });
    }

    function hideUserInfo(event) {
        // event.st;
        // keep state within each chat components to switch show / hide
    }

    useEffect(() => {
        socket.on('group_get', onGroupGet);
        socket.on('group_message_add', onGroupMessages);
        socket.on('group_leave', onGroupLeave);

        socket.emit('group_get', id);

        socket.on('user_get', onUserGet);

        return function cleanup() {
            socket.removeListener('group_get');
            socket.removeListener('group_message_add');
            socket.removeListener('group_leave');

            socket.removeListener('user_get');
        };
    }, []);

    function toggleUser(userId) {
        socket.emit('user_get', userId);
    }

    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    useEffect(() => {
        scrollToBottom();
    }, [groupInfo.groupMessages]);

    return (
        <header id='App-header3'>
            <div
                className='messageGroup'
                onClick={(e) => {
                    e.stopPropagation();
                    hideUserInfo(e);
                }}
            >
                <div
                    className='groupChatHeader'
                    onClick={(e) => {
                        navigate(`/groups/${id}/info`);
                    }}
                >
                    <img
                        src={groupInfo.group.avatar}
                        height={'40px'}
                        width={'40px'}
                        alt='group'
                        style={{ borderRadius: '10px' }}
                    ></img>
                </div>
                <div
                    className='userName'
                    onClick={(e) => {
                        navigate(`/groups/${id}/info`);
                    }}
                >
                    <b>{groupInfo.group.name}</b>
                </div>
                <div
                    className='chatSettingsButton'
                    onClick={(e) => {
                        setSettingsVisible(!settingsVisible);
                    }}
                >
                    <i className='fa-solid fa-gear hover'></i>
                </div>

                {settingsVisible && (
                    <div className='dialogWindow'>
                        <div
                            className='hover'
                            style={{ padding: '20px' }}
                            onClick={(e) => {
                                navigate(`/groups/${id}/edit`);
                            }}
                        >
                            <i
                                className='fa-solid fa-signature'
                                style={{
                                    paddingRight: '10px',
                                }}
                            ></i>
                            Edit Group
                        </div>

                        <div
                            className='hover'
                            style={{ padding: '20px' }}
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
                    </div>
                )}
            </div>

            <div className='messageBody'>
                {userInfo.visible && (
                    <div
                        className='userInfoContainer'
                        ref={userInfoModal}
                        style={{
                            left: clickPos.clickedX + 'px',
                            top: clickPos.clickedY + 'px',
                        }}
                    >
                        <img
                            src={userInfo.avatar}
                            height={'60px'}
                            width={'60px'}
                            alt='group'
                            style={{ borderRadius: '15px' }}
                        ></img>
                        <h3 style={{ margin: '15px 0 0 0' }}>
                            {userInfo.username}
                        </h3>
                        <p style={{ margin: '10px 0 5px 0' }}>
                            Created:{' '}
                            {new Date(userInfo.created).toLocaleDateString(
                                undefined,
                                options
                            )}
                        </p>
                        <p style={{ margin: '5px 0 10px 0' }}>
                            Role: {userInfo.ranking}
                        </p>
                        {/* <p>Role: {userInfo.ranking}</p> */}
                        <Link
                            to={`/users/${userInfo._id}/info`}
                            className='viewUserPage'
                        >
                            View Page
                        </Link>
                    </div>
                )}
                {groupInfo.groupMessages ? (
                    groupInfo.groupMessages.map((message, i) => {
                        return (
                            <GroupChatMessage
                                user={user}
                                message={message}
                                i={i}
                                toggleUser={toggleUser}
                                setClickPos={setClickPos}
                                key={i}
                            />
                        );
                    })
                ) : (
                    <div>Couldn't get messages...</div>
                )}
                {emojiVisible && (
                    <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        autoFocusSearch={false}
                    />
                )}
                <div
                    className='scroll'
                    ref={messagesEndRef}
                />
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();

                    addNewMessage();
                }}
                style={{ width: '100%' }}
            >
                <div className='messageInput'>
                    <div
                        className='emojiButton'
                        onClick={(e) => {
                            setEmojiVisible(!emojiVisible);
                        }}
                    >
                        <i className='fa-regular fa-face-smile hover'></i>
                    </div>
                    <div className='attatchmentButton'>
                        <i className='fa-solid fa-paperclip hover'></i>
                    </div>
                    <input
                        type='text'
                        placeholder='Type in your message'
                        className='sendInput'
                        id='sendInput'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></input>
                    <div
                        className='sendButton'
                        onClick={(e) => {
                            e.stopPropagation();
                            addNewMessage();
                        }}
                    >
                        <i className='fa-regular fa-paper-plane hover'></i>
                    </div>
                </div>
            </form>
        </header>
    );
}

export default GroupChat;
