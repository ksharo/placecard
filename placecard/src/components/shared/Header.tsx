import { useHistory } from "react-router-dom";
import logo from '../../assets/logo.png';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './HeadFoot.css';

export function Header() {
  const history = useHistory();

  let handleClick =  () => {
    history.push('/');
  }   
    return (
    <header className='header-footer'>
        <img className='logo' onClick={handleClick} src={logo} alt='Logo'></img>
        <section id='login'>
          <section className='loginUserInput'>
            <TextField  className='input' size='small' type='text' variant='standard' id='username' label='Username'></TextField>
            <TextField className='input' size='small' type='password' variant='standard' id='password' label='Password'></TextField>
          </section>
          <Button color='secondary' size='medium' variant='outlined'>Log In</Button>
        </section>
      </header>
    );
}
