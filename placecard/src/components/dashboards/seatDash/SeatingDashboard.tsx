import { Link } from "react-router-dom";
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

export function SeatingDashboard() {
    const name = 'Wedding';
    const date = '10/10/10';
    const survComp = 10;
    const perTable = 10;
    const seats = 100;
    const tables = Math.ceil(seats / perTable);
    const seated = 3;

    const [editing, toggleEditing] = useState([false, true])
    const [tableList, changeName] = useState(['Table1', 'table2']);
    const rows: GridRowsProp = [
        { id: 1, col1: 'Hello', col2: 'World' },
        { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
        { id: 3, col1: 'MUI', col2: 'is Amazing' },
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

    const empty = () => { };

    const columns: GridColDef[] = [
        { field: 'col1', headerName: 'Guests', width: 300, headerAlign: 'center', headerClassName: 'tableTitle' },
    ];
    return (
        <>
            <section className='header'>
                <section className='titleBar'>
                    <h1>Wedding | 10/10/10</h1>
                    <Button variant='outlined'>Return to Dashboard</Button>
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

            <Grid className='dashBody' container spacing={6}>
                <Grid item xs={3}>
                    <div className='guestTable' style={{ height: 500, width: '100%' }}>
                        <DataGrid rows={rows} columns={columns} hideFooter={true} />
                    </div>
                </Grid>

                <Grid item xs={9}>
                    <Card>
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
                        {tableList.map((el, ind) =>
                            <DragDropContext onDragEnd={empty}>
                                <Card>
                                    <AppBar position='static' color='inherit'>
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
                                                {[...Array(perTable)].map((i, ind) =>
                                                    <Draggable draggableId={ind.toString()} index={ind}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <p>{ind}</p>
                                                            </div>
                                                        )}
                                                    </Draggable>)}
                                            </div>
                                        )}
                                    </Droppable>
                                </Card>
                            </DragDropContext>
                        )}
                    </Card>
                </Grid>
            </Grid>

        </>
    );
}