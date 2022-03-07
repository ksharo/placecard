import { Link } from "react-router-dom";
import TextField from '@mui/material/TextField';
import './guestPages.css';
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Checkbox } from "@mui/material";

export function SurveyPt2() {

    const rows: GridRowsProp = [
        { id: 1, col0: 'Bob' },
        { id: 2, col0: 'Larry' },
        { id: 3, col0: 'Junior' },
    ];
    const columns: GridColDef[] = [
        {
            field: 'col0', headerName: 'Name', headerAlign: 'left', flex: 2
        },
        {
            field: 'col1', headerName: 'Sit Together Preference', headerAlign: 'center', cellClassName: 'centeredCheck', flex: 1,
            renderCell: () => { return (<Checkbox></Checkbox>) }
        },
        {
            field: 'col2', headerName: 'Sit Apart Preference', headerAlign: 'center', cellClassName: 'centeredCheck', flex: 1,
            renderCell: () => { return (<Checkbox></Checkbox>) }
        },
    ];

    return (
        <section className='surveyPt2'>
            <h1 className='title'>Seating Survey - Part II</h1>
            <p className='subtitle'>Great! Now share some preferences to let us know how we can seat your party properly.</p>

            <div className='survey' style={{ height: 400 }}>
                <DataGrid rows={rows} columns={columns} hideFooter={true} disableSelectionOnClick={true} rowHeight={50} />
            </div>

            <section className='horizontalContainer'>

                <Link to='/surveyPt1' className='rectangleButton tinyButton'>
                    Go Back
                </Link>
                <Link to='/doneSurvey' className='rectangleButton tinyButton'>
                    Finish
                </Link>

            </section>
        </section>
    );
}

