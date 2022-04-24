import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import './Confirmation.css';

export function SentConf() {
    window.setGuestMode(false);
    const history = useHistory();
    const toDash = () => {
        history.push('/eventDash');
    };

    return (
        <>
            <h1 className='title lowTitle'>Awesome! You did it!</h1>
            <p className='subtitle'>Now sit back, relax, and let us take it from here.</p>
            <Button className='confBtn' onClick={toDash}>Go to event dashboard</Button>
        </>
    );
}

