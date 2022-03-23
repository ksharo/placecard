import { isNull, isUndefined } from "lodash";
import { useAuthContext } from "../firebase/AuthProvider";
import LoginBox from "./LoginBox";
import { ProfileMenu } from "./ProfileMenu";

const ProfileBox = (props: any) => {
    const firebaseUser = useAuthContext();

    window.setLoggedIn(!(isNull(firebaseUser) || isUndefined(firebaseUser)));

    return (
        <div className = "profileBox">
            { isNull(firebaseUser) || isUndefined(firebaseUser) ? <LoginBox/> : <ProfileMenu user={firebaseUser}/>}
        </div>
    );
};

export default ProfileBox;