import { useRef, useState } from "react";
import { MdUploadFile } from 'react-icons/md';
import '../guestList/GuestList.css';
import template from '../../assets/Placecard_Guestlist_Template.png';
import { AiOutlineFileExcel } from "react-icons/ai";
import { addGuestToGlobalEvent } from "../guestList/AddGuestPopUp";

export function UploadFile(props: {setTableData:Function}) {
	const [userFile, setUserFile] = useState(undefined);
    let eventId = '';
    const fileSelected = (event: any) => {
		const selectedFile = event.target.files[0];
		setUserFile(selectedFile)
     	// const reader = new FileReader();
		let data = new FormData();
        data.append('file', selectedFile);
        if (window && window.activeEvent){
            eventId =  window.activeEvent.id;
        }

		const requestOptions = {
			method: 'POST',
			// headers: {
			// 	'Content-Type': 'application/json'
			// },
            body: data
		};
        fetch('http://localhost:3001/guests/fileUpload/'+eventId, requestOptions)
            .then(response => response.json())
            .then(data => handleUploadedData(data))
		return fetch('http://localhost:3001/guests/fileUpload/'+eventId, requestOptions);
	}

    const handleUploadedData = (data: any) => {
        console.log("file returned", data.returnData);
        props.setTableData(data.returnData);
        if (window.activeEvent) {
            window.activeEvent.guestList = [];
            window.activeEvent.surveys = [];
            window.setInvitees([]);
            window.activeEvent.tables = [];
        }
        data.addedGuests.map((guest: any) => {addGuestToGlobalEvent(guest); console.log(guest);})
    }
    return (
        <section className='fileUploadSection'>
        <a href={template} className='downloadTemplate' download="Placecard_Guestlist_Template.xlsx">
                <AiOutlineFileExcel size={30}/>
                <span>Download our Template!</span>
        </a>
        <section className="fileUploadButtonSection">
            <MdUploadFile className="uploadFileIcon"/>
            <section>
                <p>Drag your file here or click here to upload</p>
                <label>{userFile != undefined  ? userFile['name'] : "No File Selected"}</label>
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
    );

}