import { useHistory } from "react-router-dom";
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { GuestListTable, GuestListDataInterface } from "../guestList/GuestListTable"
import { AddGuestPopUp } from "../guestList/AddGuestPopUp";
import './editGuestList.css';
import { UploadFile } from "../shared/UploadFile";


export function EditGuestList() {
	const [guestListData, setGuestListData]					= useState<GuestListDataInterface[]>([])

	useEffect( () => {
		const startingGuests: GuestListDataInterface[] = [...guestListData];
		const startingGroups: any = {};
		if (window.activeEvent !== null) {
			// loop over guest list to fillout guestListData state
			for (let guest of window.activeEvent.guestList) {
				/* single people */
				if (guest.groupName == undefined  || guest.groupName.trim() === "") {
					const newGuest: GuestListDataInterface = {
						groupName: guest.name,
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
						id: guest.groupID
					}
				}
			}
			// loop over gue
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
			setGuestListData(startingGuests);
		}
	}, [window.activeEvent]);

    const history = useHistory();
    let handleClick =  () => {
        history.push('/eventDash');
    }

	return (
		<>
			<h1 className='title'>Edit Your Guest List</h1>
			<GuestListTable tableData={guestListData} setTableData={setGuestListData} mode="SurveySent"/>

			<AddGuestPopUp guestListData={guestListData} setGuestListData={setGuestListData}/>
			<section>
				<span>OR</span><hr/>
			</section>
			<UploadFile/>
			<Button variant='contained' onClick={handleClick}>Return to Dashboard</Button>

		</>
	)
}