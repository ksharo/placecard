/// <reference types="react-scripts" />
interface Window {
    // TODO: figure out type of set functions
    loggedInState: boolean;
    setLoggedIn: any;

    emailState: string;
    setEmail: any;

    firstNameState: string;
    setFirstName: any;

    lastNameState: string;
    setLastName: any;

    phoneState: string;
    setPhone: any;

    profPicState: any;
    setProfPic: any;

    profPicNameState: string;
    setProfPicName: any;

    eventsState: PlacecardEvent[];
    setEvents: any;

    activeEvent: PlacecardEvent | null;
    setActiveEvent: any;

    inviteesState: Invitee[];
    setInvitees: any;

    dislikedInvitees: Invitee[];
    setDisliked: any;

    likedInvitees: Invitee[];
    setLiked: any;

    lovedInvitees: Invitee[];
    setLoved: any;

    curGroupID: string | undefined;
    setGroupID: any;
}

interface PlacecardEvent {
    id: string;
    name: string;
    date: string;
    location: string;
    numAttend: number;
    perTable: number;
    guestList: Invitee[];
    tables: Table[];
}

interface Invitee {
    id: string;
    name: string;
    groupID?: string; 
    groupName?: string;
}

interface Table {
    id: string;
    name: string;
    guests: Invitee[];
}