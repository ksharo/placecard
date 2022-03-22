// import { useState } from "react"
// import { GuestListRow } from "./GuestListRow"
// import { Button } from "@mui/material";
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
			<tr>
				<td className="firstCol" onClick={() => setOpen(!open)}>{props.guest.groupName}</td>
				<td>{props.guest.groupContact}</td>
				<td>{props.guest.sendSurvey.toString()}</td>
				<td>Delete</td>
			</tr>
			<tr>
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
					<tr>
						<th className="firstCol headerCol">Name of Individual/Party</th>
						<th className="headerCol">Contact</th>
						<th className="headerCol">Send Survey</th>
						<th className="headerCol">Delete</th>
					</tr>
				</thead>

				<tbody>
					{props.tableData.map((obj, i) => (
						<GuestListTableRow guest={obj}/>
						// <>
							// 	<tr>
							// 		<td className="firstCol">{obj.groupName}</td>
							// 		<td>{obj.groupContact}</td>
							// 		<td>{obj.sendSurvey.toString()}</td>
							// 		<td>Delete</td>
							// 	</tr>
							// 	<tr>
							// 		<Collapse in={open} timeout="auto" unmountOnExit>
							// 			{obj.groupMembers.map((memberName, _) =>(
							// 				<td className="subgroupMember">{memberName}</td>
							// 			))}
							// 		</Collapse>
							// 	</tr>
						// </>
					))}
				</tbody>

			</table>



			{/* <section className="resultTable">

				<span className="firstCol headerCol">Name of Individual/Party</span>
				<span className="headerCol">Contact</span>
				<span className="headerCol">Send Survey</span>
				<span className="headerCol">Delete</span>

				{props.tableData.map((obj, i) => (
					<>
						<span className="firstCol">{obj.groupName}</span>
						<span>{obj.groupContact}</span>
						<span>{obj.sendSurvey.toString()}</span>
						<span>Delete</span>
						{obj.groupMembers.map((memberName, _) =>(
							<span className="subgroupMember">{memberName}</span>
						))}
					</>
				))}

			</section> */}
		</section>
	)
	// const [rows, setRows] = useState([
	// 	{
	// 		guestName:	"",
	// 		email:		"",
	// 		phone:		"",
	// 		partySize:	1,
	// 		isVip:		false
	// 	}
	// ])
	// const [numRows, setNumRows] = useState(rows.length)

	// const [tableValid, setTableValid] = useState(true)

	// function addRow(): void {
	// 	setRows([...rows, {guestName: "", email: "", phone:"", partySize: 1, isVip: false}]);
	// 	setNumRows(numRows + 1)
	// }

	// function updateRow(rowIndex: number, property: any, value: any, validationRegex: RegExp): void {
	// 	setRows( (prev) => (prev.map((item, itemIndex) => {
	// 		if (itemIndex === rowIndex){
	// 			return {...item, [property]: value}
	// 		}
	// 		else{
	// 			return item;
	// 		}
	// 	})) )

	// 	if (!validationRegex.test(value)){
	// 		setTableValid(false)
	// 	}
	// }

	// function deleteRow(indexToDelete: number): void {
	// 	// console.log("delete", indexToDelete)
	// 	// console.log(rows.filter(function(...[, index]) {return index !== indexToDelete	}))

	// 	setRows(rows.filter(function(...[, index]) { //...[, index] is equivalent to saying "I only want the second argument", equivalent to function(_, index)
	// 		return index !== indexToDelete
	// 	}));
	// 	setNumRows(numRows - 1)
	// }

	// return (
	// 	<>
	// 		{/* <Search /> */}
	// 		<section className="guestTable">
	// 			<section className="guestTableHeader">
	// 				<span>Name of Individual/Party</span>
	// 				<span>Email</span>
	// 				<span>Phone</span>
	// 				<span># in Party</span>
	// 				<span>VIP</span>

	// 				{rows.map((row: rowDetails, index: number) => (
	// 					<GuestListRow
	// 						rowNum			= {index}
	// 						guestName			= {row.guestName}
	// 						email			= {row.email}
	// 						phone			= {row.phone}
	// 						partySize			= {row.partySize}
	// 						isVip			= {row.isVip}
	// 						deleteRowFunction	= {deleteRow}
	// 						updateRowFunction	= {updateRow}
	// 					/>
	// 				))}
	// 			</section>
	// 		</section>

	// 		<section className = 'addGuestRowBottomControl'>
	// 			<Button variant="outlined" onClick={addRow} className="addGuestRowButton">
	// 				Add New Guest
	// 			</Button>
	// 			 <input type="hidden" name="numGuestsAdded" value={numRows} />
	// 		</section>
	// 	</>
	// )
}
