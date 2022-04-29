import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SaveIcon from '@mui/icons-material/Save';
import { updateGuestToGlobalEvent } from "../guestList/AddGuestPopUp";

import './GuestListTable.css'
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { TextField } from '@mui/material';
import { v4 as uuid } from 'uuid';

export interface GuestListDataInterface {
	individualName?:	string;
	groupName?:		string;
	groupContact:		string | undefined;
	groupSize:		string | undefined;
	sendSurvey:		boolean;
	surveyStatus?:		"Completed" | "Pending" | "Not Sent" | "Failed to Send" | "N/A"
	groupMembers:		any[];
	id?: 			string;
	group_id?:		string;
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
		// console.log(props);
		// console.log(props.tableData[props.index].id);
		// delete the person from the database

		setEditing(false)
		props.setTableData(
			[
				...props.tableData.slice(0, props.index),
				...props.tableData.slice(props.index+1)
			]
		)
	}

	const rowIsGroup = props.guest.groupMembers.length > 0
	return(
		<>
			<tr className='groupSummary'>
				{
					props.mode === "New" ?
						<>
							<td className="firstCol" onClick={() => setOpen(!open)}>
								{rowIsGroup && <IconButton className='guestListIcon'>{open ? <KeyboardArrowDownIcon/> : <KeyboardArrowRightIcon/>}</IconButton>}
							</td>
							<td className='nameCol'>
								{editing?
									<TextField value={rowIsGroup ? props.guest.groupName : props.guest.individualName} onChange={(e) => updateRowData((rowIsGroup ? "groupName" : "individualName"), e.target.value)} size="small"></TextField>
									:
									rowIsGroup ? props.guest.groupName : props.guest.individualName
								}
							</td>
							<td className='contactCol'>
								{editing?
									<TextField value={props.guest.groupContact} onChange={(e) => updateRowData("groupContact", e.target.value)} size="small"></TextField>
									:
									props.guest.groupContact
								}
							</td>
							<td><Checkbox checked={props.guest.sendSurvey} onChange={(e) => updateRowData("sendSurvey", e.target.checked)}/></td>
							<td>
								<IconButton
									className='guestListIcon'
									onClick={() => {
										if(editing){
											console.log(props.guest);
											console.log({
													first_name: props.guest.individualName,
													email: props.guest.groupContact,
													party_size: props.guest.groupMembers.length,
												});
											if(!rowIsGroup){ //if row is individual, update individual
												updateGuestToGlobalEvent(props.guest, props.guest.id);
												const nameSplit = (props && props.guest && props.guest.individualName)? props.guest.individualName.split(" ") : [];
												let firstName = '';
												let lastName = '--';
												if (nameSplit.length > 1) {
													firstName = nameSplit.slice(0, nameSplit.length - 1).join(" ");
													lastName = nameSplit[nameSplit.length - 1];
												}
												else {
													firstName = nameSplit[0];
												}

												const requestOptions = {
													method: 'PATCH',
													headers: { 'Content-Type': 'application/json' },
													body: JSON.stringify({
														first_name: firstName,
														last_name: lastName,
														email: props.guest.groupContact,
														party_size: props.guest.groupMembers.length,
														_id: props.guest.id
													})
												};
												fetch('http://localhost:3001/guests/updateGuest', requestOptions)
											}
											else {	//eles, row is group, must update all group memebrs.
												let updatedGroupName = props.guest.groupName
												console.log("guestprops:",props.guest);

											}
										};
										setEditing(!editing);
									}}
									aria-label={editing? "Save edits" : "Edit row"}>
									{editing? <SaveIcon/> : <EditIcon/>}
								</IconButton>
							</td>
							<td><IconButton className='guestListIcon' onClick={() => deleteRowData()} aria-label="Delete row"><DeleteIcon/></IconButton></td>
						</>
					:
						<>
							<td className="firstCol" onClick={() => setOpen(!open)}>
								{rowIsGroup && <IconButton className='guestListIcon'>{open ? <KeyboardArrowDownIcon/> : <KeyboardArrowRightIcon/>}</IconButton>}
							</td>
							<td className='nameCol'>
								{editing?
									<TextField value={props.guest.groupName} onChange={(e) => updateRowData("groupName", e.target.value)} size="small"></TextField>
									:
									props.guest.groupName
								}
							</td>
							<td className='contactCol'>
								{editing?
									<TextField value={props.guest.groupContact} onChange={(e) => updateRowData("groupContact", e.target.value)} size="small"></TextField>
									:
									props.guest.groupContact
								}
							</td>
							<td>{window.activeEvent !== null && window.activeEvent.surveys != undefined  && window.activeEvent.surveys.indexOf(props.guest.id != undefined  ? props.guest.id : '') !== -1 ? (window.activeEvent.respondents != undefined  && window.activeEvent.respondents.indexOf(props.guest.id != undefined  ? props.guest.id : '') !== -1 ? 'Completed' : 'Pending') : 'Not Sent'}</td>
							<td><IconButton className='guestListIcon' aria-label="Send reminder"><NotificationsIcon/></IconButton></td>
							<td>
								<IconButton className='guestListIcon' onClick={() => {if(!editing){console.log(props.guest)}; setEditing(!editing);}} aria-label={editing? "Save edits" : "Edit row"}>
									{editing? <SaveIcon/> : <EditIcon/>}
								</IconButton>
							</td>
							<td><IconButton className='guestListIcon' onClick={() => deleteRowData()} aria-label="Delete row"><DeleteIcon/></IconButton></td>
						</>
				}

			</tr>
			<tr className='groupDropdown'>
				<td></td>
				<td colSpan={(props.mode === "New" ? 5 : 6)}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<ul className='subgroupMemberList'>
							{props.guest.groupMembers.map((memberName, i) =>(
								editing?
									<li className="subgroupMember" key={uuid()}>
										<TextField value={memberName} onChange={(e) => {
												updateRowData("groupMembers", props.guest.groupMembers.slice(0, i)
													.concat([e.target.value])
													.concat(props.guest.groupMembers.slice(i+1)));
												}
											} size="small"/>
										<IconButton className='guestListIcon' onClick={() => updateRowData("groupMembers", props.guest.groupMembers.slice(0, i).concat(props.guest.groupMembers.slice(i+1)))} aria-label="Delete row"><DeleteIcon/></IconButton>
									</li>
									:
									<li className="subgroupMember" key={memberName+uuid()}>{memberName}</li>
							))}

							{ editing && (
								<section className="addButtonGroup">
									<Button color="primary" variant="contained" onClick={() => updateRowData("groupMembers", props.guest.groupMembers.concat([""]) )}>Add Member to Group</Button>
								</section>
							)}
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
								<th className='firstCol'></th>
								<th className='firstColName'>Name of Individual/Group</th>
								<th className='firstColContact'>Contact</th>
								<th >Send Survey</th>
								<th >Edit</th>
								<th >Delete</th>
							</>
							:
							<>
								<th className='firstCol'></th>
								<th className='firstColName'>Name of Individual/Group</th>
								<th className='firstColContact'>Contact</th>
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
						<GuestListTableRow tableData={props.tableData} guest={obj} setTableData={props.setTableData} index={i} mode={props.mode} key={i}/>
					))}
				</tbody>

			</table>
		</section>
	)
}
