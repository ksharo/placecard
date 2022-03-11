import { useHistory, useLocation } from "react-router-dom";
import TextField from '@mui/material/TextField';
import './guestPages.css';
import { Button } from "@mui/material";
import validator from "validator";
import { ObjectId } from "mongodb";

export function GuestConfirmation() {
    const history = useHistory();
    const queryString = useLocation().search;
    // gets query string if you do /beginSurvey?guestId=aaaaaa
    const guestID = new URLSearchParams(queryString).get('guestId');

    const goHome = () => {
        history.push('/');
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const contact = validator.trim(event?.target?.contactInfo?.value).toLowerCase();
        try {
            const guestInfo = await fetch('http://localhost:3001/guests/'+guestID);
            const eventInfo = await fetch('http://localhost:3001/events/guests/'+guestID);
            const eventData = await eventInfo.json();
            const guests = [];
            for (let guestID of eventData.guest_list) {
                try {
                  const guestFetch = await fetch('http://localhost:3001/guests/'+guestID);
                  const fetchedGuest = await guestFetch.json();
                  const newGuest = {
                    id: fetchedGuest._id,
                    name: fetchedGuest.first_name + ' ' + fetchedGuest.last_name,
                    groupID: fetchedGuest.group_id,
                    groupName: fetchedGuest.group_name,
                    contact: fetchedGuest.email,
                  }
                  guests.push(newGuest);
                }
                catch (e) {
                    console.error("Error: could not fetch guest with id " + guestID + ". " + e);
                }
            }
            window.setInvitees(guests);
            if (guestInfo.status == 200) {
                const data = await guestInfo.json();
                const newGuest = {
                    id: data._id,
                    name: data.first_name + " " + data.last_name,
                    groupID: data.group_id,
                    groupName: data.group_name,
                    contact: data.email,
                };
                window.setCurGuest(newGuest);
                if ((data.email.toLowerCase() == contact || data.phone_number == contact) && contact != '' && contact != undefined) {
                    // TODO: set current guest info to this guest
                    history.push('/takeSurvey');
                }
                else {
                    const contactErr = document.getElementById('wrongContactError');
                    if (contactErr != null) {
                        contactErr.style.display = 'block';
                        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                    }
                }
            }
            else {
                const linkErr = document.getElementById('wrongLinkError');
                if (linkErr != null) {
                    linkErr.style.display = 'block';
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                }
            }
        }
        catch {
            const linkErr = document.getElementById('wrongLinkError');
            if (linkErr != null) {
                linkErr.style.display = 'block';
                window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
            }
        }
    }

    return (
        <section className='guestConfirmation'>
            <h1 className='title'>Welcome to Placecard!</h1>
            <p className='subtitle'>To respond to an event survey, confirm your identity by typing in the email address or phone number to which this link was sent.</p>
            <p className='pageError' id='wrongContactError'>Incorrect contact information. Please try again.</p>
            <p className='pageError' id='wrongLinkError'>There is a problem with your link. Please try again.</p>
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

