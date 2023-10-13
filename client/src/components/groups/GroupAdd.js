import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import socket from '../../socket/socket';

function GroupAdd({ user }) {
    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        avatar: '',
        description: '',
    });

    const [error, setError] = useState('');

    function onError(error) {
        setError(error);
    }

    function onGroupCreate(throwaway) {
        navigate('/groups');
    }

    useEffect(() => {
        socket.on('error', onError);

        // todo: bug here since group_create is sent on all sockets
        socket.on('group_create', onGroupCreate);

        return function cleanup() {
            socket.removeListener('error');
            socket.removeListener('group_create');
        };
    }, []);

    async function eGroupCreate(e) {
        e.preventDefault();

        const newGroup = {
            name: formData.name,
            avatar: formData.avatar,
            description: formData.description,
            owner: user._id,
        };

        socket.emit('group_create', newGroup);
    }

    return (
        <header id='App-header'>
            <div className='loginContainer'>
                <h1 style={{ margin: '0 0 20px 0' }}>Create A Group</h1>
                <form
                    onSubmit={(e) => {
                        eGroupCreate(e);
                    }}
                >
                    <div style={{ textAlign: 'left' }}>
                        <p
                            style={{ margin: '0', fontSize: '18px' }}
                            className='grayColor'
                        >
                            Name
                        </p>
                    </div>
                    <div className='loginUserContainer'>
                        <i
                            className='fa-solid fa-user-group grayColor'
                            style={{ marginRight: '10px' }}
                        ></i>

                        <input
                            type='text'
                            placeholder='Name'
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            value={formData.name}
                            required
                            className='loginInput'
                        ></input>
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <p
                            style={{ margin: '0', fontSize: '18px' }}
                            className='grayColor'
                        >
                            Gravatar URL
                        </p>
                    </div>
                    <div className='loginUserContainer'>
                        <i
                            className='fa-solid fa-image grayColor'
                            style={{ marginRight: '10px' }}
                        ></i>

                        <input
                            type='text'
                            placeholder='Url'
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    avatar: e.target.value,
                                })
                            }
                            value={formData.avatar}
                            className='loginInput'
                        ></input>
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <p
                            style={{ margin: '0', fontSize: '18px' }}
                            className='grayColor'
                        >
                            Description
                        </p>
                    </div>
                    <div className='loginUserContainer'>
                        <i
                            className='fa-solid fa-image grayColor'
                            style={{ marginRight: '10px' }}
                        ></i>

                        <input
                            type='text'
                            placeholder='Description'
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            value={formData.description}
                            className='loginInput'
                        ></input>
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
                                paddingBottom: '5px',
                                width: '60%',
                            }}
                        >
                            Want to join a group instead? Look in the group tab
                            to the left to find open groups.
                        </p>
                    </div>
                </form>
            </div>
        </header>
    );
}

export default GroupAdd;
