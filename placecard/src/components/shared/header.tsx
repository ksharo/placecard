import logo from '../../assets/logo.svg';
import './HeadFoot.css';

export function Header() {
    return (
    <header className='header-footer'>
        <img className='logo' src={logo} alt='Logo'></img>
        <section id='login'>
          <section className='loginUserInput'>
            <input className="borderless" type='text' id='username' placeholder='Username'></input>
            <input className="borderless" type='password' id='password' placeholder='Password'></input>
          </section>
          <button className='rectangleButton'>Log In</button>
        </section>
      </header>
    );
}