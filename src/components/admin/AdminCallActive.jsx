import {
  Box,
  FormControl,
  Select,
  OutlinedInput,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import "../../Switcher.scss";
import { useDispatch, useSelector } from "react-redux";
import { getAdminCallActive } from "../../redux/actions/adminPortal/adminPortal_callActiveAction";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";
import { api } from "../../mockData";
import axios from "axios";
import dayjs from "dayjs";
import { disconnectSocket } from "../../socket_service/socketService";
const drawerWidth = 240;

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
      },
    },
  },
});

export function CustomFooterStatusComponent(props) {
  return (
    <></>
    // <Box sx={{ p: 1, display: 'flex' }}>
    //   <FiberManualRecordIcon
    //     fontSize="small"
    //     sx={{
    //       mr: 1,
    //       color: props.status === 'connected' ? '#4caf50' : '#d9182e',
    //     }}
    //   />
    //   Status {props.status}
    // </Box>
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

function AdminCallActive({
  colorThem,
  radioValue,
  setRadioValue,
  mockDataTeam,
}) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [option, setOption] = useState("L");
  const [timeStamp, setTimeStamp] = useState([]);
  const [timeDifference, setTimeDifference] = useState([]);
  const parseTimestamp = () => {
    return timeStamp?.map((item) => {
      const date = new Date(item.TimeStamp);
      return date; // Keep Date objects for time difference calculation
    });
  };

  const timestampDate = parseTimestamp();

  // Function to calculate time differences for each timestamp
  const calculateTimeDifferences = () => {
    const currentTime = new Date();
    const differences = timestampDate?.map((timestamp) => {
      const diffInMs = currentTime - timestamp;
      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      // Format with leading zeros
      const formattedHours = String(diffInHours).padStart(2, "0");
      const formattedMinutes = String(diffInMinutes % 60).padStart(2, "0");
      const formattedSeconds = String(diffInSeconds % 60).padStart(2, "0");

      return {
        days: diffInDays,
        hours: formattedHours,
        minutes: formattedMinutes,
        seconds: formattedSeconds,
      };
    });

    setTimeDifference(differences);
  };

  // Calculate time differences initially and update every 5 seconds
  useEffect(() => {
    calculateTimeDifferences(); // Initial calculation

    const interval = setInterval(() => {
      calculateTimeDifferences(); // Recalculate every 5 seconds
    }, 5000);

    return () => clearInterval(interval);
  }, [timeStamp]);

  useEffect(() => {
    dispatch(getAdminCallActive(radioValue));
    //   return () => {
    //   // optional: disconnect if needed when component unmounts
    //   disconnectSocket(); // only if socket should stop
    // };
  }, [dispatch]); // Empty dependency array ensures this effect runs once on mount

  const handleBarging = async (data) => {
    const token = JSON.parse(localStorage.getItem("admin"));
    let values = JSON.stringify({
      channel: data,
      option: option,
    });
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token} `,
        },
      };
      const { data } = await axios.post(
        `${api.dev}/api/callbarge`,
        values,
        config
      );
      if (data?.status === 200) {
        toast.success(data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });
      } else {
        toast.error(data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500,
      });
    }
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",
      width: 100,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <span style={{ color: "red" }}>{params.row.srNo}</span>
      ),
    },
    {
      field: "Username",
      headerName: "Username",
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "DIDNumber",
      headerName: "Did Number",
      width: 130,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "CallerID",
      headerName: "Caller Id",
      width: 130,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },

    {
      field: "Details",
      headerName: "Destination",
      width: 200,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },

    {
      field: "TimeStamp",
      headerName: "Start Time",
      width: 200,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
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
          var formattedDate =
            day +
            "/" +
            month +
            "/" +
            year +
            " " +
            hours +
            ":" +
            minutes +
            ":" +
            seconds;

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
      field: "CallDirection",
      headerName: "Call Direction",
      width: 150,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "CallDuration",
      headerName: "Call Duration",
      width: 150,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        if (params.value !== null) {
          const index = mockDataTeam.findIndex(
            (item) => item.id === params.row.id
          );
          const duration = timeDifference && timeDifference[index];

          return (
            <span style={{ color: "green" }}>
              {duration
                ? `${duration.hours}:${duration.minutes}:${duration.seconds}`
                : ""}
            </span>
          );
        }
        return null;
      },
    },

    {
      field: "Status",
      headerName: "Status",
      width: 120,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
  ];

  const columns1 = [
    {
      field: "id",
      headerName: "Sr No.",
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: (params) => {
        return <span style={{ color: "red" }}>{params.row.id + 1}</span>;
      },
    },
    {
      field: "Username",
      headerName: "Username",
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "DIDNumber",
      headerName: "Did Number",
      width: 130,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "CallerID",
      headerName: "Caller Id",
      width: 130,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },

    {
      field: "Details",
      headerName: "Destination",
      width: 200,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },

    {
      field: "TimeStamp",
      headerName: "Start Time",
      width: 200,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
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
      field: "CallDirection",
      headerName: "Call Direction",
      width: 150,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "CallDuration",
      headerName: "Call Duration",
      width: 150,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        if (params.value !== null) {
          const index = mockDataTeam.findIndex(
            (item) => item.id === params.row.id
          );
          const duration = timeDifference && timeDifference[index];

          return (
            <span style={{ color: "green" }}>
              {duration
                ? `${duration.hours}:${duration.minutes}:${duration.seconds}`
                : ""}
            </span>
          );
        }
        return null;
      },
    },

    {
      field: "Status",
      headerName: "Status",
      width: 120,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
  ];
  useEffect(() => {
    // Prepare timeStamp array from mockDataTeam
    const formattedTimeStamps = mockDataTeam?.map((item) => ({
      id: item.id,
      TimeStamp: item.TimeStamp, // Assuming TimeStamp is a property of each item
    }));

    setTimeStamp(formattedTimeStamps);
  }, [mockDataTeam]);

  const rows = useMemo(() => {
    return []; // Return an empty array to prevent any rows from being displayed initially
  }, []);

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
                    <div className="cntnt_title d-flex justify-content-between">
                      <div className="">
                        <h3>Live Calls</h3>
                        {/* <p>
                          Use this to monitor and interact with the active
                          calls.
                        </p> */}
                      </div>
                      <div className="d-flex justify-content-between">
                        <div className="d-flex justify-content-between">
                          <div>
                            <FormControl>
                              {/* <FormLabel id="demo-row-radio-buttons-group-label">Live Calls</FormLabel> */}
                              <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={radioValue} // Bind the selected value to state
                                onChange={(e) => {
                                  setRadioValue(e.target.value);
                                }} // Handle change event
                              >
                                <FormControlLabel
                                  value=""
                                  control={<Radio />}
                                  label={`All`}
                                />
                                <FormControlLabel
                                  value="Inbound"
                                  control={<Radio />}
                                  label={`Inbound`}
                                />
                                <FormControlLabel
                                  value="Outbound"
                                  control={<Radio />}
                                  label={`Outbound`}
                                />
                                <FormControlLabel
                                  value="Outbound_IP"
                                  control={<Radio />}
                                  label={`Outbound IP`}
                                />
                              </RadioGroup>
                            </FormControl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <ThemeProvider theme={theme}>
                        {state?.getAdminCallActive?.callactive !== undefined ? (
                          <>
                            <div style={{ height: "100%", width: "100%" }}>
                              <DataGrid
                                // checkboxSelection
                                rows={mockDataTeam}
                                columns={columns}
                                headerClassName="custom-header"
                                // getRowClassName={(params) =>
                                //   isRowBordered(params)
                                //     ? classes.borderedGreen
                                //     : classes.borderedRed
                                // }
                                components={{ Toolbar: GridToolbar }}
                                slots={{
                                  toolbar: CustomToolbar,
                                  footer: CustomFooterStatusComponent,
                                }}
                                autoHeight
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ height: "100%", width: "100%" }}>
                              <DataGrid
                                // checkboxSelection
                                rows={rows}
                                columns={columns1}
                                headerClassName="custom-header"
                                // getRowClassName={(params) =>
                                //   isRowBordered(params)
                                //     ? classes.borderedGreen
                                //     : classes.borderedRed
                                // }
                                components={{ Toolbar: GridToolbar }}
                                slots={{
                                  toolbar: CustomToolbar,
                                  footer: CustomFooterStatusComponent,
                                }}
                                autoHeight
                                disableColumnResize={false} // Allow column resizing
                                hideFooterPagination={window.innerWidth < 600} // Hide pagination for small screens
                              />
                            </div>
                          </>
                        )}
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
          </Box>
        </div>
      </div>
    </>
  );
}

export default AdminCallActive;
