import { GuestListTable, GuestListDataInterface } from "./GuestListTable"
import { AddGuestPopUp, addGuestToGlobalEvent } from "./AddGuestPopUp";
import { useState, useEffect, useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";
import './GuestList.css'
import { UploadFile } from "../shared/UploadFile";

export function GuestList(){
	window.setGuestMode(false);
	const TITLE			= 'Add a Guest List For Your Event'
	const PAGE_DESCRIPTION	= 'Download our guest list template, fill it out, and drop it back here'
	const TABLE_TITLE		= 'Enter guest list manually'
	const TABLE_DESCRIPTION	= 'You only need to provide one method of contact for each guest'

	const history			= useHistory();

	const [guestListData, setGuestListData]	= useState<GuestListDataInterface[]>([])



	/* initialize guest list data */
	useLayoutEffect( () => {
		const startingGuests: GuestListDataInterface[] = [...guestListData];
		const startingGroups: any = {};
		if (window.activeEvent !== null) {
			// loop over guest list to fillout guestListData state
			for (let guest of window.activeEvent.guestList) {
				/* single people */
				if (guest.groupName == undefined  || guest.groupName.trim() === "") {
					const newGuest: GuestListDataInterface = {
						individualName: guest.name,
						// groupName: guest.name,
						groupContact: guest.contact,
						groupSize: guest.groupSize?.toString(),
						sendSurvey: true,
						groupMembers: [],
						id: guest.id
					};
					if (!startingGuests.some(g => { if (g.id === newGuest.id) return true;})) {
						startingGuests.push(newGuest);
					}
				}
				/* groups */
				else if (guest.groupID != undefined  && Object.keys(startingGroups).includes(guest.groupID)) {
					startingGroups[guest.groupID].groupMembers.push(guest.name);
				}
				else if (guest.groupID != undefined ) {
					startingGroups[guest.groupID] = {
						groupName: guest.groupName,
						groupContact: guest.contact,
						groupSize: guest.groupSize?.toString(),
						sendSurvey: true,
						groupMembers: [guest.name],
						id: guest.groupID,
						group_id: guest.groupID
					}
				}
			}
			// loop over guest
			for (let groupID of Object.keys(startingGroups)) {
				const group = startingGroups[groupID];
				const newGroup: GuestListDataInterface = {
					groupName: group.groupName,
					groupContact: group.groupContact,
					groupSize: group.groupSize,
					sendSurvey: group.sendSurvey,
					groupMembers: group.groupMembers,
					id: group.id
				};
				if (!startingGuests.some(g => { if (g.id === newGroup.id) return true;})) {
					startingGuests.push(newGroup);
				}
			}
			console.log({startingGuests})
			setGuestListData(startingGuests);
		}
	}, [window.activeEvent]);


	const toCustomizeSurvey = (event: any) => {
		event.preventDefault()
		if(event && event.target && event.target.numGuestsAdded && event.target.numGuestsAdded.value){
			let numRows =  event?.target?.numGuestsAdded?.value
			let guestList: any = {}
			for(let i = 0; i < numRows; i++ ){
				let guest = {
					first_name:	event.target["name"+i].value,
					email: 		event.target["email"+i].value,
					// phone_number: 	event.target["phone"+i].value,
					party_size: 	event.target["partySize"+i].value,
					isVip: 		event.target["isVip"+i].checked,
				}
				guestList['guest'+ i] = guest
			}

		}

		// let data = new FormData();
		// if (userFile != undefined) {
          // 	data.append('file', userFile);
		// }

		// if(userFile && userFile['name']){
		// 	const requestOptions = {
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-Type': 'application/json'
		// 		}
		// 	};
		// 	return fetch('http://localhost:3001/guestList/fileUpload', requestOptions);
		// }

		history.push('/editSurvey');
	}


	return(
		<>
			<section>
				<h1 className='title'>{TITLE}</h1>
				<p className='subtitle'>{PAGE_DESCRIPTION}</p>
			</section>

			<UploadFile setTableData={setGuestListData}/>

			<section className="horizontalOr">
				<div className="horizontalBar"/>
				<span>OR</span>
				<div className="horizontalBar"/>
			</section>

			<form id="addGuestListForm" onSubmit={ toCustomizeSurvey }>

				<section className = "manualGuestListSection">
					<h1 className='title'>{TABLE_TITLE}</h1>
					<p className='subtitle'>{TABLE_DESCRIPTION}</p>
					<AddGuestPopUp guestListData={guestListData} setGuestListData={setGuestListData}/>
					<GuestListTable tableData={guestListData} setTableData={setGuestListData} mode="New"/>
				</section>
				<Button type="submit" color="primary" variant="contained">Next</Button>
			</form>

		</>
	);
}
