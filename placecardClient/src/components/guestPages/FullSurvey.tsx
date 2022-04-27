import { Button } from "@mui/material";
import { ObjectId } from "mongodb";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { SurveyConf } from "../confirmationPages/SurveyConf";
import { EditSurveyResponses } from "./EditSurveyResponses";
import { SurveyDislikes } from "./SurveyDislikes";
import { SurveyGroupPage } from "./SurveyGroupPage";
import { SurveyIdealTable } from "./SurveyIdealTable";
import { SurveyLikes } from "./SurveyLikes";
import moment from "moment";
import validator from 'validator';


export function FullSurvey(props?: { preview: boolean, hostView?: boolean }) {
    if (!props || !props.preview) {
        window.setGuestMode(true);
    }
    else {
        window.setGuestMode(false);
    }
    const history = useHistory();
    const queryString = useLocation().search;
    // gets query string if you do /takeSurvey?page=aaaaaa&guestId=aaaaaa&eventId=12345
    const pageString = new URLSearchParams(queryString).get('page');
    const guestID = new URLSearchParams(queryString).get('guestId');
    const eventID = new URLSearchParams(queryString).get('eventId');
    const setupSurvey = async () => {
        if ((pageString != undefined  || (props == undefined  || props.hostView === false)) && (window.curGuest == undefined  || window.inviteesState.length === 0)) {
            try {
                const guestInfo = await fetch('http://localhost:3001/guests/' + guestID);
                const eventInfo = await fetch('http://localhost:3001/events/guestAccess/' + eventID);
                const eventData = await eventInfo.json();
                const guests = [];
                const guestFetch = await fetch('http://localhost:3001/events/guests/' + eventID);
                const fetchedGuests = await guestFetch.json();
                for (let guest of fetchedGuests) {
                    const newGuest = {
                        id: guest._id,
                        name: guest.first_name + ' ' + guest.last_name,
                        groupID: guest.group_id,
                        groupName: guest.group_name,
                        groupSize: guest.party_size,
                        contact: guest.email,
                    }
                    guests.push(newGuest);
                }

                window.setActiveEvent({
                    id: undefined,
                    uid: undefined,
                    name: eventData.event_name,
                    date: (new Date(eventData.event_start_time)).toLocaleString().split(',')[0],
                    time: moment(new Date(eventData.event_start_time)).format('h:mm a'),
                    location: eventData.location,
                    perTable: eventData.attendees_per_table,
                    guestList: undefined,
                    tables: undefined,
                });
                window.setInvitees(guests);
                if (guestInfo.status === 200) {
                    const data = await guestInfo.json();
                    const newGuest = {
                        id: data._id,
                        name: data.first_name + " " + data.last_name,
                        groupID: data.group_id,
                        groupName: data.group_name,
                        groupSize: data.party_size,
                        contact: data.email,
                    };
                    window.setDisliked(data.survey_response.disliked);
                    window.setLiked(data.survey_response.liked);
                    window.setLoved(data.survey_response.ideal);
                    window.setCurGuest(newGuest);
                    window.setGroupID(data.group_id);
                }
            }
            catch (e) {
                console.error(e)
                const linkErr = document.getElementById('wrongLinkError');
                if (linkErr !== null) {
                    linkErr.style.display = 'block';
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }
            }
        }
        if (props != undefined  && props.hostView && window.curGuest == undefined ) {
            const newGuest = {
                id: new ObjectId(),
                name: window.firstNameState + ' ' + window.lastNameState,
                contact: window.emailState
            }
            window.setCurGuest(newGuest);
            window.setDisliked([]);
            window.setLiked([]);
            window.setLoved([]);
        }
    }

    useEffect(() => {
        if (props != undefined  && props.hostView) {
            const newGuest = {
                id: new ObjectId(),
                name: window.firstNameState + ' ' + window.lastNameState,
                contact: window.emailState
            }
            window.setCurGuest(newGuest);
        }
    }, [window.uidState, window.firstNameState, window.lastNameState])

    setupSurvey();

    let pageNum = Number(pageString);
    let startPage = pageNum;
    const [curPage, setPage] = React.useState(startPage);
        window.addEventListener('hashchange', () => {
        const page = Number(window.location.hash.split('#page')[1]);
        if (page != startPage) {
            startPage = page;
            setPage(page);
        }
     });
    const pages = [
        <SurveyGroupPage></SurveyGroupPage>,
        <SurveyLikes></SurveyLikes>,
        <SurveyIdealTable></SurveyIdealTable>,
        <SurveyDislikes></SurveyDislikes>,
        <EditSurveyResponses></EditSurveyResponses>,
        <SurveyConf></SurveyConf>,
        <SurveyGroupPage error={true}></SurveyGroupPage>,
    ];

    const startFresh = () => {
        startPage = 0;
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        setPage(0);
    };

    if (props != undefined  && props.preview) {
        /* Don't include last three pages in preview for sizing/usability purposes */
        pages.pop();
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
        /* Make sure that on preview we don't switch pages accidentally! */
        if (props == undefined  || !props.preview) {
            if (curPage === 1 && window.likedInvitees.length + (window.curGuest ? (window.curGuest.groupSize ? window.curGuest.groupSize : 1) : 1) < (window.activeEvent ? window.activeEvent.perTable : 10)) {
                /* not enough people for ideal table page, put all in ideal and skip to dislikes */
                window.lovedInvitees = window.likedInvitees;
                for (let x of window.inviteesState) {
                    if (window.curGuest != undefined  && window.curGuest.groupID != undefined  && x.groupID === window.curGuest?.groupID){
                        await updateGuest(x.id);
                    }
                }
                if (window.curGuest) {
                    await updateGuest(window.curGuest.id);
                }
                startPage += 2;
                const link = '/takeSurvey/'+startPage+'?page=' + startPage + '&guestId=' + guestID + '&eventId=' + eventID;
                history.push(link);
                window.location.hash = '#page' + startPage;
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                setPage(curPage + 2);
                return;
            }
            if (curPage === 0 || curPage === pages.length-1) {
                /* take care of removed members */
                for (let x of window.removedMembers) {
                    if (x.contact && validator.isEmail(x.contact)) {
                        continue;
                    }
                    else {
                        // throw some error about necessary email
                        const link = '/takeSurvey/'+startPage+'?page=' + startPage + '&guestId=' + guestID + '&eventId=' + eventID;
                        history.push(link);
                        window.location.hash = '#page' + startPage;                        
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                        setPage(pages.length-1);
                        return;
                    }
                }
                for (let x of window.removedMembers) {
                    if (x.contact) {
                        await removeMember(x.id, x.contact);
                        if (window.curGuest?.groupSize) {
                            window.curGuest.groupSize -= 1;
                        }
                    }
                }
                window.setRemovedMembers([]);
            }
            /* check for default values to make sure that we don't overwrite with bad data */
            if (!((window.dislikedInvitees.length === 1 && window.dislikedInvitees[0].id === 'none') || (window.likedInvitees.length === 1 && window.likedInvitees[0].id === 'none') || (window.lovedInvitees.length === 1 && window.lovedInvitees[0].id === 'none'))) {
                // TODO add error checking here!!!
                for (let x of window.inviteesState) {
                    if (window.curGuest != undefined  && window.curGuest.groupID != undefined  && x.groupID === window.curGuest?.groupID){
                        await updateGuest(x.id);
                    }
                }
                if (window.curGuest) {
                    await updateGuest(window.curGuest.id);
                }
            }
            if (curPage === pages.length-1) {
                startPage = 1;
                window.location.hash = '#page'+startPage;                
                const link = '/takeSurvey/'+startPage+'?page=' + startPage + '&guestId=' + guestID + '&eventId=' + eventID + window.location.hash;
                history.push(link);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                setPage(startPage);
            }
            else {
                startPage += 1;
                window.location.hash = '#page'+startPage;                
                const link = '/takeSurvey/'+startPage+'?page=' + startPage + '&guestId=' + guestID + '&eventId=' + eventID + window.location.hash;
                history.push(link);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                setPage(curPage + 1);
            }
        }
        else {
            startPage += 1;
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            setPage(curPage + 1);
        }
    };

    const prevPage = async () => {
        /* Make sure that on preview we don't switch pages accidentally! */
        if (props == undefined  || !props.preview) {
            if (curPage === 3 && window.likedInvitees.length + (window.curGuest ? (window.curGuest.groupSize ? window.curGuest.groupSize : 1) : 1) < (window.activeEvent ? window.activeEvent.perTable : 10)) {
                /* not enough people for ideal table page, put all in ideal and skip to dislikes */
                window.lovedInvitees = window.likedInvitees;
                for (let x of window.inviteesState) {
                    if (window.curGuest != undefined  && window.curGuest.groupID != undefined  && x.groupID === window.curGuest?.groupID){
                        await updateGuest(x.id);
                    }
                }
                if (window.curGuest) {
                    await updateGuest(window.curGuest.id);
                }
                startPage -= 2;
                window.location.hash = '#page'+startPage;                
                const link = '/takeSurvey/'+startPage+'?page=' + startPage + '&guestId=' + guestID + '&eventId=' + eventID + window.location.hash;
                history.push(link);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                setPage(curPage - 2);
                return;
            }
            /* check for default values to make sure that we don't overwrite with bad data */
            if (!((window.dislikedInvitees.length === 1 && window.dislikedInvitees[0].id === 'none') || (window.likedInvitees.length === 1 && window.likedInvitees[0].id === 'none') || (window.lovedInvitees.length === 1 && window.lovedInvitees[0].id === 'none'))) {
                for (let x of window.inviteesState) {
                    if (window.curGuest != undefined  && window.curGuest.groupID != undefined  && x.groupID === window.curGuest?.groupID){
                        await updateGuest(x.id);
                    }
                }
                if (window.curGuest) {
                    await updateGuest(window.curGuest.id);
                }
            }
            startPage -= 1;
            window.location.hash = '#page'+startPage; 
            const link = '/takeSurvey/'+startPage+'?page=' + startPage + '&guestId=' + guestID + '&eventId=' + eventID + window.location.hash;
            history.push(link);               
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            setPage(curPage - 1);
        }
        else {
            startPage -= 1;
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            setPage(curPage - 1);
        }
    };
    return (
        <>
            {pages[curPage]}
            {curPage === 0 || ((!props || !props.preview) && curPage === pages.length-1) ? <Button variant='contained' className='basicBtn fitBtn' onClick={nextPage}>Continue</Button> :
                curPage === pages.length - 2 && (!props || !props.preview)?
                    <></>
                    :
                    props && props.preview && curPage === pages.length - 2 || ((!props || !props.preview) && curPage === pages.length - 3) ?
                        <>
                            <Button variant='contained' className='basicBtn fitBtn generalButton' onClick={prevPage}>Go Back</Button>
                            <Button variant='contained' className='basicBtn fitBtn generalButton' onClick={nextPage}>Finish!</Button>
                        </>
                        :
                        props && props.preview && curPage === pages.length-1 ? 
                        <></> 
                        :
                        <>
                            <Button variant='contained' className='basicBtn fitBtn generalButton' onClick={prevPage}>Go Back</Button>
                            <Button variant='contained' className='basicBtn fitBtn generalButton' onClick={nextPage}>Next</Button>
                        </>}
        </>
    );

}

function updateGuest(id: string) {
    if (window.curGuest != undefined ) {
        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: id,
                survey_response: {
                    disliked: window.dislikedInvitees,
                    liked: window.likedInvitees,
                    ideal: window.lovedInvitees
                },
                party_size: window.curGuest.groupSize
            })
        };
        return fetch('http://localhost:3001/guests/updateGuest', requestOptions);
    }
}

function removeMember(id: string, email: string) {
    let groupid = undefined;
    /* fix global variables */
    const matching = window.inviteesState.filter( (g) => {
        return g.id.toString() === id.toString();
    });
    if (matching.length > 0) {
        groupid = matching[0].groupID;
        matching[0].groupID = undefined;
        matching[0].groupSize = 1;
        matching[0].groupName = undefined;
        matching[0].contact = email;
    }
    /* send to database */
    const requestOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            _id: id,
            email: email,
            groupId: groupid
        })
    };
    return fetch('http://localhost:3001/guests/removeFromGroup/'+id, requestOptions);
}