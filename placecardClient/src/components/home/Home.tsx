import { Button } from '@mui/material';
import mainImg from '../../assets/homeImage.jpeg';
import {BsFillCloudArrowUpFill} from 'react-icons/bs'
import {RiSurveyFill} from 'react-icons/ri'
import {FaUmbrellaBeach} from 'react-icons/fa'

import './Home.css';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import OAuthDialogList from '../firebase/OAuthDialogList';

export function Home() {
    const history = useHistory();
    const [ signupOpen, setOpenSignup ] = useState(false);

    const closeSignupDialogBox = () => {
        setOpenSignup(false);
    };

    const openSignupDialogBox = () => {
        setOpenSignup(true);
    };

    useEffect( () => {
        // user's first time! send them to createEvent
        if (window.firstTime === true) {
            history.push('/createEvent');
        }
        // otherwise to their dashboard if they are at the home screen
        else if (window.firstTime === false) {
            history.push('/userHome');
        }
    }, [window.firstTime]);

    return (
        <>
            <section className='eyeCatcher'>
                <section className='gradientCover'>
                    <section className='introSection'>
                        <h1 className='homeTitle'>The easy way to create a seating chart</h1>
                        <h4>Crowdsource to automatically create your seating chart based on guest preferences</h4>
                        <Button variant='contained' onClick={openSignupDialogBox} color='info'>Get Started - it's free</Button>
                    </section>
                </section>
                <img id='mainImage' src={mainImg}/>
            </section>
            <section className='mainContent'>
                <hr className='separatingLine'/>
                <h1 className='title smallTitle'>How It Works:</h1>
                <section className='howItWorksInstructions'>
                    <section className='instructionStep'>
                        <section className='stepNumber'>
                            1
                        </section>
                        <section className='stepCard'>
                            <BsFillCloudArrowUpFill className='howToIcons'/>
                            <h2 className='stepCardTitle'>Upload Guest List</h2>
                            <p>Upload your list from excel or use our guest list builder.</p>
                        </section>
                    </section>
                    <section className='instructionStep'>
                        <section className='stepNumber'>
                            2
                        </section>
                        <section className='stepCard'>
                            <RiSurveyFill className='howToIcons'/>
                            <h2 className='stepCardTitle'>Send Survey</h2>
                            <p>Your guests take a quick seating preference survey.</p>
                        </section>
                    </section>
                    <section className='instructionStep'>
                        <section className='stepNumber'>
                            3
                        </section>
                        <section className='stepCard'>
                            <FaUmbrellaBeach className='howToIcons'/>
                            <h2 className='stepCardTitle'>Sit Back and Relax</h2>
                            <p>Placecard automatically creates your seating chart based on survey responses.</p>
                                <p>(Manually edit the chart anytime, giving you full control and final say.)</p>
                        </section>
                    </section>
                </section>
            </section>
            <OAuthDialogList
                open={signupOpen}
                onClose={closeSignupDialogBox}
                title='Sign up for'
            />
        </>
    )
}