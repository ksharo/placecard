import { Button } from '@mui/material';
import './Confirmation.css';

export function SentConf() {

    return (
        <>
            <h1 className='title'>Awesome! You did it!</h1>
            <p className='subtitle'>Now sit back, relax, and let us take it from here.</p>
            <Button className='confBtn' variant='contained'>Go to event dashboard</Button>
        </>
    );
}

