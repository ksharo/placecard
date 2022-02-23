import { Box, Dialog, DialogTitle, DialogContent, DialogContentText, List } from "@mui/material";
import placecardLogo from "../../assets/logo.png";
import CustomOAuthBox from "./CustomOAuthBox";
import { PROVIDERS, authBoxConfigs } from "../../constants/mappings/authBoxConfigs";
import { loginDescription } from "../../constants/messages";

const PROVIDER_NAMES: string[] = Object.values(PROVIDERS);

export interface OAuthDialogListProps { 
    open: boolean,
    onClose: () => void
};

const OAuthDialogList = (props: OAuthDialogListProps) => {
    const { open, onClose } = props;

    const authList = PROVIDER_NAMES.map((providerName) => {
        return <CustomOAuthBox authBoxConfig={ authBoxConfigs[providerName] }/> 
    });

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Sign in to</DialogTitle>
            <DialogContent>
                <Box
                    className="logoImage"
                    component="img"
                    alt="Placecard logo"
                    src={placecardLogo}
                />
                <DialogContentText className="loginDialogText">
                    {loginDescription}
                </DialogContentText>
            </DialogContent>
            <List>
                { authList }
            </List>
        </Dialog>
    );
};

export default OAuthDialogList;