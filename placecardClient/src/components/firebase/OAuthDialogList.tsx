import { Box, Dialog, DialogTitle, DialogContent, DialogContentText, List } from "@mui/material";
import placecardLogo from "../../assets/logo.png";
import CustomOAuthBox from "./CustomOAuthBox";
import { PROVIDERS, authBoxConfigs } from "../../constants/mappings/authBoxConfigs";
import { loginDescription } from "../../constants/messages";
import { v4 as uuid } from 'uuid';

const PROVIDER_NAMES: string[] = Object.values(PROVIDERS);

export interface OAuthDialogListProps { 
    open: boolean,
    onClose: () => void
};

const OAuthDialogList = (props: {open: any, onClose:any, title: String}) => {
    const open: any = props.open;
    const onClose: any = props.onClose;

    const authList = PROVIDER_NAMES.map((providerName) => {
        return <CustomOAuthBox key={uuid()} authBoxConfig={ authBoxConfigs[providerName] }/> 
    });

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>{props.title}</DialogTitle>
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