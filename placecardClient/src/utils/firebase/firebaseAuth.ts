import { getAuth, AuthProvider, signInWithPopup } from "firebase/auth";
import { getFirebaseApp } from "./firebase";

const firebaseApp = getFirebaseApp();

const AUTH = getAuth(firebaseApp);

async function popupLogin(authProvider: AuthProvider) {
    try {
        await signInWithPopup(AUTH, authProvider);
    } catch (error) {
        console.log("Error: ", error);
    }
}

export {
    popupLogin
};