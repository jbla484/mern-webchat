import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import socket from '../../socket/socket';

function Register() {
    let navigate = useNavigate();

    const passwordRef = useRef(null);
    const eyeRef = useRef(null);

    const passwordRef2 = useRef(null);
    const eyeRef2 = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    });

    async function onSubmit(e) {
        e.preventDefault();

        if (formData.password !== formData.password2) {
            // todo: add proper alerts on the page
            onError('Please enter the same password');
        } else {
            const newUser = {
                username: formData.name,
                email: formData.email,
                password: formData.password,
            };
            socket.emit('user_register', newUser);
        }
    }

    function onUserRegister(arg) {
        navigate('/login');
    }

    function onError(error) {
        document.getElementById('errorMessage').innerHTML = error;
        document.getElementById('errorMessage').style.display = 'block';
    }

    useEffect(() => {
        socket.on('user_register', onUserRegister);

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
            socket.removeListener('user_register');
            socket.removeListener('error');
        };
    }, []);

    return (
        <header id='App-header'>
            <div className='registerContainer'>
                <h1 style={{ margin: '0 0 20px 0' }}>Sign Up</h1>
                <form
                    onSubmit={(e) => {
                        onSubmit(e);
                    }}
                >
                    <div>
                        <input
                            type='text'
                            placeholder='Username'
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            value={formData.name}
                            required
                            className='loginInput'
                            autoFocus
                        ></input>
                    </div>
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
                            className='loginInput'
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

                    <div>
                        <input
                            type='password'
                            placeholder='Confirm Password'
                            minLength='6'
                            required
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password2: e.target.value,
                                })
                            }
                            value={formData.password2}
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
                        <button
                            to='/'
                            className='loginPostLink'
                        >
                            Submit
                        </button>
                    </div>

                    <div style={{ margin: '0', paddingBottom: '20px' }}>
                        <p style={{ margin: '0', paddingBottom: '5px' }}>
                            Already have an account?
                        </p>
                        <Link
                            to='/login'
                            className='registerButton'
                        >
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </header>
    );
}

export default Register;
