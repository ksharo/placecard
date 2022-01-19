import '../forms/Forms.css'
import './editPages.css'
import { useHistory } from "react-router-dom";
import validator from 'validator';
import { Button } from '@mui/material';
import moment from 'moment';

export function EditDetails(){
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
            validateHelper('editNameError', valid);
            checkAllErrors(name, date, location, num_attend, per_table);
        }
    }

    let validateDate = (event: any) => {
        if (!firstTime) {
            date = event.target.value;
            const valid = validator.isDate(date) && validator.isAfter(date);
            validateHelper('editDateError', valid);
            checkAllErrors(name, date, location, num_attend, per_table);
        }
    }

    let validateLocation = (event: any) => {
        if (!firstTime) {
            location = validator.trim(event.target.value);
            const valid = validator.isWhitelisted(location.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_., &!\'');
            validateHelper('editLocationError', valid);
            checkAllErrors(name, date, location, num_attend, per_table);
        }
    }

    let validateAttend = (event: any) => {
        if (!firstTime) {
            num_attend = event.target.value;
            const strNum = validator.trim(num_attend.toString());
            const valid = !validator.isEmpty(strNum) && num_attend > 0;
            validateHelper('editNumAttError', valid);
            checkAllErrors(name, date, location, num_attend, per_table);
        }
    }

    let validateTable = (event: any) => {
        if (!firstTime) {
            per_table = event.target.value;
            const strNum = validator.trim(per_table.toString());
            const valid = !validator.isEmpty(strNum) && per_table > 0;
            validateHelper('editPerTableError', valid);
            checkAllErrors(name, date, location, num_attend, per_table);
        }
    }
    
    let handleSubmit = async (event: any) => {
        event.preventDefault();
        let errorFound = false;
        const x = document.getElementById('sendEventEditError');
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
                // TODO: edit event, not send it, and uncomment when backend is working
                // await sendEvent(name, date, location, num_attend, per_table);
                // if sendEvent is successful, go back to dashboard after updating globals
                // TODO: add id stuff from event
                const activeEvent = {id: '', name: name, date: date, location: location, numAttend: num_attend, perTable: per_table};
                // first change list
                const events = [...window.eventsState];
                const curEvent = window.activeEvent;
                for (let i = 0; i < events.length; i++) {
                    const event = events[i];
                    if (curEvent != null && event.name == curEvent.name && (event.date == curEvent.date || moment(event.date).format('DD MMMM YYYY') == curEvent.date) && 
                        event.location == curEvent.location && event.numAttend == curEvent.numAttend
                        && event.perTable == curEvent.perTable) {
                            // found the matching event!
                            events[i] = activeEvent;
                            break;
                        }
                }
                window.setEvents(events);
                console.log(events);
                // then change active event
                window.setActiveEvent(activeEvent);
                history.push('/eventDash');            
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
            const y = document.getElementById('editEventError');
            if (y != null) {
                y.style.display = 'inline-block';
                window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
            }
            firstTime = false;
        }
    }

    const noSave = () => {
        const x = document.getElementById('hiddenWarning');
        if (x != null) {
            x.style.display = 'inline-block';
        }
    };
    const toDashboard = () => {
        history.push('/eventDash');
    };
    const toHome = () => {
        history.push('/userHome');
    };
    const hideWarning = () => {
        const x = document.getElementById('hiddenWarning');
        if (x != null) {
            x.style.display = 'none';
        }
    }

    return (
    <>
    {window.activeEvent == null ?
    <>
     <h1 className='title'>Error: No event found.</h1> 
     <Button variant='outlined' onClick={toHome}>Return Home</Button>
     </>
     : 
        <>
        <section className='hiddenBoxes' id='hiddenWarning'>
            <section className='innerBox'>
                <h1 className='smallBoxTitle title'>Notice</h1>
                <p className='subtitle'>Returning to the dashboard will forget your saved data.</p>
                <p className='subtitle'>Are you sure you want to continue?</p>
                <section className='horizontalFlex'>
                    <button className='smallButton' onClick={hideWarning}>No</button>
                    <button className='smallButton' onClick={toDashboard}>Yes</button>
                </section>
            </section>
        </section>
        <h1 className='title'>Edit Your Event</h1>
        <p className='subtitle pageError' id='editEventError'>Please fix the errors.</p>
        <p className='subtitle pageError' id='sendEventEditError'>Something went wrong. Please try again.</p>
        <form className='vertical-form' onSubmit={handleSubmit} id='editEventForm'>
            <label>Event Name
            <span id='editNameError' className='formError'>The event name can only contain spaces and the following characters: [a-zA-Z0-9.'&!-_].</span>
            <input name='name' onChange={validateName} defaultValue={window.activeEvent.name} type="text"/>
            </label>
            <label>Event Date
            <span id='editDateError' className='formError'>Please enter a valid date that is after today.</span>
            <input name='date' defaultValue={moment(window.activeEvent.date).format('YYYY-MM-DD')} onChange={validateDate} type="date"/>
            </label>
            <label>Location (optional)
            <span id='editLocationError' className='formError'>The event location can only contain spaces and the following characters: [a-zA-Z0-9.'&!-_,].</span>
            <input name='location' defaultValue={window.activeEvent.location} onChange={validateLocation} type="text"/>
            </label>
            <label>Expected Number of Attendees
            <span id='editNumAttError' className='formError'>Please enter a positive number.</span>
            <input name='num_attend' defaultValue={window.activeEvent.numAttend} onChange={validateAttend} type="number"/>
            </label>
            <label>Attendees Per Table
            <span id='editPerTableError' className='formError'>Please enter a positive number.</span>
            <input name='per_table' onChange={validateTable} defaultValue={window.activeEvent.perTable} type="number"/>
            </label>
            <section className='horizontalFlex'> 
                <button className='rectangleButton smallerButton' onClick={noSave}>Return to Dashboard</button>
                <button type='submit' className='rectangleButton smallerButton'>Save</button>
            </section>
        </form>
        </>
    }
    </>
    
    );
}

async function sendEvent(name: string, date: string, location: string, num_attendees: number, per_table: number) {
    // location cannot be empty string when sent to database
    if (location == '') {
        location = 'N/A';
    }
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
            attendees_per_table: Number(per_table)
            })
        };
    return fetch('http://localhost:3001/events/editEvent', requestOptions);
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
        errorFound = showError('editNameError');
    }

    /* Make sure the date is after today */
    if (!(validator.isDate(date) && validator.isAfter(date))) {
        errorFound = showError('editDateError');
    }

    /* Make sure location is only letters, numbers, underscores, apostrophes, ampersands, and dashes */
    if (!(validator.isWhitelisted(location.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_., &!\''))) {
        errorFound = showError('editLocationError');
    }
    
    /* Make sure the number attending is a valid, positive number */
    let strNum = validator.trim(num_attend.toString());
    if (!(!validator.isEmpty(strNum) && num_attend > 0)) {
        errorFound = showError('editNumAttError');
    }

    /* Make sure the number per table is a valid, positive number */
    strNum = validator.trim(per_table.toString());
    if (!(!validator.isEmpty(strNum) && per_table > 0)) {
        errorFound = showError('editPerTableError');
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
    
    let x = document.getElementById('editEventError');
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