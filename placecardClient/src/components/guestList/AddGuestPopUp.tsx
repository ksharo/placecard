import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { ObjectId } from 'mongodb';
import { useEffect, useState } from 'react';
import validator from 'validator';

const DEFAULT_GROUP_SIZE	= 5
const MIN_GROUP_SIZE	= 1
const MAX_GROUP_SIZE	= 25

const NAME_REGEX				= /^[a-zA-z\s.]{2,}$/
const NAME_OPTIONAL_REGEX		= /^[a-zA-z\s.]{2,}$|^$/
const EMAIL_REGEX				= /^[a-zA-Z.\d!#$%&'*+\-/=?^_`{|}~]+@[a-zA-Z+.-\d]+.[a-zA-z+.-\d]+$/
const PHONE_REGEX				= /^[\d-\s()+_#.ext]*$/
const PARTY_SIZE_REGEX			= /^[\d]*$/

const NAME_ERROR_TEXT			= "Name must only contain A - Z, periods, and must be 2 or more character"
const NAME_OPTIONAL_ERROR_TEXT	= "Name must only contain A - Z, periods, and must be 2 or more character. Leave blank if no plus one"
const EMAIL_ERROR_TEXT			= "Email must be a valid email"
const PHONE_ERROR_TEXT			= ""
const GROUP_SIZE_ERROR_TEXT		= `Group size must be between ${MIN_GROUP_SIZE} and ${MAX_GROUP_SIZE}`

export function AddGuestPopUp(props: { guestListData: any, setGuestListData: any }) {
	const [individualAddPopupState, setIndividualAddPopupState]	= useState(false)
	const [groupAddPopupState, setGroupAddPopupState]			= useState(false)

	const [currIndiName, setCurrIndiName]			= useState("")
	const [currIndiContact, setCurrIndiContact]		= useState("")
	const [currPlusOneName, setCurrPlusOneName]		= useState("")
	const [currIndiSendSurvey, setCurrIndiSendSurvey]	= useState(true)

	const [currGrpName, setCurrGrpName]			= useState("")
	const [currGrpContact, setCurGrpContact]		= useState('')
	const [currGrpSize, setCurrGrpSize]			= useState(DEFAULT_GROUP_SIZE.toString())
	const [currGrpSendSurvey, setCurrGrpSendSurvey]	= useState(true)
	const [currGrpMembers, setCurrGrpMembers]		= useState(Array(DEFAULT_GROUP_SIZE).fill(""))
	const [currGrpId, setCurrGrpId]				= useState((new ObjectId()).toString());
	const [indiIsValid, setIndiIsValid] = useState({
		name: true,
		contact: true,
		plusOneName: true,
	})
	const [grpIsValid, setGrpIsValid] = useState({
		grpName: true,
		grpContact: true,
	})
	const [grpSizeIsValid, setGrpSizeIsValid] = useState(true)
	const [grpMembersIsValid, setGrpMemebrsIsValid] = useState(Array(DEFAULT_GROUP_SIZE).fill(true))

	function validateIndi() {
		let isValidInput = true
		if (!NAME_REGEX.test(currIndiName)) {
			setIndiIsValid((prev) => ({ ...prev, name: false }))
			isValidInput = false;
		}
		if (!NAME_OPTIONAL_REGEX.test(currPlusOneName)) {
			setIndiIsValid((prev) => ({ ...prev, plusOneName: false }))
			isValidInput = false;
		}
		if (!validator.isEmail(currIndiContact)) {
			setIndiIsValid((prev) => ({ ...prev, contact: false }))
			isValidInput = false;
		}
		return isValidInput;
	}

	function validateGrp() {
		let isValidInput = true
		if (!NAME_REGEX.test(currGrpName)) {
			setGrpIsValid((prev) => ({ ...prev, grpName: false }))
			isValidInput = false;
		}
		if (!validator.isEmail(currGrpContact)) {
			setGrpIsValid((prev) => ({ ...prev, grpContact: false }))
			isValidInput = false;
		}
		const newGrpMembersIsValid = [...grpMembersIsValid]
		currGrpMembers.forEach(function (subgroupMember, index) {
			newGrpMembersIsValid[index] = NAME_REGEX.test(subgroupMember)
		})
		setGrpMemebrsIsValid(newGrpMembersIsValid)
		if (!grpSizeIsValid) {
			isValidInput = false;
		}
		return isValidInput
	}

	async function addIndiToTable(guestListData: any, setGuestListData: any) {
		if (!validateIndi()) {
			console.log("Frontend Validation Failed")
			return;
		}
		setGuestListData([...guestListData, {
			"groupName":		currPlusOneName ? (currIndiName + " & " + currPlusOneName) : currIndiName,
			"groupContact":	currIndiContact,
			"groupSize":		currGrpSize,
			"sendSurvey":		currIndiSendSurvey,
			"groupMembers":	currPlusOneName ? [currIndiName, currPlusOneName] : []
		}])
		const grpName = (currPlusOneName ? currIndiName + " and " + currPlusOneName : undefined);
		const grpSize = currPlusOneName ? 2 : 1;
		const res = await sendGuest(currIndiName, currIndiContact, grpName, currGrpId, grpSize, currIndiSendSurvey);
		const guestData = await res?.json();
		if (res != undefined && !res.ok) {
			const message = `An error has occured: ${res.status} - ${res.statusText}`;
			throw new Error(message);
		}
		else {
			console.log("success!")
		}
		if (currPlusOneName) {
			const resPlusOne = await sendGuest(currPlusOneName, currIndiContact, grpName, currGrpId, grpSize, currIndiSendSurvey);
			const plusOneData = await resPlusOne?.json();
			if (resPlusOne != undefined && !resPlusOne.ok) {
				const message = `An error has occured: ${resPlusOne.status} - ${resPlusOne.statusText}`;
				throw new Error(message);
			}
			else {
				console.log("success!")
				updateGlobalEvent(plusOneData);
			}
		}
		setCurrIndiName("")
		setCurrIndiContact("")
		setCurrPlusOneName("")
		setCurrIndiSendSurvey(true)
		setCurrGrpId((new ObjectId()).toString());
		updateGlobalEvent(guestData);


	}

	async function addGrpToTable(guestListData: any, setGuestListData: any) {
		if (!validateGrp()) {
			console.log("Frontend Validation Failed")
			return;
		}
		setGuestListData([...guestListData, {
			"groupName":		currGrpName,
			"groupContact":	currGrpContact,
			"groupSize":		currGrpSize,
			"sendSurvey":		currGrpSendSurvey,
			"groupMembers":	currGrpMembers
		}])
		const allData = [];
		for (let x of currGrpMembers) {
			const res = await sendGuest(x, currGrpContact, currGrpName, currGrpId, Number(currGrpSize), currGrpSendSurvey);
			const guestData = await res?.json();
			if (res != undefined && !res.ok) {
				const message = `An error has occured: ${res.status} - ${res.statusText}`;
				throw new Error(message);
			}
			else {
				console.log("success!")
				allData.push(guestData);
			}
		}
		setCurrGrpName("")
		setCurGrpContact("")
		setCurrGrpSize(DEFAULT_GROUP_SIZE.toString())
		setCurrGrpSendSurvey(true)
		setCurrGrpMembers(Array(DEFAULT_GROUP_SIZE).fill(""))
		setGrpMemebrsIsValid(Array(DEFAULT_GROUP_SIZE).fill(true))
		setCurrGrpId((new ObjectId()).toString());
		for (let guestData of allData) {
			updateGlobalEvent(guestData);
		}

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
		if (!isNaN(newNumInt) && newNumInt >= MIN_GROUP_SIZE && newNumInt <= MAX_GROUP_SIZE) {
			if (!grpSizeIsValid) {
				setGrpSizeIsValid(true)
			}
			let difference = 0
			if ((difference = newNumInt - currGrpMembers.length) > 0) {
				const arr = currGrpMembers.concat(Array(difference).fill(""));
				setCurrGrpMembers(arr)

				// add members that are valid to the validation state
				const validArr = grpMembersIsValid.concat(Array(difference).fill(true));
				setGrpMemebrsIsValid(validArr)
			}
			else if (difference < 0) {
				const arr = currGrpMembers
				arr.splice(newNumInt)
				setCurrGrpMembers(arr)

				// Remove our markers on valid or invalid individuals
				const validArr = grpMembersIsValid
				grpMembersIsValid.splice(newNumInt)
				setGrpMemebrsIsValid(validArr)
			}
		}
		else {
			setGrpSizeIsValid(false)
		}
	}

	//#region Typewriter effect

	const [namePlaceholder, setNamePlaceholder] = useState("Appleseed Family")
	let fullNameList = 'AppleseedFamily'

	// for(let i = 0; i < fullNameList.length; i++){
	// 	addLetter(i);
	// }

	function addLetter(i: number) {
		setTimeout(function () {
			setNamePlaceholder(fullNameList.substring(0, i))
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
	const AnimatedInput = ({ placeholder: passedPlaceholder = "", ...passedProps }) => {
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
				clearInterval(intr)
			}
		});


		return <TextField {...passedProps} placeholder={placeholder} />
	};

	//#endregion

	function individualPopOut() {
		return (
			<section className="buttonPopOut">
				<TextField
					placeholder="Name"
					value={currIndiName}
					onChange={e => {
						setCurrIndiName(e.target.value);
						if (!indiIsValid.name && NAME_REGEX.test(e.target.value)) {
							setIndiIsValid((prev) => ({ ...prev, name: true }))
						}
					}}
					error={!indiIsValid.name}
					helperText={indiIsValid.name ? "" : NAME_ERROR_TEXT}
					label="Name"
				/>
				<TextField
					placeholder="Email or Phone"
					value={currIndiContact}
					onChange={e => {
						setCurrIndiContact(e.target.value);
						if (!indiIsValid.contact && EMAIL_REGEX.test(e.target.value)) {
							setIndiIsValid((prev) => ({ ...prev, contact: true }))
						}
					}}
					error={!indiIsValid.contact}
					helperText={indiIsValid.contact ? "" : EMAIL_ERROR_TEXT}
					label="Contact"
				/>
				<TextField
					placeholder="Name"
					className="plusOneInput"
					value={currPlusOneName}
					onChange={e => {
						setCurrPlusOneName(e.target.value);
						if (!indiIsValid.plusOneName && NAME_OPTIONAL_REGEX.test(e.target.value)) {
							setIndiIsValid((prev) => ({ ...prev, plusOneName: true }))
						}
					}}
					error={!indiIsValid.plusOneName}
					helperText={indiIsValid.plusOneName ? "" : NAME_OPTIONAL_ERROR_TEXT}
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
					<Button color="primary" variant="contained" onClick={() => addIndiToTable(props.guestListData, props.setGuestListData)}>Add</Button>
				</section>
			</section>
		)
	}

	function groupPopOut() {
		return (
			<section className="buttonPopOut">
				<section className="groupInfo">
					{/* <AnimatedInput  label="Group Name" placeholder={fullNameList}></AnimatedInput> */}
					{/* <TypeWriterPlaceholder></TypeWriterPlaceholder> */}
					<TextField
						placeholder={namePlaceholder}
						label="Group Name"
						value={currGrpName}
						onChange={e => {
							setCurrGrpName(e.target.value);
							if (!grpIsValid.grpName && NAME_REGEX.test(e.target.value)) {
								setGrpIsValid((prev) => ({ ...prev, grpName: true }))
							}
						}}
						error={!grpIsValid.grpName}
						helperText={grpIsValid.grpName ? "" : NAME_ERROR_TEXT}
					/>
					<TextField
						placeholder="Email or Phone Number"
						label="Group Contact"
						value={currGrpContact}
						onChange={e => {
							setCurGrpContact(e.target.value);
							if (!grpIsValid.grpContact && EMAIL_REGEX.test(e.target.value)) {
								setGrpIsValid((prev) => ({ ...prev, grpContact: true }))
							}
						}}
						error={!grpIsValid.grpContact}
						helperText={grpIsValid.grpContact ? "" : EMAIL_ERROR_TEXT}
					/>
					<TextField
						type="number"
						label="Group Size"
						value={currGrpSize}
						InputProps={{ inputProps: { min: MIN_GROUP_SIZE, max: MAX_GROUP_SIZE } }}
						// onChange={e=>setCurrGrpSize(parseInt(e.target.value))}
						onChange={e => changeGrpSize(e.target.value)}
						error={!grpSizeIsValid}
						helperText={grpSizeIsValid ? "" : GROUP_SIZE_ERROR_TEXT}
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
							onChange={e => {
								updateGrpMembers(i, e);
								if (!grpMembersIsValid[i] && NAME_REGEX.test(e.target.value)) {
									const newGrpMembersIsValid = [...grpMembersIsValid]
									newGrpMembersIsValid[i] = true
									setGrpMemebrsIsValid(newGrpMembersIsValid)
								}
							}}
							error={!grpMembersIsValid[i]}
							helperText={grpMembersIsValid[i] ? "" : NAME_ERROR_TEXT}

						/>
					))}
				</section>

				<section className="addButtonGroup">
					<Button color="primary" variant="contained" onClick={() => addGrpToTable(props.guestListData, props.setGuestListData)}>Add</Button>
				</section>
			</section>
		)
	}

	function sendGuest(name: string, contact: string, groupName: string | undefined, groupId: string, groupSize: number, sendSurvey: boolean) {
		if (window.activeEvent != undefined && window.activeEvent != null) {
			const nameSplit = name.split(" ");
			let firstName = '';
			let lastName = '--';
			if (nameSplit.length > 1) {
				firstName = nameSplit.slice(0, nameSplit.length - 1).join(" ");
				lastName = nameSplit[nameSplit.length - 1];
			}
			else {
				firstName = nameSplit[0];
			}
			let body: any = {
				"first_name": firstName,
				"last_name": lastName,
				"email": contact,
				"party_size": groupSize,
				"associated_table_number": -1,
			}
			if (groupName != undefined) {
				body["group_id"] = groupId;
				body["group_name"] = groupName;
			}
			if (sendSurvey) {
				body["survey_response"] = {
					"disliked": [],
					"liked": [],
					"ideal": []
				}
			}
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			}
			return fetch('http://localhost:3001/guests/newGuest/' + window.activeEvent.id, requestOptions)
		}
	}

	function updateGlobalEvent(guestData: any) {
		if (window.activeEvent != null) {
			const curGuests = [...window.activeEvent.guestList];
			const newGuest = {
				id: guestData._id,
				name: guestData.first_name + ' ' + guestData.last_name,
				groupID: guestData.group_id,
				groupName: guestData.group_name,
				groupSize: guestData.party_size,
				contact: guestData.email,
			};
			curGuests.push(newGuest);
			const curSurveys = window.activeEvent.surveys ? [...window.activeEvent.surveys] : [];
			curSurveys.push(guestData._id);
			const tmpEvent = window.activeEvent;
			tmpEvent.guestList = curGuests;
			tmpEvent.surveys = curSurveys;
			// see if we need to add tables to the event
			const num_attend = curGuests.length;
			const tmpSeats = window.activeEvent.tables.length * window.activeEvent.perTable;
			if (tmpSeats < num_attend) {
				const id = (new ObjectId()).toString();
				const newTable: Table = {
					id: id,
					name: 'Table ' + (window.activeEvent.tables.length + 1).toString(),
					guests: []
				}
				tmpEvent.tables.push(newTable);
			}
			window.setActiveEvent(tmpEvent);
			window.setInvitees(curGuests);
		}
	}

	return(
		<>
			<section className="buttonControlGroup">
				<button className="addButton"
					id="addIndividualButton"
					type="button"
					onClick={	() => {
						setIndividualAddPopupState(!individualAddPopupState);
						setGroupAddPopupState(false)
					}}>
					Add Individual
				</button>
				<button className="addButton"
					id="addCoupleOrGroupButton"
					type="button"
					onClick={() => {
						setGroupAddPopupState(!groupAddPopupState);
						setIndividualAddPopupState(false)
					}}>
					Add Couple or Group
				</button>
			</section>

			{ individualAddPopupState && individualPopOut() }
			{ groupAddPopupState && groupPopOut() }
		</>
	)
}
