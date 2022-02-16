import '../shared/HeadFoot.css';
import { useState, MouseEvent } from 'react';
import { useHistory } from "react-router-dom";
import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import { userSignOut } from "../../utils/firebase/firebaseAuth";
import "../shared/HeadFoot.css";

function ProfileMenu(props: any) {
    const [ anchorEl, setAnchorEl ] = useState(undefined);
    const [open, setOpen ] = useState(false);

    const handleMenuClick = (event: any) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };

    const handleMenuClose = (event: any) => {
        setAnchorEl(undefined);
        setOpen(false);
    };

    return (
        <div className="profileMenu">
            <Button className="profileAvatarButton" variant="text" size="small" onClick={handleMenuClick}>
                <Avatar alt={props.user.displayName} src={props.user.photoURL}/>
            </Button>
            <Menu
                className="profileMenuDropdown"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
            >   
                <MenuItem divider>Signed in as: {props.user.displayName}</MenuItem>
                <MenuItem onClick={userSignOut}>Sign out</MenuItem>
            </Menu>
        </div>
        
    )
}

export default ProfileMenu;