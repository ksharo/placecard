import { Link } from "react-router-dom";
import sadFace from '../../assets/sadFace.png';

export function NotFound() {
    return (
        <>
            <img src={ sadFace }></img>
            <h1 className='title'>Error 404: Page Not Found!</h1>
            <p className='subtitle'>Oh no! The page you requested doesn't seem to exist. Click the button below to return home.</p>
            <Link to='/' className='rectangleButton' id='start-button'>
                    Return Home
            </Link>
        </>
    );
}
