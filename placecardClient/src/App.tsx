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
import { SurveyPt1SitTogether } from './components/guestPages/SurveyPt1SitTogether';
import { SurveyDislikes } from './components/guestPages/SurveyDislikes';
import { SurveyIdealTable } from './components/guestPages/SurveyIdealTable';
import { SurveyLikes } from './components/guestPages/SurveyLikes';
import { SurveyInstructions } from './components/guestPages/SurveyInstructions';
import { EditSurveyResponses } from './components/guestPages/EditSurveyResponses';

function App() {
  const seedGuests: Invitee[] = [{id: '00', name: 'Sharo Family', size: 6}, {id: '11', name: 'Choy Family', size: 5}, {id: '22', name: 'Alex Rubino', size: 1}, {id: '33', name: 'Simon Gao', size: 1}, {id: '44', name: 'Gil Austria', size: 1}, {id: '55', name: 'Jayson Infante', size: 1}];
  const seedTables: Table[] = [{id: '0', name: 'Table 1', guests: []}, {id: '1', name: 'Table 2', guests: []}, {id: '2', name: 'Table 3', guests: []}];
  const seedEvent: PlacecardEvent = { 'id': '1', 'name': 'testEvent', 'date': '03/08/2022', 'location': 'My House', 'numAttend': 6, 'perTable': 2, 'tables': seedTables, 'guestList': seedGuests};
  [window.loggedInState, window.setLoggedIn] = React.useState(true);
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

  document.title = 'Placecard';

  const loggedInRoutes = (<>
      <Route exact path='/editProfile' component={ EditProfile }/>
      <Route exact path='/createEvent' component={ CreateEvent }/>
      <Route exact path='/userHome' component={ UserDashboard }/>
      <Route exact path='/uploadGuestList' component={ GuestList }/>
      <Route exact path='/editSurvey' component={ EditSurvey }/>
      <Route exact path='/sentConf' component={ SentConf }/>
      <Route exact path='/eventDash' component={ EventDashboard }/>
      <Route exact path='/editDetails' component={ EditDetails }/>
      <Route exact path='/seatDash' component={ SeatingDashboard }/>
      </>);

  return (
      <body>
        <Router>
          <section className='content'>
          <Header/>
          <Switch>
            <Route exact path='/' component={ Home }/>
            <Route exact path='/newAccount' component={ NewAccount }/>
            <Route exact path='/beginSurvey' component={ GuestConfirmation }/>
            {/* <Route exact path='/surveyPt1' component={ SurveyPt1WithAges }/> */}
            {/* <Route exact path='/surveyPt2' component={ SurveyPt2 }/> */}
            <Route exact path='/surveyPt1' component={ SurveyPt1SitTogether }/>
            <Route exact path='/surveyInstructions' component={ SurveyInstructions }/>
            <Route exact path='/surveyDislikes' component={ SurveyDislikes }/>
            <Route exact path='/surveyLikes' component={ SurveyLikes }/>
            <Route exact path='/surveyIdealTable' component={ SurveyIdealTable }/>
            <Route exact path='/editSurveyResponses' component={ EditSurveyResponses }/>
            <Route exact path='/doneSurvey' component={ SurveyConf }/>
            <Route path="/404" component={ NotFound }/>
            { window.loggedInState ? loggedInRoutes : <Redirect to='/'/>}
            <Redirect to="/404"/>
          </Switch>
          </section>
          <Footer/>
        </Router>
      </body>
  );
}

export default App;
