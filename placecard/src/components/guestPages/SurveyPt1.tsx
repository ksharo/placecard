import { Link } from "react-router-dom";
import TextField from '@mui/material/TextField';
import './guestPages.css';
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Checkbox } from "@mui/material";

export function SurveyPt1() {
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
            field: 'col0', headerName: 'Seat with Party', headerAlign: 'center', cellClassName: 'centeredCheck', flex: 1,
            renderCell: () => { return (<Checkbox defaultChecked></Checkbox>) }
        },
        {
            field: 'col1', headerName: 'First Name', headerAlign: 'left', flex: 4,
            renderCell: () => { return (<TextField size='small' className='nameField' variant='filled'></TextField>) }
        },
        {
            field: 'col2', headerName: 'Last Name', headerAlign: 'left', flex: 4,
            renderCell: () => { return (<TextField size='small' className='nameField' variant='filled'></TextField>) }
        },
        {
            field: 'col3', headerName: 'Age Group', headerAlign: 'center', flex: 2,
            renderCell: () => {
                return (<select className='ageField'>
                    <option selected disabled>Age Group</option>
                    <option>Under 10</option>
                    <option>10-17</option>
                    <option>18-24</option>
                    <option>25-34</option>
                    <option>35-44</option>
                    <option>45-54</option>
                    <option>55-64</option>
                    <option>65+</option>
                </select>)
            }
        }
    ];

    return (
        <section className='surveyPt1'>
            <h1 className='title'>Seating Survey - Part I</h1>
            <p className='subtitle'>Your party has {invited} members! Enter the information for each below:</p>

            <div className='survey' style={{ height: 400 }}>
                <DataGrid rows={rows} columns={columns} hideFooter={true} disableSelectionOnClick={true} rowHeight={80} />
            </div>

            <section className='horizontalContainer'>

                <Link to='/' className='rectangleButton tinyButton'>
                    Home
                </Link>
                <Link to='/surveyPt2' className='rectangleButton tinyButton'>
                    Continue
                </Link>

            </section>
        </section>
    );
}

