import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { isUndefined } from "lodash";

type OptionalFirebaseApp = FirebaseApp | undefined;

// TODO: Move this to a backend API service where we make client requests ;
// otherwise keys will be exposed to the browser in the front-end build which is insecure
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

let firebaseApp: OptionalFirebaseApp = undefined;

function getFirebaseApp() {
    if (isUndefined(firebaseApp)) {
        firebaseApp = initializeApp(firebaseConfig);
    }
    return firebaseApp;
}

function getFirebaseAuth(firebaseApp?: OptionalFirebaseApp) {
    const currentFirebaseApp = firebaseApp || getFirebaseApp();
    return getAuth(currentFirebaseApp);
}


export {
    getFirebaseApp,
    getFirebaseAuth
};