import { useHistory } from "react-router-dom";
import Card from '@mui/material/Card';
import { Button, CardActions, CardContent, CardHeader } from "@mui/material";


export function DetailsCard(props: {name: string; date: string; location: string; guests: string; perTable: string}) {
    const history = useHistory();
    const toEditDetails = () => {
        history.push('/editDetails');
    };
    return (
        <Card className='dashCard smallCard'>
            <CardHeader title='Event Details' className='dashCardHeader'/>
            <CardContent>
                <p><strong>Name:</strong> {props.name} </p>
                <p><strong>Date:</strong> {props.date} </p>
                <p><strong>Location:</strong> {props.location === '' ? 'N/A' : props.location} </p>
                <p><strong>Number of Guests:</strong> {props.guests} </p>
                <p><strong>Guests Per Table:</strong> {props.perTable} </p>
            </CardContent>
            <CardActions className='cardFooter'>
                <Button onClick={toEditDetails} className='basicBtn fitBtn' variant='contained'>
                     Edit Details
                </Button>
            </CardActions>
        </Card>
    );
}

