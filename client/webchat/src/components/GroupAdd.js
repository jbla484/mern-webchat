import { Link } from 'react-router-dom';
import { useState } from 'react';

import socket from '../socket/socket';

function GroupAdd() {
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

        console.log('group_create');
        socket.emit('group_create', group);
    }

    return (
        <header id='App-header'>
            <div className='loginContainer'>
                <h1>Create A Group</h1>
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

                    <div className='loginLinkContainer'>
                        <button to='/' className='loginPostLink'>
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
