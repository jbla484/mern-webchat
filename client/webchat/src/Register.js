import { Link } from 'react-router-dom';
import { useState } from 'react';

import socket from './socket/socket';

function Register(props) {
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
            console.error('Please enter the same password');
        } else {
            const newUser = {
                username: formData.name,
                email: formData.email,
                password: formData.password,
            };
            socket.emit('user_register', newUser);
        }
    }

    return (
        <div className='loginContainer'>
            <h1>Sign Up</h1>
            <form
                onSubmit={(e) => {
                    onSubmit(e);
                }}
            >
                <div className='loginUserContainer'>
                    <div className='loginUserIcon'>
                        <i className='fa-regular fa-user'></i>
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
                        autoFocus
                    ></input>
                </div>

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
                        className='loginInput'
                    ></input>
                </div>

                <div className='loginUserContainer'>
                    <div className='loginUserEmail'>
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

                <div className='loginUserContainer'>
                    <div className='loginUserIcon'>
                        <i className='fa-solid fa-lock'></i>
                    </div>

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
                    ></input>
                </div>

                <div className='loginLinkContainer'>
                    <button to='/' className='loginPostLink'>
                        Submit
                    </button>
                </div>

                <div className='loginRegisterContainer'>
                    <div style={{ margin: '0', paddingBottom: '40px' }}>
                        <p style={{ margin: '0', paddingBottom: '5px' }}>
                            Already have an account?
                        </p>
                        <Link
                            // to='/login'
                            className='registerButton'
                            onClick={() => props.setter('login')}
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Register;
