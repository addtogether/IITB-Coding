import React from "react";

import {
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";

import {
    Group,
    AccessTime,
    Numbers,
    Pending,
    Done,
    SmsFailedOutlined,
    WarningAmber,
} from "@mui/icons-material";

import dataRight from "../data/dataRight";

const RightContent = ({ setShowPopup, setData }) => {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "audioId", headerName: "Audio ID", width: 140 },
        { field: "storyId", headerName: "Story ID", width: 140 },
        { field: "apiCallStatus", headerName: "API Call Status", width: 140 },
        { field: "apiCallTime", headerName: "API Call Time", width: 180 },
        { field: "apiCallId", headerName: "API Call ID", width: 140 },
        { field: "apiResponseTime", headerName: "API Response Time", width: 140 },
        { field: "apiResponse", headerName: "API Response", width: 140 }
    ];

  return (
    <div className="rightContent">
        <h1>Selected JSON API Detail</h1>

        {dataRight.length > 0 ? (
            <>
                <div className="pillLayout">
                    <Chip
                        className="chip dark"
                        icon={<Group className="chip-icon" />}
                        label="Group: Unique-ID-1"
                    />
                    <Chip
                        className="chip primary"
                        icon={<AccessTime className="chip-icon" />}
                        label="15 mins"
                    />
                    <Chip
                        className="chip info"
                        icon={<Numbers className="chip-icon" />}
                        label="Count: 10"
                    />
                    <Chip
                        className="chip warning"
                        icon={<Pending className="chip-icon" />}
                        label="Pending: 2"
                    />
                    <Chip
                        className="chip success"
                        icon={<Done className="chip-icon" />}
                        label="Success: 7"
                        color="success"
                    />
                    <Chip
                        className="chip failure"
                        icon={<SmsFailedOutlined className="chip-icon" />}
                        label="Failed: 10"
                    />
                </div>
                <div style={{ height: 470, width: "100%", cursor: "pointer" }}>
                    <TableContainer sx={{ maxHeight: 410 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
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
                                    dataRight
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {

                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                <TableCell>{ row?.id }</TableCell>
                                                <TableCell>{ row?.audioId }</TableCell>
                                                <TableCell>{ row?.storyId }</TableCell>
                                                <TableCell>{ row?.apiCallStatus }</TableCell>
                                                <TableCell>{ row?.apiCallTime }</TableCell>
                                                <TableCell>{ row?.apiCallId }</TableCell>
                                                <TableCell>{ row?.apiResponseTime }</TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="small"
                                                        onClick={() => {
                                                            setShowPopup(true);
                                                            setData(row);
                                                        }}
                                                    >
                                                        View
                                                    </Button>
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
                        count={dataRight.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                </div>
            </>
        ) : (
            <div className="blankScreen">
                <WarningAmber
                    style={{ width: 100, height: 100, color: "var(--warning-color)" }}
                />
                <h2>Please select a json request to see it's details</h2>
            </div>
        )}
    </div>
  );
};

export default RightContent;