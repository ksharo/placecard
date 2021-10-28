import { useHistory } from "react-router-dom";
import logo from '../../assets/logo.png';
import './HeadFoot.css';
import { ProfileMenu } from './ProfileMenu';

export function Header() {
  const history = useHistory();
  let loggedIn = true;

  let handleClick =  () => {
    history.push('/');
  }   
  let profile = <ProfileMenu name='Apple Zebra' id='1'/>;
  
  let login = 
        <section id='login'>
          <section className='loginUserInput'>
            <input className="borderless" type='text' id='username' placeholder='Username'></input>
            <input className="borderless" type='password' id='password' placeholder='Password'></input>
          </section>
          <button className='rectangleButton'>Log In</button>
        </section>;

    return (
    <header className='header-footer'>
        <img className='logo' onClick={handleClick} src={logo} alt='Logo'></img>
           { loggedIn ? profile : login}
      </header>
    );
}
