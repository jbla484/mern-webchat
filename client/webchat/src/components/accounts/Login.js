import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import socket from '../../socket/socket';

function Login({ setUser }) {
    let navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    async function loginSubmit(e) {
        e.preventDefault();

        const user = {
            email: formData.email,
            password: formData.password,
        };

        socket.emit('client_user_login', user);
    }

    async function loginDemo(e) {
        e.preventDefault();

        const user = {
            email: 'j@j.com',
            password: 'password',
        };

        socket.emit('client_user_login', user);
    }

    function onUserLogin(user) {
        setUser(user);
        navigate('/groups');
    }

    function onError(error) {
        console.log(error);
        document.getElementById('errorMessage').innerHTML = error;
        document.getElementById('errorMessage').style.display = 'block';
    }

    useEffect(() => {
        socket.on('server_user_login', onUserLogin);

        socket.on('error', onError);

        return function cleanup() {
            socket.removeListener('server_user_login');
            socket.removeListener('error');
        };
    }, []);

    return (
        <header id='App-header'>
            <div className='loginContainer'>
                <h1 style={{ margin: '0 0 20px 0' }}>Log In</h1>
                <form
                    onSubmit={(e) => {
                        loginSubmit(e);
                    }}
                >
                    <div style={{ textAlign: 'left' }}>
                        <p
                            style={{ margin: '0', fontSize: '18px' }}
                            className='grayColor'
                        >
                            Email
                        </p>
                    </div>

                    <div className='loginUserContainer'>
                        <i
                            className='fa-solid fa-envelope grayColor'
                            style={{ marginRight: '10px' }}
                        ></i>
                        <input
                            type='email'
                            placeholder='Email Address'
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            value={formData.email}
                            required
                            className='loginInput'
                            autoFocus
                        ></input>
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <p
                            style={{ margin: '0', fontSize: '18px' }}
                            className='grayColor'
                        >
                            Password
                        </p>
                    </div>
                    <div className='loginUserContainer'>
                        <i
                            className='fa-solid fa-key grayColor'
                            style={{ marginRight: '10px' }}
                        ></i>
                        <input
                            type='password'
                            placeholder='Password'
                            minLength='6'
                            required
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            value={formData.password}
                            className='loginInput'
                        ></input>
                    </div>
                    <Link
                        className='recoverLink'
                        onClick={(e) => {
                            loginDemo(e);
                        }}
                    >
                        Use demo account
                    </Link>
                    <div className='errorContainer'>
                        <p
                            id='errorMessage'
                            style={{ display: 'none' }}
                        ></p>
                    </div>
                    <div className='loginLinkContainer'>
                        <Link
                            to='/recover'
                            className='recoverLink'
                        >
                            Forgot Password
                        </Link>
                        <button
                            to='/'
                            className='loginPostLink'
                        >
                            Login
                        </button>
                    </div>
                    <div className='loginRegisterContainer'>
                        <div style={{ margin: '0', paddingBottom: '40px' }}>
                            <p style={{ margin: '0', paddingBottom: '5px' }}>
                                Don't have an account?
                            </p>
                            <Link
                                to='/register'
                                className='registerLink'
                                onClick={() => {}}
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </header>
    );
}

export default Login;
