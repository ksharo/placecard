import { Link } from "react-router-dom";
import { EventBox } from "./EventBox";
import './UserDashboard.css';

export function UserDashboard() {
    return (
        <>
            <h1 className='title'>Welcome back, Apple Zebra!</h1>
            <section className='boxes'>
                <EventBox></EventBox>
            </section>
            <Link to='/createEvent' className='rectangleButton' id='addEventBtn'>
                    + Add New Event
            </Link>
        </>
    );
}

