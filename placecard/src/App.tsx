import './App.css';
import { Footer } from './components/shared/footer';
import { Header } from './components/shared/header';

function App() {
  document.title = 'Placecard';
  return (
    <>
    <Header></Header>
    <h1>Content</h1>
    <Footer></Footer>
    </>
  );
}

export default App;
