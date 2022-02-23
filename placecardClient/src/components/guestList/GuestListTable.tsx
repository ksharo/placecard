import { useState } from "react"
import { GuestListRow } from "./GuestListRow"
import { Button } from "@mui/material";

type rowDetails = {
	guestName:	string,
	email:		string,
	phone:		string,
	partySize:	number,
	isVip:		boolean
}


export function GuestListTable() {
	const [rows, setRows] = useState([
		{
			guestName:	"",
			email:		"",
			phone:		"",
			partySize:	1,
			isVip:		false
		}
	])
	const [numRows, setNumRows] = useState(rows.length)

	const [tableValid, setTableValid] = useState(true)

	function addRow(): void {
		setRows([...rows, {guestName: "", email: "", phone:"", partySize: 1, isVip: false}]);
		setNumRows(numRows + 1)
	}

	function updateRow(rowIndex: number, property: any, value: any, validationRegex: RegExp): void {
		setRows( (prev) => (prev.map((item, itemIndex) => {
			if (itemIndex === rowIndex){
				return {...item, [property]: value}
			}
			else{
				return item;
			}
		})) )

		if (!validationRegex.test(value)){
			setTableValid(false)
		}
	}

	function deleteRow(indexToDelete: number): void {
		// console.log("delete", indexToDelete)
		// console.log(rows.filter(function(...[, index]) {return index !== indexToDelete	}))

		setRows(rows.filter(function(...[, index]) { //...[, index] is equivalent to saying "I only want the second argument", equivalent to function(_, index)
			return index !== indexToDelete
		}));
		setNumRows(numRows - 1)
	}

	return (
		<>
			{/* <Search /> */}
			<section className="guestTable">
				<section className="guestTableHeader">
					<span>Name of Individual/Party</span>
					<span>Email</span>
					<span>Phone</span>
					<span># in Party</span>
					<span>VIP</span>

					{rows.map((row: rowDetails, index: number) => (
						<GuestListRow
							rowNum			= {index}
							guestName			= {row.guestName}
							email			= {row.email}
							phone			= {row.phone}
							partySize			= {row.partySize}
							isVip			= {row.isVip}
							deleteRowFunction	= {deleteRow}
							updateRowFunction	= {updateRow}
						/>
					))}
				</section>
			</section>

			<section className = 'addGuestRowBottomControl'>
				<Button variant="outlined" onClick={addRow} className="addGuestRowButton">
					Add New Guest
				</Button>
				 <input type="hidden" name="numGuestsAdded" value={numRows} />
			</section>
		</>
	)
}
