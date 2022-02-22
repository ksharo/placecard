import { useHistory } from "react-router-dom";
import Card from '@mui/material/Card';
import { Button, CardActions, CardContent, CardHeader } from "@mui/material";
import { PieChart } from 'react-minimal-pie-chart';


export function EditCard(props: {numSent: string; numRec: string}) {
    const history = useHistory();
    
    const toGuestListEdit = () => {
        history.push('/editGuestList');
    };
    const percRec = cleanPercentage(parseInt(props.numRec)/parseInt(props.numSent));
    return (
        <Card className='dashCard bigCard'>
            <CardHeader title='Guest List' className='dashCardHeader'/>
            <CardContent className='flexCard'>
                <section>
                    <p><strong>Surveys Sent:</strong> {props.numSent} </p>
                    <p><strong>Surveys Completed:</strong> {props.numRec}/{props.numSent} </p>
                </section>
                <PieChart className='pieChart' totalValue={100} animate={true}
                    data={[
                        { title: 'Percent Completed', value: percRec, color: 'var(--highlight)' },
                        { title: 'Percent Waiting', value: 100-percRec, color: '#e5e5e5' }
                    ]}
                    />
            </CardContent>
            <CardActions className='cardFooter'>
                <Button onClick={toGuestListEdit} className='basicBtn biggerBtn' variant='contained'>
                     Edit/View Guest List
                </Button>
            </CardActions>
        </Card>

    );
}

function cleanPercentage(perc: number) {
    return Math.round(perc * 100);
}
