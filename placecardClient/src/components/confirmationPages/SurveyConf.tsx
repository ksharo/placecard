import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";

export function SurveyConf() {
    const history = useHistory();
    return (
        <>
            <h1 className='title lowTitle'>Your survey responses have been received.</h1>
            <p className='subtitle'>We will do our best to place you properly based on your responses.</p>
            <Button variant='contained' className='basicBtn fitBtn highBtn' onClick={() => history.push('/')}>Go to Placecard Home</Button>
            <p className='subtitle lowText spacedBottom'>Have an event of your own? <a className='textLink' onClick={() => history.push('/newAccount')}>Start using Placecard's seating chart magic today!</a></p>
        </>
    );
}

