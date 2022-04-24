import { Link, useHistory } from "react-router-dom";
import { EventBox } from "./EventBox";
import './UserDashboard.css';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { Button, Card, CardActions, CardContent, CardHeader, CircularProgress, IconButton, Switch } from "@mui/material";
import { AiFillPlusCircle } from "react-icons/ai";
import React, { useLayoutEffect } from "react";
import { HiTrash } from 'react-icons/hi';


export function UserDashboard() {
    window.setGuestMode(false);
    const [viewAll, setView] = React.useState(false);
    const history = useHistory();
    const handleClick = async (event: PlacecardEvent) => {
        window.setActiveEvent(event);
        // get the event again so that we update the time
        const result = await fetch('http://localhost:3001/events/' + event.id);
        if (result.ok) {
            const data = await result.json();
            const updatedEvent = {
                'id': data._id,
                'uid': data._userId,
                'name': data.event_name,
                'date': (new Date(data.event_start_time)).toLocaleString().split(',')[0],
                'time': (new Date(data.event_start_time)).toTimeString().split(' ')[0],
                'location': data.location,
                'tables': event.tables,
                'perTable': data.attendees_per_table,
                'guestList': event.guestList,
                'respondents': event.respondents,
                'surveys': data.surveys_sent
            }
            window.setActiveEvent(updatedEvent);
            window.setInvitees(event.guestList);
        }
        else {
            console.error('Could not update event');
        }
        history.push('/eventDash');
    };

    const newEvent = () => {
        history.push('/createEvent');
    };

    const columns = [
        {
            field: 'eventName',
            headerName: 'Your Events',
            width: 198
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 148
        },
        {
            field: 'countdown',
            headerName: 'Days Left',
            width: 148
        },
        {
            field: 'dashboards',
            headerName: '',
            width: 148,
            renderCell: (params: any) => {
                return <Button className='basicBtn fitBtn dashBtn' onClick={() => handleClick(params.value)} size='small' variant='contained'>Dashboard</Button>
            }
        },
        {
            field: 'deletes',
            headerName: '',
            width: 98,
            renderCell: (params: any) => {
                return <IconButton onClick={() => showDelWarning(params.value)}><HiTrash /></IconButton>
            }
        }
    ];

    const [rowsState, setRows]: [any, any] = React.useState([]);
    const [tableHeight, setTableHeight] = React.useState<number>(500)

    useLayoutEffect(() => {
        const rows: any = [];
        for (let event of window.eventsState) {
            const daysLeft = Math.ceil(((new Date(event.date)).valueOf() - (new Date()).valueOf()) / 100000000);
            let daysLeftString = daysLeft.toString();
            if (daysLeft === 0) {
                daysLeftString = 'Today is the day!';
            }
            else if (daysLeft === 1) {
                daysLeftString = '1 Day Left!';
            }
            else if (daysLeft < 0) {
                daysLeftString = 'Event has ended.';
            }
            if (daysLeft >= 0 || viewAll) {
                rows.push({
                    id: event.id,
                    eventName: event.name,
                    countdown: !isNaN(Number(daysLeftString)) ? Number(daysLeftString) : (daysLeftString),
                    date: moment(event.date).format('MM / DD / YYYY'),
                    dashboards: event,
                    deletes: event.id
                });
            }
        }
        setRows([...rows]);
        if (window.eventsState.length < 1) {
            setTableHeight(500)
        }
        else {
            setTableHeight(Math.min(500, (60 + (Math.max(1, rows.length) * 52))))
        }

    }, [window.eventsState, viewAll]);

    const updateRows = () => {
        setView(!viewAll);
    };

    const showDelWarning = (eventId: string) => {
        const x = document.getElementById('hiddenWarning');
        if (x !== null) {
            x.style.display = 'block';
            x.classList.add(eventId);
        }
    }
    const del = async () => {
        hideWarning();
        const x = document.getElementById('hiddenWarning');
        let eventId: string = '';
        if (x !== null) {
            eventId = x.classList[x?.classList.length-1];
        }
        if (eventId !== '') {
            try {
                const confirmation = await deleteEvent(eventId);
                if (confirmation.status === 200) {
                    const events = [...window.eventsState];
                    const matchingId = (event: PlacecardEvent) => event.id === eventId;
                    const deletedInd = events.findIndex(matchingId);
                    events.splice(deletedInd, 1);
                    window.setEvents(events);
                    if (window.activeEvent !== null && window.activeEvent.id === eventId) {
                        window.setActiveEvent(undefined);
                    }
                }
                else {
                    console.error('Error: delete event failed');
                }
            }
            catch (e) {
                console.error(e);
            }
        }
    }

    const loadingCircle = () => {
        return (
            <section className='loadingCircle'>
                {window.eventsState === rowsState ? <p>No Events</p> :
                    <>
                        <p>Loading...</p>
                        <CircularProgress size={24} />
                    </>
                }
            </section>
        )
    }
    const hideWarning = () => {
        const x = document.getElementById('hiddenWarning');
        if (x !== null) {
            x.style.display = 'none';
        }
    }
    return (
        <>
            <section className='hiddenBoxes' id='hiddenWarning'>
                <Card className='innerBox'>
                    <CardHeader className='innerBoxHeader' title='Notice' />
                    <CardContent className='innerBoxContent'>
                        <p className='subtitle'>You are about to delete this event.</p>
                        <p className='subtitle'>Are you sure you want to continue?</p>
                    </CardContent>
                    <CardActions className='spacedBtns'>
                        <Button variant='contained' className='basicBtn' onClick={hideWarning}>No</Button>
                        <Button variant='contained' className='basicBtn' onClick={del}>Yes</Button>
                    </CardActions>
                </Card>
            </section>
            <h1 className='title'>Welcome back{window.firstNameState.trim() === '' ? '!' : ', ' + window.firstNameState + '!'}</h1>
            <section className='userDashContent'>
                <div style={{ 'height': tableHeight }} className='table'>
                    <DataGrid
                        rows={rowsState}
                        columns={columns}
                        disableColumnMenu={true}
                        hideFooter={true}
                        disableSelectionOnClick={true}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'countdown', sort: 'asc' }],
                            },
                        }}
                        components={{
                            NoRowsOverlay: loadingCircle,
                        }}
                    />
                </div>

                <section className='userDashFooter'>
                    <Button variant='contained' className='leftBtn' onClick={newEvent}><AiFillPlusCircle className='plusBtn' />Add New Event</Button>
                    <label>
                        <Switch onChange={updateRows} checked={!viewAll} />
                        Show Only Future Events
                    </label>
                </section>
            </section>
        </>
    );
}

function deleteEvent(eventId: string) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return fetch('http://localhost:3001/events/' + eventId, requestOptions);
}
