import { StarBorder } from '@mui/icons-material';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';
import { GuestListTable, GuestListDataInterface } from "../guestList/GuestListTable"
import './editGuestList.css';


export function EditGuestList() {
	const [guestListData, setGuestListData]					= useState<GuestListDataInterface[]>([])

	useEffect( () => {
		const startingGuests: GuestListDataInterface[] = [...guestListData];
		const startingGroups: any = {};
		if (window.activeEvent != null) {
			// loop over guest list to fillout guestListData state
			for (let guest of window.activeEvent.guestList) {
				/* single people */
				if (guest.groupName == undefined || guest.groupName.trim() == "") {
					const newGuest: GuestListDataInterface = {
						individualName: guest.name,
						groupContact: guest.contact,
						groupSize: guest.groupSize?.toString(),
						sendSurvey: true,
						groupMembers: [],
						id: guest.id
					};
					if (!startingGuests.some(g => { if (g.id == newGuest.id) return true;})) {
						startingGuests.push(newGuest);
					}
				}
				/* groups */
				else if (guest.groupID != undefined && Object.keys(startingGroups).includes(guest.groupID)) {
					startingGroups[guest.groupID].groupMembers.push(guest.name);
				}
				else if (guest.groupID != undefined) {
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
				if (!startingGuests.some(g => { if (g.id == newGroup.id) return true;})) {
					startingGuests.push(newGroup);
				}
			}
			setGuestListData(startingGuests);
		}
	}, [window.activeEvent]);


	return (
		<>
			<GuestListTable tableData={guestListData}/>

			<section>
				<section className='guestTableHader'>
					<section>Name of Individual/Party</section>
					<section>Contact</section>
					<section>VIP</section>
					<section>Survey Status</section>
					<section>Remind</section>
				</section>
				<section>
					{guestListData.map((name, i) => (
						<>
							<section>Name of Individual/Party</section>
							<section>Contact</section>
							<section>VIP</section>
							<section>Survey Status</section>
							<section>Remind</section>
						</>
					))}
				</section>
			</section>
			<Collapse in={true} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					<ListItemButton sx={{ pl: 4 }}>
						<ListItemIcon>
							<StarBorder />
						</ListItemIcon>
						<ListItemText primary="Starred" />
					</ListItemButton>
				</List>
			</Collapse>
		</>
	)
}