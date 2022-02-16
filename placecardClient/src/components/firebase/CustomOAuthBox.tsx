import "./AuthBox.css";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import OAuthIcon from "./OAuthIcon";
import { AuthBoxConfig } from "../../constants/mappings/authBoxConfigs";
import { popupLogin } from "../../utils/firebase/firebaseAuth";

const OAuthListButton = (props: { authBoxConfig: AuthBoxConfig }) => {
    const { providerName, authProvider} = props.authBoxConfig;
    
    const onClickHandler = async () => {
        await popupLogin(authProvider);
    };

    return (
        <ListItem onClick={ onClickHandler }>
            <ListItemButton>
                <ListItemIcon>
                    <OAuthIcon providerName={ providerName }/>
                </ListItemIcon>
                <ListItemText primary={ providerName }/>
            </ListItemButton>
        </ListItem>
    );
};

export default OAuthListButton;