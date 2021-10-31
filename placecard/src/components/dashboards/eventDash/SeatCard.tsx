import { Link } from "react-router-dom";
import Card from '@mui/material/Card';


export function SeatCard(props: {tables: string; full: string; started: string; empty: string}) {
    return (
        <Card className='dashCard'>
            <section className='summary'>
                <h3>Seating Chart</h3>     
                <hr/>    
                <p>Tables: {props.tables} </p>
                <p>Tables Full: {props.full} </p>
                <p>Tables Part Full: {props.started} </p>
                <p>Tables Empty: {props.empty} </p>
            </section>
            <Link to='/editSeatingChart' className='editButton'>
                    Edit/View Seating Chart
            </Link>
        </Card>
    );
}

