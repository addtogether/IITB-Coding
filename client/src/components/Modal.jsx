import React from 'react'

import { Chip } from '@mui/material';
import { Group, AccessTime, Numbers } from '@mui/icons-material'
import { Close } from '@mui/icons-material'

const Modal = ({ showPopup, setShowPopup, data }) => {

    return (
        <div className={`modalDiv ${showPopup ? "show" : ""}`}>
            
            <div className={`modalComponent ${showPopup ? "show" : ""}`}>
            
                <Close
                    className="modal-close-btn"
                    onClick={(e) => setShowPopup(false)}
                />
            
                <div className="modalContent">
            
                    <div className="pillLayout">
                        <Chip
                            className="chip failure"
                            icon={<Group className="chip-icon" />}
                            label={'Group: ' + data?.id}
                        />
                        <Chip
                            className="chip primary"
                            icon={<AccessTime className="chip-icon" />}
                            label={'Time: ' + data?.apiResponseTime + ' mins'}
                        />
                        <Chip
                            className="chip info"
                            icon={<Numbers className="chip-icon" />}
                            label="Count: 10"
                        />
                    </div>
                    
                    <div className="decodedText">
                        <h4>Decoded Text</h4>
                        <h2>{ data.apiResponse?.decodedText }</h2>
                    </div>

                    <div className="countCardContainer">
                        <div className="countCard success">
                            <div className="left">{ data.apiResponse?.insertion }</div>
                            <div className="right">
                                <h4>Insertion</h4>
                            </div>
                        </div>
                        <div className="countCard failure">
                            <div className="left">{ data.apiResponse?.deletion }</div>
                            <div className="right">
                                <h4>Deletion</h4>
                            </div>
                        </div>
                        <div className="countCard info">
                            <div className="left">{ data.apiResponse?.substitution }</div>
                            <div className="right">
                                <h4>Substitution</h4>
                            </div>
                        </div>
                        <div className="countCard primary">
                            <div className="left">{ data.apiResponse?.wcpm }</div>
                            <div className="right">
                                <h4>WCPM</h4>
                            </div>
                        </div>
                        <div className="countCard warning">
                            <div className="left">{ data.apiResponse?.speechRate }</div>
                            <div className="right">
                                <h4>Speech Rate</h4>
                            </div>
                        </div>
                        <div className="countCard dark">
                            <div className="left">{ data.apiResponse?.pronunciation }</div>
                            <div className="right">
                                <h4>Pronounciation</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal