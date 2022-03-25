import { GoogleAuthProvider } from "firebase/auth";

function googleProvider() {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    
    const customParameters = {
        "login_hint": "user@example.com"
    };
    provider.setCustomParameters(customParameters);

    return provider;
}

export {
    googleProvider
}