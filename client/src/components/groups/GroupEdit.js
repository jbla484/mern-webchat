import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import socket from '../../socket/socket';

function GroupEdit({ user, setUser }) {
    let navigate = useNavigate();
    const { id } = useParams();

    const [group, setGroup] = useState({});

    function onGroupGet(group) {
        setGroup(group);
    }

    useEffect(() => {
        socket.on('group_get', onGroupGet);
        socket.on('group_edit', onGroupEdit);
        socket.on('error', onError);

        socket.emit('group_get', id);

        return function cleanup() {
            socket.removeListener('group_edit');
            socket.removeListener('group_get');
            socket.removeListener('error');
        };
    }, []);

    function editGroupName(e) {
        //pop up form and pull new name from it

        const info = {
            userId: user._id,
            groupId: id,
            newName: group.name,
            newUrl: group.avatar,
            newDescription: group.description,
        };

        socket.emit('group_edit', info);
    }

    function onError(error) {
        document.getElementById('errorMessage').innerHTML = error;
        document.getElementById('errorMessage').style.display = 'block';
    }

    function onGroupEdit(arg) {
        navigate(`/groups/${id}/chat`);
    }

    return (
        <header id='App-header'>
            <div className='registerContainer'>
                <h1>Edit Group</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        editGroupName();
                    }}
                >
                    {/* TODO: since the name is populated, cant submit unless name is removed from input field */}
                    <div>
                        <div style={{ textAlign: 'left' }}>
                            <p
                                style={{
                                    margin: '0',
                                    fontSize: '18px',
                                    transform: 'translateX(2px)',
                                }}
                                className='grayColor'
                            >
                                Name
                            </p>
                        </div>
                        <input
                            type='text'
                            placeholder='Group Name'
                            onChange={(e) =>
                                setGroup({
                                    ...group,
                                    name: e.target.value,
                                })
                            }
                            value={group.name}
                            className='loginInput'
                            autoFocus
                        ></input>
                    </div>

                    <div>
                        <div style={{ textAlign: 'left' }}>
                            <p
                                style={{
                                    margin: '0',
                                    fontSize: '18px',
                                    transform: 'translateX(2px)',
                                }}
                                className='grayColor'
                            >
                                Avatar
                            </p>
                        </div>
                        <input
                            type='text'
                            placeholder='Gravatar URL'
                            onChange={(e) =>
                                setGroup({
                                    ...group,
                                    avatar: e.target.value,
                                })
                            }
                            value={group.avatar}
                            className='loginInput'
                        ></input>
                    </div>

                    <div>
                        <div style={{ textAlign: 'left' }}>
                            <p
                                style={{
                                    margin: '0',
                                    fontSize: '18px',
                                    transform: 'translateX(2px)',
                                }}
                                className='grayColor'
                            >
                                Description
                            </p>
                        </div>
                        <input
                            type='text'
                            placeholder='Description'
                            onChange={(e) =>
                                setGroup({
                                    ...group,
                                    description: e.target.value,
                                })
                            }
                            value={group.description}
                            className='loginInput'
                        ></input>
                    </div>

                    <div className='errorContainer'>
                        <p
                            id='errorMessage'
                            style={{ display: 'none' }}
                        ></p>
                    </div>

                    <div className='loginLinkContainer'>
                        <button
                            to='/'
                            className='loginPostLink'
                        >
                            Submit
                        </button>
                    </div>

                    <div className='loginRegisterContainer'>
                        <p
                            style={{
                                margin: '0 auto',
                                width: '90%',
                            }}
                        >
                            Want to join a group instead? Look for an open group
                            on the groups page.
                        </p>
                    </div>
                </form>
            </div>
        </header>
    );
}

export default GroupEdit;
