import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from "@mui/icons-material/Search";
import BlockIcon from "@mui/icons-material/Block";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  Modal,
  TextField,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  CircularProgress,
  Tooltip,
  InputAdornment,
  Grid,
  Popover,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
//import Frm from '../../pages/Frm';
import { useDispatch, useSelector } from "react-redux";
import {
  createBlockReport,
  getReport,
} from "../../redux/actions/adminPortal/reportAction";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "../../Switcher.scss";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { makeStyles } from "@mui/styles";
import dayjs from "dayjs";
import { getAllUsers } from "../../redux/actions/adminPortal/userAction";
import { getAdminUsersList } from "../../redux/actions/adminPortal/adminPortal_listAction";
import { DateTimePicker } from "@mui/x-date-pickers";
import { callStatusMessages } from "../../pages/Tooltips";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
dayjs.extend(utc);
dayjs.extend(timezone);

const drawerWidth = 240;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const useStyles = makeStyles({
  borderedGreen: {
    borderLeft: "3px solid green", // Add your border styling here
    boxShadow: "2px -1px 4px -3px #686868",
    margin: "4px 4px 1px 4px !important",
  },
  borderedRed: {
    borderLeft: "3px solid red", // Add your border styling here
    boxShadow: "2px -1px 4px -3px #686868",
    margin: "4px 4px 1px 4px !important",
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
    "& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root": {
      top: "-4px",
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
}

const array = [
  "TFN_SUSPENDED",
  "SERVER_DOWN",
  "CALLER_ABANDONED",
  "CALL_TRANSFERED",
  "CALL_ANSWER",
  "TFN_USER_NOT_ACTIVE",
  "CALLERID_BLOCKED_BY_USER",
  "UNABLE_TO_JOIN_QUEUE",
  "DESTINATION_BUSY",
  "NOT_SUFFICIENT_FUNDS",
  "TFN_NOT_ACTIVE",
  "TRIED_ALL_CARRIER_NO_SUCCESS",
  "NORMAL_HANGUP",
  "DESTINATION_FAILED",
  "USER_NOT_FOUND",
  "TFN_USER_SUSPENDED",
  "NO_ANSWER",
  "CONGESTION",
  "DESTINATION_CONGESTION",
  "ANSWERED",
  "FASTAGI_DOWN",
];

// =====Start Items====>

// =====End Items====>

function AdminReport({ colorThem }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [currentAudio, setCurrentAudio] = useState(null);
  const [userId, setUserId] = useState("");
  const railwayZone = "Asia/Kolkata"; // Replace with your desired timezone
  const [fromDate, setFromDate] = useState(
    dayjs().tz(railwayZone).startOf("day").format("DD/MM/YYYY HH:mm")
  );
  const [toDate, setToDate] = useState(
    dayjs().tz(railwayZone).endOf("day").format("DD/MM/YYYY HH:mm") // Default to 23:59
  );
  const [callDirection, setCallDirection] = useState("");
  const [callType, setCallType] = useState("");
  const [didNumber, setDidNumber] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const [callerId, setCallerId] = useState("");
  const [extension, setExtension] = useState("");
  const audioRefs = useRef({}); // Store references to audio elements
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isXs = useMediaQuery(theme.breakpoints.only("xs")); // < 600px

  const handleSelectionChange = (selection) => {
    setSelectedRows(selection);
  };

  const classes = useStyles();
  const handleFromDateChange = (date) => {
    if (dayjs(date, "DD/MM/YYYY HH:mm", true).isValid()) {
      setFromDate(dayjs(date).tz(railwayZone).format("DD/MM/YYYY HH:mm"));
    } else {
      setFromDate(null);
    }
  };

  const handleToDateChange = (date) => {
    if (dayjs(date, "DD/MM/YYYY HH:mm", true).isValid()) {
      setToDate(dayjs(date).tz(railwayZone).format("DD/MM/YYYY HH:mm"));
    } else {
      setToDate(null);
    }
  };
  useEffect(() => {
    let data = JSON.stringify({
      from_date: dayjs().tz(railwayZone).startOf("day").format("YYYY-MM-DD HH:MM"),
      to_date: dayjs().tz(railwayZone).endOf("day").format("YYYY-MM-DD HH:MM"),
    });
    dispatch(getReport(data));
    dispatch(getAllUsers(""));
    dispatch(getAdminUsersList());
  }, [dispatch, response]);

  useMemo(() => {
    if (state?.getAdminUsersList?.userList) {
      const usersArray = Object.keys(state?.getAdminUsersList?.userList)?.map(
        (key) => ({
          user_id: key,
          username: state?.getAdminUsersList?.userList[key],
        })
      );
      setUsers(usersArray);
    }
  }, [state?.getAdminUsersList?.userList]);

  const handleSearch = (e) => {
    // Convert fromDate and toDate to YYYY-MM-DD format
    const formattedFromDate = fromDate
      ? dayjs(fromDate, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm")
      : null;
    const formattedToDate = toDate
      ? dayjs(toDate, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm")
      : null;
    let data = JSON.stringify({
      caller_id: callerId,
      user_id: userId,
      from_date: formattedFromDate,
      to_date: formattedToDate,
      call_direction: callDirection,
      call_type : callType,
      didnumber: didNumber,
      destination: destination,
      hangup_reason: status,
      extension: extension,
    });
    dispatch(getReport(data));
  };

  const handleReset = (e) => {
    // setFromDate(null);
    // setToDate(null);
    setCallType("");
    setUserId("");
    setCallDirection("");
    setDidNumber("");
    setDestination("");
    setResponse("data");
    setExtension("");
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
    //  setCurrentAudio(null);
  };

  const handleDownload = (recordingPath) => {
    // You can implement download logic here
    // For example, create a link with the recording path and click it programmatically
    const link = document.createElement("a");
    link.href = recordingPath;
    link.download = recordingPath.split("/").pop(); // Set filename to the last part of the path
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusMessage = (key) => {
    const status = callStatusMessages.find((item) => item.key === key);
    return status ? status.value : "Unknown Status";
  };

  const CallStatusTooltip = ({ statusKey, sx }) => {
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
                fontSize: "calc(0.5rem + 0.10vw)",
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
                fontSize: "calc(0.5rem + 0.18vw)",
              }}
            >
              {statusKey}
            </span>
          </Tooltip>
        )}
      </>
    );
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const columns = [
    {
      field: "start_at",
      headerName: "Call Start Time",
      headerAlign: "start",
      align: "start",
      headerClassName: "custom-header",
      width: isXs ? 70 : 100,
      minWidth: 70,
      maxWidth: 100,
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          {isSmallScreen ? "Call Time" : "Call Start Time"}
        </Typography>
      ),
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
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{ color: "blue", fontSize: "calc(0.5rem + 0.2vw)" }}
              >
                {`${day}/${month}/${year}`}
              </span>
              <span
                style={{ color: "green", fontSize: "calc(0.5rem + 0.2vw)" }}
              >
                {`${hours}:${minutes}:${seconds}`}
              </span>
            </div>
          </>
          );
        }
      },
    },
    {
      field: "username",
      headerName: "Username",
      headerClassName: "custom-header",
      width: isXs ? 70 : 70,
      minWidth: 70,
      maxWidth: 70,
      headerAlign: "start",
      align: "start",
      cellClassName: "super-app-theme--cell",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          Username
        </Typography>
      ),
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.5rem + 0.2vw)" }} // Match header size or set your own
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "callerid",
      headerName: "Caller ID",
      headerClassName: "custom-header",
      width: isXs ? 80 : 100,
      minWidth: 80,
      maxWidth: 100,
      headerAlig6: "start",
      align: "start",
      cellClassName: "super-app-theme--cell",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          Caller ID
        </Typography>
      ),
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.5rem + 0.2vw)" }} // Match header size or set your own
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "destination_number",
      headerName: "Service",
      //type: "number",
      width: isXs ? 55 : 90,
      minWidth: 55,
      maxWidth: 90,
      headerAlign: "start",
      align: "start",
      // headerAlign: "center",
      // align: "center",
      headerClassName: "custom-header",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          Service
        </Typography>
      ),
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <p
              style={{
                color: "orange",
                margin: "0",
                textTransform: "capitalize",
                fontSize: "calc(0.6rem + 0.15vw)" 
              }}
            >
              {params?.row?.destination_number}
            </p>
          </div>
        );
      },
    },
    {
      field: "details",
      headerName: "Destination",
      width: isXs ? 140 : 130,
      minWidth: 130,
      maxWidth: 150,
      headerAlign: "start",
      align: "start",
      headerClassName: "custom-header",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          Destination
        </Typography>
      ),
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.5rem + 0.2vw)" }} // Match header size or set your own
        >
          {params.value}
        </Typography>
      ),
      
    },
    {
      field: "status",
      headerName: "Status",
      width: isXs ? 110 : 180,
      minWidth: 120,
      maxWidth: 190,
      headerAlign: "start",
      align: "start",
      headerClassName: "custom-header",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          Status
        </Typography>
      ),
      renderCell: (params) => (
        <Box sx={{ fontSize: "calc(0.5rem + 0.10vw)" }}>
          <CallStatusTooltip statusKey={params.value} />
        </Box>
      )
    },

    {
      field: "call_status",
      headerName: "Call Status",
      width: isXs ? 80 : 80,
      minWidth: 80,
      maxWidth: 80,
      headerAlign: "start",
      align: "start",
      headerClassName: "custom-header",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          Call Status
        </Typography>
      ),
      renderCell: (params) => {
        return (
          <>
            <span>
              {params.row.call_status === "ANSWER" ? (
                <span style={{ color: "green",fontSize: "calc(0.5rem + 0.2vw)" }}>
                  {params.row.call_status}
                </span>
              ) : (
                <span style={{ color: "red",fontSize: "calc(0.5rem + 0.2vw)" }}>{params.row.call_status}</span>
              )}
            </span>
          </>
        );
      },
    },
    
    {
      field: "did_tfn",
      headerName: "DID Number",
      width: isXs ? 100 : 100,
      minWidth: 100,
      maxWidth: 100,
      headerAlign: "start",
      align: "start",
      headerClassName: "custom-header",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          DID Number
        </Typography>
      ),
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.5rem + 0.2vw)" }} // Match header size or set your own
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "duration",
      headerName: "Duration",
      width: isXs ? 55 : 60,
      minWidth: 55,
      maxWidth: 60,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          Duration
        </Typography>
      ),
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.5rem + 0.2vw)" }} // Match header size or set your own
        >
          {params.value}
        </Typography>
      ),
    },

    {
      field: "billing_type",
      headerName: "Bill Type",
      width: isXs ? 55 : 60,
      minWidth: 55,
      maxWidth: 60,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          Bill Type
        </Typography>
      ),
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.5rem + 0.2vw)" }} // Match header size or set your own
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "billsec",
      headerName: "Bill Sec",
      width: isXs ? 55 : 60,
      minWidth: 55,
      maxWidth: 60,
      headerAlign: "cecenterter",
      align: "center",
      headerClassName: "custom-header",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          Bill Sec
        </Typography>
      ),
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.5rem + 0.2vw)" }} // Match header size or set your own
        >
          {params.value}
        </Typography>
      ),
    },

    {
      field: "policy",
      headerName: "Policy",
      width: isXs ? 55 : 60,
      minWidth: 55,
      maxWidth: 60,
      headerAlign: "cecenterter",
      align: "center",
      headerClassName: "custom-header",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          Policy
        </Typography>
      ),
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.5rem + 0.2vw)" }} // Match header size or set your own
        >
          {params.value}
        </Typography>
      ),
    },

    {
      field: "interval",
      headerName: "Interval",
      width: isXs ? 55 : 60,
      minWidth: 55,
      maxWidth: 60,
      headerAlign: "cecenterter",
      align: "center",
      headerClassName: "custom-header",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          Interval
        </Typography>
      ),
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.5rem + 0.2vw)" }} // Match header size or set your own
        >
          {params.value}
        </Typography>
      ),
    },


    {
      field: "used_minutes",
      headerName: "Used minutes",
      width: isXs ?80 : 100,
      minWidth: 80,
      maxWidth: 100,
      headerAlign: "cecenterter",
      align: "center",
      headerClassName: "custom-header",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          {isMobile? "Used Min" : "Used Minutes"}
        </Typography>
      ),
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.5rem + 0.2vw)" }} // Match header size or set your own
        >
          {params.value}
        </Typography>
      ),
    },
    
    {
      field: "call_direction",
      headerName: "Call Direct.",
      width: isXs ? 80 : 80,
      minWidth: 80,
      maxWidth: 80,
      headerAlign: "start",
      align: "start",
      headerClassName: "custom-header",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          Call Direct.
        </Typography>
      ),
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.5rem + 0.2vw)" }} // Match header size or set your own
        >
          {params.value}
        </Typography>
      ),
    },
    
    // {
    //   field: "answered_by",
    //   headerName: "Answered By",
    //   width: 230,
    //   headerAlign: "center",
    //   align: "center",
    //   headerClassName: "custom-header",
    // },
    
    {
      field: "answer_at",
      headerName: "Call Answer Time",
      headerAlign: "start",
      align: "start",
      headerClassName: "custom-header",
      width: isXs ? 80 : 90,
      minWidth: 80,
      maxWidth:90,
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          {isSmallScreen ? "Call Answer" : "Call Answer"}
        </Typography>
      ),
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
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{ color: "blue", fontSize: "calc(0.5rem + 0.2vw)" }}
              >
                {`${day}/${month}/${year}`}
              </span>
              <span
                style={{ color: "green", fontSize: "calc(0.5rem + 0.2vw)" }}
              >
                {`${hours}:${minutes}:${seconds}`}
              </span>
            </div>
          </>
          );
        }
      },
    },

    {
      field: "end_at",
      headerName: "Call End Time",
      headerAlign: "start",
      align: "start",
      headerClassName: "custom-header",
      width: isXs ? 80 : 90,
      minWidth: 80,
      maxWidth: 90,
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          {isSmallScreen ? "Call End" : "Call End"}
        </Typography>
      ),
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
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{ color: "blue", fontSize: "calc(0.5rem + 0.2vw)" }}
              >
                {`${day}/${month}/${year}`}
              </span>
              <span
                style={{ color: "green", fontSize: "calc(0.5rem + 0.2vw)" }}
              >
                {`${hours}:${minutes}:${seconds}`}
              </span>
            </div>
          </>
          );
        }
      },
    },
    {
      field: "dialstring",
      headerName: "Dial String",
      width: isXs ? 320 : 380,
      minWidth: 320,
      maxWidth: 380,
      headerAlign: "start",
      align: "start",
      headerClassName: "custom-header",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important" }}
        >
          Dial String
        </Typography>
      ),
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.5rem + 0.2vw)" }} // Match header size or set your own
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "hangupsource",
      headerName: "Hangup Source",
      width: isXs ? 200 : 200,
      minWidth: 200,
      maxWidth:300,
      headerAlign: "start",
      align: "start",
      headerClassName: "custom-header",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          Hangup Source
        </Typography>
      ),
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.5rem + 0.2vw)" }} // Match header size or set your own
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "uniqueid",
      headerName: "Unique Id",
      width: isXs ? 120 : 120,
      minWidth: 120,
      maxWidth:120,
      headerAlign: "start",
      align: "start",
      headerClassName: "custom-header",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          Unique Id
        </Typography>
      ),
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.5rem + 0.2vw)" }} // Match header size or set your own
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "recording_path",
      headerName: "Recording",
      width: isXs ? 200 : 200,
      minWidth: 200,
      maxWidth:200,
      headerAlign: "start",
      align: "start",
      headerClassName: "custom-header",
      renderHeader: () => (
        <Typography
          variant="body2"
          sx={{ fontSize: "calc(0.6rem + 0.15vw)", fontWeight: "bold", color:"white !important"}}
        >
          Recording
        </Typography>
      ),
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
  ];

  const rows = [];
  state?.report?.report?.data &&
    state?.report?.report?.data?.forEach((item, index) => {
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
        policy: item?.policy,
        interval: item?.interval,
        used_minutes: item?.used_minutes,
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
        details: item.details,
        billing_type: item.billing_type,
      });
    });

  const selectedCallerDataMap = new Map();

  selectedRows.forEach((id) => {
    const selectedRow = rows.find((row) => row.id === id);
    if (selectedRow) {
      const userId = selectedRow.user_uuid;
      if (!selectedCallerDataMap.has(userId)) {
        selectedCallerDataMap.set(userId, {
          type: "CallerID",
          details: [],
          description: "Report",
          user_id: JSON.stringify(userId),
          is_active: true,
        });
      }
      const data = selectedCallerDataMap.get(userId);
      if (!data.details.includes(selectedRow.caller_id_number)) {
        data.details.push(selectedRow.caller_id_number);
      }
    }
  });

  const selectedCallerData = Array.from(selectedCallerDataMap.values());

  const handleBlockCallerIds = () => {
    dispatch(createBlockReport(JSON.stringify(selectedCallerData)));
  };

  return (
    <>
      <div className={`App ${colorThem} `}>
        <div className="contant_box">
          <Box
            className="right_sidebox mobile_top_pddng"
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
          >
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

                        <div
                          className="cntnt_title"
                        >
                          <div className="col-12">
                            <h3>call details records</h3>
                          </div>
                        </div>

                        <Grid
                          container
                          className="cdr_filter_row"
                          style={{ padding: "20px 0" }}
                        >
                          <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <FormControl
                              fullWidth
                              style={{ width: "98%", margin: "7px 0" }}
                              className={classes.formControl}
                            >
                              <InputLabel id="demo-simple-select-label">
                                UserName
                              </InputLabel>

                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="UserName"
                                helperText="Select the language."
                                style={{ textAlign: "left" }}
                                value={userId}
                                onChange={(e) => {
                                  setUserId(e.target.value);
                                }}
                                required
                              >
                                {users?.map((item, index) => {
                                  return (
                                    <MenuItem key={index} value={item?.user_id}>
                                      {item.username}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
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
                              label="Caller Id"
                              variant="outlined"
                              value={callerId}
                              onChange={(e) => setCallerId(e.target.value)}
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
                              label="DID Number"
                              variant="outlined"
                              value={didNumber}
                              onChange={(e) => {
                                setDidNumber(e.target.value);
                              }}
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
                            <FormControl
                              className={classes.formControl}
                              fullWidth
                              style={{ width: "98%", margin: "3px 0" }}
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
                                <MenuItem value={"Outbound_IP"}>Outbound IP</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center",position: "relative", top:"3px" }}
                          >
                            <FormControl
                              className={classes.formControl}
                              fullWidth
                              style={{ width: "98%", margin: "7px 0" }}
                            >
                              <InputLabel id="demo-simple-select-label">
                                Call Type
                              </InputLabel>

                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Call Type"
                                helperText="Select the language."
                                style={{ textAlign: "left" }}
                                value={callType}
                                onChange={(e) => {
                                  setCallType(e.target.value);
                                }}
                                required
                              >
                                <MenuItem value={""}>None</MenuItem>
                                <MenuItem value={"Toll-Free"}>Toll Free</MenuItem>
                                <MenuItem value={"Local"}>Local</MenuItem>
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
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center",paddingTop:isMobile?"10px":"0px"}}
                          >
                            <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                              className={classes.formControl}
                            >
                              <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                              className={classes.formControl}
                            >
                              <DemoContainer
                                components={["DatePicker"]}
                                sx={{ width: "100%" }}
                                className="select_date"
                              >
                                <DateTimePicker
                                  label="From Date"
                                  value={
                                    fromDate
                                      ? dayjs(fromDate, "DD/MM/YYYY HH:mm")
                                      : null
                                  }
                                  onChange={handleFromDateChange}
                                  renderInput={(props) => (
                                    <TextField {...props} />
                                  )}
                                  format="DD/MM/YYYY HH:mm" // 24-hour format
                                  ampm={false} // Disables AM/PM toggle
                                  minutesStep={1}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                            </LocalizationProvider>
                          </Grid>
                          <Grid
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center",paddingTop:isMobile?"10px":"0px" }}
                          >
                            <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                              className={classes.formControl}
                            >
                              <DemoContainer
                                components={["DatePicker"]}
                                sx={{ width: "100%" }}
                                className="select_date"
                              >
                                <DateTimePicker
                                  label="To Date"
                                  value={
                                    toDate
                                      ? dayjs(toDate, "DD/MM/YYYY HH:mm")
                                      : null
                                  }
                                  onChange={handleToDateChange}
                                  renderInput={(props) => (
                                    <TextField {...props} />
                                  )}
                                  format="DD/MM/YYYY HH:mm" // 24-hour format
                                  ampm={false} // Disables AM/PM toggle
                                  minutesStep={1} // Show all minutes (no step increment)
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </Grid> 
                          <Grid
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            style={{
                              display: "flex",
                              alignItems: "start",
                              justifyContent: "space-between",
                              paddingTop: "18px",
                            }}
                          >
                              <Box>
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
                              <IconButton
                              className="filter_block_btn"
                              style={{
                                marginLeft: "0 !important",
                                background: selectedCallerData.length
                                  ? "red"
                                  : "grey",
                              }}
                              onClick={handleBlockCallerIds}
                            >
                              Block &nbsp;
                              <BlockIcon />
                            </IconButton>
                              </Box>
                          </Grid>
                        </Grid>

                        <ThemeProvider theme={theme}>
                          <div style={{ height: 500, width: "100%" }}>
                            <DataGrid
                              rows={rows}
                              columns={columns}
                              checkboxSelection
                              disableRowSelectionOnClick
                              components={{ Toolbar: GridToolbar }}
                              onRowSelectionModelChange={handleSelectionChange}
                            />
                          </div>
                        </ThemeProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}

export default AdminReport;
