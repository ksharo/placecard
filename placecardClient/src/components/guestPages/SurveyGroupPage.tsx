import { Checkbox, CircularProgress, TextField } from "@mui/material";
import { GridRowsProp, GridColDef, DataGrid } from "@mui/x-data-grid";


export function SurveyGroupPage(props: {error?: boolean}) {
    // get the names of everyone in the current group
    // TODO: make edits for when someone doesn't have a group!
    const names: { name: string, id: string }[] = [];
    for (let x of window.inviteesState) {
        if (window.curGroupID != undefined && window.curGroupID != '' && x.groupID == window.curGroupID) {
            names.push({ name: x.name, id: x.id });
        }
    }
    const makeRows = () => {
        let arr: Array<any> = [];
        names.map((name, ind) => {
            arr[ind] = { id: ind, col0: name.name, col1: name.id, col2: name.id };
        });
        return arr;
    };

    const makeOneRow = () => {
        if (window.curGuest != undefined) {
            let arr: Array<any> = [{ id: 0, col0: window.curGuest.name, col1: window.curGuest.contact }];
            return arr;
        }
        else {
            return [];
        }
    };

    let rows: GridRowsProp = makeRows();

    let singleRow: GridRowsProp = makeOneRow();

    const columns: GridColDef[] = [
        {
            field: 'col0', headerName: 'Name', headerAlign: 'center', flex: 2,
        },
        {
            field: 'col2', headerName: 'Remove from group', headerAlign: 'center', cellClassName: 'centeredCheck', flex: 3,
            renderCell: (params) => { return (<Checkbox id={'checkbox' + params.value} onClick={updateInputs}></Checkbox>) }
        },
        {
            field: 'col1', headerName: 'Email Address', headerAlign: 'center', cellClassName: 'centeredCheck', flex: 3,
            renderCell: (params) => { return (<TextField id={'input' + params.value} variant='outlined' size='small' label='Email' placeholder='example@123.com' type='email' className='hiddenInput' onChange={updateRemovedMember}></TextField>) }
        }
    ];

    const lessColumns: GridColDef[] = [
        {
            field: 'col0', headerName: 'Name', headerAlign: 'center', flex: 2,
        },
        {
            field: 'col1', headerName: 'Email Address', headerAlign: 'center', cellClassName: 'centeredCheck', flex: 3,
            renderCell: (params) => { return (<TextField variant='outlined' size='small' label='Email' value={params.value} type='email' disabled={true}></TextField>) }
        }
    ];
    // updates the input boxes to enable or disable those checked/unchecked
    const updateInputs = (event: any) => {
        let id = event.target.id.substring(8);
        const el = document.getElementById('input' + id);
        if (event.target.checked) {
            // ready to remove member!
            el?.parentElement?.parentElement?.classList.remove('hiddenInput');
            const val = (el as HTMLInputElement).value;
            const matching = window.removedMembers.filter((m) => { return m.id == id; });
            if (matching.length > 0) {
                matching[0].contact = val;
            }
            else {
                const person = {
                    id: id,
                    name: '',
                    contact: val
                };
                window.removedMembers.push(person);
            }
        }
        else {
            // don't remove member!
            el?.parentElement?.parentElement?.classList.add('hiddenInput');
            const matching = window.removedMembers.filter((m) => { return m.id == id; });
            if (matching.length > 0) {
                window.removedMembers.splice(window.removedMembers.indexOf(matching[0]), 1);
            }
        }
    }

    const updateRemovedMember = (event: any) => {
        const el = event.target;
        const id = event.target.id.substring(5)
        const val = (el as HTMLInputElement).value;
        const matching = window.removedMembers.filter((m) => { return m.id == id; });
        if (matching.length > 0) {
            matching[0].contact = val;
        }
        else {
            const person = {
                id: id,
                name: '',
                contact: val
            };
            window.removedMembers.push(person);
        }
    }

    const loadingCircle = () => {
        return (
            <section className='higherLoadingCircle'>
                <p>Loading...</p>
                <CircularProgress size={24} />
            </section>
        )
    }
    return (
        <>
            <h1 className='title'>Seating Survey - Part I</h1>
            {props.error && <p className='shownError'>Please make sure every removed member has a valid email so we can send them a survey!</p>}
            {names.length == 0 ?
                <>
                    <p className='subtitle'>Your are the only member in your group.</p>
                    <p className='subtitle'>Your answers to this survey will only count for you. Please review your data below.</p>
                    <div className='survey' style={{ height: 140 }}>
                        <DataGrid
                            rows={singleRow}
                            columns={lessColumns}
                            disableColumnMenu={true}
                            hideFooter={true}
                            disableSelectionOnClick={true}
                            components={{
                                NoRowsOverlay: loadingCircle,
                            }}
                            rowHeight={80} />
                    </div>
                </>
                :
                <>
                    <p className='subtitle'>Your group has {names.length} members.</p>
                    <p className='subtitle'>Your answers to this survey will apply to everyone in your group.
                        If you want to separate your group so that other members can answer independently, please remove
                        them from your group now.</p>
                    <div className='survey' style={{ height: 400 }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            disableColumnMenu={true}
                            hideFooter={true}
                            components={{
                                NoRowsOverlay: loadingCircle,
                            }}
                            disableSelectionOnClick={true}
                            rowHeight={80} />
                    </div>
                </>
            }
        </>
    );

}