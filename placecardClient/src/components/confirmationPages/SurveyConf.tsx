import { Link } from "react-router-dom";

export function SurveyConf() {

    return (
        <>
            <h1 className='title'>Your survey responses have been received.</h1>
            <p className='subtitle'>We will do our best to place you properly based on your responses.</p>
            <h1 className='title'>Thank you!</h1>
            <Link to='/' className='rectangleButton smallerButton'>
                Go to Placecard Home
            </Link>
            <p className='subtitle'>Have an event of your own? Start using Placecard's seating chart magic today!</p>

            <Link to='/newAccount' className='rectangleButton smallerButton'>
                Create an account
            </Link>
        </>
    );
}

