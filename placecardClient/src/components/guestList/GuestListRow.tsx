import { HiTrash } from 'react-icons/hi';
import { useState, useEffect } from 'react'
import { Checkbox, TextField } from "@mui/material";
import './GuestListRow.css'

type GuestListRowProps = {
	rowNum:		number,
	guestName:	string,
	email:		string,
	phone:		string,
	partySize:	number,
	isVip:		boolean,
	deleteRowFunction: (index: number) => void,
	updateRowFunction: (index: number, property: any, value: any) => void,
}


export function GuestListRow({ rowNum, guestName, email, phone, partySize, isVip, deleteRowFunction, updateRowFunction}: GuestListRowProps){
	const [rowState, setRowState] = useState({
			guestName:	guestName,
			email:		email,
			phone:		phone,
			partySize:	partySize,
			isVip:		isVip,
		})

	function updateCheckboxState(event: any): void {
		if (event){
			setRowState( (prev) => ({...prev, isVip: event['target']['checked']}));
			updateRowFunction(rowNum, "isVip", (event.target as HTMLInputElement).checked)
		}
	}

	useEffect( () => {
		console.log('GuestListRowRerender: Parent props did not match my state');
		setRowState( {
			guestName:	guestName,
			email:		email,
			phone:		phone,
			partySize:	partySize,
			isVip:		isVip,
		} )
	}, [guestName, email, phone, partySize, isVip])

	return(
		<>
			<TextField
				name={"name" + rowNum}
				value={rowState.guestName}
				inputProps={{autoComplete: "disabled"}}
				className= 'nameColumn'
				onChange={(event)=> setRowState( (prev) => ({ ...prev, guestName: event.target.value }) )}
				onBlur={(event) => updateRowFunction(rowNum, "guestName", event.target.value)}
			/>
			<TextField
				name={"email" + rowNum}
				type="email"
				value={rowState.email}
				inputProps={{autoComplete: "disabled"}}
				onChange={(event)=> setRowState( (prev) => ({ ...prev, email: event.target.value }) )}
				onBlur={(event) => updateRowFunction(rowNum, "email", event.target.value)}
			/>
			<TextField
				name={"phone" + rowNum}
				type="phone"
				value={rowState.phone}
				inputProps={{autoComplete: "disabled"}}
				onChange={(event)=> setRowState( (prev) => ({ ...prev, phone: event.target.value }) )}
				onBlur={(event) => updateRowFunction(rowNum, "phone", event.target.value)}
			/>
			<TextField
				name={"partySize" + rowNum}
				type="number"
				value={rowState.partySize}
				inputProps={{autoComplete: "disabled"}}
				onChange={(event)=> setRowState( (prev) => ({ ...prev, partySize: Number(event.target.value) }) )}
				onBlur={(event) => updateRowFunction(rowNum, "partySize", event.target.value)}
			/>
			<Checkbox
				name={"isVip" + rowNum}
				checked={rowState.isVip}
				defaultChecked={false}
				onChange={(event)=> updateCheckboxState(event)}
			/>
			<button
				tabIndex={-1}
				id={"deleteRow" + rowNum}
				onClick={ () => deleteRowFunction(rowNum) }
				type="button">

				<HiTrash/>
			</button>
		</>
	)
}
