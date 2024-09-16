import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Header from './components/header/header'; // Ensure this path is correct
import Form from'./components/form/form'
document.body.style.backgroundColor = '#143D64'; 
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Header />
    
    <App />

  </React.StrictMode>
);

reportWebVitals();