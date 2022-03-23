import { useHistory } from "react-router-dom";
import TextField from '@mui/material/TextField';
import './guestPages.css';
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Button } from "@mui/material";

export function SurveyPt1SitTogether() {
    const history = useHistory();
    const invited = 6;

    const makeRows = () => {
        let arr: Array<any> = [];
        [...Array(invited)].map((_, ind) => {
            arr[ind] = { id: ind };
        });
        return arr;
    };

    let rows: GridRowsProp = makeRows();

    const columns: GridColDef[] = [
        {
            field: 'col1', headerName: 'First Name', headerAlign: 'left', flex: 4,
            renderCell: () => { return (<TextField size='small' className='nameField' variant='filled'></TextField>) }
        },
        {
            field: 'col2', headerName: 'Last Name', headerAlign: 'left', flex: 4,
            renderCell: () => { return (<TextField size='small' className='nameField' variant='filled'></TextField>) }
        }
    ];

    const handleClick = () => {
        history.push('/surveyDislikes')
    }

    return (
        <section className='surveyPt1'>
            <h1 className='title'>Seating Survey - Part I</h1>
            <p className='subtitle'>Your party has {invited} members! Enter the information for each below:</p>

            <div className='survey' style={{ height: 400 }}>
                <DataGrid rows={rows} columns={columns} disableColumnMenu={true} hideFooter={true} disableSelectionOnClick={true} rowHeight={80} />
            </div>
                
            <Button variant='outlined' className='generalButton' onClick={handleClick}>
                        Continue
            </Button>

        </section>
    );
}

