import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';

import './GuestTable.css'
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';

export interface GuestListDataInterface {
	individualName?:	string;
	groupName?:		string;
	groupContact:		string | undefined;
	groupSize:		string | undefined;
	sendSurvey:		boolean;
	surveyStatus?:		"Completed" | "Pending" | "Not Sent" | "Failed to Send" | "N/A"
	groupMembers:		any[];
	id?: 			string
}

export type GuestListTableMode = "SurveySent" | "New"

function GuestListTableRow(props: {guest:GuestListDataInterface, setTableData:Function, index:number, mode?:GuestListTableMode}){
	const [open, setOpen]		= useState(false)
	const [editing, setEditing]	= useState(false)

	return(
		<>
			<tr className='groupSummary' onClick={() => setOpen(!open)}>
				{
					props.mode === "New" ?
						<>
							<td className="firstCol" onClick={() => setOpen(!open)}>{open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}</td>
							<td>{props.guest.groupName}</td>
							<td>{props.guest.groupContact}</td>
							<td><Checkbox checked={props.guest.sendSurvey} onClick={() => console.log("checked")}/></td>
							<td><IconButton aria-label="Edit row"><EditIcon/></IconButton></td>
							<td><IconButton aria-label="Delete row"><DeleteIcon/></IconButton></td>
						</>
					:
						<>
							<td className="firstCol" onClick={() => setOpen(!open)}>{open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}</td>
							<td>{props.guest.groupName}</td>
							<td>{props.guest.groupContact}</td>
							<td>{props.guest.surveyStatus}</td>
							<td><IconButton aria-label="Send reminder"><NotificationsIcon/></IconButton></td>
							<td><IconButton aria-label="Edit row"><EditIcon/></IconButton></td>
							<td><IconButton aria-label="Delete row"><DeleteIcon/></IconButton></td>
						</>
				}

			</tr>
			<tr className='groupDropdown'>
				<td></td>
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


export function GuestListTable(props: {tableData:GuestListDataInterface[], setTableData:Function, mode?:GuestListTableMode}) {
	return(
		<section className="guestTable">
			<table className="resultTable">

				<thead>
					<tr className="headingRow">
						{
							props.mode === "New" ?
							<>
								<th className='firstCol'>Expand Group</th>
								<th >Name of Individual/Party</th>
								<th >Contact</th>
								<th >Send Survey</th>
								<th >Edit</th>
								<th >Delete</th>
							</>
							:
							<>
								<th className='firstCol'>Expand Group</th>
								<th >Name of Individual/Party</th>
								<th >Contact</th>
								<th >Survey Status</th>
								<th >Remind</th>
								<th >Edit</th>
								<th >Delete</th>
							</>
						}

					</tr>
				</thead>

				<tbody>
					{props.tableData.map((obj, i) => (
						<GuestListTableRow guest={obj} setTableData={props.setTableData} index={i} mode={props.mode}/>
					))}
				</tbody>

			</table>
		</section>
	)
}
