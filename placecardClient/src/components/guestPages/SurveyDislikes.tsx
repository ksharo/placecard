import { CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

let searchTerm = '';
export function SurveyDislikes() {
    let names: {name: string, id: string}[] = [];
    let likeIds: string[] = [];
    // don't include disliked invitees here
    const setup = () => {
        for (let x of window.likedInvitees) {
            if (!likeIds.includes(x.id)) {
                likeIds.push(x.id);
            }
        }
        for (let x of window.inviteesState) {
            if (!likeIds.includes(x.id)) {
                if (window.curGuest != undefined  && window.curGuest.id !== x.id) {
                    if (window.curGuest.groupID != undefined  && window.curGuest.groupID !== '') {
                        if (x.groupID !== window.curGuest.groupID) {
                            names.push({name: x.name, id: x.id});
                        }
                    }
                    else {
                        names.push({name: x.name, id: x.id});
                    }
                }
            }
        }
    }
    const makeRows = () => {
        setup();
        let arr: Array<any> = [];
        names.map((name, ind) => {
            arr[ind] = { id: ind, col0: name.name, col1: name.id};
        });
        return arr;
    };

    let startRows: GridRowsProp = makeRows();
    const [rows, setRows] = React.useState([...startRows]);

    const columns: GridColDef[] = [
        {
            field: 'col0', headerName: 'Name', headerAlign: 'center', flex: 2,
        },
    ];

    const updateDislikes = (checkedUsers: any) => {
        let tmp = [];
        //iterate over the list of checkedUsers, get their information and add to tmp
        for (let user of checkedUsers) {
            const id = user.col1;
            
            const x = window.inviteesState.filter((u) => u.id == id)[0];
            let name = x.name;
            let groupName = x.groupName;
            let groupID = x.groupID;
           
            tmp.push({id: id, name: name, groupName: groupName, groupID: groupID});
        }
        //update disliked state
        window.setDisliked(tmp);
    }

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
                <h1 className='title'>Seating Survey - Part IV</h1>
                <p className='subtitle'>Which of these individuals do you want to avoid sitting with?</p>
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
                    <DataGrid rows={rows} 
                        columns={columns} 
                        disableColumnMenu={true} 
                        hideFooter={true} 
                        disableSelectionOnClick={true} 
                        components={{
                            NoRowsOverlay: loadingCircle,
                        }}
                        rowHeight={80}
                        checkboxSelection
                        onSelectionModelChange={(ids) => {
                            const selectedIDs = new Set(ids);
                            console.log(selectedIDs);
                            const selectedRowData = rows.filter((row) =>
                              selectedIDs.has(row.id)
                            );
                            updateDislikes(selectedRowData);
                          }} 
                        />
                </div>
    </>);
}
