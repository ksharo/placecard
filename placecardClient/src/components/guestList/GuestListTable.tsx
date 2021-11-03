import { useState } from "react"
import { GuestListRow } from "./GuestListRow"


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
			guestName		: "Alfred",
			email		: "A@g.com",
			phone		: "123",
			partySize		: 4,
			isVip		: false
		}
	])

	function addRow(): void{
		setRows([...rows, {guestName: "", email: "", phone:"", partySize: 1, isVip: false}])
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
				</section>

				{rows.map((row: rowDetails) => (
					<GuestListRow
						guestName	= {row.guestName}
						email	= {row.email}
						phone	= {row.phone}
						partySize	= {row.partySize}
						isVip	= {row.isVip}
					/>
				))}
			</section>

			<button onClick={addRow}>
				<img alt="Fake"></img>
				<span>Add New Guest</span>
			</button>
		</>
	)
}
