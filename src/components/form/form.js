import React, { useState,useContext,useEffect } from 'react';
import TextField from '@mui/material/TextField'; 
import './form.css';
import Button from '@mui/material/Button';
import image from '../images/file-text.png';
import Quiz  from '../quiz/quiz';
import { Link, Navigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import swal from 'sweetalert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { colors } from '@mui/material';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom'
import axios from 'axios';
import { Card, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './appcontext/appcontext';
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

const WhiteCard = () => {
  const [role, setRole] = useState('');

  const [skills,setSkills] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [file, setFile] = useState('');
  const [isRoleEntered, setIsRoleEntered] = useState(false);
  const [isEmailEntered, setIsEmailEntered] = useState(false);
  const [isPhonenumberEntered, setIsPhonenumberEntered] = useState(false);

  const onChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {

    const formData = new FormData();
    formData.append('file', file);
    formData.append('role', role);
    formData.append('email', email);
    formData.append('phonenumber', phonenumber);
    formData.append('skills',skills);

    try {
      // Send POST request with form data
      await axios.post('http://localhost:3007/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Form submitted successfully!');
      // Reset form fields after submission
      setRole('');
      setEmail('');
      setPhonenumber('');
      setFile('');
      swal("Form submitted successfully");
 
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  const { name, setName } = useContext(AppContext);
  const {username,setusername} = useContext(AppContext);
  const {useremail,setuseremail} = useContext(AppContext);
  const {userphonenumber,setuserphonenumber} = useContext(AppContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const roleName = query.get('role');

  useEffect(() => {
    if (roleName) {
      setName(roleName);
    }
  }, [roleName, setName]);
  
  useEffect(() => {
    if (role) {
      setusername(role);
    }
  }, [role, setusername]);
  useEffect(() => {
    if (email) {
      setuseremail(email);
    }
  }, [email, setuseremail]);
  useEffect(() => {
    if (phonenumber) {
      setuserphonenumber(phonenumber);
    }
  }, [phonenumber, setuserphonenumber]);
  const navigate = useNavigate();
  const handleClick = async (e) => {
    e.preventDefault(); // Prevent default behavior of the event (e.g., form submission)
    await handleSubmit(); // Submit the form data
    navigate('/rules'); // Navigate to '/rules'
  };
  return (
    
    <Card  className="whitecard">
  
       <p className='url'>{name ? ` ${name}` : 'Name not provided in URL'}</p>
      <form onSubmit={handleSubmit}>
      <div className="input-container">
  <Input
    className='textfield'
    value={role}
    onChange={(e) => setRole(e.target.value)}
    sx={{ borderRadius: isRoleEntered ? '30%' : '0%' }} // Apply border radius conditionally
    placeholder={isRoleEntered ? '' : 'Enter Your Name'} // Placeholder based on conditional state
    inputProps={{
      style: {
        borderRadius: isRoleEntered ? '60%' : '0%', // Apply border radius conditionally
      },
    }}
  />
  <Input
    className='textfield'
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    sx={{ borderRadius: isEmailEntered ? '30%' : '0%' }} // Apply border radius conditionally
    placeholder={isEmailEntered ? '' : 'Enter your Email'} // Placeholder based on conditional state
    inputProps={{
      style: {
        borderRadius: isEmailEntered ? '30%' : '0%', // Apply border radius conditionally
      },
    }}
  />
  <Input
    className='textfield'
    value={phonenumber}
    onChange={(e) => setPhonenumber(e.target.value)}
    sx={{ borderRadius: isPhonenumberEntered ? '30%' : '0%' }} // Apply border radius conditionally
    placeholder={isPhonenumberEntered ? '' : 'Enter your Phone Number'} // Placeholder based on conditional state
    inputProps={{
      style: {
        borderRadius: isPhonenumberEntered ? '30%' : '0%', // Apply border radius conditionally
      },
    }}
  />
</div>

         
            <div  sx={{ width: 230}}>
            <textarea
          className='card'
          value={skills}
          placeholder='Enter Your Skills'
          onChange={(e) => setSkills(e.target.value)}
          multiline
          rows={4}
          sx={{ width: 430, marginTop: 2, borderRadius: '30%' }} // Adjust the border radius as per design
          variant="outlined"
        />
        {/* <img src={image} alt="Company Logo" sx={{  }}/> 
      <h2 style={{ color: 'rgba(105, 121, 248, 1)' }}>Upload The Resume Here</h2>

     <Button
  component="label"
  role={undefined}
  variant="contained"
  tabIndex={-1}
  startIcon={<CloudUploadIcon />}
  onChange={onChange}
>
  Upload file
  <VisuallyHiddenInput type="file" />
</Button> */}
    </div> 
    

    <button type='button' onClick={handleClick} className="beautiful-button"> 
    Next
</button>

      </form>
    
    
    
      </Card>
  );
};

export default WhiteCard;
