import { Button } from '@mui/material';
import mainImg from '../../assets/placeholderImage.jpeg';
import {BsFillCloudArrowUpFill} from 'react-icons/bs'
import {RiSurveyFill} from 'react-icons/ri'
import {FaUmbrellaBeach} from 'react-icons/fa'

import './Home.css';

export function Home() {
    return (
        <>
            <section className='eyeCatcher'>
                <section className='gradientCover'>
                    <section className='introSection'>
                        <h1 className='homeTitle'>Welcome to Placecard</h1>
                        <h4>A modernly versatile seating-chart application</h4>
                        <Button variant='contained' color='info'>Get Started!</Button>
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
                            <p>Enter some basic information about your event and share your guest list with us to get started.</p>
                        </section>
                    </section>
                    <section className='instructionStep'>
                        <section className='stepNumber'>
                            2
                        </section>
                        <section className='stepCard'>
                            <RiSurveyFill className='howToIcons'/>
                            <h2 className='stepCardTitle'>Send Survey</h2>
                            <p>Customize a message inviting your guests to fill out our seating survey and send it to whoever you want!</p>
                        </section>
                    </section>
                    <section className='instructionStep'>
                        <section className='stepNumber'>
                            3
                        </section>
                        <section className='stepCard'>
                            <FaUmbrellaBeach className='howToIcons'/>
                            <h2 className='stepCardTitle'>Placecard Magic!</h2>
                            <p>Sit back, relax, and let Placecard do the rest of the work! We will seat guests based on their responses, but feel free to edit on your own as well!</p>
                        </section>
                    </section>
                </section>
            </section>
        </>
    )
}