import { GuestListTable } from "./GuestListTable"
import { DataGrid } from '@mui/x-data-grid';
import { useState } from "react";
import { Button, Checkbox, Input, TextField } from "@mui/material";


export function GuestList(){
	const title			= 'Add a Guest List For Your Event'
	const pageDescription	= 'Download our guest list template, fill it out, and drop it back here'

	const tableTitle		= 'Enter Guest List Manually'
	const tableDescription	= 'You only need to provide one method of contact for each guest'

	const columns = [
		{
			field: 'individualOrPartyName',
			headerName: 'Name of Individual/Party',
			flex: 3,
			renderCell: () => {
				return <TextField fullWidth={true} inputProps={{autoComplete: "disabled"}}/>
			},
		},
		{
			field: 'email',
			headerName: 'Email',
			flex: 3,
			renderCell: () => {
				return <TextField type="email" fullWidth={true} inputProps={{autoComplete: "disabled"}}/>
			},
		},
		{
			field: 'phone',
			headerName: 'Phone',
			flex: 3,
			renderCell: () => {
				return <TextField type="phone" fullWidth={true} inputProps={{autoComplete: "disabled"}}/>
			},
		},
		{
			field: 'numberInParty',
			headerName: '# in Party',
			flex: 1,
			renderCell: () => {
				return <TextField type="number" fullWidth={true} inputProps={{autoComplete: "disabled"}}/>
			},
		},
		{
			field: 'vip',
			headerName: 'VIP*',
			flex: 1,
			renderCell: () => {
				return <Checkbox/>
			},
		},
	]

	const [rows, editRows] = useState([
		{
			id: 1,
			individualOrPartyName: "J",
			email: "c",
			phone: "d",
			numberInParty: "e",
			vip: "l"
		},
		{
			id: 2,
			individualOrPartyName: "J",
			email: "c",
			phone: "d",
			numberInParty: "e",
			vip: "l"
		},
	])

	let i = 3

	return(
		<>
			<section>
				<h1 className='title'>{title}</h1>
				<p className='subtitle'>{pageDescription}</p>
			</section>
			<section>
				<img alt="File Icon"></img>
				<p>Drag Your File Here</p>
				<p>or</p>
				<p><input type='file'></input></p>
			</section>
			<section>
				<span>OR</span><hr/>
			</section>
			<section>
				<h3>{tableTitle}</h3>
				<p>{tableDescription}</p>
				{/* <GuestListTable></GuestListTable> */}
			</section>

			<section style={{ height: 400, width: '100%' }}>
				<DataGrid
					rows={rows}
					columns={columns}
					hideFooter={true}
					disableSelectionOnClick={true}
				/>
			</section>

			<Button variant="outlined" onClick={() => {console.log(i); editRows([...rows, {
				id: i++,
				individualOrPartyName: "J",
				email: "c",
				phone: "d",
				numberInParty: "e",
				vip: "l"
			}]);
			i = i +1}}>
				Add New Guest
			</Button>

			<Button color="primary" variant="contained">Next</Button>
		</>
	);
}