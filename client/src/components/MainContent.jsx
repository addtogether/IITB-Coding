import React from 'react'

import '../App.css'
import LeftContent from './LeftContent';
import RightContent from './RightContent';

const MainContent = () => {
      
    return (
        <div className="MainContent">
            <LeftContent />
            <RightContent />
        </div>
    )
}

export default MainContent