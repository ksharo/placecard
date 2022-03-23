import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SaveIcon from '@mui/icons-material/Save';

import './GuestTable.css'
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { TextField } from '@mui/material';

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

function GuestListTableRow(props: {tableData:GuestListDataInterface[], guest:GuestListDataInterface, setTableData:Function, index:number, mode?:GuestListTableMode}){
	const [open, setOpen]		= useState(false)
	const [editing, setEditing]	= useState(false)

	function updateRowData(key: string, value: any){
		props.setTableData(
			[
				...props.tableData.slice(0, props.index),
				{
					...props.tableData[props.index],
					[key]: value,
				},
				...props.tableData.slice(props.index+1)
			]
		)
	}

	function deleteRowData(){
		props.setTableData(
			[
				...props.tableData.slice(0, props.index),
				...props.tableData.slice(props.index+1)
			]
		)
	}

	return(
		<>
			<tr className='groupSummary'>
				{
					props.mode === "New" ?
						<>
							<td className="firstCol" onClick={() => setOpen(!open)}>
								<IconButton>{open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}</IconButton>
							</td>
							<td>
								{editing?
									<TextField value={props.guest.groupName} onChange={(e) => updateRowData("groupName", e.target.value)} size="small"></TextField>
									:
									props.guest.groupName
								}
							</td>
							<td>
								{editing?
									<TextField value={props.guest.groupContact} onChange={(e) => updateRowData("groupContact", e.target.value)} size="small"></TextField>
									:
									props.guest.groupContact
								}
							</td>
							<td><Checkbox checked={props.guest.sendSurvey} onChange={(e) => updateRowData("sendSurvey", e.target.checked)}/></td>
							<td>
								<IconButton onClick={() => setEditing(!editing)} aria-label={editing? "Save edits" : "Edit row"}>
									{editing? <SaveIcon/> : <EditIcon/>}
								</IconButton>
							</td>
							<td><IconButton onClick={() => deleteRowData()} aria-label="Delete row"><DeleteIcon/></IconButton></td>
						</>
					:
						<>
							<td className="firstCol" onClick={() => setOpen(!open)}>
								<IconButton>{open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}</IconButton>
							</td>
							<td>
								{editing?
									<TextField value={props.guest.groupName} onChange={(e) => updateRowData("groupName", e.target.value)} size="small"></TextField>
									:
									props.guest.groupName
								}
							</td>
							<td>
								{editing?
									<TextField value={props.guest.groupContact} onChange={(e) => updateRowData("groupContact", e.target.value)} size="small"></TextField>
									:
									props.guest.groupContact
								}
							</td>
							<td>{props.guest.surveyStatus}</td>
							<td><IconButton aria-label="Send reminder"><NotificationsIcon/></IconButton></td>
							<td>
								<IconButton onClick={() => setEditing(!editing)} aria-label={editing? "Save edits" : "Edit row"}>
									{editing? <SaveIcon/> : <EditIcon/>}
								</IconButton>
							</td>
							<td><IconButton onClick={() => deleteRowData()} aria-label="Delete row"><DeleteIcon/></IconButton></td>
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
		<section className="guestListTable">
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
						<GuestListTableRow tableData={props.tableData} guest={obj} setTableData={props.setTableData} index={i} mode={props.mode}/>
					))}
				</tbody>

			</table>
		</section>
	)
}
