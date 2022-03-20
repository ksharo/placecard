// import { useState } from "react"
// import { GuestListRow } from "./GuestListRow"
// import { Button } from "@mui/material";
import './GuestTable.css'

export interface GuestListDataInterface {
	individualName?:	string;
	groupName?:		string;
	groupContact:		string | undefined;
	groupSize:		string | undefined;
	sendSurvey:		boolean;
	groupMembers:		any[]
}


export function GuestListTable(props: {tableData:GuestListDataInterface[]}) {

	return(
		<section className="guestTable">
			<section className="resultTable">

				<span className="firstCol">Name of Individual/Party</span>
				<span>Contact</span>
				<span>Send Survey</span>
				<span>Delete</span>

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

			</section>
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
