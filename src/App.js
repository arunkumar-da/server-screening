import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/login/login';
import Form from './components/form/form';
import Rules from './components/rules/rules';
import Exit from './components/exit/exit';
import Quiz from './components/quiz/quiz';
import Summa from './components/summa/summa';
import { AppProvider } from './components/form/appcontext/appcontext';
const App = () => {
  const [isExamCompleted, setIsExamCompleted] = useState(false);

  const AppContent = () => {
    const navigate = useNavigate();

    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === 'Alt' || event.key === 'Tab' || event.key === 'Escape' || event.key ==='F11') {
          alert(`${event.key} We detected an attempt to "Switch windows or Switch Tabs". Please refrain from switching windows or tabs. Doing so, will automatically end the Assessment.`);
          console.log(`${event.key} key pressed!`);
          navigate('/exit');
          event.preventDefault();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [navigate]);

    const requestFullscreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch((err) => console.log(err));
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen().catch((err) => console.log(err));
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen().catch((err) => console.log(err));
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen().catch((err) => console.log(err));
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (!isExamCompleted) {
          requestFullscreen();
        } else {
          window.close();
        }
      }
    };

    const handleUserInteraction = (event) => {
      requestFullscreen();
     
    };

    useEffect(() => {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('msfullscreenchange', handleFullscreenChange);
      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('keydown', handleUserInteraction);
      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      };
    }, [isExamCompleted]);

    return (
      <div className="App" tabIndex={0} >
        <AppProvider>
        <Routes>
          <Route path="/" element={<Form />} />
          {/* <Route path="/" element={<Summa />} /> */}
          <Route path="/form" element={<Form />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/quiz" element={<Quiz setIsExamCompleted={setIsExamCompleted} />} />
          <Route path="/exit" element={<Exit />} />
        </Routes>
        </AppProvider>
      </div>
    );
  };

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
