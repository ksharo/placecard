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

export function SeatingDashboard() {
    const history = useHistory();
    let handleClick =  () => {
        history.push('/eventDash');
      }  
    const name = 'Wedding';
    const date = '10/10/10';
    const survComp = 10;
    const perTable = 10;
    const seats = 100;
    const tables = Math.ceil(seats / perTable);
    const seated = 3;

    const [editing, toggleEditing] = useState([false, true, false, false, false])
    const [tableList, changeName] = useState(['Table1', 'table2', 'table3', 'hi', 'testThis']);
    const [tablesData, editTablesData] = useState([["apple", "adam", "arkansas"], ["chips"]])
    const rows: GridRowsProp = [
        { id: 1, col1: 'Bob', col2: '1', col3: <select/>},
        { id: 2, col1: 'Larry', col2: '1' },
        { id: 3, col1: 'Junior', col2: '3' },
    ];

    const columns: GridColDef[] = [
        { field: 'col1', headerName: 'Name', headerAlign: 'left', cellClassName: 'nameCell', flex: 6},
        { field: 'col2', headerName: 'Party Size', headerAlign: 'center', cellClassName: 'centeredCell', flex: 3},
        { field: 'col3', headerName: 'Table', renderCell: () => {
           return (<select>
                    <option selected disabled>No Table</option>
                    {tableList.map( (name) => 
                            <option value={name}>{name}</option>
                    )}
                </select>)
        }, headerAlign: 'center',  cellClassName: 'centeredCell', flex: 4},
    ];

    const updateState = (ind: number, ed: any[], item: any, updater: any) => {
        const eTemp = [...ed];
        eTemp[ind] = item;
        updater(eTemp);
    };

    const getNewName = (ind: number) => {
        const nameEl = document.getElementById('tableName' + ind);
        if (nameEl) {
            return (nameEl as HTMLInputElement).value;
        }
        return '';
    };

    const empty = (result: any) => {
        const { destination, source, draggableId } = result;
        console.log(destination);
        console.log(source);
        console.log(draggableId)

        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        console.log(tablesData)
        console.log(tablesData[destination.droppableId])

        const newIds = Array.from(tablesData[destination.droppableId])
        newIds.splice(source.index, 1);
        newIds.splice(destination.index, 0, destination.droppableId)

        const newColumn = {
            ...tablesData[destination.droppableId],
            taskIds: newIds
        }

        const newState = {
            ...tablesData,
            columns: newColumn
        }

        editTablesData(newState)
    };

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

            <Grid className='dashBody' container spacing={6} columns={{xs:1, sm:2, md:12}}>
                <Grid item xs={1} sm={1} md={4}>
                    <Card>
                        <AppBar className='tableTitle' position='static' color='inherit'>
                            <Toolbar className='toolbar tableTitle centeredContent'>
                                <Typography variant='h5'>Guests</Typography>
                            </Toolbar>
                        </AppBar>
                        <div className='guestTable' style={{ height: 500, width: '100%' }}>
                            <DataGrid rows={rows} columns={columns} hideFooter={true} disableSelectionOnClick={true} />
                        </div>
                    </Card>
                </Grid>

                <Grid item xs={1} sm={1} md={8}>
                    <Card className='seatingChart'>
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
                        <Grid container spacing={{xs:1, md: 2, lg: 4}} columns={{ xs: 1, md: 2, lg: 3 }}>
                            {tableList.map((el, ind) =>
                                <Grid item xs={1} md={1} lg={1}>
                                    <DragDropContext onDragEnd={empty}>
                                        <Card className='tableBox'>
                                            <AppBar position='static' className='tableHeader'>
                                                <Toolbar>
                                                    {editing[ind] ?
                                                        <><input id={'tableName' + ind} defaultValue={el} />
                                                            <IconButton onClick={(e) => { updateState(ind, tableList, getNewName(ind), changeName); updateState(ind, editing, !editing[ind], toggleEditing) }}>
                                                                <IoIosSave />
                                                            </IconButton></>
                                                        :
                                                        <><Typography variant='h6'> {el} </Typography>
                                                            <IconButton onClick={() => updateState(ind, editing, !editing[ind], toggleEditing)}>
                                                                <AiFillEdit />
                                                            </IconButton></>}
                                                    <Button variant='text' size='small'>Clear</Button>
                                                </Toolbar>
                                            </AppBar>
                                            <Droppable droppableId={ind.toString()}>
                                                {(provided) => (
                                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                                        <ul>
                                                            {[...Array(perTable)].map((i, ind) =>
                                                                <Draggable draggableId={ind.toString()} index={ind}>
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                        >
                                                                            <li className='seat'>
                                                                                {ind} {i}
                                                                                <MdLock />
                                                                                {/* <MdLockOpen /> */}
                                                                            </li>
                                                                        </div>
                                                                    )}

                                                                </Draggable>)}
                                                            {provided.placeholder}
                                                        </ul>
                                                    </div>
                                                )}

                                            </Droppable>
                                        </Card>
                                    </DragDropContext>
                                </Grid>
                            )}
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            </>
        }
        </>
    );
}