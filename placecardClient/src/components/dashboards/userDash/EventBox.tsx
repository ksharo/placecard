import { AccordionDetails, AccordionSummary, Card, CardContent, Toolbar } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import './EventBox.css';

export function EventBox() {
    return (
        <Accordion>
            <AccordionSummary>
                <AppBar position='static' color='inherit'>
                    <Toolbar className='toolbar'>
                    <Typography component='p'>Wedding | 10/10/10</Typography>
                    <Button size='medium'>Dashboard</Button>
                    </Toolbar>
                </AppBar>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    testing123
                </Typography>
            </AccordionDetails>


        </Accordion>
    );
}