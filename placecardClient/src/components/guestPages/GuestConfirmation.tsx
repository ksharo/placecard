import { useHistory, useLocation } from "react-router-dom";
import TextField from '@mui/material/TextField';
import './guestPages.css';
import moment from "moment";
import { Button } from "@mui/material";
import validator from "validator";

export function GuestConfirmation() {
    const history = useHistory();
    const queryString = useLocation().search;
    // gets query string if you do /beginSurvey?guestId=aaaaaa&eventId=12345
    const guestID = new URLSearchParams(queryString).get('guestId');
    const eventID = new URLSearchParams(queryString).get('eventId');

    const goHome = () => {
        history.push('/');
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const contact = validator.trim(event?.target?.contactInfo?.value).toLowerCase();
        try {
            const guestInfo = await fetch('http://localhost:3001/guests/'+guestID);
            const eventInfo = await fetch('http://localhost:3001/events/guestAccess/'+eventID);
            const eventData = await eventInfo.json();
            const guests = [];
            const guestFetch = await fetch('http://localhost:3001/events/guests/'+eventID);
            const fetchedGuests = await guestFetch.json();
            for (let guest of fetchedGuests) {
                const newGuest = {
                    id: guest._id,
                    name: guest.first_name + ' ' + guest.last_name,
                    groupID: guest.group_id,
                    groupName: guest.group_name,
                    groupSize: guest.party_size,
                    contact: guest.email,
                }
                guests.push(newGuest);
            }
            window.setActiveEvent({
                id: undefined,
                uid: undefined,
                name: eventData.event_name,
                date: (new Date(eventData.event_start_time)).toLocaleString().split(',')[0],
                time: moment(new Date(eventData.event_start_time)).format('h:mm a'),
                location: eventData.location,
                perTable: eventData.attendees_per_table,
                guestList: undefined,
                tables: undefined,
            });
            window.setInvitees(guests);
            if (guestInfo.status === 200) {
                const data = await guestInfo.json();
                const newGuest = {
                    id: data._id,
                    name: data.first_name + " " + data.last_name,
                    groupID: data.group_id,
                    groupName: data.group_name,
                    groupSize: data.party_size,
                    contact: data.email,
                };
                if ((data.email.toLowerCase() === contact || data.phone_number === contact) && contact !== '' && contact != undefined ) {
                    window.setCurGuest(newGuest);
                    window.setGroupID(data.group_id);
                    window.setDisliked(data.survey_response.disliked);
                    window.setLiked(data.survey_response.liked);
                    window.setLoved(data.survey_response.ideal);
                    history.push('/takeSurvey/?page=0&guestId='+guestID+'&eventId='+eventID);
                }
                else {
                    const contactErr = document.getElementById('wrongContactError');
                    if (contactErr !== null) {
                        contactErr.style.display = 'block';
                        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                    }
                }
            }
            else {
                const linkErr = document.getElementById('wrongLinkError');
                if (linkErr !== null) {
                    linkErr.style.display = 'block';
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                }
            }
        }
        catch (e) {
            const linkErr = document.getElementById('wrongLinkError');
            console.error(e);
            if (linkErr !== null) {
                linkErr.style.display = 'block';
                window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
            }
        }
    }

    return (
        <section className='guestConfirmation'>
            <h1 className='title'>Welcome to Placecard!</h1>
            <p className='subtitle'>To respond to an event survey, confirm your identity by typing in the email address to which this link was sent.</p>
            <p className='pageError' id='wrongContactError'>Incorrect contact information. Please try again.</p>
            <p className='pageError' id='wrongLinkError'>There is a problem with your link. Please try again.</p>
            <form onSubmit={handleSubmit}>
                <section className='decoratedTextField'>
                    <TextField label='Email Address' name='contactInfo' size='small' className='textInput'/>
                </section>
                <section className='horizontalContainer twoBtns'>
                    <Button className='basicBtn' variant='contained' onClick={goHome}>Home</Button>
                    <Button className='basicBtn' variant='contained' type='submit'>Next</Button>
                </section>
            </form>
        </section>
    );
}

