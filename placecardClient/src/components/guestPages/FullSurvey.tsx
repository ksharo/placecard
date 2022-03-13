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
    // gets query string if you do /takeSurvey?page=aaaaaa
    const pageString = new URLSearchParams(queryString).get('page');
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

    const nextPage = () => {
        startPage += 1;
        history.push('/takeSurvey?page='+startPage);
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        setPage(curPage + 1);
    };
    const prevPage = () => {
        startPage -= 1;
        history.push('/takeSurvey?page='+startPage);
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