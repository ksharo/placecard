import './editPages.css';
import validator from 'validator';
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";
import React from 'react';

export function EditProfile() {
    const history = useHistory();
    let editMode = false;
    let firstName = 'firstName';
    let lastName = 'lastName';
    let email = 'email@email.com';
    let phone = '555-555-5555'
    const [firstNameState, setFirst] = React.useState(firstName);
    const [lastNameState, setLast] = React.useState(lastName);
    const [emailState, setEmail] = React.useState(email);
    const [phoneState, setPhone] = React.useState(phone);


    const toDashboard = () => {
        // TODO: make sure user wants to leave (hidden box thing) if edit On is true
        // 'all unsaved changes will be lost. are you sure you want to continue?'
        history.push('/userHome');
    };

    // functions that show/remove errors based on user's input
    let validateFirstName = (event: any) => {
        firstName = validator.trim(event.target.value);
        const valid = !validator.isEmpty(firstName) && validator.isAlphanumeric(firstName.replace('-', '')) && validator.isByteLength(firstName, {min: 2, max: undefined});
        validateHelper('firstNameError', valid);
    }

    let validateLastName = (event: any) => {
        lastName = validator.trim(event.target.value);
        const valid = !validator.isEmpty(lastName) && validator.isAlphanumeric(lastName.replace('-', '')) && validator.isByteLength(lastName, {min: 2, max: undefined});
        validateHelper('lastNameError', valid);
    }

    let validatePhone = (event: any) => {
        phone = validator.trim(event.target.value);
        const regex = new RegExp('[0-9]{3}-[0-9]{3}-[0-9]{4}');
        const valid = (validator.isWhitelisted(phone, '0123456789') && phone.length == 10) || 
        (validator.isWhitelisted(phone, '0123456789-') && phone.length == 12 && regex.test(phone)) ||
        (phone.length == 0);
        validateHelper('phoneError', valid);
    }

    let validateEmail = (event: any) => {
        email = validator.trim(event.target.value);
        const valid = validator.isEmail(email);
        validateHelper('emailError', valid);
    }

    /* Checks the data to make sure it is valid and then turns edit mode off if it is */
    const saveChanges = () => {
        // TODO: collect, validate, and send profile data
        // do validation first
        const valid = checkAllErrors(firstName, lastName, phone, email);
        // change everything and save if the data is all valid. Otherwise don't do anything
        if (valid) {
            const editables = document.getElementsByClassName('editable');
            const uneditables = document.getElementsByClassName('uneditable');
            for (let i = 0; i < editables.length; i++) {
                (editables[i] as HTMLInputElement).style.display = 'none';
            }
            for (let i = 0; i < uneditables.length; i++) {
                (uneditables[i] as HTMLInputElement).style.display = 'inline-block';
            }
            // change profile data for user to view
            setFirst(firstName);
            setLast(lastName);
            setEmail(email);
            setPhone(phone);
            editMode = false;
        }
    };

    /* Turns edit mode on so that users can change their profile */
    const editOn = () => {
        const editables = document.getElementsByClassName('editable');
        const uneditables = document.getElementsByClassName('uneditable');
        for (let i = 0; i < uneditables.length; i++) {
            (uneditables[i] as HTMLInputElement).style.display = 'none';
        }
        for (let i = 0; i < editables.length; i++) {
            (editables[i] as HTMLInputElement).style.display = 'inline-block';
            if (i == 0) {
                (editables[i] as HTMLInputElement).focus();
            }
        }
        editMode = true;
    };

    return (
        <>
            <h1 className='title'>Your Profile</h1>
            <p className='subtitle pageError' id='editProfileError'>Please fix the errors before saving</p>
            <section className='profilePage'>
                <section className='verticalFlex box'>
                    <span id='firstNameError' className='editProfError'>Please make sure your first name is at least two characters and contains only letters, numbers, and hyphens.</span>
                    <span id='lastNameError' className='editProfError'>Please make sure your last name is at least two characters and contains only letters, numbers, and hyphens.</span>
                    <p className='profileElem'>Name: 
                        <span className='profileData uneditable'>{ firstNameState } { lastNameState }</span>
                        <input className='profileData editable' id='editFirstName' type='text' onChange={ validateFirstName } defaultValue={firstNameState} autoFocus/>
                        <input className='profileData editable' id='editLastName' type='text' onChange={ validateLastName } defaultValue={lastNameState}/>
                    </p>
                    <span id='emailError' className='editProfError'>Please enter a valid email.</span>
                    <p className='profileElem'>Email: 
                        <span className='profileData uneditable'>{ emailState }</span>
                        <input className='profileData editable' id='editEmail' type='text' onChange={ validateEmail } defaultValue={emailState}/>
                    </p>
                    <span id='phoneError' className='editProfError'>Please make sure your phone number contains only numbers and hyphens and is of the form xxx-xxx-xxxx.</span>
                    <p className='profileElem'>Phone Number: 
                        <span className='profileData uneditable'>{ phoneState }</span>
                        <input className='profileData editable' id='editPhone' type='text' onChange={ validatePhone } defaultValue={phoneState}/>
                    </p>
                    <p className='profileElem'>Password: 
                        <Button className='profileData'>Change Password</Button>
                    </p>
                    <p className='profileElem'>Upload Profile Picture: 
                        <input type='file' className='profileData' accept="image/png, image/gif, image/jpeg"/>
                    </p>
                    <section className='horizontalFlex bottomButtons'>
                        <Button variant='contained' onClick={ editOn }>Edit</Button>
                        <Button variant='contained' onClick={ saveChanges }>Save Changes</Button>
                    </section>
                </section>
                <Button variant='outlined' onClick={ toDashboard } className='homeButton'>Home</Button>
            </section>
        </>
    );
}

/* 
 * Removes redundancy from validation functions by performing the
 * show/hide of errors given the id of that error and the boolean
 * that must be checked
 */
function validateHelper(id: string, valid: boolean) {
    let x = document.getElementById(id);
    if (valid) {
        if (x != null) {
            x.style.display = 'none';
        }             
    }
    else {
        if (x != null) {
            x.style.display = 'inline-block';
        } 
    }
}

/*
 * Checks to see if there are any errors in order to show
 * or hide the error at the top of the page.
 * Returns false if there's an error; true otherwise
 */
function checkAllErrors(firstName: string, lastName: string, phone: string, email: string) {
    const regex = new RegExp('[0-9]{3}-[0-9]{3}-[0-9]{4}');
    const error = (!validator.isEmpty(firstName) && validator.isAlphanumeric(firstName.replace('-', '')) && validator.isByteLength(firstName, {min: 2, max: undefined}))
    && (!validator.isEmpty(lastName) && validator.isAlphanumeric(lastName.replace('-', '')) && validator.isByteLength(lastName, {min: 2, max: undefined})) &&
    ((validator.isWhitelisted(phone, '0123456789') && phone.length == 10) || (validator.isWhitelisted(phone, '0123456789-') && phone.length == 12 && 
    regex.test(phone)) || (phone.length == 0)) && validator.isEmail(email);
    
    let x = document.getElementById('editProfileError');
    // if there's an error, keep the item visible
    if (!error) {
        if (x != null) {
            x.style.display = 'inline-block';
        }
        return false;
    }
    // otherwise, hide it
    else {
        if (x != null) {
            x.style.display = 'none';
        }
        return true;
    }
}