import { Button } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import sadFace from '../../assets/sadFace.png';

export function NotFound() {
    const history = useHistory();
    const goHome = () => {
        history.push('/')
    };

    return (
        <>
            <img className='lowImg' src={ sadFace }></img>
            <h1 className='title highTitle'>Oh no! Something went wrong...</h1>
            <hr className='peachLine'></hr>
            <p className='subtitle'>Error 404: The page you requested doesn't exist. </p>
            <Button variant='contained' onClick={goHome} className='basicBtn biggerBtn'>Return Home</Button>
        </>
    );
}
