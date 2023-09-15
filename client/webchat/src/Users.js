function Users(props) {
    return (
        <>
            <div className='usersDisplay'>
                {props.users.map((user) => {
                    return (
                        <div className='userInformation'>
                            <div
                                style={{
                                    fontFamily: "'Oswald', sans-serif",
                                    fontSize: '24px',
                                }}
                            >
                                Name: {user.name}
                            </div>
                            <div>Also known as: {user.username}</div>
                            <div>
                                Joined: {new Date(user.created).toDateString()}
                            </div>
                            <div>Ranking: {user.ranking}</div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default Users;
