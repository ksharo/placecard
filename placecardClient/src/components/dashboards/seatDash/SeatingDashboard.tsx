import { useHistory } from "react-router-dom";
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import './SeatingDashboard.css';
import { AppBar, CardActions, CardHeader, IconButton, InputAdornment, Switch, 
    TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { AiFillEdit, AiFillMinusCircle, AiFillPlusCircle } from 'react-icons/ai';
import { IoIosClose, IoIosSave } from "react-icons/io";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import moment from 'moment';
import React, { useEffect, useLayoutEffect } from "react";
import {uuid} from "uuidv4";
import { FaExclamationCircle, FaSearch } from "react-icons/fa";
import { ObjectId } from "mongodb";

const unseatedID = uuid();
let searchTerm = '';
let seatGroupsTogether = false;
let dataHistory: {past: any[], present: any[], future: any[]} = {
    past: [],
    present: [],
    future: []
};
// let timePoint = 0;
const editList: boolean[] = [];
for (let _ in (window.activeEvent? window.activeEvent.tables : [])) {
    editList.push(false);
}
export function SeatingDashboard() {
    const history = useHistory();
    let handleClick =  () => {
        history.push('/eventDash');
    }  

    let origTables: Table[] = [];
    let tmpUnseated: Invitee[] = [];

    // let survComp = 0;
    let perTable = -1;
    let num_attend = 0;
    let tables = ((window.activeEvent != null) ? window.activeEvent.tables.length : 0);
    let tmpSeats = tables*perTable;
    const [editing, toggleEditing] = React.useState(editList);
    const [idList, setIds]: [string[], any] = React.useState([]);
    const setVariables = () => {
        const tmpIds: string[] = [];
        dataHistory.past = [];
        dataHistory.present = [];
        dataHistory.future = [];
        if (window.activeEvent != undefined && window.activeEvent != null) {
            tmpUnseated = [];
            origTables = [...window.activeEvent.tables];
            for (let x of origTables) {
                tmpIds.push(x.id);
            }
            perTable = window.activeEvent.perTable;
            tables = ((window.activeEvent != null) ? window.activeEvent.tables.length : 0);
            num_attend = window.activeEvent.guestList.length;
            tmpSeats = tables*perTable;
            let tmpEdit = [...editList];
            while (tmpSeats < num_attend) {
                const id = (new ObjectId()).toString();
                const newTable: Table = {
                    id: id,
                    name: 'Table ' + (tables+1).toString(),
                    guests: []
                }
                origTables.push(newTable);
                tables += 1;
                tmpSeats += perTable;
                tmpEdit.push(false);
                tmpIds.push(id);
            }
            toggleEditing(tmpEdit);
            const guests = window.activeEvent.guestList;
            for (let i = 0; i < guests.length; i++) {
                let x = guests[i];
                let isUnseated = true;
                if (window.activeEvent) {
                    for (let t of window.activeEvent.tables) {
                        const guestIDs = t.guests.map( (guest) => {return guest.id});
                        if (guestIDs.includes(x.id)) {
                            isUnseated = false;
                            break;
                        }
                    }
                    if (isUnseated) {
                        tmpUnseated.push(x);
                    }
                }
            }
            setUnseated([...tmpUnseated]);
            setIds([...tmpIds]);
            setTablesData(origTables);
            setData([origTables, [...tmpUnseated]]);
            setSeated(num_attend - tmpUnseated.length);
            setSeats(tmpSeats);
        }
    }


    const [tablesData, setTablesData] = React.useState(origTables);
    const [unseated, setUnseated] = React.useState(tmpUnseated);
    const [allData, setData] = React.useState([tablesData, unseated]);
    if (dataHistory.present.length == 0) {
        dataHistory.present = allData;
    }

    const [shownUnseated, searchedUnseated] = React.useState([...tmpUnseated]);
    const [seated, setSeated] = React.useState(num_attend - unseated.length);
    const [seats, setSeats] = React.useState(tmpSeats);
    const [disabled, setDisabled] = React.useState(false);

    useLayoutEffect(() => {   
        search(null, searchTerm);
    }, [unseated]);

    useEffect(() => {
        if (dataHistory.present.length > 0) {
            dataHistory.past.push([JSON.parse(JSON.stringify(dataHistory.present))]);
            dataHistory.present = allData;
            dataHistory.future = [];
        }
    }, [allData]);

    useEffect(() => {
        executeUpdate();
        if (tablesData != undefined) {
            const emptyTables = tablesData.filter( (table) => {return table.guests.length == 0});
            if (emptyTables == undefined || emptyTables.length == 0) {
                setDisabled(true);
            }
            else {
                setDisabled(false);
            }
        }
    }, [tablesData]);

    const executeUpdate = async() => {
        try {
            await updateEvent(tablesData);
        }
        catch (e) {
            console.error(e);
        }
    };

    // in case there is a delay in getting the data
    useEffect(() => {
        if (window.activeEvent != undefined) {            
            setVariables();
            setUnseated(tmpUnseated);
            setTablesData(origTables);
            setData([origTables, tmpUnseated]);
        }
    }, [window.activeEvent, window.inviteesState])

    const renameTable = (table: Table, open: boolean) => {
        editList[idList.indexOf(table.id)] = open; 
        toggleEditing([...editList]); 
        if (open == false) {
            const tmpTables = JSON.parse(JSON.stringify(tablesData));
            for (let x of tmpTables) {
                if (table.id == x.id) {
                    x.name = (document.getElementById('tableName'+table.id) as HTMLInputElement).value;
                    setTablesData([...tmpTables]);
                    setData([tmpTables, [...unseated]]);
                    break;
                }
            }
        }
    }

    const onDragEnd = (result: any) => {
        let newTables = tablesData;
        let newUnseated = unseated;
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
                // make sure the whole group gets moved if the option is on
                if (seatGroupsTogether && removed.groupID != undefined) {
                    for (let x of tmpTables) {
                        if (x.id != destination.droppableId) {
                            let tmpGuests = [...x.guests];
                            for (let y of x.guests) {
                                if (y.groupID == removed.groupID && y.id != removed.id) {
                                    // remove y from the table
                                    if (x.id == source.droppableId) {
                                        sourceItems.splice(sourceItems.indexOf(y), 1);
                                    }
                                    else {
                                        tmpGuests.splice(tmpGuests.indexOf(y), 1);
                                    }
                                    // add y to the new table
                                    destItems.splice(destination.index, 0, y);
                                }
                            }
                            x.guests = tmpGuests;
                        }
                    }
                    // go through unseated
                    const tmpNotSeated = [...unseated];
                    for (let y of unseated) {
                        if (y.groupID == removed.groupID && y.id != removed.id) {
                            // remove y from unseated
                            tmpNotSeated.splice(tmpNotSeated.indexOf(y), 1);
                            // add y to the new table
                            destItems.splice(destination.index, 0, y);
                        }
                    }
                    setUnseated(tmpNotSeated);
                    newUnseated = tmpNotSeated;
                }
                for (let x of tmpTables) {
                    if (x.id == source.droppableId)  {
                        x.guests = [...sourceItems];
                    }
                    if (x.id == destination.droppableId) {
                        x.guests = [...destItems];
                    }
                }
                setTablesData([...tmpTables]);
                newTables = [...tmpTables];
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
                    const item = shownUnseated[source.index];
                    const [removed] = sourceItems.splice(sourceItems.indexOf(item), 1);
                    // put it into the destination list. 
                    // Don't delete anything, just put it in the right position (index)
                    destItems.splice(destination.index, 0, removed);
                    const tmpTables = tablesData;
                    // make sure the whole group gets moved if the option is on
                    if (seatGroupsTogether && removed.groupID != undefined) {
                        // go through the tables
                        for (let x of tmpTables) {
                            if (x.id != destination.droppableId) {
                                let tmpGuests = [...x.guests];
                                for (let y of x.guests) {
                                    if (y.groupID == removed.groupID && y.id != removed.id) {
                                        // remove y from the table
                                        if (x.id == source.droppableId) {
                                            sourceItems.splice(sourceItems.indexOf(y), 1);
                                        }
                                        else {
                                            tmpGuests.splice(tmpGuests.indexOf(y), 1);
                                        }
                                        // add y to the new table
                                        destItems.splice(destination.index, 0, y);
                                    }
                                }
                                x.guests = tmpGuests;
                            }
                        }
                        // go through unseated
                        const tmpSource = [...sourceItems];
                        for (let y of tmpSource) {
                            if (y.groupID == removed.groupID && y.id != removed.id) {
                                // remove y from unseated
                                sourceItems.splice(sourceItems.indexOf(y), 1);
                                // add y to the new table
                                destItems.splice(destination.index, 0, y);
                            }
                        }
                    }
                    for (let x of tmpTables) {
                        if (x.id == destination.droppableId) {
                            x.guests = [...destItems];
                        }
                    }
                    setTablesData([...tmpTables]);
                    setUnseated([...sourceItems]);
                    newUnseated = [...sourceItems];
                    setSeated(seated + 1);
                    newTables = [...tmpTables];
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
                    // make sure the whole group gets moved if the option is on
                    if (seatGroupsTogether && removed.groupID != undefined) {
                        // go through the tables
                        for (let x of tmpTables) {
                            let tmpGuests = [...x.guests];
                            for (let y of x.guests) {
                                if (y.groupID == removed.groupID && y.id != removed.id) {
                                    // remove y from the table
                                    if (x.id == source.droppableId) {
                                        sourceItems.splice(sourceItems.indexOf(y), 1);
                                    }
                                    else {
                                        tmpGuests.splice(tmpGuests.indexOf(y), 1);
                                    }
                                    // add y to unseated
                                    destItems.splice(destination.index, 0, y);
                                }
                            }
                            x.guests = tmpGuests;
                        }
                    }
                    for (let x of tmpTables) {
                        if (x.id == source.droppableId) {
                            x.guests = [...sourceItems];
                        }
                    }
                    setTablesData([...tmpTables]);
                    setUnseated([...destItems]);
                    newUnseated = [...destItems];
                    setSeated(seated - 1);
                    newTables = [...tmpTables];
                }
            }
        }
        else {
            // unseated gets different treatment from tables!!
            // sort based on drag and drop within unseated table
            if (source.droppableId == unseatedID)  {
                const copiedItems = [...shownUnseated];
                const [removed] = copiedItems.splice(source.index, 1);
                copiedItems.splice(destination.index, 0, removed);
                // set the new column data based off of the above
                searchedUnseated([...copiedItems]);
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
                newTables = [...tmpTables]
            }
        }

        newTables = JSON.parse(JSON.stringify(newTables));
        for (let x of newTables) {
            x = JSON.parse(JSON.stringify(x));
            x.guests = [...x.guests];
        }
        setData([newTables, [...newUnseated]]);

    };

    const clearSearch = () => {
        const e = document.getElementById('searchBar');
        if (e != null) {
            (e as HTMLInputElement).value='';
        }
        searchTerm = '';
        searchedUnseated(unseated);
    }

    const search = (event: any, search? : string) => {
        if (search == undefined) {
            searchTerm = event.target.value.toLowerCase().trim();
        }
        if (searchTerm.trim()=='') {
            searchedUnseated(unseated);
            return;
        }
        const newUnseated = unseated.filter( (x) => {
            return (x.name.toLowerCase()).includes(searchTerm) || (x.groupName != undefined ? x.groupName.toLowerCase().includes(searchTerm) : false);
        });
        searchedUnseated(newUnseated);
    };

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
            let newTables = JSON.parse(JSON.stringify(tmpTables));
            for (let x of newTables) {
                x = JSON.parse(JSON.stringify(x));
                x.guests = [...x.guests];
            }
            setData([newTables, [...unseated]]);
        }
    };

    const clearAll = () => {
        let newTables: Table[] = [];
        let newUnseated: Invitee[] = unseated;
        for (let x of tablesData) {
            newUnseated = newUnseated.concat(x.guests);
            clearTable(null, x.id);
            newTables.push({id: x.id, name: x.name, guests: []});
        }
        setTablesData(newTables);
        setUnseated(newUnseated);
        setSeated(0);
        newTables = JSON.parse(JSON.stringify(newTables));
        for (let x of newTables) {
            x = JSON.parse(JSON.stringify(x));
            x.guests = [...x.guests];
        }
        setData([newTables, [...unseated]]);
    };

    const title = window.activeEvent == null ? 'Event' : `${window.activeEvent.name}  |  ${moment(window.activeEvent.date).format('MM / DD / YYYY')}`;
    
    const toggleGroupMode = (event: any) => {
        seatGroupsTogether = event.target.checked;
    };

    /* checks if a group is sitting together */
    const isGroupTogether = (groupID: string | undefined) => {
        let difTables = 0;
        for (let x of tablesData) {
            for (let y of x.guests) {
                if (y.groupID == groupID) {
                    difTables += 1;
                    break;
                }
            }
            if (difTables > 1) {
                return false;
            }
        }
        return true;
    };

    /* checks if all members of a group are seated */
    const isGroupUnseated = (groupID: string | undefined) => {
        for (let x of unseated) {
            if (x.groupID == groupID) {
                return true;
            }
        }
        return false;
    };

    /* seats a group together where the button is clicked */
    const seatGroupTogether = (tableId: string, groupID: string | undefined) => {
        let tmpTables = [...tablesData];
        const guestsToAdd: Invitee[] = [];
        let ourTableInd = 0;
        for (let x of tablesData) {
            if (tableId != x.id) {
                // find all the guests with groupID
                const tmpGuests = [...x.guests];
                for (let y of tmpGuests) {
                    if (y.groupID == groupID) {
                        // remove them from their table
                        const [removed] = tmpTables[tmpTables.indexOf(x)].guests.splice(x.guests.indexOf(y), 1);
                        // keep track of the guest
                        guestsToAdd.push(removed);
                    }
                }
            }
            // find our table ind for the end
            else {
                ourTableInd = tmpTables.indexOf(x);
            }
        }
        // set up our table
        tmpTables[ourTableInd].guests = tmpTables[ourTableInd].guests.concat(guestsToAdd);
        setTablesData(tmpTables);
        const newTables = JSON.parse(JSON.stringify(tmpTables));
        for (let x of newTables) {
            x = JSON.parse(JSON.stringify(x));
            x.guests = [...x.guests];
        }
        setData([newTables, [...unseated]]);
    };

    /* seats all unseated members of a group  */
    const seatUnseatedGroup = (tableId: string, groupID: string | undefined) => {
        const guestsToAdd: Invitee[] = [];
        const tmpNotSeated = [...unseated];
        let tmpTables = [...tablesData];
        for (let x of unseated) {
            if (x.groupID == groupID) {
                const [removed] = tmpNotSeated.splice(tmpNotSeated.indexOf(x), 1);
                guestsToAdd.push(removed);
            }
        }
        // add the data to our table
        const ourTable = tablesData.filter( (t) => {
            return t.id == tableId;
        });
        tmpTables[tmpTables.indexOf(ourTable[0])].guests = tmpTables[tmpTables.indexOf(ourTable[0])].guests.concat(guestsToAdd);
        setSeated(seated + guestsToAdd.length);
        setTablesData(tmpTables);

        // set unseated to value without these people
        setUnseated(tmpNotSeated);
        const newTables = JSON.parse(JSON.stringify(tmpTables));
        for (let x of newTables) {
            x = JSON.parse(JSON.stringify(x));
            x.guests = [...x.guests];
        }
        setData([newTables, [...tmpNotSeated]]);
    };

    const undo = () => {
        if (dataHistory.past.length > 0) {
            dataHistory.future.push(dataHistory.present);
            dataHistory.present = dataHistory.past.pop();
            if (dataHistory.present.length == 1) {
                dataHistory.present = dataHistory.present[0]
            }
            const tmpTables = JSON.parse(JSON.stringify(dataHistory.present[0]));
            for (let x of tmpTables) {
                x = JSON.parse(JSON.stringify(x));
                x.guests = [...x.guests];
            }
            setTablesData(tmpTables);
            setUnseated(JSON.parse(JSON.stringify(dataHistory.present[1])));
        }
    };
    const redo = () => {
        if (dataHistory.future.length > 0) {
            dataHistory.past.push(dataHistory.present);
            dataHistory.present = dataHistory.future.pop();
            if (dataHistory.present.length == 1) {
                dataHistory.present = dataHistory.present[0]
            }
            const tmpTables = JSON.parse(JSON.stringify(dataHistory.present[0]));
            for (let x of tmpTables) {
                x = JSON.parse(JSON.stringify(x));
                x.guests = [...x.guests];
            }
            setTablesData(tmpTables);            
            setUnseated(JSON.parse(JSON.stringify(dataHistory.present[1])));
        }
    };

    const addTable = () => {
        if (window.activeEvent != null) {
            let tmpTables = [...window.activeEvent.tables];
            const id = (new ObjectId()).toString();
            tables = ((window.activeEvent != null) ? window.activeEvent.tables.length : 0);
            const newTable: Table = {
                id: id,
                name: 'Table ' + (tables+1).toString(),
                guests: []
            }
            tables += 1;
            window.activeEvent.tables.push(newTable);
            tmpTables.push(newTable);
            setTablesData(tmpTables);
            tmpTables = JSON.parse(JSON.stringify(tmpTables));
            for (let x of tmpTables) {
                x = JSON.parse(JSON.stringify(x));
                x.guests = [...x.guests];
            }
            setData([tmpTables, [...unseated]]);
        }
    };

    const deleteTable = () => {
        if (window.activeEvent != null) {
            let emptyTables = tablesData.filter( (table) => {return table.guests.length==0});
            let toDelete = emptyTables[emptyTables.length-1];
            let tmpTables = [...tablesData];
            tmpTables = JSON.parse(JSON.stringify(tmpTables));
            let newTables: Table[] = [];
            for (let x of tmpTables) {
                if (x.id != toDelete.id) {
                    x = JSON.parse(JSON.stringify(x));
                    x.guests = [...x.guests];
                    newTables.push(x);
                }
            }
            setTablesData(newTables);
            setData([[...newTables], [...unseated]]);
        }
    };

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
                        <h3 className='seatStat'>{window.activeEvent.respondents == undefined || window.activeEvent.surveys == undefined ? '0' : Math.floor((window.activeEvent.respondents.length/window.activeEvent.surveys.length)*100)}%</h3>
                        <p className='statLabel'>Survey Completion</p>
                    </Grid>
                    <Grid item xs={4}>
                        <h3 className='seatStat'>
                            <Tooltip title={disabled ? "Must have an empty table to delete!" : ""}>
                                <span className='editTableNum'>
                                    <IconButton className='editTableNum' onClick={deleteTable} disabled={disabled}>
                                        <AiFillMinusCircle/>
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <span className='spacedSpan'>{tablesData.length}</span>
                            <IconButton className='editTableNum' onClick={addTable}>
                                <AiFillPlusCircle/>
                            </IconButton>
                        </h3>
                        <p className='statLabel'>Total Table{tablesData.length==1 ? '' : 's'}</p>
                    </Grid>
                    <Grid item xs={4}>
                        <h3 className='seatStat'>{seats}</h3>
                        <p className='statLabel'>Total Seat{seats==1 ? '' : 's'}</p>
                    </Grid>
                    <Grid item xs={4}>
                        <h3 className='seatStat'>{seated}</h3>
                        <p className='statLabel'>Seated Guest{seated==1 ? '' : 's'}</p>
                    </Grid>
                    <Grid item xs={4}>
                        <h3 className='seatStat'>{seats - seated}</h3>
                        <p className='statLabel'>Available Seat{seats-seated==1 ? '' : 's'}</p>
                    </Grid>
                    <Grid item xs={1}>
                    </Grid>
                    <Grid item xs={5}>
                        <Button variant='contained' className='fitBtn' onClick={handleClick}>Return to Dashboard</Button>
                    </Grid>
                </Grid>
            </Card>
            {/* Unseated Guests Sidebar */}
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>

            <Grid className='dashBody' container spacing={6} columns={{xs:1, sm:2, md:12}}>
                <Grid item xs={1} sm={1} md={3}>
                    <Card className='seatDashCard'>
                        <CardHeader title='Unseated Guests' className='cardHeader'/>
                        <section className='guestTable centeredCell'>
                            <section className='stickySearch centeredCell'>
                                <TextField
                                placeholder='Search Guests'
                                className='searchBar' 
                                id='searchBar'
                                size='small' 
                                onChange={search}
                                InputProps={{startAdornment:
                                    <InputAdornment position="start">  
                                        <FaSearch/>
                                    </InputAdornment>, 
                                endAdornment:
                                    searchTerm.trim() != ''  && <InputAdornment position="end">  
                                        <IconButton className='smallClose' onClick={clearSearch}>
                                            <IoIosClose/>
                                        </IconButton>
                                    </InputAdornment>}}>
                                </TextField>
                            </section>
                            <Droppable droppableId={unseatedID} key={unseatedID}>
                                {(provided, snapshot) => {
                                    return (
                                        <section className={`unseatedSection ${snapshot.isDraggingOver ? "overBackground" : ""}`} {...provided.droppableProps} ref={provided.innerRef}>
                                            {shownUnseated.length == 0 ? unseated.length == 0 ? <p className='centeredCell'>All guests have been seated!</p> : <p className='wrappedP'>No guests found for search term {searchTerm}</p> : 
                                            <>
                                            {shownUnseated.map((guest: Invitee, index) => {
                                                return (
                                                    <Draggable key={guest.id} draggableId={guest.id} index={index}>
                                                        {(provided, snapshot) => {
                                                            return (
                                                                <section className={`guestName ${snapshot.isDragging ? "draggingGuest" : "placedGuest"}`} ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}>
                                                                    <span className='cornerText'>{(guest.groupName==undefined ? 'No Group' : guest.groupName)}</span>
                                                                    <br/>
                                                                    {guest.name}
                                                                </section>
                                                            );
                                                        }}
                                                    </Draggable>
                                                );
                                            })
                                            }</>}
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
                            <label className='switchLabel'>
                                <Switch defaultChecked={false} onChange={toggleGroupMode}/>
                                Move Groups Together
                            </label>
                            <Button variant='text' className='whiteTxtBtn' size='small' onClick={undo} disabled={dataHistory.past.length==0}>Undo</Button>
                            <Button variant='text' className='whiteTxtBtn' size='small' onClick={redo} disabled={dataHistory.future.length==0}>Redo</Button>
                            &#160;&#160;|&#160;&#160;
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
                                                                                            <span className='cornerText'>{(guest.groupName==undefined ? 'No Group' : guest.groupName)}</span>
                                                                                            {guest.groupName != undefined && !isGroupTogether(guest.groupID) && 
                                                                                            <Tooltip title={<span>Group is separated.<br/>Click to seat group together.</span>}>
                                                                                                <IconButton className='infoError' onClick={() => seatGroupTogether(table.id, guest.groupID)}>
                                                                                                    <FaExclamationCircle />
                                                                                                </IconButton>
                                                                                            </Tooltip>}
                                                                                            {guest.groupName != undefined && isGroupTogether(guest.groupID) && isGroupUnseated(guest.groupID) && 
                                                                                            <Tooltip title={<span>Some members of this group are unseated.<br/>Click to seat group together.</span>}>
                                                                                                <IconButton className='infoError' onClick={() => seatUnseatedGroup(table.id, guest.groupID)}>
                                                                                                    <FaExclamationCircle />
                                                                                                </IconButton>
                                                                                            </Tooltip>}
                                                                                            <br/>
                                                                                            {guest.name}
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
                                                    <CardActions className={table.guests.length > (window.activeEvent ? window.activeEvent.perTable : 1) ? 'overFull' : 'tableFillLevel'}>Seated: {table.guests.length} / {(window.activeEvent? window.activeEvent.perTable : 1)}</CardActions>
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

function updateEvent(tablesData: Table[]) {
    if (window.activeEvent != null && window.activeEvent != undefined) {
        const tables = [];
        if (tablesData.length == 0) {
            return;
        }
        for (let x of tablesData) {
            const tmpGuests = [];
            for (let g of x.guests) {
                if (g == undefined || g.id == undefined) {
                    return;
                }
                tmpGuests.push(g.id);
            }
            tables.push({name: x.name, id: x.id, guests: tmpGuests})
        }
        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    tables: [...tables],
                })
            };
        return fetch('http://localhost:3001/events/updateEvent/'+window.activeEvent.id, requestOptions);
    }
}