import { Checkbox, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

export function SurveyDislikes() {
    const names: {name: string, id: string}[] = [];
    for (let x of window.inviteesState) {
        if (window.curGuest != undefined && window.curGuest.id != x.id) {
            if (window.curGuest.groupID != undefined && window.curGuest.groupID != '') {
                if (x.groupID != window.curGuest.groupID) {
                    names.push({name: x.name, id: x.id});
                }
            }
            else {
                names.push({name: x.name, id: x.id});
            }
        }
    }
    const makeRows = () => {
        let arr: Array<any> = [];
        names.map((name, ind) => {
            arr[ind] = { id: ind, col0: name.name, col1: name.id};
        });
        return arr;
    };

    let rows: GridRowsProp = makeRows();

    const columns: GridColDef[] = [
        {
            field: 'col0', headerName: 'Party Name', headerAlign: 'center', flex: 2,
        },
        {
            field: 'col1', headerName: 'Do not sit with', headerAlign: 'center', cellClassName: 'centeredCheck', flex: 1,
            renderCell: (params) => { return (<Checkbox id={'checkbox' + params.value} defaultChecked={isChecked(params.value)} onClick={updateDislikes}></Checkbox>) }
        }
    ];

    const isChecked = (id: string) => {
        for (let x of window.dislikedInvitees) {
            if (x.id == id) {
                return true;
            }
        }
        return false;
    }

    const updateDislikes = (event: any) => {
        // first, get the id of the party this checkbox belongs to
        const id = event.target.id.substring(8);
        const checked = event.target.checked;
        // find the size and name of the party
        let size = 1;
        let name = '';
        let groupID = undefined;
        let groupName = undefined;
        for (let x of window.inviteesState) {
            if (x.id == id) {
                size = 1;
                name = x.name;
                groupID = x.groupID;
                groupName = x.groupName;
                break;
            }
        }
        if (checked) {
            // add the party to the list of those who are disliked
            const tmp = window.dislikedInvitees;
            tmp.push({id: id, name: name, groupID: groupID, groupName: groupName});
            window.setDisliked(tmp);
        }
        else {
            // remove the party from the list of those who are disliked
            const tmp = [];
            for (let x of window.dislikedInvitees) {
                if (x.id != id) {
                    tmp.push({id: x.id, name: x.name, groupName: x.groupName, groupID: x.groupID})
                }
            }
            window.setDisliked(tmp);
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
                <h1 className='title'>Seating Survey - Part II</h1>
                <p className='subtitle'>Which of these parties do you want to avoid sitting with?</p>
                <div className='survey' style={{ height: 400 }}>
                    <DataGrid rows={rows} 
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
