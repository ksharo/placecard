import { Button, Box } from "@mui/material";
import { useState } from "react";
import OAuthDialogList from "../firebase/OAuthDialogList";

const LoginBox = () => {
    const [ open, setOpen ] = useState(false);

    const closeDialogBox = () => {
        setOpen(false);
    };

    const openDialogBox = () => {
        setOpen(true);
    };

    return (
        <Box className="loginBox">
            <Button variant="text" onClick={openDialogBox}>
                Log In
            </Button>
            <OAuthDialogList
                open={open}
                onClose={closeDialogBox}
            />
        </Box>
    );
};

export default LoginBox