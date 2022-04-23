import { AccordionDetails, AccordionSummary, Card, CardContent, Toolbar } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useHistory } from "react-router-dom";
import './EventBox.css';

export function EventBox(props: {id: string, name: string; date: string; location: string; numAttend: number; perTable: number; guestList: Invitee[]; tables: Table[]}) {
    const history = useHistory();
    const handleClick = () => {
        window.setActiveEvent({id: props.id, name: props.name, date: props.date, location: props.location, numAttend: props.numAttend, perTable: props.perTable, guestList: props.guestList, tables: props.tables});
        history.push('/eventDash');
    };
    const numTables = Math.ceil(props.numAttend/props.perTable);
    const daysLeft = Math.ceil(((new Date(props.date)).valueOf() - (new Date()).valueOf())/100000000);
    let daysLeftString = daysLeft.toString() + " Days Left!";
    if (daysLeft === 0) {
        daysLeftString = 'Today is the day!';
    }
    else if (daysLeft === 1) {
        daysLeftString = '1 Day Left!';
    }
    else if (daysLeft < 0) {
        daysLeftString = 'Event has ended.';
    }
    return (
        <Accordion>
            <AccordionSummary>
                <AppBar position='static' color='inherit'>
                    <Toolbar className='toolbar'>
                    <Typography component='p'>{props.name} -- {daysLeftString}</Typography>
                    <Button onClick={handleClick} size='medium'>Dashboard</Button>
                    </Toolbar>
                </AppBar>
            </AccordionSummary>
            <AccordionDetails>
                <Typography className='eventDetails'>
                    Date: {props.date}<br/>
                    Location: {props.location}<br/>
                    Number of Guests: {props.numAttend}<br/>
                    Guests Per Table: {props.perTable}<br/>
                    Number of Tables: {Math.ceil(numTables)}
                </Typography>
            </AccordionDetails>


        </Accordion>
    );
}