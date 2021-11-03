import { Link } from "react-router-dom";
import TextField from '@mui/material/TextField';
import './guestPages.css';

export function GuestConfirmation() {
    return (
        <section className='guestConfirmation'>
            <h1 className='title'>Welcome to Placecard!</h1>
            <p className='subtitle lowSub'>To respond to an event survey, confirm your identity by typing in the email address or phone number to which this unique link was sent.</p>
            <TextField label='Email/Phone Number' className='textInput'/>

            <section className='horizontalContainer lowButtons'>
                <Link to='/' className='rectangleButton tinyButton'>
                        Home
                </Link>
                <Link to='/surveyPt1' className='rectangleButton tinyButton'>
                        Next
                </Link>
            </section>
        </section>
    );
}

