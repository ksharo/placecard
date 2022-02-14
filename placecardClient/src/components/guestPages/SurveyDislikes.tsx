import { Button, Checkbox } from "@mui/material";
import { DataGrid, GridArrowUpwardIcon, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useHistory } from "react-router-dom";

export function SurveyDislikes() {
    const history = useHistory();
    const names: {name: string, id: string}[] = [];
    for (let x of window.inviteesState) {
        names.push({name: x.name, id: x.id});
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
            renderCell: (params) => { return (<Checkbox id={'checkbox' + params.value} checked={isChecked(params.value)} onClick={updateDislikes}></Checkbox>) }
        }
    ];

    const prevPage = () => {
        history.push('/surveyInstructions');
    }
    const nextPage = () => {
        history.push('/surveyLikes');
    }
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

    return (<>
                <h1 className='title'>Seating Survey - Part I</h1>
                <p className='subtitle'>Which of these parties do you want to avoid sitting with?</p>

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
