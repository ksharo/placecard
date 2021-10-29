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
import { SeatingDashboard } from './components/dashboards/seatDash/SeatingDashboard';


function App() {
  document.title = 'Placecard';
  return (
    <Router>
      <body>
        <Header/>
        <Switch>
          <Route exact path='/' component={ Home }/>
          <Route exact path='/newAccount' component={ NewAccount }/>
          <Route exact path='/eventDash' component={ EventDashboard }/>
          <Route exact path='/createEvent' component={ CreateEvent }/>
          <Route exact path='/userHome' component={ UserDashboard }/>
          <Route exact path='/seatDash' component={ SeatingDashboard }/>
          <Route path="/404" component={ NotFound }/>
          <Redirect to="/404"/>
        </Switch>
        <Footer/>
      </body>
    </Router>
  );
}

export default App;
