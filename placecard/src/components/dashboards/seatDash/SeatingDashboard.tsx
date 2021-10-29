import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import './SeatingDashboard.css';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { AppBar, Toolbar, Typography } from "@mui/material";

export function SeatingDashboard() {
    const name = 'Wedding';
    const date = '10/10/10';
    const survComp = 10;
    const tables = 10;
    const seats = 100;
    const seated = 3;


    const rows: GridRowsProp = [
        { id: 1, col1: 'Hello', col2: 'World' },
        { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
        { id: 3, col1: 'MUI', col2: 'is Amazing' },
      ];

    const columns: GridColDef[] = [
        { field: 'col1', headerName: 'Guests', width: 300, headerAlign: 'center', headerClassName: 'tableTitle' },
      ];

    return (
        <>
            <section className='header'>
                <section className='titleBar'>
                    <h1>Wedding | 10/10/10</h1>
                    <Button variant='outlined'>Return to Dashboard</Button>
                </section>
                <hr/>
            </section>
            <Grid container className='dashBody' spacing={0} columns={24}>
                <Grid item xs={3}>
                    <h3 className='seatStat'>{survComp}%</h3>
                    <p className='statLabel'>Survey Completion</p>
                </Grid>
                <Grid item xs={9}>
                </Grid>
                <Grid item xs={3}>
                    <h3 className='seatStat'>{tables}</h3>
                    <p className='statLabel'>Total Tables</p>
                </Grid>
                <Grid item xs={3}>
                    <h3 className='seatStat'>{seats}</h3>
                    <p className='statLabel'>Total Seats</p>
                </Grid>
                <Grid item xs={3}>
                    <h3 className='seatStat'>{seated}</h3>
                    <p className='statLabel'>Seated Guests</p>
                </Grid>
                <Grid item xs={3}>
                    <h3 className='seatStat'>{seats-seated}</h3>
                    <p className='statLabel'>Available Seats</p>
                </Grid>
            </Grid>

            <Grid className='dashBody' container spacing={6}>
                <Grid item xs={3}>
                    <table className='guestTable' style={{ height: 500, width: '100%'}}>
                        <DataGrid rows={rows} columns={columns} hideFooter={true}/>
                    </table>
                </Grid>
            
            <Grid item xs={9}>
                <Card>
                    <AppBar className='tableTitle' position='static' color='inherit'>
                        <Toolbar className='toolbar tableTitle'>
                            <section className='verticalContainer'>
                                <Button size='small'>Lock All</Button>
                                <Button size='small'>Clear All</Button>
                            </section>
                            <p>Seating Chart</p>
                            <Button size='medium'>Generate New Plan</Button>
                        </Toolbar>
                    </AppBar>
                    <p>blah blah blah</p> 
                </Card>
            </Grid>
            </Grid>

        </>
    );
}

