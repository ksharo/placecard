import '../shared/HeadFoot.css';
import { useState, MouseEvent } from 'react';
import { useHistory } from "react-router-dom";
import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import { userSignOut } from "../../utils/firebase/firebaseAuth";
import "../shared/HeadFoot.css";
import React from 'react';

// function ProfileMenu(props: any) {
//     const [ anchorEl, setAnchorEl ] = useState(undefined);
//     const [open, setOpen ] = useState(false);

//     const handleMenuClick = (event: any) => {
//         setAnchorEl(event.currentTarget);
//         setOpen(true);
//     };

//     const handleMenuClose = (event: any) => {
//         setAnchorEl(undefined);
//         setOpen(false);
//     };

//     return (
//         <div className="profileMenu">
//             <Button className="profileAvatarButton" variant="text" size="small" onClick={handleMenuClick}>
//                 <Avatar alt={props.user.displayName} src={props.user.photoURL}/>
//             </Button>
//             <Menu
//                 className="profileMenuDropdown"
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={handleMenuClose}
//             >   
//                 <MenuItem divider>Signed in as: {props.user.displayName}</MenuItem>
//                 <MenuItem onClick={userSignOut}>Sign out</MenuItem>
//             </Menu>
//         </div>
        
//     )
// }

// export default ProfileMenu;

export function ProfileMenu(props: {user: any}) {
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const names = props.user.displayName.split(' ');
    let initials = '';
    if (names.length > 1) {
        initials = names[0][0].toUpperCase() + names[names.length-1][0].toUpperCase();
    }
    else {
        initials = names[0][0];
    }

    const goEditProfile = () => {
        history.push('/editProfile');
    };

    const userHome = () => {
        history.push('/userHome');
    };

    const logOut = () => {
        userSignOut();
        window.setLoggedIn(false);
        window.setFirstTime(undefined);
        history.push('/');
    };

    const initCode = <Avatar className='profilePic' onClick={ handleClick } sx={{ width: 46, height: 46 }}>{initials}</Avatar>;
    const imgCode = <Avatar className='profilePic' alt={initials} onClick={ handleClick } src={window.profPicState == null  ? props.user.photoURL : window.profPicState} sx={{ width: 46, height: 46 }}>{initials}</Avatar>;
    return (
        <>
            {window.profPicState == null  && props.user.photoURL == null  ? initCode : imgCode}
            <Menu anchorEl={ anchorEl } 
                open={ open } 
                onClose ={ handleClose } 
                onClick={ handleClose }>
                <MenuItem id='fullName' style={{ pointerEvents: 'none' }}>{props.user.displayName}</MenuItem>
                <MenuItem onClick={ userHome }>Home</MenuItem>
                {/* <MenuItem onClick={ goEditProfile }>View/Edit Profile</MenuItem> */}
                <MenuItem onClick={ logOut }>Logout</MenuItem>
            </Menu>
        </>
    );
}