import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className='navbar'>
            <Link
                to='/'
                className='companyLogo'
                style={{ fontFamily: "'Oswald', sans-serif" }}
            >
                <i
                    className='fa-solid fa-comments'
                    style={{ paddingRight: '5px' }}
                ></i>{' '}
                WebChat
            </Link>
            {/* <p>
                <Link
                    to='/users'
                    style={{ fontSize: '20px' }}
                >
                    <i
                        className='fa-solid fa-users'
                        style={{ paddingRight: '5px' }}
                    ></i>{' '}
                    Users
                </Link>
            </p>
            <p>
                <Link
                    to='/login'
                    style={{ fontSize: '20px' }}
                >
                    <i
                        className='fa-solid fa-circle-user'
                        style={{ paddingRight: '5px' }}
                    ></i>{' '}
                    Login
                </Link>
            </p> */}
            <label for='check'>
                <input type='checkbox' id='check' />
                <span></span>
                <span></span>
                <span></span>
            </label>
        </nav>
    );
}

export default Navbar;
