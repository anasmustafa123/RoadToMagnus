import './App.css';
import SignUp from './components/SignUp';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp></SignUp>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
