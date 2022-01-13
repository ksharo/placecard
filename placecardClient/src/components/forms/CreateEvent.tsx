import './Forms.css'
import { Link, useHistory } from "react-router-dom";
import validator from 'validator';

export function CreateEvent(){
    const history = useHistory();
    let name = '';
    let date = '';
    let location = '';
    let num_attend = -1;
    let per_table = -1;
    let firstTime = true;
    
    let validateName = (event: any) => {
        if (!firstTime) {
            name = event.target.value;
            name = validator.trim(name);
            let x = document.getElementById('nameError');
            if (!validator.isEmpty(name) && validator.isWhitelisted(name.toLocaleLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_. &!\'')) {
                if (x != null) {
                    x.style.display = 'none';
                }             }
            else {
                if (x != null) {
                    x.style.display = 'inline-block';
                } 
            }
        }
    }
    let validateDate = (event: any) => {
        if (!firstTime) {
            date = event.target.value;
            let x = document.getElementById('dateError');
            if (validator.isDate(date) && validator.isAfter(date)) {
                if (x != null) {
                    x.style.display = 'none';
                } 
            }
            else {
                if (x != null) {
                    x.style.display = 'inline-block';
                } 
            }        
        }
    }
    let validateLocation = (event: any) => {
        if (!firstTime) {
            location = event.target.value;
            location = validator.trim(location);
            let x = document.getElementById('locationError');
            if (validator.isWhitelisted(location.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_., &!\'')) {
                if (x != null) {
                    x.style.display = 'none';
                } 
            }
            else {
                if (x != null) {
                    x.style.display = 'inline-block';
                } 
            }        
        }
    }
    let validateAttend = (event: any) => {
        if (!firstTime) {
            num_attend = event.target.value;
            let x = document.getElementById('numAttError');
            let strNum = validator.trim(num_attend.toString());
            if (!validator.isEmpty(strNum) && num_attend > 0) {
                if (x != null) {
                    x.style.display = 'none';
                } 
            }
            else {
                if (x != null) {
                    x.style.display = 'inline-block';
                } 
            }        
        }
    }
    let validateTable = (event: any) => {
        if (!firstTime) {
            per_table = event.target.value;
            let strNum = validator.trim(per_table.toString());
            let x = document.getElementById('perTableError');
            if (!validator.isEmpty(strNum) && per_table > 0) {
                if (x != null) {
                    x.style.display = 'none';
                } 
            }
            else {
                if (x != null) {
                    x.style.display = 'inline-block';
                } 
            }        
        }
    }
    let handleSubmit = async (event: any) => {
        let errorFound = false;
        if (event == null) {
            console.log('uh oh (handleSubmit)')
        }
        event.preventDefault();
        // get data from form and fill variables
        name = event?.target?.name?.value;
        date = event?.target?.date?.value;
        location = event?.target?.location?.value;
        num_attend = event?.target?.num_attend?.value;
        per_table = event?.target?.per_table?.value;

        // validate form based on above data
        // check to make sure name is not empty and is only letters, numbers, underscores, apostrophes, ampersands, and dashes
        name = validator.trim(name);
        if (!validator.isEmpty(name) && validator.isWhitelisted(name.toLocaleLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_. &!\'')) {
            console.log('yay!');
        }
        else {
            console.log('boo');
            let x = document.getElementById('nameError');
            if (x != null) {
                x.style.display = 'inline-block';
            } 
            errorFound = true;
        }

        // check to make sure the date is after today
        if (validator.isDate(date) && validator.isAfter(date)) {
            console.log('yay');
        }
        else {
            console.log('boo');
            let x = document.getElementById('dateError');
            if (x != null) {
                x.style.display = 'inline-block';
            } 
            errorFound = true;
        }

        // check to make sure location is only letters, numbers, underscores, apostrophes, ampersands, and dashes
        location = validator.trim(location);
        if (validator.isWhitelisted(location.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_., &!\'')) {
            console.log('yay!');
        }
        else {
            console.log('boo');
            let x = document.getElementById('locationError');
            if (x != null) {
                x.style.display = 'inline-block';
            } 
            errorFound = true;
        }

        // check to make sure the number attending is a valid, positive number
        let strNum = validator.trim(num_attend.toString());
        if (!validator.isEmpty(strNum) && num_attend > 0) {
            console.log('yay!');
        }
        else {
            console.log('boo');
            let x = document.getElementById('numAttError');
            if (x != null) {
                x.style.display = 'inline-block';
            } 
            errorFound = true;
        }

        // check to make sure the number per table is a valid, positive number
        strNum = validator.trim(per_table.toString());
        if (!validator.isEmpty(strNum) && per_table > 0) {
            console.log('yay!');
        }
        else {
            console.log('boo');
            let x = document.getElementById('perTableError');
            if (x != null) {
                x.style.display = 'inline-block';
            } 
            errorFound = true;
        }

        if (!errorFound) { 
            // if form is good, sendEvent
            try {
                await sendEvent(name, date, location, num_attend, per_table);
            }
            catch {
                console.log('uh oh (handleClick)');
            }
            // if sendEvent is successful, go to next page
            history.push('/uploadGuestList');
        }
        else {
            console.log('errors found');
            firstTime = false;
        }
    }
    return (
    <>
        <h1 className='title'>Create a New Event</h1>
        <p className='subtitle'>To get started, we just need some of the basics.
        <br/>Don't worry, these can always be edited later.</p>

        <form className='vertical-form' onSubmit={handleSubmit} id='createEventForm'>
            <label>Event Name
            <span id='nameError' className='formError'>The event name can only contain spaces and the following characters: [a-zA-Z0-9.'&!-_].</span>
            <input name='name' onChange={validateName} type="text"/>
            </label>
            <label>Event Date
            <span id='dateError' className='formError'>Please enter a valid date that is after today.</span>
            <input name='date' onChange={validateDate} type="date"/>
            </label>
            <label>Location (optional)
            <span id='locationError' className='formError'>The event location can only contain spaces and the following characters: [a-zA-Z0-9.'&!-_,].</span>
            <input name='location' onChange={validateLocation} type="text"/>
            </label>
            <label>Expected Number of Attendees
            <span id='numAttError' className='formError'>Please enter a positive number.</span>
            <input name='num_attend' onChange={validateAttend} type="number" defaultValue="100"/>
            </label>
            <label>Attendees Per Table
            <span id='perTableError' className='formError'>Please enter a positive number.</span>
            <input name='per_table' onChange={validateTable} type="number" defaultValue="10"/>
            </label>
            <button type='submit' className='rectangleButton smallerButton'>Create!</button>
        </form>
    </>
    );
}

async function sendEvent(name: string, date: string, location: string, num_attendees: number, per_table: number) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'applications/json'
        },
        body: JSON.stringify({
                event_name: name,
                event_time: date,
                expected_number_of_attendees: num_attendees,
                attendees_per_table: per_table
            })
        };
    return fetch('http://localhost:3001/events/newEvent', requestOptions);
}