import { Link } from 'react-router-dom';

function Navbar({ user }) {
    return (
        <nav className='navbar'>
            <Link
                to={Object.keys(user).length === 0 ? '/' : 'groups'}
                className='companyLogo'
                style={{ fontFamily: "'Oswald', sans-serif", flexGrow: '1' }}
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
                />
                <span></span>
                <span></span>
                <span></span>
            </label>
        </nav>
    );
}

export default Navbar;
