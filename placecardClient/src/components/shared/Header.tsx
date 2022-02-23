import { useHistory } from "react-router-dom";
import logo from '../../assets/logo.png';
import './HeadFoot.css';
import ProfileBox from "../profile/ProfileBox";

export function Header(props:{stick: boolean}) {
  const history = useHistory();

  const handleClick =  () => {
    history.push('/');
  }   

  return (
    <header className= {`header ${props.stick ? "stickTop" : ""}`}>
      <img className='logo' onClick={handleClick} src={logo} alt='Logo'></img>
      <ProfileBox/>
    </header>
  );
}