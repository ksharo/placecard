import Collapse from '@mui/material/Collapse';
import { useState } from 'react';

import './GuestTable.css'

export interface GuestListDataInterface {
	individualName?:	string;
	groupName?:		string;
	groupContact:		string | undefined;
	groupSize:		string | undefined;
	sendSurvey:		boolean;
	groupMembers:		any[];
	id?: 			string
}

function GuestListTableRow(props: {guest:GuestListDataInterface}){
	const [open, setOpen] = useState(false)

	return(
		<>
			<tr className='groupSummary'>
				<td className="firstCol" onClick={() => setOpen(!open)}>{props.guest.groupName}</td>
				<td>{props.guest.groupContact}</td>
				<td>{props.guest.sendSurvey.toString()}</td>
				<td>Delete</td>
			</tr>
			<tr className='groupDropdown'>
				<td colSpan={4}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<ul className='subgroupMemberList'>
							{props.guest.groupMembers.map((memberName, _) =>(
								<li className="subgroupMember" >{memberName}</li>
							))}
						</ul>
					</Collapse>
				</td>
			</tr>
		</>
	)
}


export function GuestListTable(props: {tableData:GuestListDataInterface[]}) {
	return(
		<section className="guestTable">
			<table className="resultTable">

				<thead>
					<tr className="headingRow">
						<th className='firstCol'>Name of Individual/Party</th>
						<th >Contact</th>
						<th >Send Survey</th>
						<th >Delete</th>
					</tr>
				</thead>

				<tbody>
					{props.tableData.map((obj, i) => (
						<GuestListTableRow guest={obj}/>
					))}
				</tbody>

			</table>
		</section>
	)
}
