import React, { useEffect, useRef, useState } from "react";
import "../../../src/style.css";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { makeStyles } from "@mui/styles";
import { getManageReport } from "../../redux/actions/sipPortal/sipPortal_reportAction";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { DateTimePicker } from "@mui/x-date-pickers";
import { callStatusMessages } from "../../pages/Tooltips";
dayjs.extend(utc);
dayjs.extend(timezone);
const useStyles = makeStyles({
  root: {
    "& .super-app-theme--header": {
      position: "sticky",
      left: 0,
      backgroundColor: "#0c367a",
      color: "#fff",
      zIndex: 1,
    },
    "& .super-app-theme--cell": {
      position: "sticky",
      left: 0,
      backgroundColor: "#fff",
      zIndex: 1,
    },
    formControl: {
      "& .MuiInputBase-root": {
        color: "#666",
        borderColor: "transparent",
        borderWidth: "1px",
        borderStyle: "solid",
        height: "45px",
        minWidth: "120px",
        justifyContent: "center",
      },
      "& .MuiSelect-select.MuiSelect-select": {
        paddingRight: "0px",
      },
      "& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
        {
          // top: "-4px"
          padding: "11.5px 14px",
        },
    },
    select: {
      width: "auto",
      fontSize: "12px",
      "&:focus": {
        backgroundColor: "transparent",
      },
    },
    selectIcon: {
      position: "relative",
      color: "#6EC177",
      fontSize: "14px",
    },
    paper: {
      borderRadius: 12,
      marginTop: 8,
    },
    list: {
      paddingTop: 0,
      paddingBottom: 0,
      "& li": {
        fontWeight: 200,
        paddingTop: 8,
        paddingBottom: 8,
        fontSize: "12px",
      },
      "& li.Mui-selected": {
        color: "white",
        background: "#6EC177",
      },
      "& li.Mui-selected:hover": {
        background: "#6EC177",
      },
    },
  },
});

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiDataGrid-row": {
            minHeight: "auto", // Adjust row height to make it more compact
          },
        },
      },
      defaultProps: {
        density: "compact", // Set default density to compact
        exportButton: true,
      },
    },
  },
});

// const array = [
//   "TFN_SUSPENDED",
//   "SERVER_DOWN",
//   "CALLER_ABANDONED",
//   "CALL_TRANSFERED",
//   "CALL_ANSWER",
//   "TFN_USER_NOT_ACTIVE",
//   "CALLERID_BLOCKED_BY_USER",
//   "UNABLE_TO_JOIN_QUEUE",
//   "DESTINATION_BUSY",
//   "NOT_SUFFICIENT_FUNDS",
//   "TFN_NOT_ACTIVE",
//   "TRIED_ALL_CARRIER_NO_SUCCESS",
//   "NORMAL_HANGUP",
//   "DESTINATION_FAILED",
//   "USER_NOT_FOUND",
//   "TFN_USER_SUSPENDED",
//   "NO_ANSWER",
//   "CONGESTION",
//   "DESTINATION_CONGESTION",
//   "ANSWERED",
//   "FASTAGI_DOWN",
// ];

function Report() {
  const classes = useStyles();
  const [currentAudio, setCurrentAudio] = useState(null);
  const railwayZone = "Asia/Kolkata"; // Replace with your desired timezone
    const [fromDate, setFromDate] = useState(
      dayjs().tz(railwayZone).startOf("day").format("DD/MM/YYYY HH:mm")
    );
    const [toDate, setToDate] = useState(
      dayjs().tz(railwayZone).endOf("day").format("DD/MM/YYYY HH:mm") // Default to 23:59
    );
  const [callDirection, setCallDirection] = useState("");
  const [didNumber, setDidNumber] = useState("");
  const [destination, setDestination] = useState("");
  const [response, setResponse] = useState("");
  const [callerId, setCallerId] = useState("");
  const [status, setStatus] = useState("");
  const audioRefs = useRef({}); // Store references to audio elements
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isXs = useMediaQuery(theme.breakpoints.only("xs")); // < 600px

  const handleFromDateChange = (date) => {
    if (dayjs(date, "DD/MM/YYYY HH:mm", true).isValid()) {
      // Convert the selected date to the desired format before updating state
      setFromDate(dayjs(date).format("DD/MM/YYYY HH:mm"));
    } else {
      setFromDate(null);
    }
  };

  const handleToDateChange = (date) => {
    if (dayjs(date, "DD/MM/YYYY HH:mm", true).isValid()) {
      // Convert the selected date to the desired format before updating state
      setToDate(dayjs(date).format("DD/MM/YYYY HH:mm"));
    } else {
      setToDate(null);
    }
  };

  useEffect(() => {
    let data = JSON.stringify({
      from_date: dayjs().tz(railwayZone).startOf("day").format("YYYY-MM-DD HH:MM"),
      to_date: dayjs().tz(railwayZone).endOf("day").format("YYYY-MM-DD HH:MM"),
    });
    dispatch(getManageReport(data));
  }, [dispatch, response]);

  const handleSearch = (e) => {
    const formattedFromDate = fromDate
      ? dayjs(fromDate, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm")
      : null;
    const formattedToDate = toDate
      ? dayjs(toDate, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm")
      : null;
    let data = JSON.stringify({
      from_date: formattedFromDate,
      to_date: formattedToDate,
      call_direction: callDirection,
      did_number: didNumber,
      destination: destination,
      caller_id: callerId,
      hangup_reason: status,
    });
    dispatch(getManageReport(data));
  };

  const handleReset = (e) => {
    setFromDate(null);
    setToDate(null);
    setCallDirection("");
    setDidNumber("");
    setDestination("");
    setResponse("data");
    setCallerId("");
    setStatus("");
  };

  // Function to handle audio clicks
  const handleAudioClick = (audioSrc) => {
    const audio = audioRefs.current[audioSrc];
    // const audio = document.getElementById(audioSrc);
    // Check if the clicked audio is already the current audio
    if (currentAudio === audio) {
      // Toggle play/pause
      if (audio.pause) {
        audio.play();
      } else {
        audio.pause();
      }
    } else {
      // If a different audio is clicked, pause the current audio (if any) and play the new one
      if (currentAudio) {
        currentAudio.pause();
      }
      setCurrentAudio(audio);
      audio.play();
    }
  };

  const handleAudioPause = () => {
    // setCurrentAudio(null);
  };
  // const handleDownload = (recordingPath) => {
  //   // You can implement download logic here
  //   // For example, create a link with the recording path and click it programmatically
  //   const link = document.createElement("a");
  //   link.href = recordingPath;
  //   link.download = recordingPath.split("/").pop(); // Set filename to the last part of the path
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const getStatusMessage = (key) => {
    const status = callStatusMessages.find((item) => item.key === key);
    return status ? status.value : "Unknown Status";
  };

  const CallStatusTooltip = ({ statusKey }) => {
    const isMobile = useMediaQuery("(max-width:600px)");
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      if (isMobile) {
        setAnchorEl(event.currentTarget);
      }
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        {isMobile ? (
          <>
            <span
              onClick={handleClick}
              style={{
                fontSize: "14px",
                color: "#1976d2",
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "120px",
              }}
            >
              {statusKey}
            </span>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <Typography sx={{ p: 2, maxWidth: "200px", fontSize: "12px" }}>
                {getStatusMessage(statusKey)}
              </Typography>
            </Popover>
          </>
        ) : (
          <Tooltip title={getStatusMessage(statusKey)} arrow>
            <span
              style={{
                fontSize: "14px",
                color: "#1976d2",
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "200px",
              }}
            >
              {statusKey}
            </span>
          </Tooltip>
        )}
      </>
    );
  };

  const columns = [
    {
      field: "callerid",
      headerName: "Caller ID",
      headerClassName: "custom-header",
      width: 120,
      headerAlign: "center",
      align: "center",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "destination_number",
      headerName: "Service",
      //type: "number",
      width: 120,
      headerAlign: "center",
      align: "center",
      // headerAlign: "center",
      // align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <p
              style={{
                fontWeight: "500",
                color: "orange",
                margin: "0",
                textTransform: "capitalize",
              }}
            >
              {params?.row?.destination_number}
            </p>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <CallStatusTooltip statusKey={params.value} />,
      headerClassName: "custom-header",
    },

    {
      field: "call_status",
      headerName: "Call Status",
      width: 120,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => {
        return (
          <>
            <span>
              {params.row.call_status === "ANSWER" ? (
                <span style={{ color: "green" }}>
                  {params.row.call_status}
                </span>
              ) : (
                <span style={{ color: "red" }}>{params.row.call_status}</span>
              )}
            </span>
          </>
        );
      },
    },
   
    {
      field: "did_tfn",
      headerName: "DID Number",
      width: 130,
      //cellClassName: "name-column--cell",
      //headerClassName: 'super-app-theme--header'
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      // editable: true
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 100,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },
    // {
    //       field: "billing_type",
    //       headerName: "Bill Type",
    //       width: isXs ? 55 : 60,
    //       minWidth: 55,
    //       maxWidth: 60,
    //       headerAlign: "center",
    //       align: "center",
    //       headerClassName: "custom-header",
    //       renderHeader: () => (
    //         <Typography
    //           variant="body2"
    //           sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
    //         >
    //           Bill Type
    //         </Typography>
    //       ),
    //       renderCell: (params) => (
    //         <Typography
    //           variant="body2"
    //           sx={{ fontSize: "calc(0.5rem + 0.2vw)" }} // Match header size or set your own
    //         >
    //           {params.value}
    //         </Typography>
    //       ),
    //     },
    {
      field: "billsec",
      headerName: "Bill Sec",
      width: 100,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },
    
    {
      field: "call_direction",
      headerName: "Call Direction",
      width: 120,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },
    // {
    //   field: "answered_by",
    //   headerName: "Answered By",
    //   width: 230,
    //   headerAlign: "center",
    //   align: "center",
    //   headerClassName: "custom-header",
    // },
    
    // {
    //   field: "answer_at",
    //   headerName: "Call Answer Time",
    //   width: 160,
    //   headerAlign: "center",
    //   align: "center",
    //   headerClassName: "custom-header",
    //   //valueFormatter
    //   renderCell: (params) => {
    //     if (params.value !== null) {
    //       const date = new Date(params.value);
    //       var day = date.getUTCDate();
    //       var month = date.getUTCMonth() + 1; // Month starts from 0
    //       var year = date.getUTCFullYear();
    //       var hours = date.getUTCHours();
    //       var minutes = date.getUTCMinutes();
    //       var seconds = date.getUTCSeconds();

    //       // Formatting single-digit day/month with leading zero if needed
    //       day = (day < 10 ? "0" : "") + day;
    //       month = (month < 10 ? "0" : "") + month;

    //       // Formatting single-digit hours/minutes/seconds with leading zero if needed
    //       hours = (hours < 10 ? "0" : "") + hours;
    //       minutes = (minutes < 10 ? "0" : "") + minutes;
    //       seconds = (seconds < 10 ? "0" : "") + seconds;
    //       return (
    //         <>
    //           <span style={{ color: "blue" }}>
    //             {day}/{month}/{year}
    //           </span>
    //           &nbsp;
    //           <span style={{ color: "green" }}>
    //             {hours}:{minutes}:{seconds}
    //           </span>
    //         </>
    //       );
    //     }
    //   },
    // },

    {
      field: "start_at",
      headerName: "Call Start Time",
      width: 160,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => {
        if (params.value !== null) {
          const date = new Date(params.value);
          var day = date.getUTCDate();
          var month = date.getUTCMonth() + 1; // Month starts from 0
          var year = date.getUTCFullYear();
          var hours = date.getUTCHours();
          var minutes = date.getUTCMinutes();
          var seconds = date.getUTCSeconds();

          // Formatting single-digit day/month with leading zero if needed
          day = (day < 10 ? "0" : "") + day;
          month = (month < 10 ? "0" : "") + month;

          // Formatting single-digit hours/minutes/seconds with leading zero if needed
          hours = (hours < 10 ? "0" : "") + hours;
          minutes = (minutes < 10 ? "0" : "") + minutes;
          seconds = (seconds < 10 ? "0" : "") + seconds;
          return (
            <>
              <span style={{ color: "blue" }}>
                {day}/{month}/{year}
              </span>
              &nbsp;
              <span style={{ color: "green" }}>
                {hours}:{minutes}:{seconds}
              </span>
            </>
          );
        }
      },
    },

    {
      field: "end_at",
      headerName: "Call End Time",
      width: 160,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => {
        if (params.value !== null) {
          const date = new Date(params.value);
          var day = date.getUTCDate();
          var month = date.getUTCMonth() + 1; // Month starts from 0
          var year = date.getUTCFullYear();
          var hours = date.getUTCHours();
          var minutes = date.getUTCMinutes();
          var seconds = date.getUTCSeconds();

          // Formatting single-digit day/month with leading zero if needed
          day = (day < 10 ? "0" : "") + day;
          month = (month < 10 ? "0" : "") + month;

          // Formatting single-digit hours/minutes/seconds with leading zero if needed
          hours = (hours < 10 ? "0" : "") + hours;
          minutes = (minutes < 10 ? "0" : "") + minutes;
          seconds = (seconds < 10 ? "0" : "") + seconds;
          return (
            <>
              <span style={{ color: "blue" }}>
                {day}/{month}/{year}
              </span>
              &nbsp;
              <span style={{ color: "green" }}>
                {hours}:{minutes}:{seconds}
              </span>
            </>
          );
        }
      },
    },
    // {
    //   field: "dialstring",
    //   headerName: "Dial String",
    //   width: 415,
    //   headerAlign: "center",
    //   align: "center",
    //   headerClassName: "custom-header",
    // },
    // {
    //   field: "hangupsource",
    //   headerName: "Hangup Source",
    //   width: 215,
    //   headerAlign: "center",
    //   align: "center",
    //   headerClassName: "custom-header",
    // },
    {
      field: "recording_path",
      headerName: "Recording",
      width: 250,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => {
        if (params.row.billsec >= 0 && params.row.recording_path !== null) {
          console.log('params.row.billsec', params.row.recording_path)
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <audio
                ref={(audio) =>
                  (audioRefs.current[params.row.recording_path] = audio)
                }
                id={params.row.recording_path}
                src={params.row.recording_path}
                controls
                controlsList="download"
                onPlay={() => handleAudioClick(params.row.recording_path)}
                onPause={handleAudioPause}
                style={{ padding: "10px" }}
              />

              {/* <IconButton onClick={() => handleDownload(params.row.recording_path)}>
          <GetAppIcon />
        </IconButton> */}
            </div>
          );
        } else {
          return <></>;
        }
      },
    },
    // {
    //   field: "uniqueid",
    //   headerName: "Unique Id",
    //   width: 180,
    //   headerAlign: "center",
    //   align: "center",
    //   headerClassName: "custom-header",
    // },
  ];

  const rows = [];
  state?.allManageReport?.managereport?.data &&
  state?.allManageReport?.managereport?.data?.forEach((item, index) => {
      rows.push({
        id: index + 1,
        did_tfn: item.tfn_number,
        destination_number: item.service_type,
        uniqueid: item.uniqueid,
        callerid: item.callerid,
        user_uuid: item?.user_uuid,
        call_direction: item?.call_direction,
        disposition: item?.disposition,
        duration: item?.duration,
        billsec: item?.billsec,
        answer_at: item.answer_at,
        time: item.answer_at,
        start_at: item.start_at,
        start_time: item.start_at,
        end_at: item.end_at,
        recording_path: item.recording_path,
        status: item.status,
        destination_type: item.destination_type,
        destination: item.destination,
        username: item.username,
        answered_by: item.answered_by,
        transfered_to: item.transfered_to,
        call_status: item.call_status,
        hangupsource: item.hangupsource,
        dialstring: item.dialstring,
        billing_type: item.billing_type,
      });
    });

  //8921BF78-AFCF-46C0-B0C4-19F702D39CCA
  //8921bf78-afcf-46c0-b0c4-19f702d39cca
  return (
    <>
      <div className="main">
        <section className="sidebar-sec">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="">
                  {/* <!----> */}
                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="pills-home"
                      role="tabpanel"
                      aria-labelledby="pills-home-tab"
                    >
                      {/* <!--role-contet--> */}
                      <div className="tab_cntnt_box">
                        <div
                          className="cntnt_title"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "end",
                          }}
                        >
                          <div>
                            <h3>Report</h3>
                          </div>
                        </div>

                        <Grid
                          container
                          className="cdr_filter_row"
                          style={{ padding: "0px 0 10px" }}
                        >
                          <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <TextField
                              className={classes.formControl}
                              style={{
                                width: "98%",
                                margin: " 5px 0 5px 0",
                              }}
                              type="text"
                              label="Caller ID"
                              variant="outlined"
                              value={callerId}
                              onChange={(e) => setCallerId(e.target.value)}
                            />
                          </Grid>
                          {/* <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <TextField
                              className={classes.formControl}
                              style={{
                                width: "98%",
                                margin: " 5px 0 5px 0",
                              }}
                              type="text"
                              label="Extension"
                              variant="outlined"
                              name="userName"
                            />
                          </Grid>
                          <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <TextField
                              className={classes.formControl}
                              style={{
                                width: "98%",
                                margin: " 5px 0 5px 0",
                              }}
                              type="text"
                              label="Duration"
                              variant="outlined"
                              name="userName"
                            />
                          </Grid>*/}
                          <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <TextField
                              className={classes.formControl}
                              style={{
                                width: "98%",
                                margin: " 5px 0 5px 0",
                              }}
                              type="text"
                              label="DID Number"
                              variant="outlined"
                              value={didNumber}
                              onChange={(e) => {
                                setDidNumber(e.target.value);
                              }}
                            />
                          </Grid>

                          {/* <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <TextField
                              className={classes.formControl}
                              style={{
                                width: "98%",
                                margin: " 5px 0 5px 0",
                              }}
                              type="text"
                              label="Destination"
                              variant="outlined"
                              value={destination}
                              onChange={(e) => {
                                setDestination(e.target.value);
                              }}
                            />
                          </Grid> */}
                          <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <FormControl
                              className={classes.formControl}
                              fullWidth
                              style={{ width: "98.5%", margin: "7px 0" }}
                            >
                              <InputLabel id="demo-simple-select-label">
                                Call Direction
                              </InputLabel>

                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Call Direction"
                                helperText="Select the language."
                                style={{ textAlign: "left" }}
                                value={callDirection}
                                onChange={(e) => {
                                  setCallDirection(e.target.value);
                                }}
                                required
                              >
                                <MenuItem value={"Inbound"}>Inbound</MenuItem>
                                <MenuItem value={"Outbound"}>Outbound</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          {/* <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <FormControl
                              className={classes.formControl}
                              fullWidth
                              style={{ width: "98.5%", margin: "7px 0px" }}
                            >
                              <InputLabel id="demo-simple-select-label">
                                Status
                              </InputLabel>

                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Status"
                                helperText="Select the language."
                                style={{ textAlign: "left" }}
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                              >
                                {array.map((item, index) => (
                                  <MenuItem key={index} value={item}>
                                    {item}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid> */}

                          <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                            }}
                          >
                            <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                              className={classes.formControl}
                            >
                              <DemoContainer
                                components={["DatePicker"]}
                                sx={{ width: "100%" }}
                              >
                                <DateTimePicker
                                  label="From Date"
                                  value={
                                    fromDate
                                      ? dayjs(fromDate, "DD/MM/YYYY HH:mm") // "DD/MM/YYYY hh:mm A" (format used for 11:01 AM or PM)
                                      : null
                                  } // Convert selectedDate to a dayjs object
                                  onChange={handleFromDateChange}
                                  renderInput={(props) => (
                                    <TextField {...props} />
                                  )}
                                  format="DD/MM/YYYY HH:mm"
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </Grid>
                          <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                            }}
                          >
                            <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                              className={classes.formControl}
                            >
                              <DemoContainer
                                components={["DatePicker"]}
                                sx={{ width: "100%" }}
                              >
                                <DateTimePicker
                                  label="To Date"
                                  value={
                                    toDate ? dayjs(toDate, "DD/MM/YYYY HH:mm") : null
                                  } // Convert selectedDate to a dayjs object
                                  onChange={handleToDateChange}
                                  renderInput={(props) => (
                                    <TextField {...props} />
                                  )}
                                  format="DD/MM/YYYY HH:mm"
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </Grid>

                          <Grid
                            xl={9}
                            lg={9}
                            md={9}
                            sm={12}
                            xs={12}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "end",
                              padding: " 0 0 0px",
                            }}
                          >
                            <IconButton
                              className="filter_search_btn"
                              style={{
                                marginLeft: "0 !important",
                                background: "green !important",
                              }}
                              onClick={handleSearch}
                            >
                              Search &nbsp;
                              <SearchIcon />
                            </IconButton>
                            <IconButton
                              className="filter_reset_btn"
                              style={{
                                marginLeft: "0 !important",
                                backgroundColor: "grey !important",
                              }}
                              onClick={handleReset}
                            >
                              Reset &nbsp;
                              <RestartAltIcon />
                            </IconButton>
                          </Grid>
                        </Grid>

                        <ThemeProvider theme={theme}>
                          <div style={{ height: "100%", width: "100%" }}>
                            <DataGrid
                              rows={rows}
                              columns={columns}
                              components={{ Toolbar: GridToolbar }}
                              autoHeight
                              disableColumnResize={false}
                              disableRowSelectionOnClick
                              hideFooterPagination={window.innerWidth < 600}
                              sx={{
                                "& .MuiDataGrid-cell": {
                                  fontSize: {
                                    xs: "12px",
                                    sm: "14px",
                                    md: "13px",
                                  },
                                  wordBreak: "break-word !important",
                                  whiteSpace: "break-spaces !important",
                                },
                              }}
                            />
                          </div>
                        </ThemeProvider>
                      </div>
                    </div>

                    {/* <!----> */}
                    {/* 
            <!----> */}
                  </div>
                  {/* <!----> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Report;
