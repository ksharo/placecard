import { useHistory } from "react-router-dom";
import logo from '../../assets/logo.png';
import './HeadFoot.css';
import { ProfileMenu } from './ProfileMenu';
import LoginBox from "./LoginBox";

export function Header() {
  const history = useHistory();
  const handleClick =  () => {
    history.push('/');
  }   
  const profile = <ProfileMenu name={window.firstNameState + ' ' + window.lastNameState} id='1'/>;

  // const checkLogin = () => {
  //   window.setLoggedIn(true);
  // }
  // let login = 
  //       <section id='login'>
  //         <section className='loginUserInput'>
  //           <input className="borderless" type='text' id='username' placeholder='Username'></input>
  //           <input className="borderless" type='password' id='password' placeholder='Password'></input>
  //         </section>
  //         <button className='rectangleButton' onClick={checkLogin}>Log In</button>
  //       </section>;
    
    let login = <LoginBox/>;

    return (
    <header className='header-footer'>
        <img className='logo' onClick={handleClick} src={logo} alt='Logo'></img>
           { window.loggedInState ? profile : login}
      </header>
    );
}