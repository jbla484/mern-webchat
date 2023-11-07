import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ user, setUser }) {
    let navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    return (
        <>
            <nav className='navbar'>
                <Link
                    to={Object.keys(user).length === 0 ? '/' : 'groups'}
                    className='companyLogo'
                    style={{
                        fontFamily: "'Oswald', sans-serif",
                        flexGrow: '1',
                    }}
                >
                    <i
                        className='fa-solid fa-comments'
                        style={{ paddingRight: '5px' }}
                    ></i>{' '}
                    WebChat
                </Link>

                <Link
                    to='leaderboards'
                    style={{ flexGrow: '0', marginRight: '10px' }}
                >
                    <i
                        className='fa-solid fa-crown'
                        style={{ paddingRight: '5px', fontSize: '30px' }}
                    ></i>{' '}
                </Link>

                <label htmlFor='check'>
                    <input
                        type='checkbox'
                        id='check'
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuVisible(!menuVisible);
                        }}
                    />
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
            </nav>

            <div
                className={
                    menuVisible ? 'navMenu slidedown' : 'navMenu slideup'
                }
            >
                <div
                    className='navMenuItem'
                    onClick={() => {
                        document.getElementById('check').checked = false;
                        setMenuVisible(!menuVisible);
                        if (user.username) navigate('/groups');
                    }}
                >
                    Groups
                </div>
                <div
                    className='navMenuItem'
                    onClick={() => {
                        document.getElementById('check').checked = false;
                        setMenuVisible(!menuVisible);
                        if (user.username) navigate('/users');
                    }}
                >
                    Users
                </div>
                <div
                    className='navMenuItem'
                    onClick={() => {
                        document.getElementById('check').checked = false;
                        setMenuVisible(!menuVisible);
                        if (user.username) navigate(`/users/${user._id}/info`);
                    }}
                >
                    Profile
                </div>
                {user.username ? (
                    <div
                        className='navMenuItem'
                        onClick={() => {
                            document.getElementById('check').checked = false;
                            setUser({});
                            setMenuVisible(!menuVisible);
                            navigate(`/`);
                        }}
                    >
                        Sign Out
                    </div>
                ) : (
                    <div
                        className='navMenuItem'
                        onClick={() => {
                            document.getElementById('check').checked = false;
                            setUser({});
                            setMenuVisible(!menuVisible);
                            navigate(`/login`);
                        }}
                    >
                        Sign In
                    </div>
                )}
            </div>
        </>
    );
}

export default Navbar;
