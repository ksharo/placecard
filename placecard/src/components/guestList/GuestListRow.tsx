import { IoTrashBinSharp } from 'react-icons/io5';
import { useState } from 'react'

type GuestListRowProps = {
	guestName:	string,
	email:		string,
	phone:		string,
	partySize:	number,
	isVip:		boolean
}
export function GuestListRow({ guestName, email, phone, partySize, isVip}: GuestListRowProps){
	const [rowState, setRowState] = useState({
			guestName		: guestName,
			email		: email,
			phone		: phone,
			partySize		: partySize,
			isVip		: isVip
		})

	return(
		<>
			<form action="">
				<input type='text'		value={rowState.guestName}	onChange={(e) => {setRowState(prevState => ({...rowState, guestName: e.target.value}))}}/>
				<input type='email'		value={rowState.email}		onChange={(e) => {setRowState(prevState => ({...rowState, email: e.target.value}))}}/>
				<input type='phone'		value={rowState.phone}		onChange={(e) => {setRowState(prevState => ({...rowState, phone: e.target.value}))}}/>
				<input type='number'	value={rowState.partySize}	onChange={(e) => {setRowState(prevState => ({...rowState, partySize: parseInt(e.target.value)}))}}/>
				<input type='checkbox'	checked={rowState.isVip}		onChange={(e) => {setRowState(prevState => ({...rowState, isVip: e.target.checked}))}}/>
				<button><IoTrashBinSharp/></button>
			</form>




		</>
	)
}
