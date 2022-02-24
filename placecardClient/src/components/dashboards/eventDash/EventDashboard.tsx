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
                <DetailsCard name={window.activeEvent.name} date={moment(window.activeEvent.date).format('DD MMMM YYYY')} location={window.activeEvent.location} guests={window.activeEvent.guestList.length.toString()} perTable={window.activeEvent.perTable.toString()}></DetailsCard>
                <EditCard numSent='200' numRec='123'></EditCard>
                <SeatCard tables={Math.ceil(window.activeEvent.guestList.length/window.activeEvent.perTable).toString()} seats={(window.activeEvent.tables.length*window.activeEvent.perTable).toString()} invitees={window.activeEvent.guestList.length.toString()} seated='2'></SeatCard>
            </section>
            <Button onClick={goHome} variant='contained' className='basicBtn fitBtn lowBtn'>
                    Return Home
            </Button>
            </>}
        </>
    );
}

