import { Link } from "react-router-dom";
import { DetailsCard } from "./DetailsCard";
import { EditCard } from "./EditCard";
import { SeatCard } from "./SeatCard";
import './EventDash.css';

export function EventDashboard() {
    return (
        <>
            <h1 className='title'>Wedding</h1>            
            <section id='edit-cards'>
                <DetailsCard name='Wedding' date='10/10/10' location='Canada(on a boat)' guests='100' perTable='8'></DetailsCard>
                <EditCard numSent='200' numRec='123'></EditCard>
                <SeatCard tables='40' full='5' started='8' empty='2'></SeatCard>
            </section>
            <Link to='/userHome' className='rectangleButton' id='start-button'>
                    Return to User Home
            </Link>
        </>
    );
}

