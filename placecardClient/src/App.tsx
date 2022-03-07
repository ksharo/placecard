import './App.css';
/* Import Other Components */
import { Home } from './components/home/Home';
/* Import Form Components */
import { NewAccount } from './components/forms/NewAccount';
import { CreateEvent } from './components/forms/CreateEvent';
import { EditEvent } from './components/forms/EditEvent';
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
import { SurveyPt1 } from './components/guestPages/SurveyPt1';
import { SurveyPt2 } from './components/guestPages/SurveyPt2';
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
  [window.loggedInState, window.setLoggedIn] = React.useState(true);
  [window.firstNameState, window.setFirstName] = React.useState('Apple');
  [window.lastNameState, window.setLastName] = React.useState('Zebra');
  [window.phoneState, window.setPhone] = React.useState('555-555-5555');
  [window.emailState, window.setEmail] = React.useState('email@email.com');
  [window.profPicState, window.setProfPic] = React.useState(null);
  [window.profPicNameState, window.setProfPicName] = React.useState('None');
  [window.eventsState, window.setEvents] = React.useState([]);
  [window.activeEvent, window.setActiveEvent] = React.useState(null);
  [window.inviteesState, window.setInvitees] = React.useState([{id: '0', name: 'Sharo Family', size: 6}, {id: '1', name: 'Choy Family', size: 5}, {id: '2', name: 'Alex Rubino', size: 1}, {id: '3', name: 'Simon Gao', size: 1}, {id: '4', name: 'Gil Austria', size: 1}, {id: '5', name: 'Jayson Infante', size: 1}]);
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
            <Route exact path='/eventDash' component={ EventDashboard }/>
            <Route exact path='/createEvent' component={ CreateEvent }/>
            <Route exact path='/editEvent' component={ EditEvent }/>
            <Route exact path='/userHome' component={ UserDashboard }/>
            <Route exact path='/uploadGuestList' component={ GuestList }/>
            <Route exact path='/seatDash' component={ SeatingDashboard }/>
            <Route exact path='/beginSurvey' component={ GuestConfirmation }/>
            <Route exact path='/surveyPt1' component={ SurveyPt1 }/>
            <Route exact path='/surveyPt2' component={ SurveyPt2 }/>
            {/* <Route exact path='/surveyPt1' component={ SurveyPt1SitTogether }/> */}
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
