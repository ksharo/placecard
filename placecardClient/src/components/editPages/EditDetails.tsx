import '../forms/Forms.css'
import './editPages.css'
import { useHistory } from "react-router-dom";
import validator from 'validator';
import { Button, Card, CardActions, CardContent, CardHeader, TextField } from '@mui/material';
import moment from 'moment';
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

export function EditDetails(){
    const history = useHistory();
    
    /* Variables to keep track of if each textField shows an error */
    const [nameError, setNameError] = React.useState(!validName);
    const [locError, setLocError] = React.useState(!validLoc);
    const [dateError, setDateError] = React.useState(!validDate);
    const [perTableError, setPerTableError] = React.useState(!validPerTable);

    let validateName = (event: any, val?: string) => {
        if (val != undefined) {
            name = val;
        }
        else {
            name = validator.trim(event.target.value);
        }
        if (!firstTime || val != undefined) {
            const valid = !validator.isEmpty(name) && validator.isWhitelisted(name.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_. &!\'');
            validName = valid;
            setNameError(!valid);
            checkAllErrors(name, date, location, per_table);
        }
    };

    let validateDate = (event: any, val?: string) => {
        if (val != undefined) {
            date = val;
        }
        else {
            date = event.target.value;
        }
        if (!firstTime || val != undefined) {
            const valid = validator.isDate(date) && validator.isAfter(date);
            validDate = valid;
            setDateError(!valid);
            checkAllErrors(name, date, location, per_table);
        }
    };

    let validateLocation = (event: any, val?: string) => {
        if (val != undefined) {
            location = val;
        }
        else {
            location = validator.trim(event.target.value);
        }
        if (!firstTime || val != undefined) {
            const valid = validator.isWhitelisted(location.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789-_., &!\'');
            validLoc = valid;
            setLocError(!valid);
            checkAllErrors(name, date, location, per_table);
        }
    };

    let validateTable = (event: any, val?: number) => {
        if (val != undefined) {
            per_table = val;
        }
        else {
            per_table = event.target.value;
        }
        if (!firstTime || val != undefined) {
            const strNum = validator.trim(per_table.toString());
            const valid = !validator.isEmpty(strNum) && per_table > 0;
            validPerTable = valid;
            setPerTableError(!valid);
            checkAllErrors(name, date, location, per_table);
        }
    };
    
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
                /* send the edited event to the backend */
                if (window.activeEvent != null) {
                    const result = await updateEvent(window.activeEvent.id, name, date, time, location, per_table, window.activeEvent.tables, window.activeEvent.guestList);
                    /* if sendEvent is successful, go back to dashboard after updating globals */
                    if (result.status == 200) {
                        const activeEvent = {id: window.activeEvent.id, uid: window.uidState, name: name, date: date, time: time, location: location, perTable: per_table, tables: window.activeEvent.tables, guestList: window.activeEvent.guestList};
                        /* first change list */
                        const events = [...window.eventsState];
                        const curEvent = window.activeEvent;
                        for (let i = 0; i < events.length; i++) {
                            const event = events[i];
                            if (curEvent.id == event.id) {
                                    /* found the matching event! */
                                    events[i] = activeEvent;
                                    break;
                                }
                        }
                        window.setEvents(events);
                        /* then change active event */
                        window.setActiveEvent(activeEvent);
                        history.goBack(); 
                    }
                    else {
                        if (x != null) {
                            x.style.display = 'inline-block';
                            window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                        } 
                    }          
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
        /* if there is an error, tell the user */
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
            window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        }
    };
    const toDashboard = () => {
        history.goBack();
    };
    const toHome = () => {
        history.goBack();
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
     <Button variant='contained' className='basicBtn' onClick={toHome}>Return Home</Button>
     </>
     : 
        <>
        <section className='hiddenBoxes' id='hiddenWarning'>
            <Card className='innerBox'>
                <CardHeader className='innerBoxHeader' title='Notice'/>
                <CardContent className='innerBoxContent'>
                    <p className='subtitle'>Your changes may not be saved.</p>
                    <p className='subtitle'>Are you sure you want to continue?</p>
                </CardContent>
                <CardActions className='spacedBtns'>
                    <Button variant='contained' className='basicBtn' onClick={hideWarning}>No</Button>
                    <Button variant='contained' className='basicBtn' onClick={toDashboard}>Yes</Button>
                </CardActions>
            </Card>
        </section>
        <h1 className='title'>Edit Your Event</h1>
        <p className='subtitle pageError' id='editEventError'>Please fix the errors.</p>
        <p className='subtitle pageError' id='sendEventEditError'>Something went wrong. Please try again.</p>
        <form className='vertical-form' onSubmit={handleSubmit} id='editEventForm'>
            <section className='formBox'>
                <TextField 
                    size='small'
                    variant='outlined' 
                    type="text" 
                    label='Event Name' 
                    name='name'
                    defaultValue={window.activeEvent.name}
                    error={nameError} 
                    helperText={nameError ? 'Must be at least one character (alphanumeric and [-_. &!\'] only)' : ''}  
                    onChange={validateName}/>
                <TextField 
                    size='small'
                    variant='outlined' 
                    type="text" 
                    label='Event Location (optional)' 
                    name='location'
                    defaultValue={window.activeEvent.location=='N/A' ? '' : window.activeEvent.location}
                    error={locError} 
                    helperText={locError ? 'Can only contain spaces and [a-zA-Z0-9.\'&!-_,]' : ''}  
                    onChange={validateLocation}/>
                <TextField 
                    variant='outlined' 
                    size='small'
                    type="date" 
                    label='Event Date' 
                    name='date'
                    defaultValue={moment(window.activeEvent.date).format('YYYY-MM-DD')}
                    InputLabelProps={{ shrink: true }}
                    error={dateError} 
                    helperText={dateError ? 'Please enter a date that is after today' : ''}  
                    onChange={validateDate}/>
                <TextField 
                    variant='outlined' 
                    size='small'
                    type="time" 
                    label='Event Time (optional)' 
                    defaultValue={window.activeEvent.time}
                    name='time'
                    InputLabelProps={{ shrink: true }}  
                    />
                <TextField 
                    variant='outlined' 
                    size='small'
                    type="number" 
                    label='Attendees Per Table' 
                    name='per_table'
                    defaultValue={window.activeEvent.perTable}
                    InputLabelProps={{ shrink: true }}
                    error={perTableError} 
                    helperText={perTableError ? 'Please enter a positive number' : ''}  
                    onChange={validateTable}
                    />
            </section>
            <section className='horizontalFlex closeButtons'> 
                <Button className='basicBtn' variant='contained' onClick={noSave}>Go Back</Button>
                <Button type='submit' className='basicBtn' variant='contained'>Save</Button>
            </section>
        </form>
        </>
    }
    </>
    
    );
}

async function updateEvent(id: string, name: string, date: string, time: string, location: string, per_table: number, tables: Table[], guestList: Invitee[]) {
    /* location cannot be empty string when sent to database */
    if (location == '') {
        location = 'N/A';
    }
    const requestOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event_name: name,
            event_start_time: Number(Date.parse(new Date(date + " " + time).toString())),
            location: location,
            attendees_per_table: Number(per_table),
            })
        };
    return fetch('http://localhost:3001/events/updateEvent/'+id.toString(), requestOptions);
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
    /* if there's an error, keep the item visible */
    if (!error) {
        if (x != null) {
            x.style.display = 'inline-block';
        }
    }
    /* otherwise, hide it */
    else {
        if (x != null) {
            x.style.display = 'none';
        }
    }
}