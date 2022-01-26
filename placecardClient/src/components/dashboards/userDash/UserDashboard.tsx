import { Link } from "react-router-dom";
import { EventBox } from "./EventBox";
import './UserDashboard.css';
import moment from 'moment';

export function UserDashboard() {
    const eventBoxes : any = [];
    for (let i = 0; i < window.eventsState.length; i++) {
        const event = window.eventsState[i];
        let location = event.location;
        if (event.location == '') {
            location = 'N/A';
        }
        console.log(event.id);
        eventBoxes.push(<EventBox id={event.id} name={event.name} location={location} date={moment(event.date).format('DD MMMM YYYY')} numAttend={event.numAttend} perTable={event.perTable}></EventBox>);
    }
    return (
        <>
            <h1 className='title'>Welcome back, {window.firstNameState} {window.lastNameState}!</h1>
            <section className='boxes'>
                {window.eventsState.length == 0 ? <p className='subtitle'>You have no current events. Create a new one by pressing the button below!</p> : eventBoxes}
            </section>
            <Link to='/createEvent' className='rectangleButton' id='addEventBtn'>
                    + Add New Event
            </Link>
        </>
    );
}

