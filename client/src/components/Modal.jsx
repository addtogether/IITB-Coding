import React from 'react';

import { Chip } from '@mui/material';
import { AccessTime, CalendarMonth, Api } from '@mui/icons-material'
import { Close } from '@mui/icons-material';

const Modal = ({ showPopup, setShowPopup, data }) => {

    return (
        <div className={`modalDiv ${showPopup ? "show" : ""}`}>
            
            <div className={`modalComponent ${showPopup ? "show" : ""}`}>
            
                <Close
                    className="modal-close-btn"
                    onClick={() => setShowPopup(false)}
                />
            
                <div className="modalContent">
            
                    <div className="pillLayout">
                        <Chip
                            className="chip failure"
                            icon={<Api className="chip-icon" />}
                            label={'API Call ID: ' + data?.apiCallId}
                        />
                        <Chip
                            className="chip primary"
                            icon={<CalendarMonth className="chip-icon" />}
                            label={new Date(data?.apiCallTime).toLocaleString()}
                        />
                        <Chip
                            className="chip primary"
                            icon={<AccessTime className="chip-icon" />}
                            label={'Time: ' + data?.apiResponseTime + 's'}
                        />
                    </div>
                    
                    <div className="decodedText">
                        <h5>Decoded Text</h5>
                        <h4>{ data.apiResponse?.decodedText }</h4>
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

export default Modal;