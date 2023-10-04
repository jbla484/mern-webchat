import { Link } from 'react-router-dom';

function Landing() {
    return (
        <>
            <div
                style={{
                    fontFamily: "'Oswald', sans-serif",
                    textDecoration: 'none',
                    color: '#282c34',
                    fontSize: '50px',
                    marginBottom: '20px',
                }}
            >
                <i
                    className='fa-solid fa-comments'
                    style={{ paddingRight: '5px' }}
                ></i>{' '}
                WebChat
            </div>
            <p style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
                Create a profile, join chat rooms, chat with others, and climb
                the leaderboards with this unique chat application.
            </p>
            <div style={{ marginTop: '20px', padding: '20px' }}>
                <Link
                    to='/register'
                    className='landingRegisterLink'
                    onClick={(e) => {
                        // setUserInfo((userInfo) => ({
                        //     ...userInfo,
                        //     currentPage: 'register',
                        // }));
                    }}
                >
                    Sign Up
                </Link>
                <Link
                    to='/login'
                    className='landingLoginLink'
                    onClick={(e) => {
                        // setUserInfo((userInfo) => ({
                        //     ...userInfo,
                        //     currentPage: 'login',
                        // }));
                    }}
                >
                    Login
                </Link>
            </div>
        </>
    );
}

export default Landing;
