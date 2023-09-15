import { Link } from 'react-router-dom';
import { useState } from 'react';

import socket from './socket/socket';

function GroupAdd(props) {
    const [formData, setFormData] = useState({
        name: '',
        avatar: '',
    });

    async function onSubmit(e) {
        e.preventDefault();

        const group = {
            name: formData.name,
            avatar: formData.avatar,
        };

        socket.emit('group_create', group);
    }

    return (
        <div className='loginContainer'>
            <h1>Create A Group</h1>
            <form
                onSubmit={(e) => {
                    onSubmit(e);
                }}
            >
                <div className='loginUserContainer'>
                    <div className='loginUserIcon'>
                        <i className='fa-solid fa-user-group'></i>
                    </div>

                    <input
                        type='text'
                        placeholder='Name'
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        value={formData.name}
                        required
                        className='loginInput'
                    ></input>
                </div>

                <div className='loginUserContainer'>
                    <div className='loginUserEmail'>
                        <i className='fa-solid fa-image'></i>
                    </div>

                    <input
                        type='text'
                        placeholder='Avatar URL'
                        onChange={(e) =>
                            setFormData({ ...formData, avatar: e.target.value })
                        }
                        value={formData.avatar}
                        className='loginInput'
                    ></input>
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
                            paddingBottom: '5px',
                            width: '60%',
                        }}
                    >
                        Want to join a group instead? Look in the group tab to
                        the left to find open groups.
                    </p>
                </div>
            </form>
        </div>
    );
}

export default GroupAdd;
