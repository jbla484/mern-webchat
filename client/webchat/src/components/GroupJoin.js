import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import socket from '../socket/socket';
import { useParams } from 'react-router-dom';

export default function GroupJoin() {
    const { id } = useParams();

    // const [formData, setFormData] = useState({
    //     name: '',
    //     avatar: '',
    // });

    const [group, setGroup] = useState({});

    async function onGroupGet(group) {
        console.log(group);
        setGroup(group);
    }

    useEffect(() => {
        socket.on('group_get', onGroupGet);

        // pull group id from url,
        console.log(id);
        socket.emit('group_get', id);

        // socket.emit('group_create', group);
        // setGroup({});

        return function cleanup() {
            socket.removeListener('group_get');
        };
    }, []);

    return (
        <header id='App-header'>
            <div className='loginContainer'>
                <h1>{group.name}</h1>
                <div style={{ textAlign: 'left' }}>
                    <p
                        style={{ margin: '0', fontSize: '18px' }}
                        className='grayColor'
                    >
                        {group.name}
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
                        // onChange={(e) =>
                        //     setFormData({
                        //         ...formData,
                        //         name: e.target.value,
                        //     })
                        // }
                        // value={formData.name}
                        required
                        className='loginInput'
                    ></input>
                </div>

                <div className='loginLinkContainer'>
                    <button to='/' className='loginPostLink'>
                        Join Group
                    </button>
                </div>
            </div>
        </header>
    );
}
