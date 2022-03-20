import { StarBorder } from '@mui/icons-material';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState } from 'react';
import './editGuestList.css';


export function EditGuestList() {
	const [guestListData, setGuestListData] = useState([])

	interface guestListDataInterface {
		groupName:	string;
        	contact:		string;
        	members:		string;
		sendSurvey:	boolean;
		groupMembers:	string[]
	}

	return (
		<>
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