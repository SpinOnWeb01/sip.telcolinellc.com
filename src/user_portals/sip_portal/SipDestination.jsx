import React, { useEffect, useMemo, useState } from "react";
import "../../../src/style.css";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { Close, Edit } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  getManageDid,
  updateManageDestination,
} from "../../redux/actions/sipPortal/managePortal_destinationAction";
import { getManageExtension } from "../../redux/actions/sipPortal/managePortal_extensionAction";
import { api } from "../../mockData";
import { ip } from "@form-validation/validator-ip";
const drawerWidth = 240;
const names = ["Manage"];
const sub_type = ["Extension", "Queue"];
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  // backgroundColor: "rgb(9, 56, 134)",
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

function SipDestination({colorThem}) {
  const current_user = localStorage.getItem("current_user");
  const token = JSON.parse(localStorage.getItem(`user_${current_user}`));
  const [edit, setEdit] = useState(false);
  const [destination, setDestination] = useState("");
  const [action, setAction] = useState("");
  const [enable, setEnable] = useState("");
  const [description, setDescription] = useState("");
  const [didId, setDidId] = useState("");
  const [response, setResponse] = useState("");
  const [recording, setRecording] = useState("");
  const [service, setService] = useState("");
  const [destinationAction, setDestinationAction] = useState("");
  const [extensionNumber, setExtensionNumber] = useState([]);
  const [queue, setQueue] = useState([]);
  const [subType, setSubType] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [error, setError] = useState("");
  const [radioValue, setRadioValue] = useState("");
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const handleEditOpen = () => setEdit(true);
  const handleEditClose = () => {
    setEdit(false);
    setDestination("");
    setAction("");
    setEnable("");
    setDescription("");
    setDidId("");
    setRecording("");
    setService("");
    setDestinationAction([]);
    setExtensionNumber([]);
    setQueue([]);
    setSubType("");
    setIpAddress("");
    setError("");
  };

  // Function to validate IP, Port, and Domain URLs
  const validateIpWithPortAndDomain = (value) => {
    const [ipOrDomainPart, portPart] = value.split(":"); // Split IP/Domain and Port

    // Regular expression for validating domain names
    const domainRegex = /^[a-zA-Z0-9-]{1,63}(\.[a-zA-Z]{2,63})+$/;

    // Validate IP (only IPv4 in this case)
    const ipValidationResult = ip().validate({
      value: ipOrDomainPart,
      options: {
        ipv4: true,
        ipv6: false,
        message: "Invalid IP address",
      },
    });

    // Check if it's a valid IP or domain
    if (!ipValidationResult.valid && !domainRegex.test(ipOrDomainPart)) {
      return {
        valid: false,
        message: "Invalid IP address or domain URL",
      };
    }

    // If port is provided, validate it
    if (portPart) {
      const portNumber = parseInt(portPart, 10);
      if (isNaN(portNumber) || portNumber < 0 || portNumber > 65535) {
        return {
          valid: false,
          message: "Invalid port number. Must be between 0 and 65535.",
        };
      }
    }

    // Both IP/Domain and Port are valid
    return { valid: true };
  };

  // Handle input change and validation
  const handleIpOrDomainChange = (e) => {
    const newValue = e.target.value;
    setIpAddress(newValue);

    const validationResult = validateIpWithPortAndDomain(newValue);

    if (validationResult.valid) {
      setError(""); // Clear error if valid
    } else {
      setError(validationResult.message); // Set error message if invalid
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "destination":
        setDestination(value);
        break;
      case "action":
        setAction(value);
        break;
      case "enabled":
        setEnable(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };

  const handleEdit = (data) => {
    handleEditOpen();
    setService(
      data?.service_type === "IP"
        ? data?.service_type
        : data?.service_type.charAt(0).toUpperCase() +
            data?.service_type.slice(1).toLowerCase()
    );
    setDidId(data?.did_id);
    setDescription(data?.description);
    setAction(data?.destination_actions);
    setDestination(data?.tfn_number);
    setEnable(data?.status);
    setRecording(data?.recording.toString());
    setIpAddress(data?.service_type === "IP" ? data.destination_actions : "");
    setDestinationAction(data?.destination_actions);
    setSubType(
      data?.sub_type.charAt(0) + data?.sub_type.slice(1).toLowerCase()
    );
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${api.dev}/api/getuserprofileextensions`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token} `,
      },
    };
    axios
      .request(config)
      .then((response) => {
        setExtensionNumber(response?.data);
      })
      .catch((error) => {
        console.log("error", error);
      });

    let ure = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${api.dev}/api/getuserprofilequeues`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token} `,
      },
    };
    axios
      .request(ure)
      .then((response) => {
        setQueue(response?.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [didId]);

  useEffect(() => {
    dispatch(getManageDid(radioValue));
    dispatch(getManageExtension());
  }, [radioValue, response]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const request = JSON.stringify({
      id: didId,
      is_active: enable.toString().charAt(0),
      details: destinationAction,
      description: description,
      recording: recording?.charAt(0),
      service_type: service?.toUpperCase(),
      sub_type: subType?.toUpperCase(),
      ip_address: ipAddress,
    });
    if (error === "") {
      dispatch(updateManageDestination(request, setEdit, setResponse));
    }
  };

  const columns = [
    {
      field: "edit",
      headerName: "Action",
      width: 100,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <Tooltip title="Edit" disableInteractive interactive>
              <IconButton onClick={() => handleEdit(params.row)}>
                <Edit
                  index={params.row.id}
                  style={{ cursor: "pointer", color: "#603e21" }}
                />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: "tfn_number",
      headerName: "Destination",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 150,
      align: "center",
    },

    {
      field: "service_type",
      headerName: "Service",
      headerClassName: "custom-header",
      width: 100,
      headerAlign: "center",
      align: "center",
    },

    // {
    //   field: "sub_type",
    //   headerName: "Sub Type",
    //   headerClassName: "custom-header",
    //   width: 100,
    //   headerAlign: "center",
    //   align: "center",
    // },

    {
      field: "sip_profile_name",
      headerName: "Details",
      width: 250,
      //cellClassName: "name-column--cell",
      //headerClassName: 'super-app-theme--header'
      headerClassName: "custom-header",
      // editable: true,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "description",
      headerName: "Description",
      width: 150,
      headerClassName: "custom-header",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "created_date",
      headerName: "Create Date",
      headerClassName: "custom-header",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const valueFormatter = (params) => {
          const date = new Date(params.value);
          return `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
        };

        return (
          <div className="d-flex justify-content-between align-items-center">
            <p
              style={{
                fontWeight: "400",
                color: "blue",
                margin: "0",
                textTransform: "capitalize",
              }}
            >
              {valueFormatter(params)}
            </p>
          </div>
        );
      },
    },
    {
      field: "updated_date",
      headerName: "Update Date",
      headerClassName: "custom-header",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const valueFormatter = (params) => {
          const date = new Date(params.value);
          return `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
        };

        return (
          <div className="d-flex justify-content-between align-items-center">
            <p
              style={{
                fontWeight: "400",
                color: "brown",
                margin: "0",
                textTransform: "capitalize",
              }}
            >
              {valueFormatter(params)}
            </p>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            {params.row.status === true ? (
              <>
                <div
                  // style={{
                  //   color: "white",
                  //   background: "green",
                  //   padding: "7px",
                  //   borderRadius: "5px",
                  //   fontSize: "12px",
                  //   textTransform: "capitalize",
                  // }}
                  style={{
                    color: "green",
                    //background: "green",
                    padding: "7px",
                    borderRadius: "5px",
                    //fontSize: "15px",
                    textTransform: "capitalize",
                    fontWeight: "600",
                  }}
                >
                  Active
                </div>
              </>
            ) : (
              <>
                <div
                  // style={{
                  //   color: "white",
                  //   background: "red",
                  //   padding: "7px",
                  //   borderRadius: "5px",
                  //   fontSize: "12px",
                  //   textTransform: "capitalize",
                  // }}
                  style={{
                    color: "red",
                    //   background: "red",
                    padding: "7px",
                    borderRadius: "5px",
                    //fontSize: "15px",
                    textTransform: "capitalize",
                    fontWeight: "600",
                  }}
                >
                  Deactive
                </div>
              </>
            )}
          </div>
        );
      },
    },
  ];

  const rows = useMemo(() => {
    const calculatedRows = [];
    state?.allManageDid?.allmanagedid?.data &&
      state?.allManageDid?.allmanagedid?.data.forEach((item, index) => {
        calculatedRows.push({
          id: index + 1,
          did_id: item.id,
          tfn_number: item?.didnumber,
          username: item?.username,
          service_type: item?.service_type,
          insert_date: item?.insert_date,
          description: item?.description,
          destination_actions: item?.details,
          created_date: item?.created_date,
          updated_date: item?.updated_date,
          sub_type: item.sub_type,
          status: item?.is_active,
          recording: item?.recording,
          sip_profile_name: item.sip_profile_name,
        });
      });
    return calculatedRows;
  }, [state?.allManageDid?.allmanagedid?.data]);

  return (
    <>
    
           <div className={`App ${colorThem} `}>
        <div className="contant_box">
          <Box
            className="right_sidebox mobile_top_pddng users"
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
          >
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
                        <div className="cntnt_title">
                          <h3>Inbound</h3>
                          {/* <p>
                            Use this to monitor and interact with the call bock.
                          </p> */}
                        </div>

                        {/*---------- Radio Buttons for filtering ---------------- */}
                        {/* <div>
                                                                          <FormControl>
                                                        <RadioGroup
                                                          row
                                                          aria-labelledby="demo-row-radio-buttons-group-label"
                                                          name="row-radio-buttons-group"
                                                         value={radioValue} // Bind the selected value to state
                                                         onChange={(e)=>setRadioValue(e.target.value)} // Handle change event
                                                        >
                                                           <FormControlLabel value="" control={<Radio />} label="All" />
                                                          <FormControlLabel value="true" control={<Radio />} label="Active" />
                                                          <FormControlLabel value="false" control={<Radio />} label="Deactive" />
                                                          <FormControlLabel value="s" control={<Radio />} label="Assign" />
                                                          <FormControlLabel value="s" control={<Radio />} label="Unassign" />
                                                        </RadioGroup>
                                                      </FormControl>
                                                                          </div> */}

                        <ThemeProvider theme={theme}>
                          <div style={{ height: "100%", width: "100%" }}>
                            <DataGrid
                              rows={rows}
                              columns={columns}
                              headerClassName="custom-header"
                              // getRowClassName={(params) =>
                              //   isRowBordered(params) ? 'borderedGreen' : 'borderedRed'
                              // }
                              components={{ Toolbar: GridToolbar }}
                              slots={{
                                toolbar: CustomToolbar,
                              }}
                              autoHeight
                            />
                          </div>
                        </ThemeProvider>

                        {/* -----   Edit Campaign Modal Start   ----- */}

                        <Dialog
                          open={edit} //onClose={handleCloseModal}
                        >
                          <Box>
                            <br />
                            <IconButton
                              className="close_icon"
                              onClick={handleEditClose}
                              sx={{ float: "inline-end" }}
                            >
                              <Close />
                            </IconButton>
                          </Box>

                          <DialogTitle
                            sx={{
                              color: "#07285d",
                              fontWeight: "600",
                              width: "500px",
                              textAlign: "center",
                            }}
                            className="extension_title"
                          >
                            Update Destination
                          </DialogTitle>

                          <DialogContent>
                            <Typography variant="body1">
                              <br />
                              <form
                                style={{
                                  textAlign: "center",
                                  // height: "200px",
                                  overflow: "auto",
                                  paddingTop: "10px",
                                  padding: "5px",
                                  width: "auto",
                                }}
                              >
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                    overflow: "auto",
                                  }}
                                  type="text"
                                  label="Destination"
                                  variant="outlined"
                                  name="destination"
                                  value={destination}
                                  onChange={handleChange}
                                  padding={"0px 0 !important"}
                                  disabled
                                />

                                {/* <FormControl
                                    style={{
                                      width: "100%",
                                      margin: " 5px 0 5px 0",
                                    }}
                                  >
                                    <InputLabel id="demo-multiple-checkbox-label">
                                      Services
                                    </InputLabel>
                                    <Select
                                      style={{ textAlign: "left" }}
                                      labelId="demo-multiple-checkbox-label"
                                      label="Services"
                                      id="demo-multiple-checkbox"
                                      fullWidth
                                      value={service}
                                      onChange={(e) => {
                                        setService(e.target.value);
                                      }}
                                    >
                                      {names.map((name) => (
                                        <MenuItem key={name} value={name}>
                                          {name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl> */}

                                {service === "Manage" ? (
                                  <>
                                    <FormControl
                                      style={{
                                        width: "100%",
                                        margin: " 5px 0 5px 0",
                                      }}
                                    >
                                      <InputLabel id="demo-multiple-checkbox-label">
                                        Sub Type
                                      </InputLabel>
                                      <Select
                                        style={{ textAlign: "left" }}
                                        labelId="demo-multiple-checkbox-label"
                                        label="Sub Type"
                                        id="demo-multiple-checkbox"
                                        //multiple
                                        fullWidth
                                        value={subType}
                                        onChange={(e) => {
                                          const newSubType = e.target.value;
                                          setSubType(newSubType);
                                          // Clear destinationAction if subType is Extension or Queue
                                          if (
                                            newSubType === "Extension" ||
                                            newSubType === "Queue"
                                          ) {
                                            setDestinationAction([]);
                                          }
                                        }}
                                        // input={
                                        //   <OutlinedInput label="Sub Type" />
                                        // }
                                        // renderValue={(selected) =>
                                        //   selected.join(", ")
                                        // }
                                        // MenuProps={MenuProps}
                                      >
                                        {sub_type.map((name) => (
                                          <MenuItem key={name} value={name}>
                                            {/* <Checkbox
                                                checked={
                                                  serviceType.indexOf(name) > -1
                                                }
                                              />
                                              <ListItemText primary={name} /> */}
                                            {name}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                    {subType === "Extension" ? (
                                      <>
                                        <FormControl
                                          style={{
                                            width: "100%",
                                            margin: " 5px 0 5px 0",
                                          }}
                                        >
                                          <InputLabel id="demo-multiple-checkbox-label">
                                            Extension
                                          </InputLabel>
                                          <Select
                                            style={{ textAlign: "left" }}
                                            labelId="demo-multiple-checkbox-label"
                                            label="Extension"
                                            id="demo-multiple-checkbox"
                                            //  multiple
                                            fullWidth
                                            value={destinationAction}
                                            onChange={(e) => {
                                              setDestinationAction(
                                                e.target.value
                                              );
                                            }}
                                            // input={
                                            //   <OutlinedInput label="Extension" />
                                            // }
                                            // renderValue={(selected) =>
                                            //   selected.join(", ")
                                            // }
                                            MenuProps={MenuProps}
                                          >
                                            {extensionNumber?.data?.map(
                                              (name) => (
                                                <MenuItem
                                                  key={name}
                                                  value={name}
                                                >
                                                  {/* <Checkbox
                                                      checked={
                                                        destinationAction.indexOf(
                                                          name
                                                        ) > -1
                                                      }
                                                    />
                                                    <ListItemText
                                                      primary={name}
                                                    /> */}
                                                  {name}
                                                </MenuItem>
                                              )
                                            )}
                                          </Select>
                                        </FormControl>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                    {subType === "Queue" ? (
                                      <>
                                        {" "}
                                        <FormControl
                                          fullWidth
                                          style={{
                                            width: "100%",
                                            margin: "7px 0",
                                          }}
                                        >
                                          <InputLabel id="demo-simple-select-label">
                                            Queue
                                          </InputLabel>

                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Queue"
                                            helperText="Select the language."
                                            style={{ textAlign: "left" }}
                                            // multiple
                                            value={destinationAction}
                                            onChange={(e) => {
                                              setDestinationAction(
                                                e.target.value
                                              );
                                            }}
                                            // input={
                                            //   <OutlinedInput label="Extension" />
                                            // }
                                            // renderValue={(selected) =>
                                            //   selected.join(", ")
                                            // }
                                            MenuProps={MenuProps}
                                            required
                                          >
                                            {queue.data?.map((item, index) => {
                                              return (
                                                <MenuItem
                                                  key={index}
                                                  value={item}
                                                >
                                                  {/* <Checkbox
                                            checked={
                                              destinationAction.indexOf(item) > -1
                                            }
                                          /> */}
                                                  {/* <ListItemText
                                                        primary={item}
                                                      /> */}
                                                  {item}
                                                </MenuItem>
                                              );
                                            })}
                                          </Select>
                                        </FormControl>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {service === "IP" ? (
                                      <>
                                        <FormControl
                                          fullWidth
                                          style={{
                                            width: "100%",
                                            margin: "7px 0",
                                            textAlign: "left",
                                          }}
                                        >
                                          <InputLabel id="demo-simple-select-label">
                                            SIP Profiles
                                          </InputLabel>
                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="SIP Profiles"
                                            //multiple
                                            value={destinationAction}
                                            onChange={(e) =>
                                              setDestinationAction(
                                                e.target.value
                                              )
                                            }
                                            input={
                                              <OutlinedInput label="SIP Profiles" />
                                            }
                                            // renderValue={(selected) =>
                                            //   selected
                                            //     .map((id) =>
                                            //       profileData?.find((item) => item.id === id)?.name // Find the name corresponding to the id
                                            //     )
                                            //     .join(", ") // Join the names into a comma-separated string
                                            // }
                                            MenuProps={MenuProps}
                                            required
                                          >
                                            {state?.allManageDid?.allmanagedid?.data?.map(
                                              (item) => (
                                                <MenuItem
                                                  key={item.details}
                                                  value={item.details}
                                                >
                                                  {/* <Checkbox checked={destinationAction.includes(item.id)} />
        <ListItemText primary={item.name} /> */}
                                                  {item.sip_profile_name}
                                                </MenuItem>
                                              )
                                            )}
                                          </Select>
                                        </FormControl>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </>
                                )}
                                <br />
                                <FormControl
                                  fullWidth
                                  style={{ width: "100%", margin: "7px 0" }}
                                >
                                  <InputLabel id="demo-simple-select-label">
                                    Recording
                                  </InputLabel>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Recording"
                                    helperText="Select the language."
                                    style={{ textAlign: "left" }}
                                    value={recording}
                                    onChange={(e) => {
                                      setRecording(e.target.value);
                                    }}
                                    required
                                  >
                                    <MenuItem value={"true"}>Yes</MenuItem>
                                    <MenuItem value={"false"}>No</MenuItem>
                                  </Select>
                                </FormControl>
                                <FormControl
                                  fullWidth
                                  style={{ width: "100%", margin: "7px 0" }}
                                >
                                  <InputLabel id="demo-simple-select-label">
                                    Enable
                                  </InputLabel>

                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Enable"
                                    helperText="Select the language."
                                    style={{ textAlign: "left" }}
                                    value={enable}
                                    onChange={(e) => {
                                      setEnable(e.target.value);
                                    }}
                                  >
                                    <MenuItem value={"true"}>Active</MenuItem>
                                    <MenuItem value={"false"}>
                                      Deactive
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                                <br />
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Description"
                                  variant="outlined"
                                  name="description"
                                  value={description}
                                  onChange={handleChange}
                                  padding={"0px 0 !important"}
                                />
                              </form>
                            </Typography>
                          </DialogContent>
                          <DialogActions
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              paddingBottom: "20px",
                            }}
                          >
                            <Button
                              variant="contained"
                              sx={{
                                fontSize: "16px !impotant",
                                background:
                                  "linear-gradient(180deg, #fb7804 0%, #D76300 100%) !important",
                                marginLeft: "0px !important",
                                padding: "10px 20px !important",
                                textTransform: "capitalize !important",
                              }}
                              className="all_button_clr"
                              color="info"
                              onClick={handleEditClose}
                              autoFocus
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              sx={{
                                fontSize: "16px !impotant",
                                padding: "10px 20px !important",
                                textTransform: "capitalize !important",
                                marginLeft: "0px !important",
                                marginRight: "0px !important",
                              }}
                              className="all_button_clr"
                              color="error"
                              onClick={handleUpdate}
                            >
                              Update
                            </Button>
                          </DialogActions>
                        </Dialog>
                        {/* -----   Edit Campaign Modal End   ----- */}
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

export default SipDestination;
