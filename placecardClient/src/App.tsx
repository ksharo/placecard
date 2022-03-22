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
import { SentConf } from './components/confirmationPages/SentConf';
import { EditDetails } from './components/editPages/EditDetails';
import { EditProfile } from './components/editPages/EditProfile';
import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { FirebaseAuthProvider } from "./components/firebase/AuthProvider";
import { FullSurvey } from './components/guestPages/FullSurvey';
import { EditGuestList } from './components/editPages/EditGuestList';

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
  [window.dislikedInvitees, window.setDisliked] = React.useState([{id:'none', name:''}]);
  [window.likedInvitees, window.setLiked] = React.useState([{id:'none', name:''}]);
  [window.lovedInvitees, window.setLoved] = React.useState([{id:'none', name:''}]);
  [window.curGroupID, window.setGroupID] = React.useState(undefined);
  [window.curGuest, window.setCurGuest] = React.useState(undefined);
  [window.uidState, window.setUID] = React.useState('');
  useEffect(() => {
    const getEvents = async () => {
      try {
        if (window.uidState != undefined && window.uidState.trim() != '') {
          const eventFetch = await fetch('http://localhost:3001/events/users/'+window.uidState);
          const fetchedEvents = await eventFetch.json();
          const events: PlacecardEvent[] = []; 
          for (let post of fetchedEvents) {
            const tables: any[] = post.tables;
            const guests: Invitee[] = [];
            let respondents = 0;
            try {
              const guestFetch = await fetch('http://localhost:3001/events/guests/'+post._id);
              const fetchedGuests = await guestFetch.json();
              for (let guest of fetchedGuests) {
                const newGuest = {
                  id: guest._id,
                  name: guest.first_name + ' ' + guest.last_name,
                  groupID: guest.group_id,
                  groupName: guest.group_name,
                  groupSize: guest.party_size,
                  contact: guest.email,
                }
                if (guest.survey_response != undefined && (guest.survey_response.disliked.length != 0 || guest.survey_response.ideal.length != 0 || guest.survey_response.liked.length != 0 )) {
                  respondents += Number(guest.party_size);
                }
                guests.push(newGuest);
                for (let x of tables) {
                  if (x.guests.includes(newGuest.id)) {
                    x.guests[x.guests.indexOf(newGuest.id)] = newGuest;
                    break;
                  }
                }
              }
              const event = {'id': post._id, 'uid': post._userId, 'name': post.event_name, 'date': (new Date(post.event_start_time)).toLocaleString().split(',')[0], 'time': (new Date(post.event_start_time)).toTimeString().split(' ')[0], 'location': post.location, 'tables': tables, 'perTable': post.attendees_per_table , 'guestList': guests, 'respondents': respondents, 'surveys': post.surveys_sent};
              events.push(event);
            }
            catch (e) {
              console.error("Error: could not fetch guests for event with id " + post._id + ". " + e);
            }
          }

        window.setEvents([...events]);
        if (events.length > 0) {
          window.setActiveEvent(events[0]);
          window.setInvitees(events[0].guestList);
        }
      }
    }
    catch (e){
      console.error('Error: Could not load events for user. ' + e);
    }

    };
    getEvents();
  }, [window.uidState]);

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
            <Route exact path='/editGuestList' component={ EditGuestList }/>
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
