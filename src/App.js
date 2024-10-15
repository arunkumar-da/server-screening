import React, { useEffect, useContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/login/login';
import Form from './components/form/form';
import Rules from './components/rules/rules';
import Exit from './components/exit/exit';
import Quiz from './components/quiz/quiz';
import Summa from './components/summa/summa';
import axios from 'axios';
import { AppProvider, AppContext } from './components/form/appcontext/appcontext';

const AppContent = () => {
  const navigate = useNavigate();
  const { username } = useContext(AppContext);
  const [isExamCompleted, setIsExamCompleted] = useState(false);

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (['Alt', 'Escape', 'F11'].includes(event.key)) {
        await axios.post('http://69.164.221.175:5000/sendWarningEmail', { name: username });
        alert(`Detected an attempt to switch windows/tabs. Please refrain from doing so.`);
        navigate('/exit');
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, username]);

  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(console.error);
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen().catch(console.error);
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen().catch(console.error);
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen().catch(console.error);
    }
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      if (!isExamCompleted) {
        requestFullscreen();
      } else {
        window.close();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isExamCompleted]);

  const handleUserInteraction = () => {
    requestFullscreen();
  };

  useEffect(() => {
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  return (
    <div className="App" tabIndex={0}>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/quiz" element={<Quiz setIsExamCompleted={setIsExamCompleted} />} />
        <Route path="/exit" element={<Exit />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <AppProvider>
      <AppContent />
    </AppProvider>
  </Router>
);

export default App;

