import { Link } from "react-router-dom";
import Card from '@mui/material/Card';


export function EditCard(props: {numSent: string; numRec: string}) {
    const percRec = cleanPercentage(parseInt(props.numRec)/parseInt(props.numSent));
    return (
        <Card className='dashCard'>
            <section className='summary'>
                <h3>Guest List/Survey</h3>     
                <hr/>    
                <p>Surveys Sent: {props.numSent} </p>
                <p>Surveys Taken: {props.numRec}/{props.numSent} ({percRec}%)</p>
            </section>
            <section className='verticalBtns'>
                <Link to='/editGuestList' className='editButton'>
                        Edit/View Guest List
                </Link>
            </section>
        </Card>
    );
}

function cleanPercentage(perc: number) {
    return Math.round(perc * 100);
}
