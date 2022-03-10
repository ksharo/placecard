import './App.css';
/* Import Other Components */
import { Home } from './components/home/Home';
/* Import Form Components */
import { NewAccount } from './components/forms/NewAccount';
import { CreateEvent } from './components/forms/CreateEvent';
/* Import Shared Components */
import { Footer } from './components/shared/Footer';
import { Header } from './components/shared/Header';
import { ObjectId } from 'mongodb';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { EventDashboard } from './components/dashboards/eventDash/EventDashboard';
import { UserDashboard } from './components/dashboards/userDash/UserDashboard';
import { NotFound } from './components/shared/NotFound';
import { GuestList } from './components/guestList/GuestList';
import { EditSurvey } from './components/editPages/EditSurvey';
import { SeatingDashboard } from './components/dashboards/seatDash/SeatingDashboard';
import { GuestConfirmation } from './components/guestPages/GuestConfirmation';
// import { SurveyPt1WithAges } from './components/guestPages/oldPages/SurveyPt1WithAges';
// import { SurveyPt2 } from './components/guestPages/oldPages/SurveyPt2Original';
import { SurveyConf } from './components/confirmationPages/SurveyConf';
import { SentConf } from './components/confirmationPages/SentConf';
import { EditDetails } from './components/editPages/EditDetails';
import { EditProfile } from './components/editPages/EditProfile';
import React, { useEffect } from 'react';
// import { SurveyPt1SitTogether } from './components/guestPages/oldPages/SurveyPt1SitTogether';
import { SurveyDislikes } from './components/guestPages/SurveyDislikes';
import { SurveyIdealTable } from './components/guestPages/SurveyIdealTable';
import { SurveyLikes } from './components/guestPages/SurveyLikes';
import { SurveyInstructions } from './components/guestPages/SurveyInstructions';
import { EditSurveyResponses } from './components/guestPages/EditSurveyResponses';
import { SurveyGroupPage } from './components/guestPages/SurveyGroupPage';
import { createTheme, ThemeProvider } from '@mui/material';
import { createBrowserHistory } from "history";
import { FirebaseAuthProvider } from "./components/firebase/AuthProvider";
import { FullSurvey } from './components/guestPages/FullSurvey';
import { async } from '@firebase/util';

// const getEvent = async () => {
//   const fetchData = await fetch('http://localhost:3001/events/6222666115cdbb7e25bc388f');
//   const post = await fetchData.json();
//   return {'id': post._id, 'name': post.name, 'date': post.event_start_time.toLocaleString().split(',')[0], 'time': post.event_start_time.toLocaleString().split(',')[1], 'location': post.location, 'tables': post.tables, 'perTable': post.attendees_per_table , 'guestList': post.guest_list};
// }
const seedGuests: Invitee[] = [
  {id: '00', name: 'Danielle Sharo', groupName: 'Sharo Family', groupID: '123'}, 
  {id: '02', name: 'Jeremiah Sharo', groupName: 'Sharo Family', groupID: '123'}, 
  {id: '03', name: 'Beth Sharo', groupName: 'Sharo Family', groupID: '123'}, 
  {id: '04', name: 'Rob Sharo', groupName: 'Sharo Family', groupID: '123'}, 
  {id: '11', name: 'Chloe Choy', groupName: 'Choy Family', groupID:'223'},
  {id: '12', name: 'Abby Choy', groupName: 'Choy Family', groupID:'223'},
  {id: '13', name: 'Mabel Choy', groupName: 'Choy Family', groupID:'223'},
  {id: '14', name: 'Wing Choy', groupName: 'Choy Family', groupID:'223'},
  {id: '22', name: 'Alex Rubino'}, 
  {id: '33', name: 'Simon Gao'}, 
  {id: '44', name: 'Gil Austria'}, 
  {id: '55', name: 'Jayson Infante'}
  ];
const seedTables: Table[] = [{id: '0', name: 'Table 1', guests: []}, {id: '1', name: 'Table 2', guests: []}, {id: '2', name: 'Table 3', guests: []}];
// const seedEvent1 = getEvent().then((result) => {return result});
// const seedEvent2: PlacecardEvent = { 'id': new ObjectId(), 'name': 'Bouncy Porpoise', 'date': '07/07/7777', 'location': 'Olive Garden', 'perTable': 4, 'tables': seedTables, 'guestList': seedGuests};
// const seedEvent3: PlacecardEvent = { 'id': new ObjectId(), 'name': 'Running Bagel', 'date': '04/02/2097', 'location': '', 'perTable': 4, 'tables': seedTables, 'guestList': seedGuests};  

function App() {
  document.title = 'Placecard';
  [window.loggedInState, window.setLoggedIn] = React.useState(true);
  [window.firstNameState, window.setFirstName] = React.useState('Apple');
  [window.lastNameState, window.setLastName] = React.useState('Zebra');
  [window.phoneState, window.setPhone] = React.useState('555-555-5555');
  [window.emailState, window.setEmail] = React.useState('email@email.com');
  [window.profPicState, window.setProfPic] = React.useState(null);
  [window.profPicNameState, window.setProfPicName] = React.useState('None');
  [window.eventsState, window.setEvents] = React.useState([]);
  [window.activeEvent, window.setActiveEvent] = React.useState(null);
  [window.inviteesState, window.setInvitees] = React.useState([]);
  [window.dislikedInvitees, window.setDisliked] = React.useState([]);
  [window.likedInvitees, window.setLiked] = React.useState([]);
  [window.lovedInvitees, window.setLoved] = React.useState([]);
  [window.curGroupID, window.setGroupID] = React.useState('223');  
  [window.uidState, window.setUID] = React.useState('BUTVFngo8WfgLdD0LJycLEz97ph2');
  useEffect(() => {
    const getEvents = async() => {
      try {
        const eventFetch = await fetch('http://localhost:3001/events/users/'+window.uidState);
        const fetchedEvents = await eventFetch.json();
        const events = []; 
        for (let post of fetchedEvents) { 
          const guests: Invitee[] = [];
          for (let guestID of post.guest_list) {
            try {
              const guestFetch = await fetch('http://localhost:3001/guests/'+guestID);
              const fetchedGuest = await guestFetch.json();
              const newGuest = {
                id: fetchedGuest._id,
                name: fetchedGuest.first_name + ' ' + fetchedGuest.last_name,
                // groupID?: string; 
                // groupName?: string;
                // contact?: string;
              }
              guests.push(newGuest);
            }
            catch (e){
              console.error("Error: could not fetch guest with id " + guestID + ". " + e);
            }
          }
          // const guests = post.guest_list.map( async (guestID: string) => {
          //   console.log(guestID);
          //   try {
          //     const guestFetch = await fetch('http://localhost:3001/guests/'+guestID);
          //     const fetchedGuest = await guestFetch.json();
          //     const newGuest = {
          //       id: fetchedGuest._id,
          //       name: fetchedGuest.first_name + ' ' + fetchedGuest.last_name,
          //       // groupID?: string; 
          //       // groupName?: string;
          //       // contact?: string;
          //     }
          //     return newGuest;
          //   }
          //   catch (e){
          //     console.error("Error: could not fetch guest with id " + guestID + ". " + e);
          //   }
          // });
          const event = {'id': post._id, 'uid': post._userId, 'name': post.event_name, 'date': (new Date(post.event_start_time)).toLocaleString().split(',')[0], 'time': (new Date(post.event_start_time)).toTimeString().split(' ')[0], 'location': post.location, 'tables': post.tables, 'perTable': post.attendees_per_table , 'guestList': guests};
          events.push(event);
          console.log(event.guestList);
        }
      window.setEvents(events);
      if (events.length > 0) {
        window.setActiveEvent(events[0]);
        window.setInvitees(events[0].guestList);
      }
      console.log(events);
    }
      catch (e){
        console.error('Error: Could not load events for user. ' + e);
      }
    };
    getEvents();
  }, [window.uidState]);
  
  // let seedEvent1: PlacecardEvent = { 'id': '62225aebb824bfc14bbaf071', 'name': 'newName', 'date': '01/29/2022', 'location': 'N/A', 'perTable': 2, 'tables': seedTables, 'guestList': seedGuests};
  
  // .then(data => {
    //   return data.json();
    // })
    // .then(post => {
    //   
    //   const seedEvent2: PlacecardEvent = { 'id': new ObjectId(), 'name': 'Bouncy Porpoise', 'date': '07/07/7777', 'location': 'Olive Garden', 'perTable': 4, 'tables': seedTables, 'guestList': seedGuests};
    //   const seedEvent3: PlacecardEvent = { 'id': new ObjectId(), 'name': 'Running Bagel', 'date': '04/02/2097', 'location': '', 'perTable': 4, 'tables': seedTables, 'guestList': seedGuests};
    // });
  // const event1 = await fetch('http://localhost:3001/events/62225aebb824bfc14bbaf071');
  // let eventTxt = await event1.text();
  // eventTxt = eventTxt.json()
  // console.log(eventTxt);
  // const seedEvent1: PlacecardEvent = {'id': eventTxt._id, 'name': event1.body.name, 'date': event1.body.date.toLocaleString().split(',')[0], 'location': event1.body.location };
  // const seedEvent1: PlacecardEvent = { 'id': '62225aebb824bfc14bbaf071', 'name': 'newName', 'date': '01/29/2022', 'location': 'N/A', 'perTable': 2, 'tables': seedTables, 'guestList': seedGuests};
  

  // [window.loggedInState, window.setLoggedIn] = React.useState(true);
  // [window.firstNameState, window.setFirstName] = React.useState('Apple');
  // [window.lastNameState, window.setLastName] = React.useState('Zebra');
  // [window.phoneState, window.setPhone] = React.useState('555-555-5555');
  // [window.emailState, window.setEmail] = React.useState('email@email.com');
  // [window.profPicState, window.setProfPic] = React.useState(null);
  // [window.profPicNameState, window.setProfPicName] = React.useState('None');
  // [window.eventsState, window.setEvents] = React.useState([seedEvent1, seedEvent2, seedEvent3]);
  // [window.activeEvent, window.setActiveEvent] = React.useState(seedEvent1);
  // [window.inviteesState, window.setInvitees] = React.useState(seedGuests);
  // [window.dislikedInvitees, window.setDisliked] = React.useState([]);
  // [window.likedInvitees, window.setLiked] = React.useState([]);
  // [window.lovedInvitees, window.setLoved] = React.useState([]);
  // [window.curGroupID, window.setGroupID] = React.useState('223');


  const theme = createTheme({
    palette: {
      secondary: {
        main: '#1F6BAE'
      },
      primary: {
        main: '#00A6A0'
      },
      info: {
        main: '#F57A75',
        contrastText: '#fff',
      },
      error: {
        main: '#EB645E'
      }
    },
    typography: {
      fontFamily: 'Ubuntu'
    }
  });
  /*
   * Pages:
   * Home: redesigned :)
   * New Account: redesigned :)
   * Begin Survey: redesigned :) 
   * Survey Instructions
   * Survey Group Page
   * Survey Dislikes
   * Survey Likes
   * Survey Ideal Table
   * Edit Survey Responses
   * Survey Confirmation: redesigned :)
   * Not Found 
   * Edit Profile
   * Edit Details: redesigned :)
   * Create Event: redesigned :) 
   * user dashboard: redesigned :)
   * guest list
   * edit survey: redesigned :)
   * sent confirmation: redesigned :)
   * event dashboard: redesigned :)
   * seating dashboard
   */

  return (
  <FirebaseAuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <section className='content'>
          <Header/>
          <Switch>
            <Route exact path='/' component={ Home }/> 
            <Route exact path='/newAccount' component={ NewAccount }/>
            <Route exact path='/beginSurvey' component={ GuestConfirmation }/>
            {/* <Route exact path='/surveyPt1' component={ SurveyPt1WithAges }/> */}
            {/* <Route exact path='/surveyPt2' component={ SurveyPt2 }/> */}
            {/* <Route exact path='/surveyPt1' component={ SurveyPt1SitTogether }/> */}
            <Route exact path='/takeSurvey' component={FullSurvey}/>
            {/* <Route exact path='/surveyInstructions' component={ SurveyInstructions }/>
            <Route exact path='/editGroup' component={ SurveyGroupPage }/>
            <Route exact path='/surveyDislikes' component={ SurveyDislikes }/>
            <Route exact path='/surveyLikes' component={ SurveyLikes }/>
            <Route exact path='/surveyIdealTable' component={ SurveyIdealTable }/>
            <Route exact path='/editSurveyResponses' component={ EditSurveyResponses }/>
            <Route exact path='/doneSurvey' component={ SurveyConf }/> */}
            <Route path="/404" component={ NotFound }/>
            {/* Authenticated routes below (user must be logged in to access) */}
            <Route exact path='/editProfile' component={ EditProfile }/>
            {/* { window.loggedInState && (<Route exact path='/editProfile' component={ EditProfile }/>)} */}
            <Route exact path='/editDetails' component={ EditDetails }/>
            {/* { window.loggedInState && (<Route exact path='/editDetails' component={ EditDetails }/>)} */}
            <Route exact path='/createEvent' component={ CreateEvent }/>
            {/* { window.loggedInState && (<Route exact path='/createEvent' component={ CreateEvent }/>)} */}
            <Route exact path='/userHome' component={ UserDashboard }/>
            {/* { window.loggedInState && (<Route exact path='/userHome' component={ UserDashboard }/>)} */}
            <Route exact path='/uploadGuestList' component={ GuestList }/>
            {/* { window.loggedInState && (<Route exact path='/uploadGuestList' component={ GuestList }/>)} */}
            <Route exact path='/editSurvey' component={ EditSurvey }/>
            {/* { window.loggedInState && (<Route exact path='/editSurvey' component={ EditSurvey }/>)} */}
            <Route exact path='/sentConf' component={ SentConf }/>
            {/* { window.loggedInState && (<Route exact path='/sentConf' component={ SentConf }/>)} */}
            <Route exact path='/eventDash' component={ EventDashboard }/>
            {/* { window.loggedInState && (<Route exact path='/eventDash' component={ EventDashboard }/>)} */}
            <Route exact path='/seatDash' component={ SeatingDashboard }/>
            {/* { window.loggedInState && (<Route exact path='/seatDash' component={ SeatingDashboard }/>)} */}
            { !window.loggedInState && (<Redirect to='/'/>)}
          <Redirect to="/404"/>
          </Switch>
          </section>
          <Footer/>
        </Router>
      </ThemeProvider>
      </FirebaseAuthProvider>
  );
}

export default App;
