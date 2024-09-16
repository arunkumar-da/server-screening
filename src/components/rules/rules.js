import React, { useContext, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import './rules.css';
import Button from '@mui/material/Button';
import clock from '../images/clocks.png';
import code from '../images/code.png';
import file from '../images/file.png';
import lock from '../images/lock.png';
import { Card } from 'antd';
import axios from 'axios';
import { AppContext } from '../form/appcontext/appcontext';
import { useNavigate } from 'react-router-dom';

const RulesComponent = () => {
  const { name } = useContext(AppContext);
  const { username } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
   
    localStorage.setItem('testName', name);
  }, [name]);


  const storedName = localStorage.getItem('testName');

  const handleClick = async () => {
    try {
      // Send data to server
      await axios.post('http://localhost:5001/sendEmailToAllEmployees', { name: username });
      
      // Navigate to the quiz page after successful response
      navigate('/quiz');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <Card className="rules-card">
      <div className='left'>
        <div className='a'>
          <img className='image' src={file} alt="File Icon" />
          <h2 className='text'>Type:</h2>
          <h3 className='detail'>Video Assessment</h3>
          <Divider className='div'/>
        </div>
        <div className='b'>
          <img className='image' src={clock} alt="Clock Icon" />
          <h2 className='text'>Duration:</h2>
          <h3 className='detail'>25:00</h3>
          <Divider className='div'/>
        </div>
        <div className='c'>
          <img className='image' src={code} alt="Code Icon" />
          <h2 className='text'>Languages:</h2>
          <h3 className='detail'>English</h3>
          <Divider className='div'/>
        </div>
        <div className='d'>
          <img className='image' src={lock} alt="Lock Icon" />
          <h2 className='text'>Title:</h2>
          <h3 className='detail'>{storedName || name}</h3>
        </div>
      </div>
      <div className='rh'>
        <h2 className='rh' style={{ color: 'rgba(105, 121, 248, 1)' }}>Summary of the  Test</h2>
        <p className='pl'>1. Environment and Equipment:</p>
        <p className='rp'>
          • Ensure you’re in a calm, quiet space to avoid interruptions. Use a desktop or laptop for better stability and performance
        </p>
        <p className='pl'>2. Audio and Video Quality:</p>
        <p className='rp'>
          • Use a high-quality webcam for a clear image and a good microphone for clear audio.
        </p>
        <p className='pl'>3. Mobile Phone:</p>
        <p className='rp'>
          • Keep your mobile phone away and not in use during the exam to prevent distractions.
        </p>
        <p className='pl'>4. Lifelines and Warnings:</p>
        <p className='rp'>
          • You will receive 1 warning and have 3 lifelines. The exam will end if all lifelines are exhausted.
        </p>
        <p className='pl'>5. Academic Integrity:</p>
        <p className='rp'>
          • Maintain academic honesty. Avoid cheating and unauthorized materials.
        </p>
        <p className='pl'>6. Internet Connection:</p>
        <p className='rp'>
          • Ensure a stable and reliable internet connection.
        </p>
        <button className='button' onClick={handleClick}>
          Get Started
        </button>
      </div>
    </Card>
  );
};

export default RulesComponent;
