import { Button } from '@mui/material';
import mainImg from '../../assets/placeholderImage.jpeg';
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
                    <img id='mainImage' src={mainImg}/>
                </section>
            </section>
        </>
    )
}