import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import NoteState from './context/notes/NoteState';
import Alert from './components/Alert';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPass from './components/ForgotPass';
import 'bootstrap/dist/css/bootstrap.css';
import LoadingBar from 'react-top-loading-bar'
export const host = process.env.REACT_APP_HOST;
function App() {
  const [alert, setAlert] = useState(null);
  const [progress, setProgress] = useState(0);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  }
  return (
    <>
      <NoteState>
        <Router>
          <Navbar setProgress={setProgress} />
          <LoadingBar height={3} color='#f11946' progress={progress}/>
          <Alert alert={alert} />
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Home showAlert={showAlert} setProgress={setProgress} />} />
              <Route exact path="/about" element={<About />} setProgress={setProgress} />
              <Route exact path="/login" element={<Login showAlert={showAlert} setProgress={setProgress} />} />
              <Route exact path="/signup" element={<SignUp showAlert={showAlert} setProgress={setProgress} />} />
              <Route exact path="/forgotPass" element={<ForgotPass showAlert={showAlert} setProgress={setProgress} />} />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
