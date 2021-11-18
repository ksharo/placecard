import { Link } from 'react-router-dom';
import './Forms.css'
export function EditEvent(){
    return (
    <>
        <h1 className='title'>Edit Your Event</h1>

        <form className='vertical-form'>
            <label>Event Name
            <input type="text"/>
            </label>
            <label>Event Date
            <input type="date"/>
            </label>
            <label>Location (optional)
            <input type="text"/>
            </label>
            <label>Expected Number of Attendees
            <input type="number" value="100"/>
            </label>
            <label>Attendees Per Table
            <input type="number" value="10"/>
            </label>
        </form>
        <Link to='/editGuestList' className='rectangleButton smallerButton'>Save!</Link>
    </>
    );
}