import { Link, useHistory } from "react-router-dom";
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
            <Button variant='outlined' onClick={goHome}>Return Home</Button>
        </> 
        :
        <>
            <h1 className='title'>{window.activeEvent.name}</h1>            
            <section id='edit-cards'>
                <DetailsCard name={window.activeEvent.name} date={moment(window.activeEvent.date).format('DD MMMM YYYY')} location={window.activeEvent.location} guests={window.activeEvent.numAttend.toString()} perTable={window.activeEvent.perTable.toString()}></DetailsCard>
                <EditCard numSent='200' numRec='123'></EditCard>
                <SeatCard tables={Math.ceil(window.activeEvent.numAttend/window.activeEvent.perTable).toString()} full='5' started='8' empty='2'></SeatCard>
            </section>
            <Link to='/userHome' className='rectangleButton' id='start-button'>
                    Return to User Home
            </Link>
            </>}
        </>
    );
}

