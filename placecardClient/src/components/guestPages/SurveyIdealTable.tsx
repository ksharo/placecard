import { Button, Checkbox } from "@mui/material";
import { GridRowsProp, GridColDef, DataGrid, AutoSizerProps } from "@mui/x-data-grid";
import React from "react";
import { useHistory } from "react-router-dom";

export function SurveyIdealTable() {
    const history = useHistory();
    const perTable = 10;
    const partySize = 6;
    let curSize = 0;
    for (let x of window.lovedInvitees) {
        curSize += x.size;
    }
    const [sizeLeft, setSizeLeft] = React.useState(perTable - (partySize + curSize));
    const names: Invitee[] = [];
    for (let x of window.likedInvitees) {
        names.push({name: x.name, id: x.id, size: x.size});
    }
    const makeRows = () => {
        let arr: Array<any> = [];
        names.map((name, ind) => {
            arr[ind] = { id: ind, col0: name.name, col1: name.size, col2: name.id};
        });
        return arr;
    };
    let rows: GridRowsProp = makeRows();

    const columns: GridColDef[] = [
        {
            field: 'col0', headerName: 'Party Name', headerAlign: 'center', flex: 2,
        },
        {
            field: 'col1', headerName: 'Party Size', headerAlign: 'center', cellClassName: 'centeredCheck', flex: 1,  
        },
        {
            field: 'col2', headerName: 'Include at table', headerAlign: 'center', cellClassName: 'centeredCheck', flex: 1,
            renderCell: (params) => { return (<>
            <Checkbox id={'checkbox' + params.value} checked={isChecked(params.value)} onClick={updateLoves}></Checkbox>
            <p id={'warning'+params.value} className='formError'>Party too big.</p>
            </>) }
        }
    ];

    const prevPage = () => {
        history.push('/surveyLikes');
    }

    const nextPage = () => {
        history.push('/editSurveyResponses');
    }

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
        let name = ''
        for (let x of window.inviteesState) {
            if (x.id == id) {
                size = x.size;
                name = x.name;
                break;
            }
        }
        if (checked) {
            // check that the size is not too much
            let curSize = 0;
            for (let x of window.lovedInvitees) {
                curSize += x.size;
            }
            if (curSize + partySize + size <= perTable) {
                // add the party to the list of those who are loved
                const tmp = window.lovedInvitees;
                tmp.push({id: id, name: name, size: size});
                window.setLoved(tmp);
                setSizeLeft(perTable - (curSize + partySize + size));
            }
            else {
                event.target.checked = false;
                // show error on page
                const warning = document.getElementById('warning'+id);
                if (warning != null) {
                    warning.style.display = 'inline-block';
                }
            }
        }
        else {
            // remove the party from the list of those who are loved
            const tmp = [];
            for (let x of window.lovedInvitees) {
                if (x.id != id) {
                    tmp.push({id: x.id, name: x.name, size: x.size})
                }
            }
            setSizeLeft(sizeLeft + size);
            window.setLoved(tmp);
        }
    }

    return (<>
                <h1 className='title'>Seating Survey - Part IV</h1>
                <p className='subtitle'>Create your ideal table! Choose up to {sizeLeft} of the parties you are comfortable <br/>with (from the previous page) to fill up your table.</p>
                <div className='survey' style={{ height: 400 }}>
                    <DataGrid rows={rows} columns={columns} disableColumnMenu={true} hideFooter={true} disableSelectionOnClick={true} rowHeight={80} />
                </div>
                <Button variant='outlined' className='generalButton' onClick={prevPage}>
                            Go Back
                </Button>
                <Button variant='outlined' className='generalButton' onClick={nextPage}>
                            Continue
                </Button>
    </>);
}