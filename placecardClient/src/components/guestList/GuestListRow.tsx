import { IoTrashBinSharp } from 'react-icons/io5';
import { HiTrash } from 'react-icons/hi';
import { useState } from 'react'
import { Checkbox, TextField } from "@mui/material";
import './GuestListRow.css'

// new updates
type GuestListRowProps = {
	rowNum:		number,
	guestName:	string,
	email:		string,
	phone:		string,
	partySize:	number,
	isVip:		boolean,
	deleteRowFunction: (index: number) => void,
}
export function GuestListRow({ rowNum, guestName, email, phone, partySize, isVip, deleteRowFunction}: GuestListRowProps){
	const [rowState, setRowState] = useState({
			guestName		: guestName,
			email		: email,
			phone		: phone,
			partySize		: partySize,
			isVip		: isVip
		})

	return(
		<>
			{/* <form action=""> */}
				{/* <input type='text'		value={rowState.guestName}	onChange={(e) => {setRowState(prevState => ({...rowState, guestName: e.target.value}))}}/>
				<input type='email'		value={rowState.email}		onChange={(e) => {setRowState(prevState => ({...rowState, email: e.target.value}))}}/>
				<input type='phone'		value={rowState.phone}		onChange={(e) => {setRowState(prevState => ({...rowState, phone: e.target.value}))}}/>
				<input type='number'	value={rowState.partySize}	onChange={(e) => {setRowState(prevState => ({...rowState, partySize: parseInt(e.target.value)}))}}/>
				<input type='checkbox'	checked={rowState.isVip}		onChange={(e) => {setRowState(prevState => ({...rowState, isVip: e.target.checked}))}}/> */}
				<TextField
					name={"name" + rowNum}
					value={rowState.guestName}
					inputProps={{autoComplete: "disabled"}}
					className= 'nameColumn'
					onBlur={(event)=>  setRowState( (prev) => ({ ...prev, guestName: event.target.value }) )}
				/>
				<TextField
					name={"email" + rowNum}
					type="email"
					inputProps={{autoComplete: "disabled"}}
				/>
				<TextField
					name={"phone" + rowNum}
					type="phone"
					inputProps={{autoComplete: "disabled"}}
				/>
				<TextField
					name={"partySize" + rowNum}
					type="number"
					inputProps={{autoComplete: "disabled"}}
				/>
				<Checkbox
					name={"isVip" + rowNum}
				/>
				<button
					tabIndex={-1}
					id={"deleteRow" + rowNum}
					onClick={ () => deleteRowFunction(rowNum) }
					type="button">

					<HiTrash/>
				</button>

				{/* <button><IoTrashBinSharp/></button> */}
			{/* </form> */}




		</>
	)
}
