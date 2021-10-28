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
  Route, 
  Switch,
} from "react-router-dom";
import { UserDashboard } from './components/dashboards/UserDashboard';


function App() {
  document.title = 'Placecard';
  return (
    <Router>
      <body>
        <Header/>
        <Switch>
          <Route exact path='/' component={ Home }/>
          <Route exact path='/newAccount' component={ NewAccount }/>
          <Route exact path='/createEvent' component={ CreateEvent }/>
          <Route exact path='/userHome' component={ UserDashboard }/>
        </Switch>
        <Footer/>
      </body>
    </Router>
  );
}

export default App;
