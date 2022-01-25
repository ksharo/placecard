import { GuestListTable } from "./GuestListTable"
import { GuestListRow } from "./GuestListRow"
import { DataGrid } from '@mui/x-data-grid';
import { useRef, useState } from "react";
import { Button, Checkbox, Input, TextField } from "@mui/material";
import { MdUploadFile } from 'react-icons/md';
import './GuestList.css'


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

	const [currentID, editCurrentID] = useState(3)

	const [customRows, editCustomRows] = useState([
		{
			id: 1,
			individualOrPartyName: "J",
			email: "c",
			phone: "d",
			numberInParty: 4,
			vip: true
		},
		{
			id: 2,
			individualOrPartyName: "J",
			email: "c",
			phone: "d",
			numberInParty: 4,
			vip: false
		},
	])







	return(
		<>






			<section>
				<h1 className='title'>{title}</h1>
				<p className='subtitle'>{pageDescription}</p>
			</section>

			<section className='fileUploadSection'>
				<label>hi</label>
				<section className="fileUploadButtonSection">
					<MdUploadFile className="uploadFileIcon"/>

					<section>
						<p>Drag your file here or click to upload</p>
						<button type="button" id ="buttonTestTag">
							<i className="fas fa-file-upload" />
							<span> Upload files</span>
						</button>
					</section>

				</section>

				<section id="dragDropContainer">
					<input
						id = "inputTestTag"
						type="file"
						ref={useRef(null)}
						title=""
						value=""
					/>
				</section>
			</section>

			{/* <section>
				<img alt="File Icon"></img>
				<p>Drag Your File Here</p>
				<p>or</p>
				<p><input type='file' id="guestListFileUpload"></input></p>
			</section> */}
			<section>
				<span>OR</span><hr/>
			</section>
			<section>
				<h3>{tableTitle}</h3>
				<p>{tableDescription}</p>
				<GuestListTable></GuestListTable>
			</section>

			{/* <section style={{ height: 400, width: '100%' }}>
				<DataGrid
					rows={rows}
					columns={columns}
					hideFooter={true}
					disableSelectionOnClick={true}
				/>
			</section>

			<Button variant="outlined" onClick={() => {console.log(currentID); editRows([...rows, {
				id: currentID + 1,
				individualOrPartyName: "J",
				email: "c",
				phone: "d",
				numberInParty: "e",
				vip: "l"
			}]);
			editCurrentID(currentID + 1)}}>
				Add New Guest
			</Button> */}


			{/* {customRows.map( (userDetail) =>
				<GuestListRow
					guestName={userDetail.individualOrPartyName}
					email={userDetail.email}
					phone={userDetail.phone}
					partySize={userDetail.numberInParty}
					isVip={userDetail.vip}
				/>
			)} */}

			{/* <Button variant="outlined" onClick={() => {
				editCustomRows([...customRows,{
					id: currentID + 1,
					individualOrPartyName: "J",
					email: "c",
					phone: "d",
					numberInParty: 0,
					vip: false
				}]);
				editCurrentID(currentID + 1)
			}}>
				Add New Guest
			</Button> */}

			<Button color="primary" variant="contained">Next</Button>
		</>
	);
}