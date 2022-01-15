import './Forms.css'
import { useHistory } from "react-router-dom";
import validator from 'validator';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

export function NewAccount() {
    const history = useHistory();
    let firstName = '';
    let lastName = '';
    let phone = '';
    let email = '';
    let password = '';
    let confirm = '';
    let firstTime = true;

    // the following togglePassword and toggleConfirm functions make the eye
    // appear with or without a slash and change the password from visible to invisible
    // or vice versa
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

    // functions that will show/remove errors based on user's input
    let validateFirstName = (event: any) => {
        if (!firstTime) {
            firstName = validator.trim(event.target.value);
            const valid = !validator.isEmpty(firstName) && validator.isAlphanumeric(firstName.replace('-', '')) && validator.isByteLength(firstName, {min: 2, max: undefined});
            validateHelper('firstNameError', valid);
            checkAllErrors(firstName, lastName, phone, email, password, confirm);
        }
    }

    let validateLastName = (event: any) => {
        if (!firstTime) {
            lastName = validator.trim(event.target.value);
            const valid = !validator.isEmpty(lastName) && validator.isAlphanumeric(lastName.replace('-', '')) && validator.isByteLength(lastName, {min: 2, max: undefined});
            validateHelper('lastNameError', valid);
            checkAllErrors(firstName, lastName, phone, email, password, confirm);
        }
    }

    let validatePhone = (event: any) => {
        if (!firstTime) {
            phone = validator.trim(event.target.value);
            const regex = new RegExp('[0-9]{3}-[0-9]{3}-[0-9]{4}');
            const valid = (validator.isWhitelisted(phone, '0123456789') && phone.length == 10) || 
            (validator.isWhitelisted(phone, '0123456789-') && phone.length == 12 && regex.test(phone)) ||
            (phone.length == 0);
            validateHelper('phoneError', valid);
            checkAllErrors(firstName, lastName, phone, email, password, confirm);
        }
    }

    let validateEmail = (event: any) => {
        if (!firstTime) {
            email = validator.trim(event.target.value);
            const valid = validator.isEmail(email);
            validateHelper('emailError', valid);
            checkAllErrors(firstName, lastName, phone, email, password, confirm);
        }
    }

    let validatePass = (event: any) => {
        if (!firstTime) {
            password = event.target.value;
            const valid = (validator.isWhitelisted(password.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%&* ') &&
            validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0, returnScore: false }));
            validateHelper('passError', valid);
            if (confirm != password) {
                validateHelper('confirmError', false);
            }
            else {
                validateHelper('confirmError', true);
            }
            checkAllErrors(firstName, lastName, phone, email, password, confirm);
        }
    }

    let validateConfirm = (event: any) => {
        if (!firstTime) {
            confirm = event.target.value;
            const valid = confirm == password;
            validateHelper('confirmError', valid);
            checkAllErrors(firstName, lastName, phone, email, password, confirm);
        }
    }

    // takes care of validation and sending data to the database when the "Next" button is pressed
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
        // get data from form and fill variables
        firstName = validator.trim(event?.target?.firstName?.value);
        lastName = validator.trim(event?.target?.lastName?.value);
        phone = validator.trim(event?.target?.phone?.value);
        email = validator.trim(event?.target?.email?.value);
        password = event?.target?.password?.value;
        confirm = event?.target?.confirm?.value;

        // begin validation process
        errorFound = validate(firstName, lastName, phone, email, password, confirm);
        if (!errorFound) { 
            // if form is good, create the new account
            try {
                // TODO: uncomment when backend is ready
                // await sendAccount(firstName, lastName, phone, email, password);
                // if sendEvent is successful, go to next page after setting window variables
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
        // if there is an error, tell the user
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
            <label>First Name
                <span id='firstNameError' className='formError'>Please make sure your first name is at least two characters and contains only letters, numbers, and hyphens.</span>
                <input type="text" name='firstName' onChange={validateFirstName}/>
            </label>
            <label>Last Name
                <span id='lastNameError' className='formError'>Please make sure your last name is at least two characters and contains only letters, numbers, and hyphens.</span>
                <input type="text" name='lastName' onChange={validateLastName}/>
            </label>
            <label>Phone Number (optional)
                <span id='phoneError' className='formError'>Please make sure your phone number contains only numbers and hyphens and is of the form xxx-xxx-xxxx.</span>
                <input type="tel" name='phone' placeholder='555-555-5555' onChange={validatePhone}/>
            </label>
            <label>Email
                <span id='emailError' className='formError'>Please enter a valid email.</span>
                <input type="text" name='email' onChange={validateEmail}/>
            </label>
            <label>Password
                <span id='passError' className='formError'>Password must be at least 8 characters including at least one uppercase letter, one lowercase letter, and one number. Spaces and the following special symbols are allowed: [ ! @ # $ % & * ]</span>
                <section className='passwordHolder'>    
                    <input type="password" name='password' id='passInp' onChange={validatePass}/>         
                    <AiFillEyeInvisible className='passEye' id='passNoEye' onClick={ toggleOnPassword }/>
                    <AiFillEye className='passEye yesEye' id='passEye' onClick={ toggleOffPassword }/>
                </section>           
            </label>
            <label>Confirm Password
                <span id='confirmError' className='formError'>Passwords don't match.</span>
                <section className='passwordHolder'>    
                    <input type="password" name='confirm' id='passConfirm' onChange={validateConfirm}/>         
                    <AiFillEyeInvisible className='passEye' id='confirmNoEye' onClick={ toggleOnConfirm }/>
                    <AiFillEye className='passEye yesEye' id='confirmEye' onClick={ toggleOffConfirm }/>
                </section>  
            </label>
            <button type='submit' className='rectangleButton smallerButton'>Next</button>
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
            'Content-Type': 'applications/json'
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
    // show the correct icon
    if (x) {
        x.style.display = 'inline-block';
        // change the type of the input
        let y = document.getElementById(inputID);
        if (y) {
            y.setAttribute('type', type);
            console.log(y);
        }
    }
    // if something went wrong, show the old element
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
 * Displays the error with id 'id'. Returns true so that
 * errorFound is set properly.
 */
function showError(id: string): boolean {
    let x = document.getElementById(id);
    if (x != null) {
        x.style.display = 'inline-block';
    } 
    return true;
}

/* 
 * Validates the information in the form
 */
function validate(firstName: string, lastName: string, phone: string, email: string, password: string, confirm: string) {
    let errorFound = false;
    /* Make sure the first name is at least two characters, remove extra white space, and check for alphanumeric only */
    if (!(!validator.isEmpty(firstName) && validator.isAlphanumeric(firstName.replace('-', '')) && validator.isByteLength(firstName, {min: 2, max: undefined}))) {
        errorFound = showError('firstNameError');
    }

    /* Make sure the last name is at least two characters, remove extra white space, and check for alphanumeric only */
    if (!(!validator.isEmpty(lastName) && validator.isAlphanumeric(lastName.replace('-', '')) && validator.isByteLength(lastName, {min: 2, max: undefined}))) {
        errorFound = showError('lastNameError');
    }

    /* Make sure the phone number, if given, is valid */
    const regex = new RegExp('[0-9]{3}-[0-9]{3}-[0-9]{4}');
    if ( !((validator.isWhitelisted(phone, '0123456789') && phone.length == 10) || 
            (validator.isWhitelisted(phone, '0123456789-') && phone.length == 12 && regex.test(phone)) ||
            (phone.length == 0))) {
        errorFound = showError('phoneError');
    }

    /* Make sure there is a valid email */
    if (!validator.isEmail(email)) {
        errorFound = showError('emailError');
    }

    /* Make sure the password is valid */
    if (! (validator.isWhitelisted(password.toLowerCase(), 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%&* ') &&
        validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1,  minSymbols: 0, returnScore: false }))) {
        errorFound = showError('passError');
    }

    /* Make sure the confirmation password equals the original password */
    if (confirm != password) {
        errorFound = showError('confirmError');
    }
    return errorFound;
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
    // if there's an error, keep the item visible
    if (!error) {
        if (x != null) {
            x.style.display = 'inline-block';
        }
    }
    // otherwise, hide it
    else {
        if (x != null) {
            x.style.display = 'none';
        }
    }
}