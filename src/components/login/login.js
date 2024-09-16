import React, { useState } from 'react';
import TextField from '@mui/material/TextField'; 
import './login.css';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { colors } from '@mui/material';
const WhiteCard = () => {
  const [name, setName] = useState('');
  const [isNameEntered, setIsNameEntered] = useState(false);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsNameEntered(true);
  };

  return (
    <div className="white-card">
      
      <h1 className='title'>Get Started Now</h1>
      <h2 className='details'>Name</h2>
      
  
      <form onSubmit={handleSubmit}>
        <TextField
          className='textfield'
          value={name}
          onChange={handleNameChange}
          sx={{ width: 430, borderRadius: isNameEntered ? '30%' : '0%' }} // Apply border radius conditionally
          InputProps={{
            style: {
              borderRadius: isNameEntered ? '60%' : '0%', // Apply border radius conditionally
            },
            placeholder: isNameEntered ? '' : 'Enter your name', // Hide placeholder when name entered
          }}
        />

      </form>
      <h2 className='details'>Phone Number</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          className='textfield'
          value={name}
          onChange={handleNameChange}
          sx={{ width: 430, borderRadius: isNameEntered ? '30%' : '0%' }} // Apply border radius conditionally
          InputProps={{
            style: {
              borderRadius: isNameEntered ? '30%' : '0%', // Apply border radius conditionally
            },
            placeholder: isNameEntered ? '' : 'Enter your name', // Hide placeholder when name entered
          }}
        />

      </form>
      <h2 className='details'>Token</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          className='textfield'
          value={name}
          onChange={handleNameChange}
          sx={{ width: 430, borderRadius: isNameEntered ? '30%' : '0%' }} // Apply border radius conditionally
          InputProps={{
            style: {
              borderRadius: isNameEntered ? '30%' : '0%', // Apply border radius conditionally
            },
            placeholder: isNameEntered ? '' : 'Enter your name', // Hide placeholder when name entered
          }}
        />

      </form>
      <Link to="/form">  <button variant="contained"  className='login-button' >
  Submit
    </button></Link>
    </div>
  );
};

export default WhiteCard;
