import { useHistory } from "react-router-dom";
import logo from '../../assets/logo.png';
import './HeadFoot.css';
import ProfileBox from "../profile/ProfileBox";
import { useEffect } from "react";
import React from "react";

let stick = true;
export function Header() {
  const history = useHistory();
  stick = (history.location.pathname == '/');
  const [stickyHeader, toggleStick] = React.useState(stick);

  const handleClick =  () => {
    history.push('/');
  }   
  useEffect(() => {
    return history.listen((location) => { 
      if (location.pathname == '/') {
        stick = true;
        toggleStick(stick);
      }
      else {
        stick = false;
        toggleStick(stick);
      }
    }); 
 },[history]) 
  return (
    <header className= {`header ${stickyHeader ? "stickTop" : ""}`}>
      <img className='logo' onClick={handleClick} src={logo} alt='Logo'></img>
      <ProfileBox/>
    </header>
  );
}