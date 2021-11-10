import './Forms.css'
import {
    Link
  } from "react-router-dom";


export function NewAccount() {
    return (
    <>
        <h1 className='title'>Welcome to Placecard!</h1>
        <p className='subtitle'>Let's get started with some basic information:</p>
        
        <form className='vertical-form'>
            <label>First Name
            <input type="text"/>
            </label>
            <label>Last Name
            <input type="text"/>
            </label>
            <label>Phone Number (optional)
            <input type="text"/>
            </label>
            <label>Email
            <input type="text"/>
            </label>
            <label>Password
            <input type="text"/>
            </label>
            <label>Confirm Password
            <input type="text"/>
            </label>
        </form>
        <Link to='/createEvent' className='rectangleButton smallerButton'>Next</Link>
    </>
    );
}
