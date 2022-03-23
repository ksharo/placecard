import { Button, Box } from "@mui/material";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import OAuthDialogList from "../firebase/OAuthDialogList";

const LoginBox = () => {
    const history = useHistory();
    const [ open, setOpen ] = useState(false);

    const closeDialogBox = () => {
        setOpen(false);
    };

    const openDialogBox = () => {
        setOpen(true);
    };

    const newAccount = () => {
        history.push('/newAccount');
    };

    return (
        <Box>
            <section className='loginBtns'>
                <Button variant="contained" className='basicBtn greyBtn fitBtn' onClick={openDialogBox}>
                    Log In
                </Button>
                <Button variant="contained" className='basicBtn smallerBtn' onClick={newAccount}>
                    Sign Up Free
                </Button>
            </section>
            <OAuthDialogList
                open={open}
                onClose={closeDialogBox}
                title='Log in to'
            />
        </Box>
    );
};

export default LoginBox