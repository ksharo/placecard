import './App.css';
import { Home } from './components/home/Home';
import { Footer } from './components/shared/Footer';
import { Header } from './components/shared/Header';
import {
  BrowserRouter as Router
} from "react-router-dom";

function App() {
  document.title = 'Placecard';
  return (
    <>
    <Header></Header>
    <Router>
    <Home></Home>
    </Router>
    <Footer></Footer>
    </>
  );
}

export default App;
