import './App.css';
import { Home } from './components/home/Home';
import { Footer } from './components/shared/Footer';
import { Header } from './components/shared/Header';
import {
  BrowserRouter as Router, 
  Route, 
  Switch,
} from "react-router-dom";
import { NewAccount } from './components/forms/NewAccount';

function App() {
  document.title = 'Placecard';
  return (
    <Router>
      <body>
        <Header/>
        <Switch>
          <Route exact path='/' component={ Home }/>
          <Route exact path='/newAccount' component={ NewAccount }/>
        </Switch>
        <Footer/>
      </body>
    </Router>
  );
}

export default App;
