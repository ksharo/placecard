import './HeadFoot.css';
import Avatar from '@mui/material/Avatar';
import React from 'react';
import { Menu, MenuItem } from '@mui/material';

export function ProfileMenu(props: {name: string; id: string}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const names = props.name.split(' ');
    let initials = '';
    if (names.length > 1) {
        initials = names[0][0] + names[names.length-1][0];
    }
    else {
        initials = names[0][0];
    }

    return (
        <>
            <Avatar className='profilePic' onClick={ handleClick } sx={{ width: 46, height: 46 }}>{initials}</Avatar>
            <Menu anchorEl={ anchorEl } 
                open={ open } 
                onClose ={ handleClose } 
                onClick={ handleClose }>
                <MenuItem id='fullName' style={{ pointerEvents: 'none' }}>{props.name}</MenuItem>
                <MenuItem>View/Edit Profile</MenuItem>
                <MenuItem>Logout</MenuItem>
            </Menu>
        </>
    );
}