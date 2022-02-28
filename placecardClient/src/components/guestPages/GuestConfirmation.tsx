import { useHistory, useLocation } from "react-router-dom";
import TextField from '@mui/material/TextField';
import './guestPages.css';
import { Button } from "@mui/material";
import validator from "validator";

export function GuestConfirmation() {
    const history = useHistory();
    // gets query string if you do /beginSurvey?=aaaaaa
    const queryString = useLocation().search;
    console.log(queryString);
    const guestID = new URLSearchParams(queryString).get('guestId');
    console.log(guestID);

    const goHome = () => {
        history.push('/');
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const contact = validator.trim(event?.target?.contactInfo?.value);
        try {
            // const guestInfo = await fetch('http://localhost:3001/guests/'+guestID);
            const guestInfo = {status: 200};
            if (guestInfo.status == 200) {
                // const data = await guestInfo.json();
                // if ((data.email == contact || data.phone_number == contact) && contact != '' && contact != undefined) {
                    // TODO: set current guest info to this guest
                    history.push('/takeSurvey');
                // }
            }
            else {
                const contactErr = document.getElementById('wrongContactError');
                if (contactErr != null) {
                    contactErr.style.display = 'block';
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                }
            }
        }
        catch {
            const contactErr = document.getElementById('wrongContactError');
            if (contactErr != null) {
                contactErr.style.display = 'block';
                window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
            }
        }
    }

    return (
        <section className='guestConfirmation'>
            <h1 className='title'>Welcome to Placecard!</h1>
            <p className='subtitle'>To respond to an event survey, confirm your identity by typing in the email address or phone number to which this link was sent.</p>
            <p className='pageError' id='wrongContactError'>Incorrect contact information. Please try again.</p>
            <form onSubmit={handleSubmit}>
                <section className='decoratedTextField'>
                    <TextField label='Email/Phone Number' name='contactInfo' size='small' className='textInput'/>
                </section>
                <section className='horizontalContainer twoBtns'>
                    <Button className='basicBtn' variant='contained' onClick={goHome}>Home</Button>
                    <Button className='basicBtn' variant='contained' type='submit'>Next</Button>
                </section>
            </form>
        </section>
    );
}

