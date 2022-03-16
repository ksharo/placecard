import { GuestListTable, GuestListDataInterface } from "./GuestListTable"
import { useRef, useState, useEffect, InputHTMLAttributes } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";
import { MdUploadFile } from 'react-icons/md';
import { HiTrash } from 'react-icons/hi';
import { TextField, Switch, Checkbox } from "@mui/material";
import './GuestList.css'


export function GuestList(){
	const title			= 'Add a Guest List For Your Event'
	const pageDescription	= 'Download our guest list template, fill it out, and drop it back here'

	const tableTitle		= 'Enter Guest List Manually'
	const tableDescription	= 'You only need to provide one method of contact for each guest'
	const history			= useHistory();

	// interface guestListDataInterface {
	// 	individualName?:	string;
	// 	groupName?:		string;
	// 	groupContact:		string;
	// 	groupSize:		string;
	// 	sendSurvey:		boolean;
	// 	groupMembers:		any[]
	// }

	const [guestListData, setGuestListData]					= useState<GuestListDataInterface[]>([])
	const [userFile, setUserFile] 						= useState(undefined);

	const [individualAddPopupState, setIndividualAddPopupState]	= useState(false)
	const [groupAddPopupState, setGroupAddPopupState]			= useState(false)

	const [currIndiName, setCurrIndiName]					= useState("")
	const [currIndiContact, setCurrIndiContact]				= useState("")
	const [currPlusOneName, setCurrPlusOneName]				= useState("")
	const [currIndiSendSurvey, setCurrIndiSendSurvey]			= useState(true)

	const [currGrpName, setCurrGrpName]					= useState("")
	const [currGrpContact, setCurGrpContact]				= useState('')
	const [currGrpSize, setCurrGrpSize]					= useState("2")
	const [currGrpSendSurvey, setCurrGrpSendSurvey]			= useState(true)
	const [currGrpMembers, setCurrGrpMembers]				= useState(["", ""])


	const fileSelected = (event: any) => {
		const selectedFile = event.target.files[0];
		setUserFile(selectedFile)
     	// const reader = new FileReader();
		let data = new FormData();
          data.append('file', selectedFile);

		// const requestOptions = {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	}
		// };
		// return fetch('http://localhost:3001/guestList/fileUpload', requestOptions);
	}


	const toCustomizeSurvey = (event: any) => {
		event.preventDefault()
		// console.log(event.target[1]);
		if(event && event.target && event.target.numGuestsAdded && event.target.numGuestsAdded.value){
			let numRows =  event?.target?.numGuestsAdded?.value
			console.log("num Rows:", numRows)
			let guestList: any = {}
			for(let i = 0; i < numRows; i++ ){
				// console.log("name"+i)
				// console.log(event.target["name"+i].value)
				// console.log(event.target["email"+i].value)
				// console.log(event.target["phone"+i].value)
				// console.log(event.target["partySize"+i].value)
				// console.log(event.target["isVip"+i].value)
				let guest = {
					first_name:	event.target["name"+i].value,
					email: 		event.target["email"+i].value,
					phone_number: 	event.target["phone"+i].value,
					party_size: 	event.target["partySize"+i].value,
					isVip: 		event.target["isVip"+i].checked,
				}
				guestList['guest'+ i] = guest
			}

			console.log(guestList);
		}

		let data = new FormData();
		if (userFile != undefined) {
          	data.append('file', userFile);
		}

		if(userFile && userFile['name']){
			console.log(userFile['name'])
			const requestOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			};
			return fetch('http://localhost:3001/guestList/fileUpload', requestOptions);
		}

		history.push('/editSurvey');
	}

	function addIndiToTable(){
		setGuestListData([...guestListData, {
			"groupName":		currPlusOneName ? (currIndiName + " and PlusOne") : currIndiName,
			"groupContact":	currIndiContact,
			"groupSize":		currGrpSize,
			"sendSurvey":		currIndiSendSurvey,
			"groupMembers":	currPlusOneName ? [currIndiName, currPlusOneName] : []
		}])
		console.log("name", currIndiName, "contact", currIndiContact, "+1", currPlusOneName, 'sendSurve??', currIndiSendSurvey)
		setCurrIndiName("")
		setCurrIndiContact("")
		setCurrPlusOneName("")
		setCurrIndiSendSurvey(true)
	}

	function addGrpToTable(){
		setGuestListData([...guestListData, {
			"groupName":		currGrpName,
			"groupContact":	currGrpContact,
			"groupSize":		currGrpSize,
			"sendSurvey":		currGrpSendSurvey,
			"groupMembers":	currGrpMembers
		}])
		console.log(currGrpName, currGrpContact, currGrpSize, currGrpSendSurvey, currGrpMembers)
		setCurrGrpName("")
		setCurGrpContact("")
		setCurrGrpSize("2")
		setCurrGrpSendSurvey(true)
		setCurrGrpMembers(["", ""])
	}

	function updateGrpMembers(index: number, event: any) {
		setCurrGrpMembers((prev) => {
			return prev.map((item, i) => {
				if (i !== index) {
					return item;
				}
				return event.target.value
			})
		})
	}

	function changeGrpSize(newNum: string) {
		setCurrGrpSize(newNum)
		let newNumInt = parseInt(newNum)
		if (!isNaN(newNumInt)){
			let difference = 0
			if ((difference = newNumInt - currGrpMembers.length) > 0 ){
				const arr = currGrpMembers.concat(Array(difference).fill(""));
				setCurrGrpMembers(arr)
			}
			else if (difference < 0){
				const arr = currGrpMembers
				arr.splice(newNumInt)
				setCurrGrpMembers(arr)
			}
		}
	}

	function individualPopOut() {
		return(
			<section className="buttonPopOut">
				<TextField
					placeholder="Name"
					value={currIndiName}
					onChange={e => setCurrIndiName(e.target.value)}
					label="Name"
				/>
				<TextField
					placeholder="Email or Phone"
					value={currIndiContact}
					onChange={e => setCurrIndiContact(e.target.value)}
					label="Contact"
				/>
				<TextField
					placeholder="Name"
					className="plusOneInput"
					value={currPlusOneName}
					onChange={(e) => setCurrPlusOneName(e.target.value)}
					label="Plus One Name (optional)"
				/>

				{/* {plusOne ?
					<section className="plusOneInputGroup">
						<TextField placeholder="Plus One Name" className="plusOneInput" value={currPlusOneName} onChange={(e) => setCurrPlusOneName(e.target.value)}/>
						<Button onClick={() => {setPlusOne(false)}}><HiTrash/></Button>
					</section>
					:
					<Button onClick={() => {setPlusOne(true)}}>Add Plus One</Button>
				} */}

				<section>
					Send Survey?
					<Switch
						checked={currIndiSendSurvey}
						onChange={e => setCurrIndiSendSurvey(e.target.checked)}
					/>
				</section>
				<section className="addButtonGroup">
					<Button color="primary" variant="contained" onClick={() => addIndiToTable()}>Add</Button>
				</section>
			</section>
		)
	}

	function groupPopOut(){
		return(
			<section className="buttonPopOut">
				<section className="groupInfo">
					{/* <AnimatedInput  label="Group Name" placeholder={fullNameList}></AnimatedInput> */}
					{/* <TypeWriterPlaceholder></TypeWriterPlaceholder> */}
					<TextField
						placeholder={namePlaceholder}
						label="Group Name"
						value={currGrpName}
						onChange={e => setCurrGrpName(e.target.value)}
					/>
					<TextField
						placeholder="Email or Phone Number"
						label="Group Contact"
						value={currGrpContact}
						onChange={e=>setCurGrpContact(e.target.value)}
					/>
					<TextField
						type="number"
						label="Group Size"
						value={currGrpSize}
						// onChange={e=>setCurrGrpSize(parseInt(e.target.value))}
						onChange={e=>changeGrpSize(e.target.value)}
					/>
					<section>
						Send Survey?
						<Switch
							checked={currGrpSendSurvey}
							onChange={e => setCurrGrpSendSurvey(e.target.checked)}
						/>
					</section>
				</section>
				<p>Leave member name blank if you do not know the member's name</p>
				<section className="groupMembers">
					{currGrpMembers.map((name, i) => (
						<TextField
							label="Member Name"
							placeholder="Leave Blank if Unknown"
							value={name}
							onChange={event=>updateGrpMembers(i, event)}
						/>
					))}
				</section>

				<section className="addButtonGroup">
					<Button color="primary" variant="contained" onClick={()=>addGrpToTable()}>Add</Button>
				</section>
			</section>
		)
	}

	const [namePlaceholder, setNamePlaceholder]		= useState("Appleseed Family")
	//#region
	let fullNameList= 'AppleseedFamily'

	// for(let i = 0; i < fullNameList.length; i++){
	// 	addLetter(i);
	// }

	function addLetter(i: number){
		setTimeout(function(){
			setNamePlaceholder(fullNameList.substring(0,i))
		}, 2000 * i)
	}

	// const TypeWriterPlaceholder = () => {
	// 	const [namePlaceholder2, setNamePlaceholder2]		= useState("Appleseed Family")

	// 	let fullNameList= 'AppleseedFamily'

	// 	for(let i = 0; i < fullNameList.length; i++){
	// 		addLetter(i);
	// 	}

	// 	function addLetter(i: number){
	// 		setTimeout(function(){
	// 			setNamePlaceholder2(fullNameList.substring(0,i))
	// 		}, 2000)
	// 	}

	// 	return <TextField placeholder={namePlaceholder2}/>

	// }

	// https://stackoverflow.com/questions/61444011/react-input-placeholder-type-writer-animation
	const AnimatedInput = ({placeholder: passedPlaceholder = "", ...passedProps}) => {
		const [placeholder, setPlaceholder] = useState(passedPlaceholder.slice(0, 0));
		const [placeholderIndex, setPlaceholderIndex] = useState(0);


		useEffect(() => {
			const intr = setInterval(() => {
				setPlaceholder(passedPlaceholder.slice(0, placeholderIndex));
				if (placeholderIndex + 1 > passedPlaceholder.length) {
					//   setTimeout(function(){setPlaceholderIndex(0)},1000);
					setPlaceholderIndex(0)

				} else {
					setPlaceholderIndex(placeholderIndex + 1)
				}
			}, 400);

			return () => {
				// setTimeout(function(){clearInterval(intr), 3000})
					console.log('hi', placeholderIndex)
				clearInterval(intr)
			}
		},);


		return <TextField {...passedProps} placeholder={placeholder}/>
	};

	//#endregion

	return(
		<>
			<section>
				<h1 className='title'>{title}</h1>
				<p className='subtitle'>{pageDescription}</p>
			</section>

			<section className='fileUploadSection'>
				<section className="fileUploadButtonSection">
					<MdUploadFile className="uploadFileIcon"/>

					<section>
						<p>Drag your file here or click here to upload</p>
						<label>{userFile != undefined ? userFile['name'] : "No File Selected"}</label>
						{/* <button type="button" id ="buttonTestTag">
							<i className="fas fa-file-upload" />
							<span> Upload files</span>
						</button> */}
					</section>
				</section>

				<section id="dragDropContainer">
					<input
						id = "inputTestTag"
						type="file"
						ref={useRef(null)}
						title=""
						value=""
						onChange={fileSelected}
						accept=".xls,.xlsx,.csv"
					/>
				</section>
			</section>

			<section>
				<span>OR</span><hr/>
			</section>

			<form id="addGuestListForm" onSubmit={ toCustomizeSurvey }>
				<section className="buttonControlGroup">
					<button className="addButton" id="addIndividualButton" type="button" onClick={() => {setIndividualAddPopupState(!individualAddPopupState); setGroupAddPopupState(false)}}>Add Individual</button>
					<button className="addButton" id="addCoupleOrGroupButton" type="button" onClick={() => {setGroupAddPopupState(!groupAddPopupState); setIndividualAddPopupState(false)} }>Add Couple or Group</button>
				</section>

				{ individualAddPopupState && individualPopOut() }
				{ groupAddPopupState && groupPopOut() }

				<section className = "manualGuestListSection">
					<h3>{tableTitle}</h3>
					<p>{tableDescription}</p>
					<GuestListTable tableData={guestListData}/>
					{/* <section className="guestTable">
						<section className="resultTable">

							<span className="firstCol">Name of Individual/Party</span>
							<span>Contact</span>
							<span>Send Survey</span>
							<span>Delete</span>

							{guestListData.map((obj, i) => (
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
					</section> */}
				</section>

				{/* <section className = "manualGuestListSection">
					<h3>{tableTitle}</h3>
					<p>{tableDescription}</p>
					<GuestListTable></GuestListTable>
				</section> */}

				<Button type="submit" color="primary" variant="contained">Next</Button>
			</form>

		</>
	);
}