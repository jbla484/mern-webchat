import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import socket from '../../socket/socket';

function Login({ setUser }) {
    let navigate = useNavigate();

    const passwordRef = useRef(null);
    const eyeRef = useRef(null);

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

        return function cleanup() {
            socket.removeListener('server_user_login');
            socket.removeListener('error');
        };
    }, []);

    return (
        <header id='App-header'>
            <div className='registerContainer'>
                <h1 style={{ margin: '0 0 20px 0' }}>Log In</h1>
                <form
                    onSubmit={(e) => {
                        loginSubmit(e);
                    }}
                >
                    <div>
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

                    <div>
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
                            ref={passwordRef}
                        ></input>
                        <i
                            className='far fa-eye'
                            ref={eyeRef}
                            id='togglePassword'
                        ></i>
                    </div>
                    <div style={{ margin: '10px 0 20px 0' }}>
                        <Link
                            className='recoverLink'
                            onClick={(e) => {
                                loginDemo(e);
                            }}
                        >
                            Use demo account
                        </Link>
                    </div>
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
