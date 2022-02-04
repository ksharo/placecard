import { GuestListTable } from "./GuestListTable"
import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";
import { MdUploadFile } from 'react-icons/md';
import './GuestList.css'



export function GuestList(){
	const title			= 'Add a Guest List For Your Event'
	const pageDescription	= 'Download our guest list template, fill it out, and drop it back here'

	const tableTitle		= 'Enter Guest List Manually'
	const tableDescription	= 'You only need to provide one method of contact for each guest'
	const history = useHistory();



	const [userFile, setUserFile] = useState(undefined);


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
    let handleClick = () => {
      history.push('/editSurvey');
    }
	}

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
				<section className = "manualGuestListSection">
					<h3>{tableTitle}</h3>
					<p>{tableDescription}</p>
					<GuestListTable></GuestListTable>
				</section>

				<Button type="submit" color="primary" variant="contained">Next</Button>
			</form>

		</>
	);
}