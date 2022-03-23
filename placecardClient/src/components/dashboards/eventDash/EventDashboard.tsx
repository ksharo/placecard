import { useHistory } from "react-router-dom";
import { DetailsCard } from "./DetailsCard";
import { EditCard } from "./EditCard";
import { SeatCard } from "./SeatCard";
import './EventDash.css';
import Button from "@mui/material/Button";
import moment from 'moment';

export function EventDashboard() {
    const history = useHistory();
    const goHome = () => {
        history.push('/userHome');
    }
    /* Get the number of seated people */
    let seated = 0;
    if (window.activeEvent != null) {
        for (let x of window.activeEvent.tables) {
            seated += x.guests.length;
        }
    }
    return (
        <>
        {window.activeEvent == null ? 
        <>
            <p className='subtitle'>There is no active event. Please return home and choose an event to view.</p> 
            <Button variant='contained' onClick={goHome}>Return Home</Button>
        </> 
        :
        <>
            <h1 className='title'>{window.activeEvent.name}</h1>  
            <p className='subtitle'>Welcome to your event dashboard</p>          
            <section id='edit-cards'>
                <DetailsCard name={window.activeEvent.name} date={moment(window.activeEvent.date).format('DD MMMM YYYY')} location={window.activeEvent.location} guests={window.activeEvent.guestList==undefined ? 'Error' : window.activeEvent.guestList.length.toString()} perTable={window.activeEvent.perTable.toString()}></DetailsCard>
                <EditCard numSent={window.activeEvent.surveys != undefined ? window.activeEvent.surveys.length?.toString() : '0'} numRec={window.activeEvent.respondents != undefined ? window.activeEvent.respondents?.length.toString() : '0'}></EditCard>
                <SeatCard tables={window.activeEvent.tables==undefined ? 'Error' : window.activeEvent.tables.length.toString()} seats={(window.activeEvent.tables==undefined ? 'Error' : window.activeEvent.tables.length*window.activeEvent.perTable).toString()} invitees={window.activeEvent.guestList==undefined ? 'Error' : window.activeEvent.guestList.length.toString()} seated={seated.toString()}></SeatCard>
            </section>
            <Button onClick={goHome} variant='contained' className='basicBtn fitBtn lowBtn'>
                    Return Home
            </Button>
            </>}
        </>
    );
}

