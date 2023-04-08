import React, {useState, useEffect} from 'react';
import { io } from 'socket.io-client'

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios"

import { MenuItem, Select, FormControl, InputLabel, Button, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Chip } from "@mui/material";

import { Upload, Done, Pending } from "@mui/icons-material";

// const baseUrl = 'http://localhost:5000'
const baseUrl = 'https://iitb-coding-server.onrender.com'
const socket = io(baseUrl);

const LeftContent = ({ handleFileUpload, selectedFile, setSelectedFile, setSelectedRow, getRightData, leftData, setLeftData }) => {

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [storyId, setStoryId] = useState(null);
    const [allStoryIds,setAllStoryIds] = useState([]);
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);

    socket.on('update-count', (updateLeft) => {
        var lIdx = leftData.map((obj) => obj._id).indexOf(`${updateLeft._id}`);
        leftData[lIdx] = updateLeft;
        setLeftData([...leftData]);
    })

    socket.on('final-done', (data) => {
        var lIdx = leftData.map((obj) => obj._id).indexOf(`${data._id}`);
        leftData[lIdx] = data;
        setLeftData([...leftData]);
    })

    useEffect(() => {
        getAllStoryIds();
    }, [leftData, fromDate, toDate]);

    useEffect(() => {
        if (fromDate !== null || toDate !== null || storyId !== null) {
          filter();
        }
    }, [fromDate, toDate, storyId]);

    // GET request for getting the story ids to populate Dropdown Options
    const getAllStoryIds = async () => {
        try {
            const response = await axios.post(`${baseUrl}/api/storyId`, {
                from: fromDate,
                to: toDate
            });
            if (response.data.status === "success") setAllStoryIds(response.data.data)
        }
        catch (error) {
            console.log(error)
        }
    }

    // Post request to filter the Left Data Table
    const filter = async () => {
        try {
            const response = await axios.post(`${baseUrl}/api/filter`, {
                from: fromDate,
                to: toDate,
                storyId: storyId
            });
            if (response.data.status === "success") setLeftData(response.data.data)
        }
        catch(error) {
            console.log(error)
        }
    }

    const handleFromChange = (value) => {
        setFromDate(value)
    }

    const handleToChange = (value) => {
        setToDate(value);
    };
    
    const handleContainingChange = (value) => {
        setStoryId(value);
    };

    const handleRowClick = (value) => {
        setSelectedRow(value);
        getRightData(value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const columns = [
        { field: 'id', headerName: 'Request ID', align: 'center', width: 160 },
        { field: 'requestTime', headerName: 'Request Time', align: 'center', width: 140 },
        { field: 'requestStatus', headerName: 'Status', align: 'center', width: 70 },
    ];

    return (
        <div className="leftContent">
            <h1>JSON Upload History</h1>

            <form action="#" className="filters">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                            style={{ width: '100% !important' }}
                            label="From"
                            value={fromDate}
                            onChange={(newValue) => handleFromChange(newValue)}
                        />
                        <DatePicker
                            style={{ width: '100% important' }}
                            label="To"
                            value={toDate}
                            onChange={(newValue) => handleToChange(newValue)}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-autowidth-label">
                        Containing Story
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth-label"
                        value={storyId}
                        label="Select your Field"
                        onChange={(e) => handleContainingChange(e.target.value)}
                    >
                        <MenuItem value={"all"} selected>All</MenuItem>
                        {
                            allStoryIds
                            .map((id) => {
                                return <MenuItem value={id} key={id}>{id}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
            </form>

            <div style={{ height: 265, width: "100%" }}>
                <TableContainer sx={{ maxHeight: 230 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow >
                                {
                                    columns.map((column) => (
                                        <TableCell
                                            key={ column.field }
                                            align = { column.align }
                                            style={{ minWidth: column.width }}
                                        >
                                            { column.headerName }
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { 
                                leftData.length > 0 
                                ? (
                                    leftData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {

                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row._id} onClick={() => handleRowClick(row._id)}>
                                                <TableCell style={{ textAlign: 'center' }}>{ row._id }</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>{ new Date(row.requestTime).toLocaleString() }</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>
                                                    {
                                                        row.requestStatus === 'Processing' 
                                                        ? (
                                                            <Chip
                                                                size='small'
                                                                className="chip"
                                                                style={{ backgroundColor: 'var(--warning-color)', color: '#fff', fontWeight: 'bold' }}
                                                                label={ row.requestStatus }
                                                                icon={<Pending className="chip-icon" style = {{ color: '#fff' }} />}
                                                            />
                                                        ) 
                                                        : (
                                                            <Chip
                                                                size='small'
                                                                className="chip"
                                                                style={{ backgroundColor: 'var(--success-color)', color: '#fff', fontWeight: 'bold' }}
                                                                label={ row.requestStatus }
                                                                icon={<Done className="chip-icon" style = {{ color: '#fff' }} />}
                                                            />
                                                        )
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )
                                : (
                                    <TableRow hover role="checkbox" tabIndex={-1}>
                                        <TableCell colSpan={3} style={{ textAlign: 'center' }}>No Data Found</TableCell>
                                    </TableRow>
                                )
                            } 
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[3, 5, 10]}
                    component="div"
                    count={leftData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>

            <form action="/post" className="uploadFile">
                <Button variant="text" component="label" style={{ textTransform: 'capitalize', gap: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                    <Upload />
                    <label className="form-label" htmlFor="customFile" style={{ cursor: 'pointer' }}>
                        { selectedFile ? selectedFile.name : 'Upload your Json file here' }
                    </label>
                    <input  
                        hidden
                        type="file"
                        accept=".json, application/json"
                        onChange={(event) => setSelectedFile(event.target.files[0])}
                        className="form-control btn"
                        id="customFile" 
                    />
                </Button>
                <Button  onClick={handleFileUpload} variant="contained" component="label" className="btn">
                    Submit
                </Button>
            </form>
        </div>
    );
}

export default LeftContent;