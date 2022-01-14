import Button from '@mui/material/Button';
import './editPages.css';

export function EditProfile() {
    return (
        <>
            <h1 className='title'>Your Profile</h1>
            <section className='profilePage'>
                <section className='verticalFlex box'>
                    <p className='profileElem'>Name: <span className='profileData'>firstName lastName</span></p>
                    <p className='profileElem'>Email: <span className='profileData'>email</span></p>
                    <p className='profileElem'>Phone Number: <span className='profileData'>phone number</span></p>
                    <p className='profileElem'>Password: <Button className='profileData' >Change Password</Button></p>
                    <p className='profileElem'>Upload Profile Picture: <input type='file' className='profileData' accept="image/png, image/gif, image/jpeg"></input></p>
                </section>
                <section className='horizontalFlex bottomButtons'>
                    <Button variant='outlined'>Dashboard</Button>
                    <Button variant='outlined'>Save Changes</Button>
                </section>
            </section>
        </>
    );
}