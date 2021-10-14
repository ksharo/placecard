import logo from '../../assets/logo.svg';
import './HeadFoot.css';

export function Footer() {
    return (
    <footer className='header-footer'>
        <button className='rectangleButton'>Contact Us</button>
        <img className='logo' src={logo} alt='Logo'></img>
        <button className='rectangleButton'>Legal Jargon</button>
    </footer>
    );
}