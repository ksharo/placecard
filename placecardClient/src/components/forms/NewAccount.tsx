import './Forms.css'
import { useHistory } from "react-router-dom";
import validator from 'validator';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Button, InputAdornment, TextField } from '@mui/material';
import React from 'react';


    let validFirst = true;
    let validLast = true;
    let validPhone = true;
    let validEmail = true;
    let validPass = true;
    let validConfirm = true;

    /* we don't want to show/hide errors before they press submit for the first time */
    let firstTime = true;

    /* variables that hold the textfield input */
    let firstName = '';
    let lastName = '';
    let phone = '';
    let email = '';
    let password = '';
    let confirm = '';

export function NewAccount() {
    const history = useHistory();

    /* Variables to keep track of if each textField shows an error */
    const [firstError, setFirstError] = React.useState(!validFirst);
    const [lastError, setLastError] = React.useState(!validLast);
    const [phoneError, setPhoneError] = React.useState(!validPhone);
    const [emailError, setEmailError] = React.useState(!validEmail);
    const [passError, setPassError] = React.useState(!validPass);
    const [confirmError, setConfirmError] = React.useState(!validConfirm);


    /* the following togglePassword and toggleConfirm functions make the eye appear with 
        or without a slash and change the password from visible to invisible or vice versa */
    let toggleOnPassword = () => {
        togglePassword('passNoEye');
    };
    let toggleOffPassword = () => {
        togglePassword('passEye');
    }
    let toggleOnConfirm = () => {
        togglePassword('confirmNoEye');
    }
    let toggleOffConfirm = () => {
        togglePassword('confirmEye');
    }

    /* functions that will show/remove errors based on user's input */
    let validateFirstName = (event: any, val?: string) => {
        if (val !=  undefined) {
            firstName = val;
        }
        else {
            firstName = validator.trim(event.target.value);
        }
        if (!firstTime || val != undefined) {
            const valid = !validator.isEmpty(firstName) && validator.isAlphanumeric(firstName.replace('-', '')) && validator.isByteLength(firstName, {min: 2, max: undefined});
            validFirst = valid;
            setFirstError(!valid);
            checkAllErrors(firstName, lastName, phone, email, password, confirm);
        }
    }

    let validateLastName = (event: any, val?: string) => {
        if (val !=  undefined) {
            lastName = val;
        }
        else {
            lastName = validator.trim(event.target.value);
        }
        if (!firstTime || val != undefined) {
            const valid = !validator.isEmpty(lastName) && validator.isAlphanumeric(lastName.replace('-', '')) && validator.isByteLength(lastName, {min: 2, max: undefined});
            validLast = valid;
            setLastError(!valid);
            checkAllErrors(firstName, lastName, phone, email, password, confirm);
        }
    }

    let validatePhone = (event: any, val?: string) => {
        if (val !=  undefined) {
            phone = val;
        }
        else {
            phone = validator.trim(event.target.value);
        }
        if (!firstTime || val != undefined) {
            const regex = new RegExp('[0-9]{3}-[0-9]{3}-[0-9]{4}');
            const valid = (validator.isWhitelisted(phone, '0123456789') && phone.length == 10) || 
            (validator.isWhitelisted(phone, '0123456789-') && phone.length == 12 && regex.test(phone)) ||
            (phone.length == 0);
            validPhone = valid;
            setPhoneError(!valid);
            checkAllErrors(firstName, lastName, phone, email, password, confirm);
        }
    }

    let validateEmail = (event: any, val?: string) => {
        if (val !=  undefined) {
            email = val;
        }
        else {
            email = validator.trim(event.target.value);
        }
        if (!firstTime || val != undefined) {
            const valid = validator.isEmail(email);
            validEmail = valid;
            setEmailError(!valid);
            checkAllErrors(firstName, lastName, phone, email, password, confirm);
        }
    }

    let validatePass = (event: any, val?: string) => {
        if (val !=  undefined) {
            password = val;
        }
        else {
            password = event.target.value;
        }
        if (!firstTime || val != undefined) {
            const valid = (validator.isWhitelisted(password.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%&* ') &&
            validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0, returnScore: false }));
            validPass = valid;
            setPassError(!valid);
            if (confirm != password) {
                validConfirm = false;
                setConfirmError(true);
            }
            else {
                validConfirm = true;
                setConfirmError(false);
            }
            checkAllErrors(firstName, lastName, phone, email, password, confirm);
        }
    }

    let validateConfirm = (event: any, val?: string) => {
        if (val !=  undefined) {
            confirm = val;
        }
        else {
            confirm = event.target.value;
        }
        if (!firstTime || val != undefined) {
            const valid = confirm == password;
            validConfirm = valid;
            setConfirmError(!valid);
            checkAllErrors(firstName, lastName, phone, email, password, confirm);
        }
    }

    /* takes care of validation and sending data to the database when the "Next" button is pressed */
    let handleSubmit = async (event: any) => {
        event.preventDefault();
        const x = document.getElementById('sendAccountError');
        if (x != null) {
            x.style.display = 'none';
        }
        let errorFound = false;
        if (event == null) {
            if (x != null) {
                x.style.display = 'inline-block';
                window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
            }
        }
    
        /* get data from form and fill variables */
        firstName = validator.trim(event?.target?.firstName?.value);
        lastName = validator.trim(event?.target?.lastName?.value);
        phone = validator.trim(event?.target?.phone?.value);
        email = validator.trim(event?.target?.email?.value);
        password = event?.target?.password?.value;
        confirm = event?.target?.confirm?.value;

        /* begin validation process */
        validateFirstName(null, firstName);
        validateLastName(null, lastName);
        validatePhone(null, phone);
        validateEmail(null, email);
        validatePass(null, password);
        validateConfirm(null, confirm);
        errorFound = !(validFirst && validLast && validPhone && validEmail && validPass && validConfirm);
        if (!errorFound) { 
            /* if form is good, create the new account */
            try {
                // TODO: uncomment when backend is ready
                // await sendAccount(firstName, lastName, phone, email, password);
                /* if sendEvent is successful, go to next page after setting window variables */
                window.setFirstName(firstName);
                window.setLastName(lastName);
                window.setPhone(phone);
                window.setEmail(email);
                // log in with this data
                window.setLoggedIn(true);
                history.push('/createEvent');
            }
            catch {
                if (x != null) {
                    x.style.display = 'inline-block';
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                }
            }
        }
        /* if there is an error, tell the user */
        else {
            const y = document.getElementById('accountFormError');
            if (y != null) {
                y.style.display = 'inline-block';
                window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
            }
            firstTime = false;
        }
    }

    return (
    <>
        <h1 className='title'>Welcome to Placecard!</h1>
        <p className='subtitle'>Let's get started with some basic information:</p>
        <p className='subtitle pageError' id='accountFormError'>Please fix the errors.</p>
        <p className='subtitle pageError' id='sendAccountError'>Something went wrong. Please try again.</p>
        <form className='vertical-form' onSubmit={handleSubmit}>
            <section className='formBox'>
                <TextField 
                    variant='outlined' 
                    type="text" 
                    label='First Name' 
                    name='firstName'
                    error={firstError} 
                    helperText={firstError ? 'At least two characters (alphanumeric only)' : ''}  
                    onChange={validateFirstName}/>
                
                <TextField 
                    variant='outlined' 
                    type="text" 
                    label='Last Name' 
                    name='lastName' 
                    error={lastError} 
                    helperText={lastError ? 'At least two characters (alphanumeric only)' : ''} 
                    onChange={validateLastName}/>

                <TextField 
                    variant='outlined' 
                    type="tel" 
                    label='Phone Number (optional)' 
                    name='phone' 
                    placeholder='555-555-5555' 
                    error={phoneError} 
                    helperText={phoneError ? 'xxx-xxx-xxxx' : ''} 
                    onChange={validatePhone}/>

                <TextField 
                    variant='outlined' 
                    type="text"
                    label='Email' 
                    name='email'
                    error={emailError} 
                    helperText={emailError ? 'Please enter a valid email' : ''}  
                    onChange={validateEmail}/>
                
                    <TextField 
                        id='passInp'
                        variant='outlined'
                        type="password" 
                        name='password' 
                        label='Password' 
                        error={passError} 
                        helperText={passError ? <>At least 8 characters. Must contain: <br/>1. One uppercase letter <br/>2. One lowercase letter <br/>3. One number <br/>Can contain spaces and the following special symbols: [ ! @ # $ % & * ] </> : ''}  
                        onChange={validatePass}
                        InputProps={{endAdornment:
                            <InputAdornment position="end">  
                                <AiFillEyeInvisible className='passEye' id='passNoEye' onClick={ toggleOnPassword }/>
                                <AiFillEye className='passEye yesEye' id='passEye' onClick={ toggleOffPassword }/>
                            </InputAdornment>}}/>       
                
                    <TextField 
                        id='passConfirm' 
                        variant='outlined'
                        type="password" 
                        label='Confirm Password' 
                        name='confirm' 
                        error={confirmError} 
                        helperText={confirmError ? 'Passwords don\'t match' : ''} 
                        onChange={validateConfirm}
                        InputProps={{endAdornment:
                            <InputAdornment position="end">  
                                <AiFillEyeInvisible className='passEye' id='confirmNoEye' onClick={ toggleOnConfirm }/>
                                <AiFillEye className='passEye yesEye' id='confirmEye' onClick={ toggleOffConfirm }/>
                            </InputAdornment>}}/>

                </section>
            <Button type='submit' className='basicBtn' variant='contained'>Next</Button>
        </form>
    </>
    );
}

/*
 * Sends the account information to the database.
 */
async function sendAccount(first_name: string, last_name: string, phone: string, email: string, password: string) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                first_name: first_name,
                last_name: last_name,
                phone: phone,
                email: email,
                password: password
            })
        };
    return fetch('http://localhost:3001/accounts/newAccount', requestOptions);
}

/*
 * Takes the necessary steps to hide/show the password to the user.
 * iconID is the HTML id of the icon that needs to be shown
 * inputID is the HTML id of the input box that needs its type to be changed
 * backupElem is the element that has been hidden but, if something goes wrong, will need to be shown again
 * type is the type that the input needs to change to. Should either be 'text' or 'password'
 */
function toggleHelper(iconID: string, inputID: string, backupElem: HTMLElement | null, type:string) {
    let x = document.getElementById(iconID);
    /* show the correct icon */
    if (x) {
        x.style.display = 'inline-block';
        /* change the type of the input */
        let y = document.getElementById(inputID);
        if (y) {
            y.setAttribute('type', type);
        }
    }
    /* if something went wrong, show the old element */
    else {
        if (backupElem) {
            backupElem.style.display = 'inline-block';
        }
    }
}

/*
 * Calls toggleHelper with the correct information based on the id parameter
 * in order to hide/show the password to the user.
 */
function togglePassword(id: string) {
    let e = document.getElementById(id);
    if (e) {
        e.style.display = 'none';
    }
    if (id == 'passNoEye') {
        toggleHelper('passEye', 'passInp', e, 'text');
    }
    else if (id == 'passEye') {
        toggleHelper('passNoEye', 'passInp', e, 'password');
    }
    else if (id == 'confirmEye') {
        toggleHelper('confirmNoEye', 'passConfirm', e, 'password');
    }
    else if (id == 'confirmNoEye') {
        toggleHelper('confirmEye', 'passConfirm', e, 'text');
    }
}

/*
 * Checks to see if there are any errors in order to show
 * or hide the error at the top of the page
 */
function checkAllErrors(firstName: string, lastName: string, phone: string, email: string, password: string, confirm: string) {
    const regex = new RegExp('[0-9]{3}-[0-9]{3}-[0-9]{4}');
    const error = (!validator.isEmpty(firstName) && validator.isAlphanumeric(firstName.replace('-', '')) && validator.isByteLength(firstName, {min: 2, max: undefined}))
    && (!validator.isEmpty(lastName) && validator.isAlphanumeric(lastName.replace('-', '')) && validator.isByteLength(lastName, {min: 2, max: undefined})) &&
    ((validator.isWhitelisted(phone, '0123456789') && phone.length == 10) || (validator.isWhitelisted(phone, '0123456789-') && phone.length == 12 && 
    regex.test(phone)) || (phone.length == 0)) && validator.isEmail(email) && (validator.isWhitelisted(password.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%&* ') &&
    validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0, returnScore: false })) && confirm == password;
    
    let x = document.getElementById('accountFormError');
    /* if there's an error, keep the error visible */
    if (!error) {
        if (x != null) {
            x.style.display = 'inline-block';
        }
    }
    /* otherwise, hide it */
    else {
        if (x != null) {
            x.style.display = 'none';
        }
    }
}