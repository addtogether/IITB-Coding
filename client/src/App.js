import React, { useState } from 'react';
import './App.css';

import Navbar from './components/Navbar';

import LeftContent from './components/LeftContent';
import RightContent from './components/RightContent';

import Modal from './components/Modal';

function App() {

  const [showPopup, setShowPopup] = useState(false);
  const [data, setData] = useState({});

  return (
    <div className="App">
      <Navbar />
      <div className="MainContent">
        <LeftContent />
        <RightContent setShowPopup={setShowPopup} setData={setData}/>
        <Modal showPopup={showPopup} setShowPopup={setShowPopup} data = {data} />
      </div>
    </div>
  );
}

export default App;