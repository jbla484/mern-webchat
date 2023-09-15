import { Link } from 'react-router-dom';
import { useState } from 'react';

import socket from './socket/socket';

function Login(props) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    });

    async function onSubmit(e) {
        e.preventDefault();

        const user = {
            email: formData.email,
            password: formData.password,
        };

        socket.emit('client_user_login', user);
    }

    return (
        <div className='loginContainer'>
            <h1>Log In</h1>
            <form
                onSubmit={(e) => {
                    onSubmit(e);
                }}
            >
                <div className='loginUserContainer'>
                    <div className='loginUserEmail'>
                        <i className='fa-solid fa-envelope'></i>
                    </div>

                    <input
                        type='email'
                        placeholder='Email Address'
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        value={formData.email}
                        required
                        className='loginInput'
                    ></input>
                </div>
                <div className='loginUserContainer'>
                    <div className='loginPasswordIcon'>
                        <i className='fa-solid fa-key'></i>
                    </div>

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
                            className='registerLink'
                            onClick={() => {}}
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Login;
