import { useState } from "react"
import { GuestListRow } from "./GuestListRow"
import { Button, Checkbox, Input, TextField } from "@mui/material";


type rowDetails = {
	guestName: string,
	email: string,
	phone: string,
	partySize: number,
	isVip: boolean
}

export function GuestListTable() {
	const [rows, setRows] = useState([
		{
			guestName		: "",
			email		: "",
			phone		: "",
			partySize		: 1,
			isVip		: false
		}
	])
	const [numRows, setNumRows] = useState(1)

	function addRow(): void {
		console.log(rows);
		setRows([...rows, {guestName: "", email: "", phone:"", partySize: 1, isVip: false}]);
		setNumRows(rows.length + 1)
	}

	function updateRow(rowIndex: number, property: any, value: any): void {
		setRows( (prev) => (prev.map((item, itemIndex) => {
			if (itemIndex === rowIndex){
				console.log("Update name");
				return {...item, [property]: value}
			}
			else{
				console.log("Same");
				return item;
			}
		})) )




		// setRows(rows.filter(function(person, index) {
		// 	return index !== indexToDelete
		// }));
	}

	function deleteRow(indexToDelete: number): void {
		console.log("delete", indexToDelete)

		console.log(rows.filter(function(person, index) {
			return index !== indexToDelete
		}))
		setRows(rows.filter(function(person, index) {
			return index !== indexToDelete
		}));
	}

//  items: this.state.items.filter((item, index) => index !== removeIndex)
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
			{console.log("Updated Parent State")}
			<section className = 'addGuestRowBottomControl'>
				<Button variant="outlined" onClick={addRow} className="addGuestRowButton">
					Add New Guest
				</Button>
				 <input type="hidden" name="numGuestsAdded" value={numRows} />

			</section>

			{/* <button onClick={addRow}>
				<img alt="Fake"></img>
				<span>Add New Guest</span>
			</button> */}
		</>
	)
}
