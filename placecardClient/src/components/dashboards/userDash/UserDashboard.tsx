import { Link, useHistory } from "react-router-dom";
import { EventBox } from "./EventBox";
import './UserDashboard.css';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { Button, Switch } from "@mui/material";
import { AiFillPlusCircle } from "react-icons/ai";
import React from "react";

let showAllEvents = false;

export function UserDashboard() {
    const [viewAll, setView] = React.useState(showAllEvents);
    const history = useHistory();
    const handleClick = (event: PlacecardEvent) => {
        window.setActiveEvent(event);
        history.push('/eventDash');
    };

    const newEvent = () => {
        history.push('/createEvent');
    };

    const columns = [
        {   field: 'eventName', 
            headerName: 'Your Events', 
            width: 200 
        },
        // {
        //     field: 'location',
        //     headerName: 'Location',
        //     width: 150,
        // },
        {
            field: 'date',
            headerName: 'Date',
            width: 150
        },
        {
            field: 'countdown',
            headerName: 'Days Left',
            width: 150
        },
        {
            field: 'btns',
            headerName: '',
            width: 200,
            renderCell: (params: any) => {
				return <Button className='basicBtn fitBtn dashBtn' onClick={() => handleClick(params.value)} size='small' variant='contained'>Dashboard</Button>
			}
        }
      ];

      const rows: any = [];
      for (let i = 0; i < window.eventsState.length; i++) {
          const event = window.eventsState[i];
        //   let location = event.location;
        //   if (event.location.trim() == '') {
        //       location = 'N/A';
        //   }
            const daysLeft = Math.ceil(((new Date(event.date)).valueOf() - (new Date()).valueOf())/100000000);
            let daysLeftString = daysLeft.toString();
            if (daysLeft == 0) {
                daysLeftString = 'Today is the day!';
            }
            else if (daysLeft == 1) {
                daysLeftString = '1 Day Left!';
            }
            else if (daysLeft < 0) {
                daysLeftString = 'Event has ended.';
            }
            if (daysLeft >= 0 || viewAll) {
                rows.push({
                    id: event.id,
                    eventName: event.name,
                    countdown: daysLeftString,
                    // location: location,
                    date: moment(event.date).format('MM / DD / YYYY') ,
                    btns: event
                });
            }
      }

    const updateRows = () => {
        showAllEvents = !showAllEvents;
        setView(showAllEvents);
    };

    return (
        <>
            <h1 className='title'>Welcome back, {window.firstNameState}!</h1>
            <section className='userDashContent'>
                <div style={{'height':Math.min(500, (60+(rows.length*52)))}} className='table'>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        disableColumnMenu={true} 
                        hideFooter={true} 
                        disableSelectionOnClick={true}
                    />
                </div>
                <section className='userDashFooter'>
                    <Button variant='contained' className='leftBtn' onClick={newEvent}><AiFillPlusCircle className='plusBtn'/>Add New Event</Button>
                    <label>
                        <Switch onChange={ updateRows } defaultChecked={!viewAll}/>
                        Show Only Future Events
                    </label>
                </section>
            </section>
        </>
    );
}

