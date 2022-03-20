import { HiTrash } from 'react-icons/hi';
import { useState, useEffect } from 'react'
import { Checkbox, TextField } from "@mui/material";
import './GuestListRow.css'
import { AiOutlineConsoleSql } from 'react-icons/ai';

type GuestListRowProps = {
	rowNum:			number,
	guestName:		string,
	email:			string,
	phone:			string,
	partySize:		number,
	isVip:			boolean,
	deleteRowFunction:	(index: number) => void,
	updateRowFunction:	(index: number, property: any, value: any, validationRegex: RegExp) => void,
}

const NAME_REGEX		= /^[a-zA-z\s]*$/
const EMAIL_REGEX		= /^[a-zA-Z.\d!#$%&'*+\-/=?^_`{|}~]+@[a-zA-Z+.-\d]+.[a-zA-z+.-\d]+$/
const PHONE_REGEX		= /^[\d-\s()+_#.ext]*$/
const PARTY_SIZE_REGEX	= /^[\d]*$/

export function GuestListRow({ rowNum, guestName, email, phone, partySize, isVip, deleteRowFunction, updateRowFunction}: GuestListRowProps){
	const [rowState, setRowState] = useState({
		guestName:	guestName,
		email:		email,
		phone:		phone,
		partySize:	partySize,
		isVip:		isVip,
	})

	const [rowValid, setRowValid] = useState({
		guestNameValid:	true,
		emailValid:		true,
		phoneValid:		true,
		partySizeValid:	true,
	})

	function updateCheckboxState(event: any): void {
		if (event){
			setRowState( (prev) => ({...prev, isVip: event['target']['checked']}));
			updateRowFunction(rowNum, "isVip", (event.target as HTMLInputElement).checked, /.*/)
		}
	}

	function validateAndUpdateState(event: any, rowParameter: string, rowParameterValid: string, validRegex: any): void {
		//Constantly validate on change
		setRowState( (prev) => ({ ...prev, [rowParameter]: event?.target.value }) );
		if ( (rowValid as any)[rowParameterValid]  &&  !validRegex.test(event.target.value) ) {
			setRowValid( (prev) => ({ ...prev, [rowParameterValid]: false}))
		}
		else if ( !(rowValid as any)[rowParameterValid]  &&  validRegex.test(event.target.value) ){
			setRowValid( (prev) => ({ ...prev, [rowParameterValid]: true}))
		}

		//Constantly check if input is valid when input is originally not valid, next button needs to do value
		setRowState( (prev) => ({ ...prev, [rowParameter]: event?.target.value }) );
		if ( !(rowValid as any)[rowParameterValid]  &&  validRegex.test(event.target.value) ){
			setRowValid( (prev) => ({ ...prev, [rowParameterValid]: true}))
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

	useEffect( () => {
		console.log('GuestListRowRerender: Parent request validation message');

	}, [])

	return(
		<>
			<TextField
				name={"name" + rowNum}
				value={rowState.guestName}
				inputProps={{autoComplete: "disabled"}}
				className= 'nameColumn'
				onChange={(event) => validateAndUpdateState(event, 'guestName', 'guestNameValid', NAME_REGEX) }
				onBlur={(event) => updateRowFunction(rowNum, "guestName", event.target.value, NAME_REGEX)}
				error={!rowValid.guestNameValid}
				helperText={rowValid.guestNameValid ? "" : "Name has invalid characters"}
			/>
			<TextField
				name={"email" + rowNum}
				type="email"
				value={rowState.email}
				inputProps={{autoComplete: "disabled"}}
				onChange={(event) => validateAndUpdateState(event, 'email', 'emailValid', EMAIL_REGEX) }
				onBlur={(event) => updateRowFunction(rowNum, "email", event.target.value, EMAIL_REGEX)}
				error={!rowValid.emailValid}
				helperText={rowValid.emailValid ? "" : "Email must contain @ and domain"}
			/>
			<TextField
				name={"phone" + rowNum}
				type="phone"
				value={rowState.phone}
				inputProps={{autoComplete: "disabled"}}
				onChange={(event) => validateAndUpdateState(event, 'phone', 'phoneValid', PHONE_REGEX) }
				onBlur={(event) => updateRowFunction(rowNum, "phone", event.target.value, PHONE_REGEX)}
				error={!rowValid.phoneValid}
				helperText={rowValid.phoneValid ? "" : "Phone number has invalid characters"}
			/>
			<TextField
				name={"partySize" + rowNum}
				type="number"
				value={rowState.partySize}
				inputProps={{autoComplete: "disabled", min:1}}
				onChange={(event) => validateAndUpdateState(event, 'partySize', 'partySizeValid', PARTY_SIZE_REGEX) }
				onBlur={(event) => updateRowFunction(rowNum, "partySize", event.target.value, PARTY_SIZE_REGEX)}
				error={!rowValid.partySizeValid}
				helperText={rowValid.partySizeValid ? "" : "Party size must be a number greater than 0"}
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
