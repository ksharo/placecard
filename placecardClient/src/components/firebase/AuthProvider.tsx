import { createContext, useEffect, useState, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "../../utils/firebase/firebase"
import { useHistory } from "react-router-dom";

const FirebaseAuthContext = createContext(undefined);

function useAuthContext() {
    return useContext(FirebaseAuthContext);
}

const FirebaseAuthProvider = ({ children } : any) => {
    const firebaseAuth = getFirebaseAuth();
    const [firebaseUser, setFirebaseUser] = useState(undefined);
    const history = useHistory();

    const toggleUser = (user: any) => {
        console.log("User: ", user);
        if (window.loggedInState==false) {
            window.setLoggedIn(!(user==null || user==undefined));
        }
        if (user != null && user != undefined) {
            const name = user.displayName.split(' ');
            window.setFirstName(name[0]);
            window.setLastName(name[name.length-1]);
            window.setPhone(user.phoneNumber);
            window.setEmail(user.email);
            window.setUID(user.uid);
            window.setFirstTime(user.metadata.createdAt == user.metadata.lastLoginAt);
        }
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