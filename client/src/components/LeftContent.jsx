import React from 'react'

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";

import { Upload } from "@mui/icons-material";

import dataLeft from "../data/dataLeft";

const LeftContent = () => {

    const [fromDate, setFromDate] = React.useState(null);
    const [toDate, setToDate] = React.useState(null);
    const [storyId, setStoryId] = React.useState(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [selectedRow, setSelectedRow] = React.useState({});

    const columns = [
        { field: 'id', headerName: 'Request ID', width: 140 },
        { field: 'requestTime', headerName: 'Request Time', width: 180 },
        { field: 'requestStatus', headerName: 'Status', width: 180 },
    ]

    const handleFromChange = (value) => {
        setFromDate(value)
        console.log('From: ', value);
    }

    const handleToChange = (value) => {
        setToDate(value);
        console.log('To: ', value);
    }
    
    const handleContainingChange = (e) => {
        setStoryId(e.target.value);
        console.log('Containing Story: ', e.target.value);
    }

    const handleRowClick = (row) => {
        setSelectedRow(row);
        console.log('Row clicked: ', selectedRow?.id);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div className="leftContent">
            <h1>JSON Upload History</h1>

            <form action="#" className="filters">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                            label="From"
                            value={fromDate}
                            onChange={(newValue) => handleFromChange(newValue)}
                        />
                        <DatePicker
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
                        onChange={handleContainingChange}
                    >
                        <MenuItem selected>Containing Story</MenuItem>
                        <MenuItem value={"1"}>1</MenuItem>
                        <MenuItem value={"2"}>2</MenuItem>
                        <MenuItem value={"3"}>3</MenuItem>
                    </Select>
                </FormControl>
            </form>

            <div style={{ height: 265, width: "100%" }}>
                <TableContainer sx={{ maxHeight: 220 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow >
                                {
                                    columns.map((column) => (
                                        <TableCell
                                            key={column.field}
                                            // align={column.align}
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
                                dataLeft
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {

                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id} onClick={() => handleRowClick(row)}>
                                            <TableCell>{ row['id'] }</TableCell>
                                            <TableCell>{ row['requestTime'] }</TableCell>
                                            <TableCell>{ row['requestStatus'] }</TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[3, 5, 10]}
                    component="div"
                    count={dataLeft.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>

            <form action="/post" className="uploadFile">
                <Button variant="text" component="label" className="btn">
                    <Upload />
                    <label class="form-label" for="customFile">
                        Upload your JSON file here
                    </label>
                    <input hidden type="file" class="form-control" id="customFile" />
                </Button>
                <Button variant="contained" component="label" className="btn">
                    Submit
                </Button>
            </form>
        </div>
    );
}

export default LeftContent