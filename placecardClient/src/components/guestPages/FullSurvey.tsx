import { Button } from "@mui/material";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { SurveyConf } from "../confirmationPages/SurveyConf";
import { EditSurveyResponses } from "./EditSurveyResponses";
import { SurveyDislikes } from "./SurveyDislikes";
import { SurveyGroupPage } from "./SurveyGroupPage";
import { SurveyIdealTable } from "./SurveyIdealTable";
import { SurveyInstructions } from "./SurveyInstructions";
import { SurveyLikes } from "./SurveyLikes";

export function FullSurvey (props?: {preview: boolean}) {
    const history = useHistory();
    const queryString = useLocation().search;
    // gets query string if you do /takeSurvey?page=aaaaaa&guestId=aaaaaa&eventId=12345
    const pageString = new URLSearchParams(queryString).get('page');
    const guestID = new URLSearchParams(queryString).get('guestId');
    const eventID = new URLSearchParams(queryString).get('eventId');
    const setupSurvey = async () => {
        if (window.curGuest == undefined || window.inviteesState.length == 0) {
            try {
                const guestInfo = await fetch('http://localhost:3001/guests/'+guestID);
                const eventInfo = await fetch('http://localhost:3001/events/'+eventID);
                const eventData = await eventInfo.json();
                const guests = [];
                for (let guestID of eventData.guest_list) {
                    try {
                        const guestFetch = await fetch('http://localhost:3001/guests/'+guestID);
                        const fetchedGuest = await guestFetch.json();
                        const newGuest = {
                            id: fetchedGuest._id,
                            name: fetchedGuest.first_name + ' ' + fetchedGuest.last_name,
                            groupID: fetchedGuest.group_id,
                            groupName: fetchedGuest.group_name,
                            groupSize: fetchedGuest.party_size,
                            contact: fetchedGuest.email,
                        }
                        guests.push(newGuest);
                    }
                    catch (e) {
                        console.error("Error: could not fetch guest with id " + guestID + ". " + e);
                    }
                }
                window.setActiveEvent({
                    id: undefined,
                    uid: undefined,
                    name: undefined,
                    date: undefined,
                    time: undefined,
                    location: undefined,
                    perTable: eventData.attendees_per_table,
                    guestList: undefined,
                    tables: undefined,
                });
                window.setInvitees(guests);
                if (guestInfo.status == 200) {
                    const data = await guestInfo.json();
                    const newGuest = {
                        id: data._id,
                        name: data.first_name + " " + data.last_name,
                        groupID: data.group_id,
                        groupName: data.group_name,
                        contact: data.email,
                    };
                    window.setDisliked(data.survey_response.disliked);
                    window.setLiked(data.survey_response.liked);
                    window.setLoved(data.survey_response.ideal);
                    window.setCurGuest(newGuest);
                }
            }
            catch {
                const linkErr = document.getElementById('wrongLinkError');
                if (linkErr != null) {
                    linkErr.style.display = 'block';
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                }
            }
        }
    }

    setupSurvey();
    
    let pageNum = Number(pageString);
    let startPage = pageNum;
    const [curPage, setPage] = React.useState(startPage);
    const pages = [
        <SurveyInstructions></SurveyInstructions>,
        <SurveyGroupPage></SurveyGroupPage>,
        <SurveyDislikes></SurveyDislikes>,
        <SurveyLikes></SurveyLikes>,
        <SurveyIdealTable></SurveyIdealTable>,
        <EditSurveyResponses></EditSurveyResponses>,
        <SurveyConf></SurveyConf>
    ];

    const startFresh = () => {
        startPage = 0;
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        setPage(0);
    };

    if (props != undefined && props.preview) {
        /* Don't include last two pages in preview for sizing/usability purposes */
        pages.pop();
        pages.pop();
        pages.push(
            <>
            <h1 className='title'>Preview is Over</h1>
            <p>This is the end of the survey preview.</p>
            <Button variant='contained' className='basicBtn fitBtn generalButton' onClick={startFresh}>Start Over</Button>
        </>)
    }

    const nextPage = async () => {
        /* check for default values to make sure that we don't overwrite with bad data */
        if (!((window.dislikedInvitees.length == 1 && window.dislikedInvitees[0].id == 'none') || (window.likedInvitees.length == 1 && window.likedInvitees[0].id == 'none') || (window.lovedInvitees.length == 1 && window.lovedInvitees[0].id == 'none'))) {
            // TODO add error checking here!!!
            await updateGuest();
        }
        startPage += 1;
        history.push('/takeSurvey?page='+startPage+'&guestId='+guestID+'&eventId='+eventID);
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        setPage(curPage + 1);
    };

    const prevPage = async () => {
        /* check for default values to make sure that we don't overwrite with bad data */
        if (!((window.dislikedInvitees.length == 1 && window.dislikedInvitees[0].id == 'none') || (window.likedInvitees.length == 1 && window.likedInvitees[0].id == 'none') || (window.lovedInvitees.length == 1 && window.lovedInvitees[0].id == 'none'))) {
            await updateGuest();
        }
        startPage -= 1;
        history.push('/takeSurvey?page='+startPage+'&guestId='+guestID+'&eventId='+eventID);
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        setPage(curPage - 1);
    };
    return (
        <>
            {pages[curPage]}
            {curPage==0 ? <Button variant='contained' className='basicBtn fitBtn' onClick={nextPage}>Continue</Button> :
            curPage==pages.length-1 ?  
            <></>
            :
            curPage==pages.length-2 ? 
            <>
                <Button variant='contained' className='basicBtn fitBtn generalButton' onClick={prevPage}>Go Back</Button>
                <Button variant='contained' className='basicBtn fitBtn generalButton' onClick={nextPage}>Finish!</Button>
            </>
            :
            <>
                <Button variant='contained' className='basicBtn fitBtn generalButton' onClick={prevPage}>Go Back</Button>
                <Button variant='contained' className='basicBtn fitBtn generalButton' onClick={nextPage}>Next</Button>
            </>}
        </>
    );

}

function updateGuest() {
    if (window.curGuest != undefined) {
        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: window.curGuest.id,
                survey_response: {
                    disliked: window.dislikedInvitees,
                    liked: window.likedInvitees,
                    ideal: window.lovedInvitees
                },
                })
            };
            return fetch('http://localhost:3001/guests/updateGuest', requestOptions);
        }
    }
