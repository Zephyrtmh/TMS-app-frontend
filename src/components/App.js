import React from 'react';
import Navigation from './Navigation'
import LoginPage from './LoginPage';
import LandingPage from './LandingPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { authUser } from '../utils/authenticate';



function App() {
  return (
    <>
      <Navigation />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={authUser(<LandingPage />)}/>
        </Routes>
      </BrowserRouter>
    </>  
  );
}

export default App;