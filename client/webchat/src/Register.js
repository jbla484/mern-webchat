import { Link } from 'react-router-dom';
import { useState } from 'react';

import socket from './socket/socket';
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

function Register() {
    let navigate = useNavigate();

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

    function onUserRegister(arg) {
        console.log(`Created user: ${arg.username}, ${arg._id}`);
        navigate('/login');

        // setUserInfo((userInfo) => ({
        //     ...userInfo,
        //     currentPage: 'login',
        // }));
    }

    useEffect(() => {
        socket.on('user_register', onUserRegister);

        return function cleanup() {
            socket.removeListener('user_register');
        };
    }, []);

    return (
        <div className='loginContainer'>
            <h1>Sign Up</h1>
            <form
                onSubmit={(e) => {
                    onSubmit(e);
                }}
            >
                <div style={{ textAlign: 'left' }}>
                    <p
                        style={{ margin: '0', fontSize: '18px' }}
                        className='grayColor'
                    >
                        Username
                    </p>
                </div>
                <div className='loginUserContainer'>
                    <i className='fa-regular fa-user grayColor'></i>
                    <input
                        type='text'
                        placeholder='Username'
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        value={formData.name}
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
                        Email
                    </p>
                </div>
                <div className='loginUserContainer'>
                    <i className='fa-solid fa-envelope grayColor'></i>

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

                <div style={{ textAlign: 'left' }}>
                    <p
                        style={{ margin: '0', fontSize: '18px' }}
                        className='grayColor'
                    >
                        Password
                    </p>
                </div>
                <div className='loginUserContainer'>
                    <i className='fa-solid fa-key grayColor'></i>
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

                <div style={{ textAlign: 'left' }}>
                    <p
                        style={{ margin: '0', fontSize: '18px' }}
                        className='grayColor'
                    >
                        Confirm Password
                    </p>
                </div>
                <div className='loginUserContainer'>
                    <i className='fa-solid fa-lock grayColor'></i>
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
                            to='/login'
                            className='registerButton'
                            // onClick={() => props.setter('login')}
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
