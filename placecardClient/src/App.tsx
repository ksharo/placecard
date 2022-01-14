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
import { SurveyPt1 } from './components/guestPages/SurveyPt1';
import { SurveyPt2 } from './components/guestPages/SurveyPt2';
import { SurveyConf } from './components/confirmationPages/SurveyConf';
import { SentConf } from './components/confirmationPages/SentConf';
import { EditDetails } from './components/editPages/EditDetails';
import { EditProfile } from './components/editPages/EditProfile';


function App() {
  document.title = 'Placecard';
  return (
    <Router>
      <body>
        <section className='content'>
        <Header/>
        <Switch>
          <Route exact path='/' component={ Home }/>
          <Route exact path='/editProfile' component={ EditProfile }/>
          <Route exact path='/newAccount' component={ NewAccount }/>
          <Route exact path='/createEvent' component={ CreateEvent }/>
          <Route exact path='/userHome' component={ UserDashboard }/>
          <Route exact path='/uploadGuestList' component={ GuestList }/>
          <Route exact path='/editSurvey' component={ EditSurvey }/>
          <Route exact path='/sentConf' component={ SentConf }/>
          <Route exact path='/eventDash' component={ EventDashboard }/>
          <Route exact path='/editDetails' component={ EditDetails }/>
          <Route exact path='/seatDash' component={ SeatingDashboard }/>
          <Route exact path='/beginSurvey' component={ GuestConfirmation }/>
          <Route exact path='/surveyPt1' component={ SurveyPt1 }/>
          <Route exact path='/surveyPt2' component={ SurveyPt2 }/>
          <Route exact path='/doneSurvey' component={ SurveyConf }/>
          <Route path="/404" component={ NotFound }/>
          <Redirect to="/404"/>
        </Switch>
        </section>
        <Footer/>
      </body>
    </Router>
  );
}

export default App;
