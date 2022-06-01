import './Forms.css'
import { useHistory } from "react-router-dom";
import validator from 'validator';
import { nanoid as uuid } from "nanoid";
import { Button, TextField } from '@mui/material';
import React from 'react';
import { ObjectId } from 'mongodb';


    let validName = true;
    let validLoc = true;
    let validDate = true;
    let validPerTable = true;

    /* variables that hold the textfield input */
    let name = '';
    let date = '';
    let time = '';
    let location = '';
    let per_table = -1;

    /* we don't want to show/hide errors before they press submit for the first time */
    let firstTime = true;

export function CreateEvent(){
    window.setGuestMode(false);
    const history = useHistory();

    /* Variables to keep track of if each textField shows an error */
    const [nameError, setNameError] = React.useState(!validName);
    const [locError, setLocError] = React.useState(!validLoc);
    const [dateError, setDateError] = React.useState(!validDate);
    const [perTableError, setPerTableError] = React.useState(!validPerTable);

    let validateName = (event: any, val?: string) => {
        if (val != undefined ) {
            name = val;
        }
        else {
            name = validator.trim(event.target.value);
        }
        if (!firstTime || val != undefined ) {
            const valid = !validator.isEmpty(name) && validator.isWhitelisted(name.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_. &!\'');
            validName = valid;
            setNameError(!valid);
            checkAllErrors(name, date, location, per_table);
        }
    }

    let validateDate = (event: any, val?: string) => {
        if (val != undefined ) {
            date = val;
        }
        else {
            date = event.target.value;
        }
        if (!firstTime || val != undefined ) {
            const valid = validator.isDate(date) && validator.isAfter(date);
            validDate = valid;
            setDateError(!valid);
            checkAllErrors(name, date, location, per_table);
        }
    }

    let validateLocation = (event: any, val?: string) => {
        if (val != undefined ) {
            location = val;
        }
        else {
            location = validator.trim(event.target.value);
        }
        if (!firstTime || val != undefined ) {
            const valid = validator.isWhitelisted(location.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_., &!\'');
            validLoc = valid;
            setLocError(!valid);
            checkAllErrors(name, date, location, per_table);
        }
    }

    let validateTable = (event: any, val?: number) => {
        if (val != undefined ) {
            per_table = val;
        }
        else {
            per_table = event.target.value;
        }
        if (!firstTime || val != undefined ) {
            const strNum = validator.trim(per_table.toString());
            const valid = !validator.isEmpty(strNum) && per_table > 0;
            validPerTable = valid;
            setPerTableError(!valid);
            checkAllErrors(name, date, location, per_table);
        }
    }

    let handleSubmit = async (event: any) => {
        event.preventDefault();
        let errorFound = false;
        const x = document.getElementById('sendEventError');
        if (x !== null) {
            x.style.display = 'none';
        }
        if (event == null ) {
            if (x !== null) {
                x.style.display = 'inline-block';
                window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
            }
        }
        /* get data from form and fill variables */
        name = validator.trim(event?.target?.name?.value);
        date = validator.trim(event?.target?.date?.value);
        time = validator.trim(event?.target?.time?.value);
        location = validator.trim(event?.target?.location?.value);
        per_table = event?.target?.per_table?.value;

        /* validate form based on above data */
        validateName(null, name);
        validateDate(null, date);
        validateLocation(null, location);
        validateTable(null, per_table);
        firstTime = false;

        errorFound = !(validName && validDate && validLoc && validPerTable);

        if (!errorFound) {
            /* if form is good, sendEvent */
            try {
                const initTable = [{id: uuid(), name: 'Table 1', guests: []}];
                const result = await sendEvent(name, window.uidState, date, time, location, initTable, per_table);
                if (result.status === 200) {
                    const data = await result.json();
                    const id: string = data._id;
                    /* if sendEvent is successful, go to next page after adding event to global list */
                    const eventsList = window.eventsState;
                    const newEvent = {id: id, uid: window.uidState, name: name, date: date, time: time, location: location, perTable: per_table, tables: initTable, guestList: []}
                    eventsList.push(newEvent);
                    window.setEvents(eventsList);
                    window.setActiveEvent(newEvent);
                    history.push('/uploadGuestList');
                }
                else {
                    if (x !== null) {
                        x.style.display = 'inline-block';
                        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                    }
                }

            }
            catch {
                if (x !== null) {
                    x.style.display = 'inline-block';
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                }
            }
        }
        /* if there is an error, tell the user */
        else {
            const y = document.getElementById('eventFormError');
            if (y !== null) {
                y.style.display = 'inline-block';
                window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
            }
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
            <section className='formBox'>
                <TextField
                    variant='outlined'
                    size='small'
                    type="text"
                    label='Event Name'
                    name='name'
                    error={nameError}
                    helperText={nameError ? 'Must be at least one character (alphanumeric and [-_. &!\'] only)' : ''}
                    onChange={validateName}/>
                <TextField
                    variant='outlined'
                    size='small'
                    type="text"
                    label='Event Location (optional)'
                    name='location'
                    error={locError}
                    helperText={locError ? 'Can only contain spaces and [a-zA-Z0-9.\'&!-_,]' : ''}
                    onChange={validateLocation}/>
                <TextField
                    variant='outlined'
                    size='small'
                    type="date"
                    label='Event Date'
                    name='date'
                    InputLabelProps={{ shrink: true }}
                    error={dateError}
                    helperText={dateError ? 'Please enter a date that is after today' : ''}
                    onChange={validateDate}/>
                <TextField
                    variant='outlined'
                    size='small'
                    type="time"
                    label='Event Time (optional)'
                    name='time'
                    InputLabelProps={{ shrink: true }}
                    />
                <TextField
                    variant='outlined'
                    size='small'
                    type="number"
                    defaultValue='10'
                    label='Attendees Per Table'
                    name='per_table'
                    InputLabelProps={{ shrink: true }}
                    error={perTableError}
                    helperText={perTableError ? 'Please enter a positive number' : ''}
                    onChange={validateTable}
                    />
            </section>
            <Button type='submit' className='basicBtn' variant='contained'>Create!</Button>
        </form>
    </>
    );
}

async function sendEvent(name: string, uid: string, date: string, time: string, location: string, initTable: Table[], per_table: number) {
    // location cannot be empty string when sent to database
    if (location === '') {
        location = 'N/A';
    }
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // TODO: Simon change date to date and time info
        body: JSON.stringify({
            event_name: name,
            _userId: uid,
            event_start_time: Number(Date.parse(new Date(date + " " + time).toString())),
            location: location,
            attendees_per_table: Number(per_table),
            tables: initTable,
            guest_list: [],
            surveys_sent: [],
            })
        };
    return fetch('http://localhost:3001/events/newEvent', requestOptions);
}

/*
 * Checks to see if there are any errors in order to show
 * or hide the error at the top of the page
 */
function checkAllErrors(name: string, date: string, location: string, per_table: number) {
    const strNum1 = validator.trim(per_table.toString());
    const error = (!validator.isEmpty(strNum1) && per_table > 0) && (validator.isWhitelisted(location.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_., &!\''))
    && (validator.isDate(date) && validator.isAfter(date)) && (!validator.isEmpty(name) && validator.isWhitelisted(name.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_. &!\''));

    let x = document.getElementById('eventFormError');
    // if there's an error, keep the item visible
    if (!error) {
        if (x !== null) {
            x.style.display = 'inline-block';
        }
    }
    // otherwise, hide it
    else {
        if (x !== null) {
            x.style.display = 'none';
        }
    }
}
