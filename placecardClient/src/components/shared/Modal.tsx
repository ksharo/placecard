import { Button, Card, CardActions, CardContent, CardHeader } from '@mui/material';

export function Modal(props: {title: string; text: string; no: Function; yes: Function}) {
    return (
        <section className='hiddenBoxes' id='hiddenWarning'>
        <Card className='innerBox'>
            <CardHeader className='innerBoxHeader' title={props.title}/>
            <CardContent className='innerBoxContent'>
                <p className='subtitle'>{props.text}</p>
                <p className='subtitle'>Are you sure you want to continue?</p>
            </CardContent>
            <CardActions className='spacedBtns'>
                <Button variant='contained' className='basicBtn' onClick={() => {props.no()}}>No</Button>
                <Button variant='contained' className='basicBtn' onClick={() => {props.yes()}}>Yes</Button>
            </CardActions>
        </Card>
    </section>
    );
}