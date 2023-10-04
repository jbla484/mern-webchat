import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import socket from '../socket/socket';

function GroupChat({ user, group }) {
    function dateReadable(date) {
        return (
            ('00' + date.getHours()).slice(-2) +
            ':' +
            ('00' + date.getMinutes()).slice(-2)
        );
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

    function onGroupMessage(messages) {
        console.log(`messages: ${messages}`);
        // setServerInfo((serverInfo) => ({
        //     ...serverInfo,
        //     listOfMessages: messages,
        // }));
    }

    useEffect(() => {
        socket.on('group_message_add', onGroupMessage);

        return function cleanup() {
            socket.removeListener('group_message_add');
        };
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        avatar: '',
    });

    async function eGroupCreate(e) {
        e.preventDefault();

        const group = {
            name: formData.name,
            avatar: formData.avatar,
        };

        socket.emit('group_create', group);
    }

    return (
        <>
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
                    // onClick={(e) => switchToFullScreen(e)}
                >
                    <i className='fa-solid fa-expand hover'></i>
                </div>
                <div
                    className='chatSettingsButton'
                    // onClick={(e) => setGroupSettings(e)}
                >
                    <i className='fa-solid fa-gear hover'></i>
                </div>

                {user.settingsVisible && (
                    <div className='dialogWindow'>
                        <div
                            className='hover'
                            style={{ padding: '20px' }}
                            onClick={(e) => {
                                // if (userInfo.groupSubPage === 'edit_name') {
                                //     setUserInfo((userInfo) => ({
                                //         ...userInfo,
                                //         groupSubPage: '',
                                //     }));
                                // } else {
                                //     setUserInfo((userInfo) => ({
                                //         ...userInfo,
                                //         groupSubPage: 'edit_name',
                                //     }));
                                // }
                                // editGroupName();
                            }}
                        >
                            <i
                                className='fa-solid fa-signature'
                                style={{
                                    paddingRight: '10px',
                                }}
                            ></i>
                            Edit group Name
                        </div>

                        <div
                            className='hover'
                            style={{ padding: '20px' }}
                            onClick={(e) => {
                                // if (userInfo.groupSubPage === 'edit_image') {
                                //     setUserInfo((userInfo) => ({
                                //         ...userInfo,
                                //         groupSubPage: '',
                                //     }));
                                // } else {
                                //     setUserInfo((userInfo) => ({
                                //         ...userInfo,
                                //         groupSubPage: 'edit_image',
                                //     }));
                                // }
                            }}
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
                            style={{ padding: '20px' }}
                            // onClick={(e) => onLeaveGroup(e)}
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
                            style={{ padding: '20px' }}
                            onClick={(e) =>
                                console.log('TODO: Delete group clicked')
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
            </div>

            <div
                className='messageBody'
                style={{
                    position: 'relative',
                    transform: 'translateZ(0)',
                }}
            >
                {group.messages ? (
                    group.messages.map((message) => {
                        return (
                            <div
                            // className={
                            //     message.userId === userInfo.userId
                            //         ? 'textRight'
                            //         : ''
                            // }
                            >
                                <div
                                    // className={
                                    //     message.userId === userInfo.userId
                                    //         ? 'incomingMessageUser'
                                    //         : 'incomingMessageOther'
                                    // }
                                    key={message._id}
                                >
                                    <div
                                        style={{
                                            display: 'inline-block',
                                        }}
                                    >
                                        <img
                                            src={message.avatar}
                                            height={'40px'}
                                            width={'40px'}
                                            alt='profile'
                                            style={{
                                                borderRadius: '20px',
                                                marginRight: '10px',
                                            }}
                                        ></img>
                                    </div>
                                    <div
                                        style={{
                                            display: 'inline-block',
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
                                <div
                                // className={
                                //     message.userId === userInfo.userId
                                //         ? 'incomingMessageTimeUser'
                                //         : 'incomingMessageTimeOther'
                                // }
                                >
                                    <div>
                                        {tConvert(
                                            dateReadable(
                                                new Date(message.created)
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div>Couldn't get messages...</div>
                )}
                {/* <div className='scroll' ref={messagesEndRef} /> */}
            </div>

            <form
                onSubmit={(e) => {
                    // onSubmit(e);
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
        </>
    );
}

export default GroupChat;
