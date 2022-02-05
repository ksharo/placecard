import './Forms.css'
import { useHistory } from "react-router-dom";
import validator from 'validator';
import {uuid} from "uuidv4";

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
            name = validator.trim(event.target.value);
            const valid = !validator.isEmpty(name) && validator.isWhitelisted(name.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_. &!\'');
            validateHelper('nameError', valid);
            checkAllErrors(name, date, location, num_attend, per_table);
        }
    }

    let validateDate = (event: any) => {
        if (!firstTime) {
            date = event.target.value;
            const valid = validator.isDate(date) && validator.isAfter(date);
            validateHelper('dateError', valid);
            checkAllErrors(name, date, location, num_attend, per_table);
        }
    }

    let validateLocation = (event: any) => {
        if (!firstTime) {
            location = validator.trim(event.target.value);
            const valid = validator.isWhitelisted(location.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_., &!\'');
            validateHelper('locationError', valid);
            checkAllErrors(name, date, location, num_attend, per_table);
        }
    }

    let validateAttend = (event: any) => {
        if (!firstTime) {
            num_attend = event.target.value;
            const strNum = validator.trim(num_attend.toString());
            const valid = !validator.isEmpty(strNum) && num_attend > 0;
            validateHelper('numAttError', valid);
            checkAllErrors(name, date, location, num_attend, per_table);
        }
    }

    let validateTable = (event: any) => {
        if (!firstTime) {
            per_table = event.target.value;
            const strNum = validator.trim(per_table.toString());
            const valid = !validator.isEmpty(strNum) && per_table > 0;
            validateHelper('perTableError', valid);
            checkAllErrors(name, date, location, num_attend, per_table);
        }
    }
    
    let handleSubmit = async (event: any) => {
        event.preventDefault();
        let errorFound = false;
        const x = document.getElementById('sendEventError');
        if (x != null) {
            x.style.display = 'none';
        }
        if (event == null) {
            if (x != null) {
                x.style.display = 'inline-block';
                window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
            }
        }
        // get data from form and fill variables
        name = validator.trim(event?.target?.name?.value);
        date = validator.trim(event?.target?.date?.value);
        location = validator.trim(event?.target?.location?.value);
        num_attend = event?.target?.num_attend?.value;
        per_table = event?.target?.per_table?.value;

        // validate form based on above data
        errorFound = validate(name, date, location, num_attend, per_table);

        if (!errorFound) { 
            // if form is good, sendEvent
            try {
                const result = await sendEvent(name, date, location, num_attend, per_table);
                if (result.status == 200) {
                    const data = await result.json();
                    const id: string = data._id;
                    // if sendEvent is successful, go to next page after adding event to global list
                    const eventsList = window.eventsState;
                    eventsList.push({id: id, name: name, date: date, location: location, numAttend: num_attend, perTable: per_table, tables: createTables(num_attend, per_table), guestList: []});
                    window.setEvents(eventsList);
                    history.push('/uploadGuestList');
                }
                else {
                    if (x != null) {
                        x.style.display = 'inline-block';
                        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                    }
                }
                      
            }
            catch {
                if (x != null) {
                    x.style.display = 'inline-block';
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                }
            }
        }
        // if there is an error, tell the user
        else {
            const y = document.getElementById('eventFormError');
            if (y != null) {
                y.style.display = 'inline-block';
                window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
            }
            firstTime = false;
        }
    }

    return (
    <>
        <h1 className='title'>Create a New Event</h1>
        <p className='subtitle'>To get started, we just need some of the basics.
        <br/>Don't worry, these can always be edited later.</p>
        <p className='subtitle pageError' id='eventFormError'>Please fix the errors.</p>
        <p className='subtitle pageError' id='sendEventError'>Something went wrong. Please try again.</p>
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

/*
 * Creates tables based on the number of attendees and number of people per table
 */
function createTables(num_attendees: number, per_table: number) {
    const tables = [];
    const numTables = Math.ceil(num_attendees/per_table);
    for (let i = 0; i < numTables; i++) {
        tables.push({
            id: uuid(),
            name: 'Table ' + (i+1).toString(),
            guests: []
        });
    }
    return tables;
}

async function sendEvent(name: string, date: string, location: string, num_attendees: number, per_table: number) {
    // location cannot be empty string when sent to database
    if (location == '') {
        location = 'N/A';
    }
    // set tables
    const tables = createTables(num_attendees, per_table);
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event_name: name,
            event_time: date,
            location: location,
            expected_number_of_attendees: Number(num_attendees),
            attendees_per_table: Number(per_table),
            tables: tables,
            guest_list: []
            })
        };
    return fetch('http://localhost:3001/events/newEvent', requestOptions);
}

/*
 * Displays the error with id 'id'. Returns true so that
 * errorFound is set properly.
 */
function showError(id: string): boolean {
    let x = document.getElementById(id);
    if (x != null) {
        x.style.display = 'inline-block';
    } 
    return true;
}

/* 
 * Validates the information in the form
 */
function validate(name: string, date: string, location: string, num_attend: number, per_table: number) {
    let errorFound = false;

    /* Make sure name is not empty and is only letters, numbers, underscores, apostrophes, ampersands, and dashes */
    if (!(!validator.isEmpty(name) && validator.isWhitelisted(name.toLocaleLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_. &!\''))) {
        errorFound = showError('nameError');
    }

    /* Make sure the date is after today */
    if (!(validator.isDate(date) && validator.isAfter(date))) {
        errorFound = showError('dateError');
    }

    /* Make sure location is only letters, numbers, underscores, apostrophes, ampersands, and dashes */
    if (!(validator.isWhitelisted(location.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_., &!\''))) {
        errorFound = showError('locationError');
    }
    
    /* Make sure the number attending is a valid, positive number */
    let strNum = validator.trim(num_attend.toString());
    if (!(!validator.isEmpty(strNum) && num_attend > 0)) {
        errorFound = showError('numAttError');
    }

    /* Make sure the number per table is a valid, positive number */
    strNum = validator.trim(per_table.toString());
    if (!(!validator.isEmpty(strNum) && per_table > 0)) {
        errorFound = showError('perTableError');
    }

    return errorFound;
}

/* 
 * Removes redundancy from validation functions by performing the
 * show/hide of errors given the id of that error and the boolean
 * that must be checked
 */
function validateHelper(id: string, valid: boolean) {
    let x = document.getElementById(id);
    if (valid) {
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

/*
 * Checks to see if there are any errors in order to show
 * or hide the error at the top of the page
 */
function checkAllErrors(name: string, date: string, location: string, num_attend: number, per_table: number) {
    const strNum1 = validator.trim(per_table.toString());
    const strNum = validator.trim(num_attend.toString());
    const error = (!validator.isEmpty(strNum1) && per_table > 0) && (!validator.isEmpty(strNum) && num_attend > 0) && (validator.isWhitelisted(location.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_., &!\''))
    && (validator.isDate(date) && validator.isAfter(date)) && (!validator.isEmpty(name) && validator.isWhitelisted(name.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_. &!\''));
    
    let x = document.getElementById('eventFormError');
    // if there's an error, keep the item visible
    if (!error) {
        if (x != null) {
            x.style.display = 'inline-block';
        }
    }
    // otherwise, hide it
    else {
        if (x != null) {
            x.style.display = 'none';
        }
    }
}