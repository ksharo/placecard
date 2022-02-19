import { useHistory } from "react-router-dom";
import { Button, Checkbox } from "@mui/material";
import { GridRowsProp, GridColDef, DataGrid } from "@mui/x-data-grid";


export function SurveyGroupPage() {
    const history = useHistory();

    // get the names of everyone in the current group
    // TODO: make edits for when someone doesn't have a group!
    const names: {name: string, id: string}[] = [];
    for (let x of window.inviteesState) {
        if (x.groupID == window.curGroupID) {
            names.push({name: x.name, id: x.id});
        }
    }
    const makeRows = () => {
        let arr: Array<any> = [];
        names.map((name, ind) => {
            arr[ind] = { id: ind, col0: name.name, col1: name.id, col2: name.id};
        });
        return arr;
    };

    let rows: GridRowsProp = makeRows();

    const columns: GridColDef[] = [
        {
            field: 'col0', headerName: 'Name', headerAlign: 'center', flex: 2,
        },
        {
            field: 'col1', headerName: 'Email Address', headerAlign: 'center', cellClassName: 'centeredCheck', flex: 3,
            renderCell: (params) => { return (<input id={'input' + params.value} type='email' disabled></input>) }
        },
        {
            field: 'col2', headerName: 'Remove from group', headerAlign: 'center', cellClassName: 'centeredCheck', flex: 2,
            renderCell: (params) => { return (<Checkbox id={'checkbox' + params.value} onClick={updateInputs}></Checkbox>) }
        }
    ];

    const prevPage = () => {
        history.push('/surveyInstructions');
    }
    const nextPage = () => {
        // TODO: push information about groups to database. 
        // ALSO check if they checked everything
        history.push('/surveyDislikes');
    }
    // updates the input boxes to enable or disable those checked/unchecked
    const updateInputs = (event: any) => {
        let id = event.target.id.substring(8);
        const el = document.getElementById('input'+id);
        if (event.target.checked) {
            el?.removeAttribute('disabled');
        }
        else {
            el?.setAttribute('disabled', 'true');
        }
    }
    return (
        <>
            <h1 className='title'>Seating Survey - Part I</h1>
            <p className='subtitle'>Your group has {names.length} members.<br/>Your answers to this survey will 
            count for everyone in the group and will cause the group to be kept together when seated.<br/>
            If you want to separate your group so that other members can answer independently,<br/>please provide their 
            contact information below.</p>
            <div className='survey' style={{ height: 400 }}>
                    <DataGrid rows={rows} columns={columns} disableColumnMenu={true} hideFooter={true} disableSelectionOnClick={true} rowHeight={80} />
            </div>
            <Button variant='outlined' className='generalButton' onClick={prevPage}>
                Go Back
            </Button>
            <Button variant='outlined' className='generalButton' onClick={nextPage}>
                Continue
            </Button>
        </>
    );

}