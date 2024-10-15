import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Header from './components/header/header'; // Ensure this path is correct
import { Helmet } from 'react-helmet';

document.body.style.backgroundColor = '#143D64';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Helmet>
      <title>Skill Assessment</title>
      <link rel="icon" href="https://static.vecteezy.com/system/resources/previews/012/627/922/non_2x/3d-play-video-icon-with-..." /> {/* Use correct URL for favicon */}
    </Helmet>
    <Header />
    <App />
  </React.StrictMode>
);

reportWebVitals();

