import { Link } from "react-router-dom";
import Card from '@mui/material/Card';


export function DetailsCard(props: {name: string; date: string; location: string; guests: string; perTable: string}) {
    return (
        <Card className='dashCard'>
            <section className='summary'>
                <h3>Event Details</h3>     
                <hr/>    
                <p>Name: {props.name} </p>
                <p>Date: {props.date} </p>
                <p>Location: {props.location == '' ? 'N/A' : props.location} </p>
                <p>Number of Guests: {props.guests} </p>
                <p>Guests Per Table: {props.perTable} </p>
            </section>
            <Link className='editButton' to='/editDetails'>
                    Edit Details
            </Link>
        </Card>
    );
}

