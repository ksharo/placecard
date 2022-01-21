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
}

interface PlacecardEvent {
    id: string;
    name: string;
    date: string;
    location: string;
    numAttend: number;
    perTable: number;
}

interface Invitee {
    id: string;
    name: string;
    size: number;
}