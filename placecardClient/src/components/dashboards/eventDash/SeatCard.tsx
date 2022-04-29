import { useHistory } from "react-router-dom";
import Card from '@mui/material/Card';
import { Button, CardActions, CardContent, CardHeader } from "@mui/material";
import { PieChart } from 'react-minimal-pie-chart';


export function SeatCard(props: { tables: string; seats: string; invitees: string; seated: string }) {
    const history = useHistory();

    const toSeatDash = () => {
        history.push('/seatDash');
    };

    const percSeated = cleanPercentage(parseInt(props.seated) / parseInt(props.invitees));

    return (
        <Card className='dashCard bigCard'>
            <CardHeader title='Seating Chart' className='dashCardHeader' />
            <CardContent className='flexCard'>
                <section>
                    <p><strong>Tables:</strong> {props.tables}</p>
                    <p><strong>Seats:</strong> {props.seats}</p>
                    <p><strong>Invitees:</strong> {props.invitees}</p>
                    <p><strong>People Seated:</strong> {props.seated}</p>
                </section>
                {parseInt(props.invitees) > 0 && <PieChart className='pieChart' totalValue={100} animate={true}
                    data={[
                        { title: 'Percent Seated', value: percSeated, color: 'var(--highlight)' },
                        { title: 'Percent Not Seated', value: 100 - percSeated, color: '#e5e5e5' }
                    ]}
                />}

            </CardContent>
            <CardActions className='cardFooter'>
                <Button onClick={toSeatDash} className='basicBtn fitBtn' variant='contained'>
                    Dashboard
                </Button>
            </CardActions>
        </Card>
    );
}

function cleanPercentage(perc: number) {
    return Math.round(perc * 100);
}