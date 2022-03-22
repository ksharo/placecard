import { createContext, useEffect, useState, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "../../utils/firebase/firebase"

const FirebaseAuthContext = createContext(undefined);

function useAuthContext() {
    return useContext(FirebaseAuthContext);
}

const FirebaseAuthProvider = ({ children } : any) => {
    const firebaseAuth = getFirebaseAuth();
    const [firebaseUser, setFirebaseUser] = useState(undefined);

    const toggleUser = (user: any) => {
        console.log("User: ", user);
        setFirebaseUser(user);
    };

    useEffect(() => {
        return onAuthStateChanged(firebaseAuth, toggleUser);
    }, []);

    return (
        <FirebaseAuthContext.Provider value={firebaseUser}>
            {children}
        </FirebaseAuthContext.Provider>
    );
};

export {
    useAuthContext,
    FirebaseAuthProvider
};