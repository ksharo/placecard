import { useHistory } from "react-router-dom";
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import './SeatingDashboard.css';
import { AppBar, CardActions, CardHeader, IconButton, TextField, Toolbar, Typography } from "@mui/material";
import { AiFillEdit } from 'react-icons/ai';
import { IoIosSave } from "react-icons/io";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import moment from 'moment';
import React from "react";
import {uuid} from "uuidv4";

const unseatedID = uuid();

const editList: boolean[] = [];
for (let x in (window.activeEvent? window.activeEvent.tables : [])) {
    editList.push(false);
}

export function SeatingDashboard() {
    const history = useHistory();
    let handleClick =  () => {
        history.push('/eventDash');
    }  

    let survComp = 0;
    let perTable = -1;
    let num_attend = 0;
    let tables = Math.ceil(num_attend / perTable);
    let seats = tables*perTable;
    let origTables: Table[] = [];
    const tmpUnseated: Invitee[] = [];
    const idList: string[] = [];

    if (window.activeEvent != undefined) {
        console.log(window.activeEvent);
        origTables = window.activeEvent.tables;
        for (let x of origTables) {
            idList.push(x.id);
        }
        perTable = window.activeEvent.perTable;
        num_attend = window.activeEvent.guestList.length;
        tables = Math.ceil(num_attend / perTable);
        seats = tables*perTable;
        for (let x of window.activeEvent.guestList) {
            let isUnseated = true;
            for (let t of window.activeEvent.tables) {
                if (t.guests.includes(x)) {
                    isUnseated = false;
                    break;
                }
            }
            if (isUnseated) {
                tmpUnseated.push(x);
            }
        }
    }
    const [tablesData, setTablesData] = React.useState(origTables);

    const [editing, toggleEditing] = React.useState(editList);
    const [unseated, setUnseated] = React.useState(tmpUnseated);
    const [seated, setSeated] = React.useState(num_attend - unseated.length);


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
            // if just dragging between tables, this will work fine
            if (source.droppableId != unseatedID && destination.droppableId != unseatedID) {
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
                        x.guests = [...sourceItems];
                    }
                    if (x.id == destination.droppableId) {
                        x.guests = [...destItems];
                    }
                }
                setTablesData([...tmpTables]);
            }
            else {
                if (source.droppableId == unseatedID) {
                    // find the data at the to/from columns
                    let destColumn: Table = {id: '', guests: [], name: ''};
                    for (let x of tablesData) {
                        if (x.id == destination.droppableId) {
                            destColumn = x;
                            break;
                        }
                    }
                    // get the items from each column in a copied list
                    const sourceItems = unseated;
                    const destItems = [...destColumn.guests];
                    // take the item that was removed from the source list
                    const [removed] = sourceItems.splice(source.index, 1);
                    // put it into the destination list. 
                    // Don't delete anything, just put it in the right position (index)
                    destItems.splice(destination.index, 0, removed);
                    const tmpTables = tablesData;
                    for (let x of tmpTables) {
                        if (x.id == destination.droppableId) {
                            x.guests = [...destItems];
                        }
                    }
                    setTablesData([...tmpTables]);
                    setUnseated([...sourceItems]);
                    setSeated(seated + 1);
                }
                else if (destination.droppableId == unseatedID) {
                    // find the data at the to/from columns
                    let sourceColumn: Table = {id: '', guests: [], name: ''};
                    for (let x of tablesData) {
                        if (x.id == source.droppableId) {
                            sourceColumn = x;
                            break;
                        }
                    }
                    // get the items from each column in a copied list
                    const destItems = unseated;
                    const sourceItems = [...sourceColumn.guests];
                    // take the item that was removed from the source list
                    const [removed] = sourceItems.splice(source.index, 1);
                    // put it into the destination list. 
                    // Don't delete anything, just put it in the right position (index)
                    destItems.splice(destination.index, 0, removed);
                    const tmpTables = tablesData;
                    for (let x of tmpTables) {
                        if (x.id == source.droppableId) {
                            x.guests = [...sourceItems];
                        }
                    }
                    setTablesData([...tmpTables]);
                    setUnseated([...destItems]);
                    setSeated(seated - 1);
                }
            }
        }
        else {
            // unseated gets different treatment from tables!!
            // sort based on drag and drop within unseated table
            if (source.droppableId == unseatedID)  {
                const copiedItems = [...unseated];
                const [removed] = copiedItems.splice(source.index, 1);
                copiedItems.splice(destination.index, 0, removed);
                // set the new column data based off of the above
                setUnseated([...copiedItems]);
            }
            // sort based on drag and drop within real table
            else {
                let sourceColumn: Table = {id: '', guests: [], name: ''};
                for (let x of tablesData) {
                    if (x.id == source.droppableId) {
                        sourceColumn = x;
                        break;
                    }
                }
                // get the items from the column in a copied list
                const sourceItems = [...sourceColumn.guests];
                const [removed] = sourceItems.splice(source.index, 1);
                sourceItems.splice(destination.index, 0, removed);
                // set the new column data based off of the above
                const tmpTables = tablesData;
                for (let x of tmpTables) {
                    if (x.id == source.droppableId)  {
                        x.guests = sourceItems;
                        break;
                    }
                }
                setTablesData([...tmpTables]);
            }
        }
    }

    const clearTable = (event: any, id?: string) => {
        let tableId = undefined;
        if (id != undefined) {
            tableId = id;
        }
        else {
            tableId = event.target.id.substring(11);
        }
        const tmpTables = tablesData;
        let nowUnseated: Invitee[] = []
        for (let x of tmpTables) {
            if (x.id == tableId) {
                nowUnseated = [...x.guests];
                x.guests = [];
            }
        }
        if (id == undefined) {
            setTablesData(tmpTables);
            setUnseated(unseated.concat(nowUnseated));
            setSeated(seated - nowUnseated.length);
        }
    };

    const clearAll = () => {
        const newTables: Table[] = [];
        let newUnseated: Invitee[] = unseated;
        for (let x of tablesData) {
            newUnseated = newUnseated.concat(x.guests);
            clearTable(null, x.id);
            newTables.push({id: x.id, name: x.name, guests: []});
        }
        setTablesData(newTables);
        setUnseated(newUnseated);
        setSeated(0);
    };
    const title = window.activeEvent == null ? 'Event' : `${window.activeEvent.name}  |  ${moment(window.activeEvent.date).format('MM / DD / YYYY')}`;
    return (
        <>
            {window.activeEvent == null ? 
            <>
            <h1 className='title'>Error: No event found.</h1>
            <Button variant='contained' onClick={handleClick}>Return to Dashboard</Button>
            </>
            :
            <section className='fullLengthSection'>
            <h1 className='title'>Seating Dashboard</h1>
            <Card className='topCard seatDashCard'>
                <CardHeader title={title} className='cardHeader'/>
                {/* Header Code  */}
                <Grid container className='dashBody firstCard' spacing={0} columns={26}>
                    <Grid item xs={4}>
                        <h3 className='seatStat'>{survComp}%</h3>
                        <p className='statLabel'>Survey Completion</p>
                    </Grid>
                    <Grid item xs={4}>
                        <h3 className='seatStat'>{tables}</h3>
                        <p className='statLabel'>Total Tables</p>
                    </Grid>
                    <Grid item xs={4}>
                        <h3 className='seatStat'>{seats}</h3>
                        <p className='statLabel'>Total Seats</p>
                    </Grid>
                    <Grid item xs={4}>
                        <h3 className='seatStat'>{seated}</h3>
                        <p className='statLabel'>Seated Guests</p>
                    </Grid>
                    <Grid item xs={4}>
                        <h3 className='seatStat'>{seats - seated}</h3>
                        <p className='statLabel'>Available Seats</p>
                    </Grid>
                    <Grid item xs={1}>
                    </Grid>
                    <Grid item xs={5}>
                        <Button variant='contained' className='fitBtn' onClick={handleClick}>Return to Dashboard</Button>
                    </Grid>
                </Grid>
            </Card>
            {/* Unseated Guests Sidebar */}
            <DragDropContext onDragEnd={(result) => onDragEnd(result, tablesData, setTablesData)}>

            <Grid className='dashBody' container spacing={6} columns={{xs:1, sm:2, md:12}}>
                <Grid item xs={1} sm={1} md={3}>
                    <Card className='seatDashCard'>
                        <CardHeader title='Unseated Guests' className='cardHeader'/>
                        <section className='guestTable'>
                            <Droppable droppableId={unseatedID} key={unseatedID}>
                                {(provided, snapshot) => {
                                    return (
                                        <section className={`unseatedSection ${snapshot.isDraggingOver ? "overBackground" : ""}`} {...provided.droppableProps} ref={provided.innerRef}>
                                            {unseated.map((guest: Invitee, index) => {
                                                return (
                                                    <Draggable key={guest.id} draggableId={guest.id} index={index}>
                                                        {(provided, snapshot) => {
                                                            return (
                                                                <section className={`guestName ${snapshot.isDragging ? "draggingGuest" : "placedGuest"}`} ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}>
                                                                {guest.name}
                                                                <br/>
                                                                <hr/>
                                                                <span className='smallerText'>Group: {(guest.groupName==undefined ? 'None' : guest.groupName)}</span>                                                                </section>
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
                        </section>
                    </Card>
                </Grid>
                {/* Begin Central Seating Chart Code */}
                <Grid item xs={1} sm={1} md={9}>
                    <Card className='seatingChart seatDashCard'>
                        {/* Header within central seating chart */}
                        <CardHeader title='Seating Chart' className='cardHeader'
                        action={<>
                            <Button variant='text' className='whiteTxtBtn' size='small' onClick={clearAll}>Clear All</Button>
                            &#160;&#160;|&#160;&#160;
                            <Button variant='text' className='whiteTxtBtn' size='medium'>Generate New Plan</Button>
                            </>}/>
                        {/* Body of seating chart, containing the table boxes */}
                            <Grid container spacing={{xs:1, md: 2, lg: 1}} columns={{ xs: 1, md: 2, lg: 3 }}>
                                {Object.entries(tablesData).map(([_, table]) => {
                                        return (
                                            <Grid item xs={1} md={1} lg={1}>
                                                <Card className='tableBox'>
                                                    <AppBar position='static' className='tableHeader'>
                                                        <Toolbar className='topTableHeader'>
                                                        {editing[idList.indexOf(table.id)] ?
                                                        <section className='tableName'><TextField id={'tableName' + table.id} label='Table Name' size='small' defaultValue={table.name} onKeyDown={(event: any) => {if (event.key=='Enter'){ renameTable(table, false)}}}/>
                                                            <IconButton className='noShadow' onClick={() => renameTable(table, false)}>
                                                                <IoIosSave />
                                                            </IconButton>
                                                            </section>
                                                        :
                                                        <section className='tableName'><Typography variant='h6'> {table.name} </Typography>
                                                            <IconButton className='noShadow' onClick={() => renameTable(table, true)}>
                                                                <AiFillEdit />
                                                            </IconButton></section>}
                                                            <Button variant='text' size='small' className='greyTxtBtn' id={'clearButton'+table.id} onClick={clearTable}>Clear</Button>
                                                            </Toolbar>
                                                            {/* <hr className='smallHR'/> */}
                                                            {/* <section className='tableOptions'>
                                                                <Button variant='contained' size='small' className='clearButton' id={'clearButton'+table.id} onClick={clearTable}>Clear</Button>
                                                                <p className={table.guests.length > perTable ? 'overFull' : 'tableFillLevel'}>{table.guests.length} / {perTable}</p>
                                                            </section> */}
                                                    </AppBar>
                                                    <Droppable droppableId={table.id} key={table.id}>
                                                        {(provided, snapshot) => {
                                                            return (
                                                                <section className={`tableInSeatDash ${snapshot.isDraggingOver ? "overBackground" : ""}`} {...provided.droppableProps} ref={provided.innerRef}>
                                                                    {table.guests.map((guest, index) => {
                                                                        return (
                                                                            <Draggable key={guest.id} draggableId={guest.id} index={index}>
                                                                                {(provided, snapshot) => {
                                                                                    return (
                                                                                        <section className={`guestName ${snapshot.isDragging ? "draggingGuest" : "placedGuest"}`} ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}>
                                                                                            {guest.name}
                                                                                            <br/>
                                                                                            <hr/>
                                                                                            <span className='smallerText'>Group: {(guest.groupName==undefined ? 'None' : guest.groupName)}</span>
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
                                                    <CardActions className={table.guests.length > perTable ? 'overFull' : 'tableFillLevel'}>Seated: {table.guests.length} / {perTable}</CardActions>
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
            </section>
        }
        </>
    );
}