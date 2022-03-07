import { Link } from "react-router-dom";
import './Confirmation.css';

export function SentConf() {

    return (
        <>
            <h1 className='title'>Your survey invitations have been sent!</h1>
            <h1 className='title'>Now sit back, relax, and let us take it from here.</h1>
            <Link to='/eventDash' className='rectangleButton smallerButton spaceTop'>
                Go to Event Dashboard
            </Link>
        </>
    );
}

