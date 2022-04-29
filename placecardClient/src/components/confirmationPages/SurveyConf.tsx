import { Button, Card, CardContent, CardHeader } from "@mui/material";
import { useHistory } from "react-router-dom";

export function SurveyConf() {
    const history = useHistory();
    return (
        <>
            <h1 className='title lowTitle'>Your survey responses have been received.</h1>
            <p className='subtitle'>We will do our best to place you properly based on your responses.</p>
            <Card className='eventDetailsCard'>
                <CardHeader title='Event Details' className='dashCardHeader detailsCardHeader'/>
                <CardContent className='detailsCardContent'>
                    {window.activeEvent == null  || window.activeEvent == undefined  ?
                    <p> Cannot get event information. </p> : 
                    <>
                        <p><strong>Name:</strong> {window.activeEvent.name} </p>
                        <p><strong>Date:</strong> {window.activeEvent.date} </p>
                        {!(window.activeEvent.time === 'Invalid date') && 
                        <p><strong>Time:</strong> {window.activeEvent.time} </p>}
                        {window.activeEvent.location !== '' && <p><strong>Location:</strong> {window.activeEvent.location} </p>}
                    </>
                    }
            </CardContent>
            </Card>
            <Button variant='contained' className='basicBtn fitBtn' onClick={() => history.push('/')}>Go to Placecard Home</Button>
            <p className='subtitle lowText spacedBottom'>Have an event of your own? <a className='textLink' onClick={() => history.push('/newAccount')}>Start using Placecard's seating chart magic today!</a></p>
        </>
    );
}

