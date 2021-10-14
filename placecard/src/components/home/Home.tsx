import { Card } from './Card'
import { Link } from "react-router-dom";
import logo from '../../assets/logo.svg';

export function Home() {
    const title1 = 'Upload Guest List';
    const title2 = 'Send Survey';
    const title3 = 'Placecard Magic!';
    
    const txt1 = 'Enter some basic information about your event and share your guest list with us to get started.';
    const txt2 = 'Customize a message inviting your guests to fill out our seating survey and send it to anyone you want!';
    const txt3 = 'Sit back, relax, and let Placecard do the rest of the work! We will seat guests based on their responses, but feel free to edit on your own as well!';
    return (
        <><h1>Welcome to Placecard!</h1>
        <p>A magical application for all your seating chart needs</p>
        
        <h2>How It Works:</h2>
        <section id='how-to-cards'>
            <Card num='1' title={title1} txt={txt1} img="guests"/>
            <Card num='2' title={title2} txt={txt2} img="mail"/>
            <Card num='3' title={title3} txt={txt3} img="magic"/>
        </section>
        <Link to='/newAccount' className='rectangleButton linkBtn' id='start-button'>
                Get Started!
        </Link>
        </>
    );
}

