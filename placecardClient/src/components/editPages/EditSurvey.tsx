import { Link } from 'react-router-dom';
import './editPages.css';

export function EditSurvey () {
    return (
    <section className='centered'>
        <h1 className='title'>Customize Invitation</h1>
        <p className='subtitle'>Great! Now it's time to customize your survey invitation!</p>
        <section className='box'>
            <p>Hello [Guestname]!</p>
            <textarea className='customInput'
                defaultValue='Please fill out a seating chart for my event, Wedding, on Placecard!'>
            </textarea>
            <p className='details'> Event Date: 08/05/2008 </p>
            <p className='details'> Number of Guests in Your Party: 6</p>
            <p className='details'> Your unique link: https://placecard.com/guestResponse/123456</p>
            <textarea className='signature' defaultValue={'Thanks! \r\nApple Zebra'}/>
        </section>
        <section className='horizontalFlex'>
            <section className='verticalFlex'>
                <Link to='/editSurveyHelp' className='rectangleButton smallerButton'>
                        Help
                </Link>
                <Link to='/uploadGuestList' className='rectangleButton smallerButton'>
                        Back
                </Link>
            </section>
            <section className='verticalFlex'>
                <Link to='/editEvent' className='rectangleButton smallerButton'>
                        Edit Event Details
                </Link>
                <Link to='/surveyPreview' className='rectangleButton smallerButton'>
                        Preview Survey
                </Link>
            </section>
            <section className='verticalFlex'>
                <Link to='/editRecipients' className='rectangleButton smallerButton'>
                        Edit Survey Recipients
                </Link>
                <Link to='/sentConf' className='rectangleButton smallerButton'>
                        Send!
                </Link>
            </section>
        </section>
    </section>
    );
}