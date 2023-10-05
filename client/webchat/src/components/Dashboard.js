import { Link } from 'react-router-dom';

function Dashboard() {
    return (
        <header id='App-header'>
            <div style={{ marginTop: '20px', padding: '20px' }}>
                {/* <Link to='/messages' className='landingRegisterLink'>
                    Messages
                </Link> */}
                <Link to='/groups' className='landingLoginLink'>
                    Groups
                </Link>
                <Link to='/' className='landingLoginLink'>
                    Logout
                </Link>
            </div>
        </header>
    );
}

export default Dashboard;
