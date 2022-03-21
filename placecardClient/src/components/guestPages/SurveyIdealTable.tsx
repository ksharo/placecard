import { Checkbox, CircularProgress } from "@mui/material";
import { GridRowsProp, GridColDef, DataGrid } from "@mui/x-data-grid";
import React, { useLayoutEffect } from "react";

export function SurveyIdealTable() {
    const perTable = window.activeEvent == undefined ? 0 : window.activeEvent.perTable;
    let partySize = window.curGuest == undefined ? 0 : window.curGuest.groupSize == undefined ? 1 : window.curGuest.groupSize;
    let curSize = 0;
    for (let x of window.lovedInvitees) {
        curSize += 1;
    }
    const [sizeLeft, setSizeLeft] = React.useState(perTable - (partySize + curSize));
    const names: Invitee[] = [];
    for (let x of window.likedInvitees) {
        names.push({name: x.name, id: x.id, groupName: x.groupName, groupID: x.groupID});
    }
    const makeRows = () => {
        let arr: Array<any> = [];
        names.map((name, ind) => {
            arr[ind] = { id: ind, col0: name.name, 
                col2: name.id};
        });
        return arr;
    };
    let rows: GridRowsProp = makeRows();

    useLayoutEffect( () => {
        partySize = window.curGuest == undefined ? 0 : window.curGuest.groupSize == undefined ? 1 : window.curGuest.groupSize;
        setSizeLeft(perTable - (partySize + curSize));
    }, [window.curGuest])

    const columns: GridColDef[] = [
        {
            field: 'col0', headerName: 'Party Name', headerAlign: 'center', flex: 4,
        },
        {
            field: 'col2', headerName: 'Include at table', headerAlign: 'center', cellClassName: 'centeredCheck', flex: 2,
            renderCell: (params) => { return (<section className='checkboxWithError'>
            <Checkbox id={'checkbox' + params.value} checked={isChecked(params.value)} onClick={updateLoves}></Checkbox>
            <p id={'warning'+params.value} className='hiddenError'>Table is full.</p>
            </section>) }
        }
    ];

    const isChecked = (id: string) => {
        for (let x of window.lovedInvitees) {
            if (x.id == id) {
                return true;
            }
        }
        return false;
    }

    const updateLoves = (event: any) => {
        // first, get the id of the party this checkbox belongs to
        const id = event.target.id.substring(8);
        const checked = event.target.checked;
        // find the size and name of the party
        let size = 1;
        let name = '';
        let groupName = undefined;
        let groupID = undefined;
        for (let x of window.inviteesState) {
            if (x.id == id) {
                size = 1;
                name = x.name;
                groupName = x.groupName;
                groupID = x.groupID;
                break;
            }
        }
        if (checked) {
            // check that the size is not too much
            let curSize = 0;
            for (let x of window.lovedInvitees) {
                curSize += 1;
            }
            if (curSize + partySize + size <= perTable) {
                // add the party to the list of those who are loved
                const tmp = window.lovedInvitees;
                tmp.push({id: id, name: name, groupName: groupName, groupID: groupID});
                window.setLoved(tmp);
                setSizeLeft(perTable - (curSize + partySize + size));
            }
            else {
                event.target.checked = false;
                // show error on page
                const warning = document.getElementById('warning'+id);
                if (warning != null) {
                    // do this so animation plays
                    warning.classList.remove('gradualError');
                    window.requestAnimationFrame(function() {
                        warning.classList.add('gradualError');
                    });
                }
            }
        }
        else {
            // remove the party from the list of those who are loved
            const tmp = [];
            for (let x of window.lovedInvitees) {
                if (x.id != id) {
                    tmp.push({id: x.id, name: x.name, groupName: x.groupName, groupID: x.groupID })
                }
            }
            setSizeLeft(sizeLeft + size);
            window.setLoved(tmp);
        }
    }

    const loadingCircle = () => {
        return (
        <section className='loadingCircle'>
            {window.curGuest != undefined ? <p>No Guests</p> : 
            <>
                <p>Loading...</p>
                <CircularProgress size={24} />
            </>
            }
        </section>
        )
    }

    return (<>
                <h1 className='title'>Seating Survey - Part IV</h1>
                <p className='subtitle'>Create your ideal table! Choose up to {sizeLeft} of the parties you are comfortable <br/>with (from the previous page) to fill up your table.</p>
                <div className='survey' style={{ height: 400 }}>
                    <DataGrid 
                        rows={rows} 
                        columns={columns} 
                        disableColumnMenu={true} 
                        hideFooter={true} 
                        disableSelectionOnClick={true} 
                        components={{
                            NoRowsOverlay: loadingCircle,
                        }}
                        rowHeight={80} />
                </div>
    </>);
}