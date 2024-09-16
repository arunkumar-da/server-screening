// AppContext.js

import React, { createContext, useState } from 'react';

// Create a context object
export const AppContext = createContext();

// Create a provider for the context
export const AppProvider = ({ children }) => {
  const [name, setName] = useState('');
  const [username,setusername] = useState('');
  const [useremail,setuseremail] = useState('');
  const [userphonenumber,setuserphonenumber] = useState('');
  return (
    <AppContext.Provider value={{ name, setName,username,setusername,useremail,setuseremail,userphonenumber,setuserphonenumber }}>
      {children}
    </AppContext.Provider>
  );
};
