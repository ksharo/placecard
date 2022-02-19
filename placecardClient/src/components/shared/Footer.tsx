import { FaFacebookSquare, FaInstagram, FaTwitterSquare } from 'react-icons/fa';
import logo from '../../assets/whiteLogo.png';
import './HeadFoot.css';
export function Footer() {
    return (
    <footer className='footer'>
        <img className='logo' src={logo} alt='Logo'></img>
        <p className='contactInfo'>hello@placecard.com</p>
        <p className='contactInfo'>(123) 456-7890</p>
        <section className='socialIcons'>
            <FaFacebookSquare></FaFacebookSquare>
            <FaTwitterSquare></FaTwitterSquare>
            <FaInstagram></FaInstagram>
        </section>
        <p className='copyright'>&#169; 2022 placecard llc</p>
    </footer>
    );
}
