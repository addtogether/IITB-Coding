import React, { useState, useEffect } from 'react';
import './App.css';

import Navbar from './components/Navbar';
import LeftContent from './components/LeftContent';
import RightContent from './components/RightContent';
import Modal from './components/Modal';
import axios from 'axios'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const baseUrl = 'http://localhost:5000'
const baseUrl = 'https://iitb-coding-server.onrender.com'

function App() {

  const [showPopup, setShowPopup] = useState(false);
  const [modalData, setModalData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [leftData, setLeftData] = useState([]);
  const [rightData, setRightData] = useState([]);

  useEffect(() => {
    getFiles();
  },[])

  // Helper function for handling file upload
  const handleFileUpload = async (e) => {
    if (!selectedFile)
      return toast.warn('Please select a file to upload');

    if (selectedFile.type !== "application/json")
      return toast.warn('Please upload only JSON files');

    toast.success('File Uploaded Successfully');

    const reader = new FileReader();
    reader.readAsText(selectedFile);
    reader.onload = () => {
      const fileContents = JSON.parse(reader.result).data; 
      addFile(fileContents);
    }
  }

  // GET request for history of all files uploaded
  const getFiles = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/file`);
      if(response.data.status === "success") setLeftData(response.data.data);
    }
    catch(err) {
      console.log(err);
    }
  }

  // Post request to send the parsed Data (Left Data)
  const addFile = async (data) => {
      try {
        const response = await axios.post(`${baseUrl}/api/file`, data);
        if(response.data.status === 'success') {
          setSelectedFile(null);
          setLeftData(prevData => [response.data.leftData, ...prevData]);
          setRightData(response.data.rightData);
        }
      }
      catch(err) {
        console.log(err)
      }
  }

  // GET request for getting the requested id file data
  const getRightData = async (requestId) => {
      try {
        const response = await axios.get(`${baseUrl}/api/rightData/${requestId}`);
        if(response.data.status === "success")  { 
          setRightData(response.data.rightData);
        }
      }
      catch(err) {
        console.log(err)
      }
  }

  return (
    <div className="App">
      <ToastContainer />
      <Navbar />
      <div className="MainContent">
        <LeftContent
          handleFileUpload={handleFileUpload}
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
          setSelectedRow={setSelectedRow}
          getRightData={getRightData}
          leftData = {leftData}
          setLeftData= {setLeftData}
        />
        <RightContent
          selectedRow={selectedRow}
          leftData={leftData}
          rightData = {rightData}
          setShowPopup={setShowPopup}
          setModalData={setModalData}
          setRightData={setRightData}
        />
        <Modal
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          data={modalData}
        />
      </div>
    </div>
  );
}

export default App;