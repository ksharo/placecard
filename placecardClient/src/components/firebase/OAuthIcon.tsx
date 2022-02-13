import GoogleIcon from "@mui/icons-material/Google";
import Person from "@mui/icons-material/Person";
import { PROVIDERS } from "../../constants/mappings/authBoxConfigs";

const OAuthIcon = (props: {providerName: string}) => {
    if (props.providerName === PROVIDERS.GOOGLE) {
        return <GoogleIcon fontSize="large"/>;
    }
    return <Person/>;
};

export default OAuthIcon;