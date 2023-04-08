import React, { useState } from "react";
import { io } from 'socket.io-client'

import { Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { Group, AccessTime, Numbers, DriveFileMove, Pending, Done, SmsFailedOutlined, WarningAmber } from "@mui/icons-material";

// const baseUrl = 'http://localhost:5000'
const baseUrl = 'https://iitb-coding-server.onrender.com'
const socket = io(baseUrl);

const RightContent = ({ selectedRow, leftData, rightData, setRightData, setShowPopup, setModalData }) => {
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    var selectedRowIndex = leftData.map((obj) => obj._id).indexOf(`${selectedRow}`);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    socket.on('status-process', (data) => {
        var rIdx = rightData.map((obj) => obj._id).indexOf(`${data._id}`);
        rightData[rIdx] = data;
        setRightData([...rightData]);
    })
    
      socket.on('status-done', (updateRight) => {
        var rIdx = rightData.map((obj) => obj._id).indexOf(`${updateRight._id}`);
        rightData[rIdx] = updateRight;
        setRightData([...rightData]);
    })

    const columns = [
        { field: "audioId", align: 'center', headerName: "Audio ID", width: 140 },
        { field: "storyId", align: 'center', headerName: "Story ID", width: 140 },
        { field: "apiCallStatus", align: 'center', headerName: "API Call Status", width: 140 },
        { field: "apiCallTime", align: 'center', headerName: "API Call Time", width: 180 },
        { field: "apiCallId", align: 'center', headerName: "API Call ID", width: 140 },
        { field: "apiResponseTime", align: 'center', headerName: "API Response Time", width: 180 },
        { field: "apiResponse", align: 'center', headerName: "API Response", width: 140 }
    ];

    return (
        <div className="rightContent">
            <h1>Selected JSON API Detail</h1>
    
            { 
                leftData && selectedRow !== null 
                ? (
                    <>
                        <div className="pillLayout">
                            <Chip
                                className="chip dark"
                                icon={<Group className="chip-icon" />}
                                label={'Group: ' + leftData[selectedRowIndex]._id }
                            />
                            <Chip
                                className="chip primary"
                                icon={<AccessTime className="chip-icon" />}
                                label={leftData[selectedRowIndex].requestDuration}
                            />
                            <Chip
                                className="chip info"
                                icon={<Numbers className="chip-icon" />}
                                label={'Count: ' + leftData[selectedRowIndex].count}
                            />
                            <Chip
                                className="chip warning"
                                icon={<Pending className="chip-icon" />}
                                label={'Pending: ' + leftData[selectedRowIndex].pending}
                            />
                            <Chip
                                className="chip success"
                                icon={<Done className="chip-icon" />}
                                label={'Success: ' + leftData[selectedRowIndex].success}
                            />
                            <Chip
                                className="chip failure"
                                icon={<SmsFailedOutlined className="chip-icon" />}
                                label={'Failed: ' + leftData[selectedRowIndex].failed}
                            />
                        </div>
                        <div style={{ height: 430, width: "100%", cursor: "pointer" }}>
                            <TableContainer sx={{ maxHeight: 400 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {
                                                columns.map((column) => (
                                                    <TableCell
                                                        key={column.field}
                                                        align={column.align}
                                                        style={{ minWidth: column.width }}
                                                    >
                                                        {column.headerName}
                                                    </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            rightData
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
        
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id} >
                                                        <TableCell style = {{ textAlign: 'center' }} >{ row.audioId }</TableCell>
                                                        <TableCell style = {{ textAlign: 'center' }} >{ row.storyId }</TableCell>
                                                        <TableCell style = {{ textAlign: 'center' }} >
                                                            {
                                                                row.apiCallStatus === 'In Queue' && (
                                                                    <Chip
                                                                        size='small'
                                                                        className="chip"
                                                                        style={{
                                                                            backgroundColor: 'var(--info-color)',
                                                                            color: '#fff',
                                                                            fontWeight: 'bold',
                                                                            paddingLeft: '5px'
                                                                        }}
                                                                        label={row.apiCallStatus}
                                                                        icon={<DriveFileMove className="chip-icon" style = {{ color: '#fff' }} />}
                                                                    />
                                                                )
                                                            }
                                                            {
                                                                row.apiCallStatus === 'Processing' && (
                                                                    <Chip
                                                                        size='small'
                                                                        className="chip"
                                                                        style={{
                                                                            backgroundColor: 'var(--warning-color)',
                                                                            color: '#fff',
                                                                            fontWeight: 'bold'
                                                                        }}
                                                                        label={row.apiCallStatus}
                                                                        icon={<Pending className="chip-icon" style = {{ color: '#fff' }} />}
                                                                    />
                                                                )
                                                            }
                                                            {
                                                                row.apiCallStatus === 'Done' && (
                                                                    <Chip
                                                                        size='small'
                                                                        className="chip"
                                                                        style={{
                                                                            backgroundColor: 'var(--success-color)',
                                                                            color: '#fff',
                                                                            fontWeight: 'bold',
                                                                        }}
                                                                        label={row.apiCallStatus}
                                                                        icon={<Done className="chip-icon" style = {{ color: '#fff' }} />}
                                                                    />
                                                                )
                                                            }
                                                            {
                                                                row.apiCallStatus === 'Failed' && (
                                                                    <Chip
                                                                        size='small'
                                                                        className="chip"
                                                                        style={{
                                                                            backgroundColor: 'var(--failure-color)',
                                                                            color: '#fff',
                                                                            fontWeight: 'bold',
                                                                        }}
                                                                        label={row.apiCallStatus}
                                                                        icon={<SmsFailedOutlined className="chip-icon" style = {{ color: '#fff' }} />}
                                                                    />
                                                                )
                                                            }
                                                        </TableCell>
                                                        <TableCell style = {{ textAlign: 'center' }} >
                                                            {
                                                                row.apiCallTime !== '-' 
                                                                ? new Date(row.apiCallTime).toLocaleString()
                                                                : row.apiCallTime
                                                            }
                                                        </TableCell>
                                                        <TableCell style = {{ textAlign: 'center' }} >{ row.apiCallId }</TableCell>
                                                        <TableCell style = {{ textAlign: 'center' }} >
                                                            { row.apiResponseTime === '-' ? row.apiResponseTime : row.apiResponseTime + 's'}
                                                        </TableCell>
                                                        <TableCell style = {{ textAlign: 'center' }} >
                                                            {
                                                                row.apiCallStatus !== 'Done' 
                                                                ? (
                                                                    <Button
                                                                        disabled
                                                                        variant="contained"
                                                                        style = {{ textTransform: 'capitalize' }}
                                                                        size="small"
                                                                        onClick={() => {
                                                                            setShowPopup(true);
                                                                            setModalData(row);
                                                                        }}
                                                                    >
                                                                        View
                                                                    </Button>
                                                                )
                                                                : (
                                                                    <Button
                                                                        variant="contained"
                                                                        style = {{ textTransform: 'capitalize' }}
                                                                        size="small"
                                                                        onClick={() => {
                                                                            setShowPopup(true);
                                                                            setModalData(row);
                                                                        }}
                                                                    >
                                                                        View
                                                                    </Button>
                                                                )
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 15]}
                                component="div"
                                count={rightData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
        
                        </div>
                    </>
                ) 
                : (
                    <div className="blankScreen">
                        <WarningAmber
                            style={{ width: 100, height: 100, color: "var(--warning-color)" }}
                        />
                        <h2>Please select a json request to see it's details</h2>
                    </div>
                )
            }
        </div>
      );
};

export default RightContent;