import { CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material";
import { GridRowParams, GridRowsProp, GridColDef, DataGrid, selectedIdsLookupSelector } from "@mui/x-data-grid";
import React, { useEffect, useLayoutEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

let searchTerm = '';
let selectedIDs = new Set();
export function SurveyIdealTable() {
    const makeLoved = () => {
        //let tmp : {[id: string] : boolean} = {};
        let tmp = [];
        for (let x of window.lovedInvitees){
            tmp.push(x.id);
        }
        return tmp;
    }
    const [loved, setLoved] = React.useState(makeLoved);

    const perTable = window.activeEvent == undefined  ? 0 : window.activeEvent.perTable;
    let partySize = window.curGuest == undefined  ? 0 : window.curGuest.groupSize == undefined  ? 1 : window.curGuest.groupSize;
    let curSize = window.lovedInvitees.length;
    const [sizeLeft, setSizeLeft] = React.useState(perTable - (partySize + curSize));
    let names: Invitee[] = [];
    const setup = () => {
        for (let x of window.likedInvitees) {
            names.push({name: x.name, id: x.id, groupName: x.groupName, groupID: x.groupID});
        }
    }
    const makeRows = () => {
        setup();
        let arr: Array<any> = [];
        names.map((name, ind) => {
            arr[ind] = { id: ind, col0: name.name, 
                col2: name.id};
        });
        return arr;
    };

    let startRows: GridRowsProp = makeRows();
    const [rows, setRows] = React.useState([...startRows]);

    useLayoutEffect( () => {
        partySize = window.curGuest == undefined  ? 0 : window.curGuest.groupSize == undefined  ? 1 : window.curGuest.groupSize;
        setSizeLeft(perTable - (partySize + curSize));
    }, [window.curGuest])

    const columns: GridColDef[] = [
        {
            field: 'col0', headerName: 'Name', headerAlign: 'center', flex: 4,
        }
    ];
    
    const checkTableSize = (checkedUsers: any) => {
        //console.log(ids.size>=perTable, ids.size);
        let size = 1;
        //check that the size is not too much
        let curSize = 0; //why iterate?
        for (let x of window.lovedInvitees) {
            curSize += 1;
        }
        // if the loved list is > max table size, disable the rest of the checkboxes
        if (curSize + partySize + size > perTable) {
            console.log("table to big")
        }
        // if the loved list is < max table size, add all to the loved list
        else {
            setSizeLeft(perTable - (curSize + partySize + size));
            updateLoves(checkedUsers);
        }

    }
    const updateLoves = (checkedUsers: any) => {
        let tmp = [];
        //iterate over the list of checkedUsers, get their information and add to tmp
        for (let user of checkedUsers) {
            const id = user.col2;
            const x = window.inviteesState.filter((u) => u.id == id)[0];
            let name = x.name;
            let groupName = x.groupName;
            let groupID = x.groupID;
            
            tmp.push({id: id, name: name, groupName: groupName, groupID: groupID});
        }

        //update loved and sizeLeft states
        setSizeLeft(perTable - (tmp.length + partySize + 1));
        window.setLoved(tmp);
    }

    useEffect(() => {
        setLoved(makeLoved);      
    }, ([window.lovedInvitees]));


    const loadingCircle = () => {
        return (
        <section className='loadingCircle'>
            {window.curGuest != undefined  ? <p>No Guests</p> : 
            <>
                <p>Loading...</p>
                <CircularProgress size={24} />
            </>
            }
        </section>
        )
    }

    const search = (event: any) => {
        searchTerm = event.target.value.toLowerCase().trim();
        if (searchTerm.trim() === '') {
            setRows([...startRows]);
            return;
        }
        const newRows = rows.filter( (x) => {
            return (x.col0.toLowerCase()).includes(searchTerm);
        });
        setRows([...newRows]);
    }

    const clearSearch = () => {
        const e = document.getElementById('searchBar');
        if (e !== null) {
            (e as HTMLInputElement).value='';
        }
        searchTerm = '';
        setRows([...startRows]);
    }
    useEffect(() => {
        names = [];
        startRows = makeRows();
        setRows([...startRows]);
    }, ([window.inviteesState]));
    return (<>
                <h1 className='title'>Seating Survey - Part III</h1>
                <p className='subtitle'>Create your ideal table! Choose up to {sizeLeft} of the individuals you are comfortable with (from the previous page) to fill up your table.</p>
                <section className='stickySearch smallSearch'>
                    <TextField
                        placeholder='Search Guests'
                        className='searchBar' 
                        id='searchBar'
                        size='small' 
                        onChange={search}
                        InputProps={{
                            startAdornment:
                                <InputAdornment position="start">  
                                    <FaSearch/>
                                </InputAdornment>, 
                            endAdornment:
                                searchTerm.trim() !== ''  && <InputAdornment position="end">  
                                    <IconButton className='smallClose' onClick={clearSearch}>
                                        <IoIosClose/>
                                    </IconButton>
                                </InputAdornment>}}>
                    </TextField>
                </section>
                <div className='survey' style={{ height: 400 }}>
                    <DataGrid 
                        rows={rows} 
                        columns={columns} 
                        disableColumnMenu={true} 
                        hideFooter={true} 
                        components={{
                            NoRowsOverlay: loadingCircle,
                        }}
                        rowHeight={80}
                        isRowSelectable = {(params: GridRowParams) =>  (loved.includes(params.row.col2) ? true : loved.length<perTable-1)}
                        checkboxSelection
                        onSelectionModelChange= {(idList) => {
                            selectedIDs = new Set(idList);
                            const selectedRowData = rows.filter((row) =>
                              selectedIDs.has(row.id)
                            );
                            updateLoves(selectedRowData);
                          }}
                        />
                </div>
    </>);
}