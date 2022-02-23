import './App.css';
/* Import Other Components */
import { Home } from './components/home/Home';
/* Import Form Components */
import { NewAccount } from './components/forms/NewAccount';
import { CreateEvent } from './components/forms/CreateEvent';
/* Import Shared Components */
import { Footer } from './components/shared/Footer';
import { Header } from './components/shared/Header';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
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
import React from 'react';
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
const seedEvent: PlacecardEvent = { 'id': '1', 'name': 'testEvent', 'date': '03/08/2022', 'location': 'My House', 'perTable': 4, 'tables': seedTables, 'guestList': seedGuests};
[window.loggedInState, window.setLoggedIn] = React.useState(true);

// TODO: We can switch window global variables for React context or use Redux for a global store
[window.loggedInState, window.setLoggedIn] = React.useState(false);
[window.firstNameState, window.setFirstName] = React.useState('Apple');
[window.lastNameState, window.setLastName] = React.useState('Zebra');
[window.phoneState, window.setPhone] = React.useState('555-555-5555');
[window.emailState, window.setEmail] = React.useState('email@email.com');
[window.profPicState, window.setProfPic] = React.useState(null);
[window.profPicNameState, window.setProfPicName] = React.useState('None');
[window.eventsState, window.setEvents] = React.useState([seedEvent]);
[window.activeEvent, window.setActiveEvent] = React.useState(seedEvent);
[window.inviteesState, window.setInvitees] = React.useState(seedGuests);
[window.dislikedInvitees, window.setDisliked] = React.useState([]);
[window.likedInvitees, window.setLiked] = React.useState([]);
[window.lovedInvitees, window.setLoved] = React.useState([]);
[window.curGroupID, window.setGroupID] = React.useState('223');



function App() {
  document.title = 'Placecard';


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
   * Survey Confirmation
   * Not Found: redesigned :|
   * Edit Profile
   * Edit Details: redesigned :)
   * Create Event: redesigned :) 
   * user dashboard
   * guest list
   * edit survey
   * sent confirmation
   * event dashboard: redesigned
   * seating dashboard
   */

  const history = createBrowserHistory();
  return (
  <FirebaseAuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <section className='content'>
          <Header stick={history.location.pathname=='/'}/>
          <Switch>
            <Route exact path='/' component={ Home }/> 
            <Route exact path='/newAccount' component={ NewAccount }/>
            <Route exact path='/beginSurvey' component={ GuestConfirmation }/>
            {/* <Route exact path='/surveyPt1' component={ SurveyPt1WithAges }/> */}
            {/* <Route exact path='/surveyPt2' component={ SurveyPt2 }/> */}
            {/* <Route exact path='/surveyPt1' component={ SurveyPt1SitTogether }/> */}
            <Route exact path='/surveyInstructions' component={ SurveyInstructions }/>
            <Route exact path='/editGroup' component={ SurveyGroupPage }/>
            <Route exact path='/surveyDislikes' component={ SurveyDislikes }/>
            <Route exact path='/surveyLikes' component={ SurveyLikes }/>
            <Route exact path='/surveyIdealTable' component={ SurveyIdealTable }/>
            <Route exact path='/editSurveyResponses' component={ EditSurveyResponses }/>
            <Route exact path='/doneSurvey' component={ SurveyConf }/>
            <Route path="/404" component={ NotFound }/>
            {/* Authenticated routes below (user must be logged in to access) */}
            { window.loggedInState && (<Route exact path='/editProfile' component={ EditProfile }/>)}
            { window.loggedInState && (<Route exact path='/editDetails' component={ EditDetails }/>)}
            { window.loggedInState && (<Route exact path='/createEvent' component={ CreateEvent }/>)}
            { window.loggedInState && (<Route exact path='/userHome' component={ UserDashboard }/>)}
            { window.loggedInState && (<Route exact path='/uploadGuestList' component={ GuestList }/>)}
            { window.loggedInState && (<Route exact path='/editSurvey' component={ EditSurvey }/>)}
            { window.loggedInState && (<Route exact path='/sentConf' component={ SentConf }/>)}
            { window.loggedInState && (<Route exact path='/eventDash' component={ EventDashboard }/>)}
            { window.loggedInState && (<Route exact path='/seatDash' component={ SeatingDashboard }/>)}
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
