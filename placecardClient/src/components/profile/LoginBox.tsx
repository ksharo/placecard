import { Button, Box } from "@mui/material";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import OAuthDialogList from "../firebase/OAuthDialogList";

const LoginBox = () => {
    // const history = useHistory();
    const [ loginOpen, setOpenLogin ] = useState(false);
    const [ signupOpen, setOpenSignup ] = useState(false);

    const closeLoginDialogBox = () => {
        setOpenLogin(false);
    };

    const openLoginDialogBox = () => {
        setOpenLogin(true);
    };

    const closeSignupDialogBox = () => {
        setOpenSignup(false);
    };

    const openSignupDialogBox = () => {
        setOpenSignup(true);
    };

    // const newAccount = () => {
    //     history.push('/newAccount');
    // };

    return (
        <Box>
            <section className='loginBtns'>
                <Button variant="contained" className='basicBtn greyBtn fitBtn' onClick={openLoginDialogBox}>
                    Log In
                </Button>
                <Button variant="contained" className='basicBtn smallerBtn' onClick={openSignupDialogBox}>
                    Sign Up Free
                </Button>
            </section>
            <OAuthDialogList
                open={loginOpen}
                onClose={closeLoginDialogBox}
                title='Log in to'
            />
            <OAuthDialogList
                open={signupOpen}
                onClose={closeSignupDialogBox}
                title='Sign up for'
            />
        </Box>
    );
};

export default LoginBox