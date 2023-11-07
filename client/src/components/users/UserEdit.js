import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import socket from '../../socket/socket';

export default function UserEdit() {
    let navigate = useNavigate();
    const { id } = useParams();

    const [user, setUser] = useState({});
    const [newPassword, setNewPassword] = useState({
        password: '',
        confirmPassword: '',
    });

    const passwordRef = useRef(null);
    const eyeRef = useRef(null);

    const passwordRef2 = useRef(null);
    const eyeRef2 = useRef(null);

    function onUserGet(user) {
        setUser(user);
    }

    useEffect(() => {
        socket.on('user_get', onUserGet);
        socket.on('user_edit', onUserEdit);
        socket.on('error', onError);

        socket.emit('user_get', id);

        const togglePassword = eyeRef.current;
        const password = passwordRef.current;

        togglePassword.addEventListener('click', function (e) {
            // toggle the type attribute
            const type =
                password.getAttribute('type') === 'password'
                    ? 'text'
                    : 'password';
            password.setAttribute('type', type);
            // toggle the eye slash icon
            this.classList.toggle('fa-eye-slash');
            this.classList.toggle('fa-eye');
        });

        const togglePassword2 = eyeRef2.current;
        const password2 = passwordRef2.current;

        togglePassword2.addEventListener('click', function (e) {
            // toggle the type attribute
            const type =
                password2.getAttribute('type') === 'password'
                    ? 'text'
                    : 'password';
            password2.setAttribute('type', type);
            // toggle the eye slash icon
            this.classList.toggle('fa-eye-slash');
            this.classList.toggle('fa-eye');
        });

        return function cleanup() {
            socket.removeListener('user_edit');
            socket.removeListener('user_get');
            socket.removeListener('error');
        };
    }, []);

    function editUser(e) {
        if (
            newPassword.password !== '' &&
            newPassword.password !== newPassword.confirmPassword
        ) {
            console.log('dont match');
        } else {
            const info = {
                userId: id,
                newName: user.username,
                newEmail: user.email,
                newUrl: user.avatar,
                newPassword: newPassword.password,
            };
            socket.emit('user_edit', info);
        }
    }

    function onError(error) {
        document.getElementById('errorMessage').innerHTML = error;
        document.getElementById('errorMessage').style.display = 'block';
    }

    function onUserEdit(arg) {
        navigate(`/users/${id}/info`);
    }

    return (
        <header id='App-header'>
            <div className='registerContainer'>
                <h1>Edit User</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        editUser();
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
                                Username
                            </p>
                        </div>
                        <input
                            type='text'
                            placeholder='Username'
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    username: e.target.value,
                                })
                            }
                            value={user.username}
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
                                Email
                            </p>
                        </div>
                        <input
                            type='text'
                            placeholder='Email'
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    email: e.target.value,
                                })
                            }
                            value={user.email}
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
                                Avatar
                            </p>
                        </div>
                        <input
                            type='text'
                            placeholder='Gravatar URL'
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    avatar: e.target.value,
                                })
                            }
                            value={user.avatar}
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
                                Password
                            </p>
                        </div>
                        <input
                            type='password'
                            placeholder='Password'
                            minLength='6'
                            onChange={(e) =>
                                setNewPassword({
                                    ...newPassword,
                                    password: e.target.value,
                                })
                            }
                            value={newPassword.password}
                            className='loginInput'
                            ref={passwordRef}
                        ></input>
                        <i
                            className='far fa-eye'
                            ref={eyeRef}
                            id='togglePassword'
                        ></i>
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
                                Confirm Password
                            </p>
                        </div>
                        <input
                            type='password'
                            placeholder='Confirm Password'
                            minLength='6'
                            onChange={(e) =>
                                setNewPassword({
                                    ...newPassword,
                                    confirmPassword: e.target.value,
                                })
                            }
                            value={newPassword.confirmPassword}
                            className='loginInput'
                            ref={passwordRef2}
                        ></input>
                        <i
                            className='far fa-eye'
                            ref={eyeRef2}
                            id='togglePassword'
                        ></i>
                    </div>

                    <div className='errorContainer'>
                        <p
                            id='errorMessage'
                            style={{ display: 'none' }}
                        ></p>
                    </div>

                    <div className='loginLinkContainer'>
                        <button className='loginPostLink'>Submit</button>
                    </div>

                    <div className='loginRegisterContainer'>
                        <p
                            style={{
                                margin: '0 auto',
                                width: '90%',
                            }}
                        >
                            Want to create a new user instead? Logout using the
                            menu and create a new account.
                        </p>
                    </div>
                </form>
            </div>
        </header>
    );
}
