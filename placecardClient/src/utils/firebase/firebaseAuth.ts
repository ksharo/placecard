import { AuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirebaseAuth } from "./firebase";

const AUTH = getFirebaseAuth();

async function popupLogin(authProvider: AuthProvider) {
    try {
        await signInWithPopup(AUTH, authProvider);
    } catch (error) {
        console.log("Error while logging in: ", error);
    }
}

async function userSignOut() {
    try {
        console.log("Signing out");
        await signOut(AUTH);    
    } catch (error) {
        console.log("Error while signing out: ", error);
    }
}

export {
    userSignOut,
    popupLogin
};