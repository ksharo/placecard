import { Button, Card, CardActions, CardContent, CardHeader, IconButton, TextareaAutosize } from '@mui/material';
import moment from 'moment';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import { FullSurvey } from '../guestPages/FullSurvey';
import './editPages.css';

export function EditSurvey () {
    const history = useHistory();

    const defaultMainText = `Please fill out a seating chart for my event, ${window.activeEvent == undefined ? 'Event Name Not Found' : window.activeEvent.name}, on Placecard!`

    const defaultSignatureText = 'Thanks! \r\n'+window.firstNameState + ' ' + window.lastNameState;

    const sendSurvey = () => {
        history.push('/sentConf');
    };

    const previewSurvey = () => {
        const el = document.getElementById('surveyPreview');
        if (el != null) {
            el.style.display = 'block';
            window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        }
    };

    const dontClose = (event: any) => {
        event.stopPropagation();
    };

    const closePreview = () => {
        const el = document.getElementById('surveyPreview');
        if (el != null) {
            el.style.display = 'none';
            window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        }
    }

    return (
    <section className='centered'>
        <section className='hiddenBoxes' id='surveyPreview' onClick={closePreview}>
            <Card className='surveyPreview' onClick={dontClose}>
                <CardHeader className='innerBoxHeader' action={<IconButton onClick={closePreview}><AiFillCloseCircle className='closeBtn'/></IconButton>} title='Preview Survey'/>
                    <CardContent>
                        <FullSurvey preview={true}></FullSurvey>
                    </CardContent>
                    <CardActions className='previewFooter'>
                        <Button color='info' variant='contained' className='basicBtn fitBtn' onClick={closePreview}>Close Preview</Button>
                    </CardActions>
            </Card>
        </section>
        <h1 className='title'>Customize Invitation</h1>
        <p className='subtitle'>Great! Now it's time to customize your survey invitation!</p>
        <Card className='box'>
            <p className='details'>Hello [Guest name/Group name]!</p>
            <TextareaAutosize className='customInput' defaultValue={defaultMainText}></TextareaAutosize>
            <p className='details'> Event Date: {window.activeEvent == undefined ? 'Error' : moment(window.activeEvent.date).format('DD MMMM YYYY')} </p>
            {window.activeEvent != undefined && window.activeEvent.location != 'N/A' && window.activeEvent.location != '' ?
            <p className='details'> Location: {window.activeEvent.location}</p>
            :
            <></>}
            <p className='details'> Number of Guests in Your Group: #</p>
            <p className='details'> Your unique link: https://placecard.com/beginSurvey/id=123456</p>
            <TextareaAutosize className='signature' defaultValue={defaultSignatureText}></TextareaAutosize>
        </Card>
        <section className='verticalFlex surveyBtns'>
            <section className='horizontalFlex'>
                <Button variant='contained' className='blueBtn basicBtn fitBtn' onClick={previewSurvey}>Preview Survey</Button>
                <Button variant='contained' className='blueBtn basicBtn fitBtn' onClick={() => history.push('/uploadGuestList')}>Edit Survey Recipients</Button>
                <Button variant='contained' className='blueBtn basicBtn fitBtn' onClick={() => history.push('/editDetails')}>Edit Event Details</Button>
            </section>
            <section className='horizontalFlex'>
                <Button variant='contained' className='basicBtn' onClick={() => history.goBack()}>Back</Button>
                <Button variant='contained' className='basicBtn' onClick={sendSurvey}>Send</Button>
            </section>
        </section>
    </section>
    );
}