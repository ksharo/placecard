import { useHistory } from "react-router-dom";
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import './SeatingDashboard.css';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { AiFillEdit } from 'react-icons/ai';
import { useState } from "react";
import { IoIosSave } from "react-icons/io";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MdLock, MdLockOpen } from 'react-icons/md';
import moment from 'moment';
import React from "react";

const editList: boolean[] = [];
for (let x in (window.activeEvent? window.activeEvent.tables : [])) {
    editList.push(false);
}


export function SeatingDashboard() {
    const history = useHistory();
    let handleClick =  () => {
        history.push('/eventDash');
      }  

    const survComp = 10;
    const perTable = 10;
    const seats = 100;
    const tables = Math.ceil(seats / perTable);
    const seated = 3;
    let origTables: Table[] = [];
    if (window.activeEvent != undefined) {
        origTables = window.activeEvent.tables;
    }
    const [tablesData, setTablesData] = React.useState(origTables);
    const idList: string[] = [];
    for (let x of tablesData) {
        idList.push(x.id);
    }
    const [editing, toggleEditing] = React.useState(editList);


    // get the data we need for the guests to be in the rows
    const tmpRows = [];
    const curEvent = window.activeEvent;
    const guestData = curEvent?.guestList;
    if (guestData != undefined) {
        for (let guest of guestData) {
            tmpRows.push({id: guest.id, col1: guest.name, col2: guest.size});
        }
    }
    const rows: GridRowsProp = tmpRows;


    const columns: GridColDef[] = [
        { field: 'col1', headerName: 'Name', headerAlign: 'left', cellClassName: 'nameCell', flex: 3},
        { field: 'col2', headerName: 'Size', headerAlign: 'center', cellClassName: 'centeredCell', flex: 1},
    ];

    const renameTable = (table: Table, open: boolean) => {
        editList[idList.indexOf(table.id)] = open; 
        toggleEditing([...editList]); 
        if (open == false) {
            for (let x of origTables) {
                if (table.id == x.id) {
                    x.name = (document.getElementById('tableName'+table.id) as HTMLInputElement).value;
                    setTablesData(origTables);
                    break;
                }
            }
        }
    }

    const onDragEnd = (result: any, columns: any, setColumns: any) => {
        // make sure that result is in the right format
        if (!result.destination) return;
        const { source, destination } = result;
        // do stuff if the name was moved from one column to another
        if (source.droppableId !== destination.droppableId) {
            // find the data at the to/from columns
            let sourceColumn: Table = {id: '', guests: [], name: ''};
            let destColumn: Table = {id: '', guests: [], name: ''};
            for (let x of tablesData) {
                if (x.id == source.droppableId) {
                    sourceColumn = x;
                }
                if (x.id == destination.droppableId) {
                    destColumn = x;
                }
            }
            // get the items from each column in a copied list
            const sourceItems = [...sourceColumn.guests];
            const destItems = [...destColumn.guests];
            // take the item that was removed from the source list
            const [removed] = sourceItems.splice(source.index, 1);
            // put it into the destination list. 
            // Don't delete anything, just put it in the right position (index)
            destItems.splice(destination.index, 0, removed);
            const tmpTables = tablesData;
            for (let x of tmpTables) {
                if (x.id == source.droppableId)  {
                    x.guests = sourceItems;
                }
                if (x.id == destination.droppableId) {
                    x.guests = destItems;
                }
            }
            setTablesData(tmpTables);
        }
    }

    return (
        <>
            {window.activeEvent == null ? 
            <>
            <h1 className='title'>Error: No event found.</h1>
            <Button variant='outlined' onClick={handleClick}>Return to Dashboard</Button>
            </>
            :
            <>
            <section className='header'>
                <section className='titleBar'>
                    <h1>{window.activeEvent.name} | {moment(window.activeEvent.date).format('MM/DD/YY')}</h1>
                    <Button variant='outlined' onClick={handleClick}>Return to Dashboard</Button>
                </section>
                <hr />
            </section>
            {/* Header Code  */}
            <Grid container className='dashBody' spacing={0} columns={24}>
                <Grid item xs={3}>
                    <h3 className='seatStat'>{survComp}%</h3>
                    <p className='statLabel'>Survey Completion</p>
                </Grid>
                <Grid item xs={9}>
                </Grid>
                <Grid item xs={3}>
                    <h3 className='seatStat'>{tables}</h3>
                    <p className='statLabel'>Total Tables</p>
                </Grid>
                <Grid item xs={3}>
                    <h3 className='seatStat'>{seats}</h3>
                    <p className='statLabel'>Total Seats</p>
                </Grid>
                <Grid item xs={3}>
                    <h3 className='seatStat'>{seated}</h3>
                    <p className='statLabel'>Seated Guests</p>
                </Grid>
                <Grid item xs={3}>
                    <h3 className='seatStat'>{seats - seated}</h3>
                    <p className='statLabel'>Available Seats</p>
                </Grid>
            </Grid>
            {/* Unseated Guests Sidebar */}
            <DragDropContext onDragEnd={result => onDragEnd(result, tablesData, setTablesData)}>

            <Grid className='dashBody' container spacing={6} columns={{xs:1, sm:2, md:12}}>
                <Grid item xs={1} sm={1} md={4}>
                    <Card>
                        <AppBar className='tableTitle' position='static' color='inherit'>
                            <Toolbar className='toolbar tableTitle centeredContent'>
                                <Typography variant='h5'>Unseated Guests</Typography>
                            </Toolbar>
                        </AppBar>
                        <div className='guestTable' style={{ height: 500, width: '100%' }}>
                            <DataGrid rows={rows} columns={columns} hideFooter={true} disableSelectionOnClick={true} />
                        </div>
                    </Card>
                </Grid>
                {/* Begin Central Seating Chart Code */}
                <Grid item xs={1} sm={1} md={8}>
                    <Card className='seatingChart'>
                        {/* Header within central seating chart */}
                        <AppBar className='tableTitle' position='static' color='inherit'>
                            <Toolbar className='toolbar tableTitle'>
                                <section className='verticalContainer'>
                                    <Button variant='contained' size='small'>Lock All</Button>
                                    <Button variant='contained' size='small'>Clear All</Button>
                                </section>
                                <Typography variant='h5'>Seating Chart</Typography>
                                <Button variant='contained' size='medium'>Generate New Plan</Button>
                            </Toolbar>
                        </AppBar>
                        {/* Body of seating chart, containing the table boxes */}
                            <Grid container spacing={{xs:1, md: 2, lg: 4}} columns={{ xs: 1, md: 2, lg: 3 }}>
                                {Object.entries(tablesData).map(([_, table]) => {
                                        return (
                                            <Grid item xs={1} md={1} lg={1}>
                                                <Card className='tableBox'>
                                                    <AppBar position='static' className='tableHeader'>
                                                        <Toolbar>
                                                        {editing[idList.indexOf(table.id)] ?
                                                        <><input id={'tableName' + table.id} defaultValue={table.name} onKeyDown={(event: any) => {if (event.key=='Enter'){ renameTable(table, false)}}}/>
                                                            <IconButton onClick={() => renameTable(table, false)}>
                                                                <IoIosSave />
                                                            </IconButton></>
                                                        :
                                                        <><Typography variant='h6'> {table.name} </Typography>
                                                            <IconButton onClick={() => renameTable(table, true)}>
                                                                <AiFillEdit />
                                                            </IconButton></>}
                                                            <Button variant='text' size='small'>Clear</Button>
                                                        </Toolbar>
                                                    </AppBar>
                                                    <Droppable droppableId={table.id} key={table.id}>
                                                        {(provided, snapshot) => {
                                                            return (
                                                                <section className='tableInSeatDash' {...provided.droppableProps} ref={provided.innerRef}>
                                                                    {table.guests.map((guest, index) => {
                                                                        return (
                                                                            <Draggable key={guest.id} draggableId={guest.id} index={index}>
                                                                                {(provided, snapshot) => {
                                                                                    return (
                                                                                        <section ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}>
                                                                                            <p>{guest.name}</p>
                                                                                        </section>
                                                                                    );
                                                                                }}
                                                                            </Draggable>
                                                                        );
                                                                    })
                                                                    }
                                                                    {provided.placeholder}
                                                                </section>
                                                            );
                                                        }}
                                                    </Droppable>
                                                </Card>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                    </Card>
                </Grid>
            </Grid>
            </DragDropContext>
            </>
        }
        </>
    );
}