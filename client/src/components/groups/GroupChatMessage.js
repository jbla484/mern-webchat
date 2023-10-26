export default function GroupChatMessage({
    user,
    message,
    i,
    toggleUser,
    setClickPos,
}) {
    function dateReadable(date) {
        return (
            ('00' + date.getHours()).slice(-2) +
            ':' +
            ('00' + date.getMinutes()).slice(-2)
        );
    }

    function tConvert(time) {
        // Check correct time format and split into components
        time = time
            .toString()
            .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) {
            // If time format correct
            time = time.slice(1); // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }

    function printMousePos(event) {
        // fourth quadrant [2, 2]
        if (
            event.clientX > window.innerWidth / 2 &&
            event.clientY > window.innerHeight / 2
        ) {
            setClickPos({
                clickedX: event.clientX - window.innerWidth / 2 - 10,
                clickedY: event.clientY - window.innerHeight / 2 + 90,
            });
        }
        // second quadrant [1, 2]
        else if (event.clientX > window.innerWidth / 2) {
            setClickPos({
                clickedX: event.clientX - window.innerWidth / 2 - 10,
                clickedY: event.clientY,
            });
        }
        // third quadrant [2, 1]
        else if (event.clientY > window.innerHeight / 2) {
            setClickPos({
                clickedX: event.clientX,
                clickedY: event.clientY - window.innerHeight / 2 + 90,
            });
        }
        // first quadrant [1, 1]
        else {
            setClickPos({ clickedX: event.clientX, clickedY: event.clientY });
        }
    }

    return (
        <div
            className={message.userId === user._id ? 'textRight' : ''}
            key={i}
        >
            <div
                className={
                    message.userId === user._id
                        ? 'incomingMessageUser'
                        : 'incomingMessageOther'
                }
                onClick={(e) => {
                    toggleUser(message.userId);
                    printMousePos(e);
                }}
            >
                <div
                    style={{
                        display: 'inline-block',
                    }}
                >
                    <img
                        src={message.avatar}
                        height={'40px'}
                        width={'40px'}
                        alt='profile'
                        style={{
                            borderRadius: '10px',
                            marginRight: '10px',
                        }}
                    ></img>
                </div>
                <div
                    style={{
                        display: 'inline-block',
                    }}
                >
                    <h3
                        style={{
                            padding: '0px',
                            margin: '0',
                        }}
                    >
                        {message.username}
                    </h3>
                    <p
                        style={{
                            padding: '0px',
                            margin: '0',
                        }}
                    >
                        {message.message}
                    </p>
                </div>
            </div>
            <div
                className={
                    message.userId === user._id
                        ? 'incomingMessageTimeUser'
                        : 'incomingMessageTimeOther'
                }
            >
                <div>{tConvert(dateReadable(new Date(message.created)))}</div>
            </div>
        </div>
    );
}
