import { Close, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import InfoIcon from '@mui/icons-material/Info';
import { useDispatch, useSelector } from "react-redux";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import {
  createManageCallBlock,
  deleteManageCallBlock,
  getManageCallBlock,
  updateCallBlockStatus,
  updateManageCallBlock,
} from "../../redux/actions/sipPortal/managePortal_callBlockAction";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import { makeStyles } from "@mui/styles";
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
  spacedRow: {
      // Adjust spacing here, e.g., margin, padding, etc.
      marginBottom: '10px',
    },
  //    tooltip: {
  //     "&:hover": {
  //       backgroundColor: "red",
  //       color: "white",
  //     },
  //    backgroundColor: "blue",
  // },
  tooltip: {
    backgroundColor: '#603e21', // Change default background color
    color: 'white',
    '&:hover': {
      backgroundColor: '#603e21', // Change background color on hover
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

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton/>
      <GridToolbarDensitySelector />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

function SipCallBlock() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [type, setType] = useState("");
  const [callBlockId, setCallBlockId] = useState("");
  const [response, setResponse] = useState("");
  const [isActive, setIsActive] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const state = useSelector((state) => state);
  const handleOpen = () => setOpen(true);
  const handleAlertClose = () => {
    setCallBlockId("")
    setAlertMessage(false);
  }

  const handleSelectionChange = (selection) => {
    setSelectedRows(selection);
  };

  useEffect(() => {
    dispatch(getManageCallBlock());
  }, [response]);

  const handleClose = () => {
    setOpen(false);
    setCallBlockId("");
    setDescription("");
    setDetails("");
    setType("");
    setIsActive("");
  };

  // =========modal

  const handleButtonClick = useCallback(
    (row) => {
      setOpenModal(true);
      setCallBlockId(row.callBlockId);
      setIsActive(row.is_active);
      setDescription(row.description);
      setDetails(row.details);
      setType(row.type);
    },
    [setIsActive, setCallBlockId, setDescription, setDetails, setType]
  ); // Memoize event handler

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setIsActive("");
    setCallBlockId("");
    setDescription("");
    setDetails("");
    setType("");
  }, [setIsActive, setCallBlockId, setDescription, setDetails, setType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      details: details,
      description: description,
      type: type,
      is_active: isActive,
    });
    dispatch(
      createManageCallBlock(
        data,
        setOpen,
        setResponse,
        setDescription,
        setDetails,
        setType,
        setIsActive
      )
    );
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      id: callBlockId,
      details: details,
      description: description,
      type: type,
      is_active: isActive?.toString()?.charAt(0),
    });
    dispatch(
      updateManageCallBlock(
        data,
        setOpenModal,
        setResponse,
        setDescription,
        setDetails,
        setType,
        setIsActive
      )
    );
  };

  const handleMessage = useCallback((data) => {
    setName(data?.details)
    setValue(data);
    setCallBlockId(data?.callBlockId)
    setAlertMessage(true);
  }, [setName, setValue]); // Memoize event handler

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isXs = useMediaQuery(theme.breakpoints.only("xs")); // < 600px

  // =======table=======>
  const columns = [
    {
      field: "edit",
      headerName: "Action",
      width: 150,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",

      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <Tooltip title="Edit" disableInteractive interactive>
              <IconButton
                onClick={() => handleButtonClick(params.row)}
                style={{
                  fontSize: "15px",
                  color: "#04255C",
                  marginRight: "10px",
                }}
              >
                <Edit index={params.row.id} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" disableInteractive interactive>
            <IconButton onClick={() => handleMessage(params?.row)}>
              <Delete style={{ cursor: "pointer", color: "red" }} />
            </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: "username",
      headerName: "User Name",
      width: 240,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "details",
      headerName: "Caller ID Number",
      width: 250,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },
    {
      field: "type",
      headerName: "Type",
      width: 250,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      headerClassName: "custom-header",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "is_active",
      headerName: "Status",
      width: 180,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            {params.row.is_active === true ? (
              <>
                <div
                  style={{
                    color: "green",
                    //background: "green",
                    padding: "7px",
                    borderRadius: "5px",
                    //fontSize: "12px",
                    textTransform: "capitalize",
                  }}
                >
                  Active
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    color: "red",
                    //background: "red",
                    padding: "7px",
                    borderRadius: "5px",
                    //fontSize: "12px",
                    textTransform: "capitalize",
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
    state?.getManageCallBlock?.getCallBlock?.data &&
      state?.getManageCallBlock?.getCallBlock?.data.forEach((item, index) => {
        calculatedRows.push({
          id: index + 1,
          description: item?.description,
          details: item?.details,
          is_active: item?.is_active,
          type: item?.type,
          username: item?.username,
          callBlockId: item?.id,
        });
      });
    return calculatedRows;
  }, [state?.getManageCallBlock?.getCallBlock?.data]);

       const selectedCallerDataSet = new Set(); // Using Set to avoid duplicates
    
      selectedRows.forEach((id) => {
        const selectedRow = rows.find((row) => row.id === id);
        if (selectedRow) {
          selectedCallerDataSet.add(selectedRow.callBlockId); // Add only did_id
        }
      });
    
      const selectedCallerData = Array.from(selectedCallerDataSet); // Convert to comma-separated string
    
      const handleDelete = useCallback(
        () => {
          const request = {
            ids: selectedCallerData,
            is_active: value,
          };
          if (value === "true" || value === "false") {
            dispatch(updateCallBlockStatus(request, setResponse, setSelectedRows));
            setAlertMessage(false);
          } else {
            dispatch(
        deleteManageCallBlock(
          { id: callBlockId },
          setResponse,
          setCallBlockId
        )
      );
      setAlertMessage(false);
          }
        },
        [
          callBlockId,
          selectedCallerData,
          value,
          dispatch,
          setResponse,
          setCallBlockId,
          setSelectedRows
        ]
      ); // Memoize event handler

  return (
    <>
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
                          <h3>Call Block</h3>
                          {/* <p>
                          Quickly access information and tools related to your
                          account.
                        </p> */}
                        </div>
                        <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "end",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: selectedRows[0] ? "block" : "none",
                                  }}
                                >
                                  <IconButton
                                    className="all_button_clr"
                                    onClick={() => handleMessage("true")}
                                    sx={{
                                      background: "green !important",
                                      fontSize: "15px",
                                      borderRadius: "5px",
                                      border: "none",
                                      color: "#fff",
                                      px: 4,
                                      textTransform: "capitalize",
                                      height: "35px",
                                      width: "90px",
                                      alignItems: "center",
                                      position: "relative",
                                      right: isMobile ? "5px" : "-15px",
                                      textAlign: "center", // Add this line
                                    }}
                                  >
                                    Active
                                  </IconButton>
                                  <IconButton
                                    onClick={() => handleMessage("false")}
                                    className="filter_block_btn"
                                    style={{
                                      height: "35px",
                                      width: "90px",
                                      px: 4,
                                      marginLeft: "10px",
                                      background: selectedRows.length
                                        ? "red"
                                        : "grey",
                                    }}
                                    disabled={selectedRows.length === 0}
                                  >
                                    Deactive
                                  </IconButton>
                                </Box>
                                <Box>
                                  <IconButton
                                    className="all_button_clr"
                                    onClick={handleOpen}
                                    sx={{
                                      fontSize: "15px",
                                      borderRadius: "5px",
                                      border: "none",
                                      color: "#fff",
                                      px: 4,
                                      textTransform: "capitalize",
                                      height: "35px",
                                      width: "90px",
                                      minWidth: "90px",
                                      flexShrink: 0,
                                      display: "inline-flex",
                                      justifyContent: "space-evenly",
                                      alignItems: "center",
                                      position: "relative",
                                    }}
                                  >
                                    Add
                                    <AddOutlinedIcon />
                                  </IconButton>
                                </Box>
                              </div>

                        <Modal
                          aria-labelledby="transition-modal-title"
                          aria-describedby="transition-modal-description"
                          open={open}
                          closeAfterTransition
                          slots={{ backdrop: Backdrop }}
                          slotProps={{
                            backdrop: {
                              timeout: 500,
                            },
                          }}
                        >
                          <Fade in={open} className="bg_imagess">
                            <Box
                              sx={style}
                              borderRadius="10px"
                              textAlign="center"
                            >
                              <IconButton
                                onClick={handleClose}
                                sx={{ float: "inline-end" }}
                              >
                                <Close />
                              </IconButton>
                              <br />
                              <br />
                              <Typography
                                id="transition-modal-title"
                                variant="h6"
                                component="h2"
                                color={"#092b5f"}
                                fontSize={"18px"}
                                fontWeight={"600"}
                                marginBottom={"16px"}
                              >
                                Add Call Block
                              </Typography>
                              <form
                                style={{
                                  textAlign: "center",
                                  textAlign: "center",
                                  // height: "400px",
                                  overflow: "auto",
                                  paddingTop: "10px",
                                  padding: "5px",
                                }}
                              >
                                <FormControl
                                  fullWidth
                                  style={{ margin: " 5px 0 5px 0" }}
                                >
                                  <InputLabel id="demo-simple-select-label">
                                    Type select box
                                  </InputLabel>
                                  <Select
                                    style={{ textAlign: "left" }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Type select box"
                                    value={type}
                                    onChange={(e) => {
                                      setType(e.target.value);
                                    }}
                                  >
                                    <MenuItem value={"CallerID"}>
                                      CallerID
                                    </MenuItem>
                                    <MenuItem value={"AreaCode"}>
                                      AreaCode
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
                                  label="Caller ID Number"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  value={details}
                                  onChange={(e) => {
                                    setDetails(e.target.value);
                                  }}
                                />
                                 <InputLabel style={{textAlign:'left', fontSize: '14px',display:'flex',alignItems:'center'}}>
                                      <Tooltip style={{color:'#fff'}} title="Sample CallerID Format +13456232323 / Sample Areacode +13" classes={{ tooltip: classes.tooltip }}>
                                        <InfoIcon style={{fontSize:"18px",color:"#603e21"}} />&nbsp;
                                        </Tooltip >
                                        Sample CallerID Format +13456232323 / Sample Areacode +13 </InputLabel>
                                <br />

                              
                                <FormControl
                                  fullWidth
                                  style={{ margin: " 5px 0 5px 0" }}
                                >
                                  <InputLabel id="demo-simple-select-label">
                                    Status
                                  </InputLabel>
                                  <Select
                                    style={{ textAlign: "left" }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    // value={age}
                                    label="Status"
                                    value={isActive}
                                    onChange={(e) => {
                                      setIsActive(e.target.value);
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
                                  type="description"
                                  label="Description"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  value={description}
                                  onChange={(e) => {
                                    setDescription(e.target.value);
                                  }}
                                />

                                <br />

                                <Button
                                  variant="contained"
                                  className="all_button_clr"
                                  color="primary"
                                  sx={{
                                    fontSize: "16px !impotant",
                                    background:
                                      "linear-gradient(180deg, #fb7804 0%, #D76300 100%) !important",
                                    marginTop: "20px",
                                    padding: "10px 20px !important",
                                    textTransform: "capitalize !important",
                                  }}
                                  onClick={handleClose}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="contained"
                                  className="all_button_clr"
                                  color="primary"
                                  sx={{
                                    fontSize: "16px !impotant",
                                    background: "#092b5f",
                                    marginTop: "20px",
                                    padding: "10px 20px !important",
                                    textTransform: "capitalize !important",
                                  }}
                                  onClick={handleSubmit}
                                >
                                  save
                                </Button>
                              </form>
                            </Box>
                          </Fade>
                        </Modal>
                      </div>

                      {/* edit */}
                      <Dialog
                        open={openModal}
                        //onClose={handleCloseModal}
                        sx={{ textAlign: "center" }}
                      >
                        <Box>
                          <IconButton
                            onClick={handleCloseModal}
                            sx={{
                              float: "inline-end",
                              marginRight: "20px",
                              marginTop: "20px",
                            }}
                          >
                            <Close />
                          </IconButton>
                        </Box>

                        <DialogTitle
                          sx={{
                            color: "#07285d",
                            fontWeight: "600",
                            width: "500px",
                          }}
                          className="mobile_view"
                        >
                          {/* <Box>
                  {" "}
                  <img src="/img/mdl_icon.png" alt="user icon" />
                </Box> */}
                          Edit
                        </DialogTitle>
                        <DialogContent>
                          <form>
                            {/* <SelectComponent handleClose={handleClose} /> */}
                            <Typography variant="body1">
                              <br />
                              <form
                                style={{
                                  textAlign: "center",
                                  textAlign: "center",
                                  // height: "400px",
                                  overflow: "auto",
                                  paddingTop: "10px",
                                  padding: "5px",
                                }}
                              >
                                <FormControl
                                  fullWidth
                                  style={{ margin: " 5px 0 5px 0" }}
                                >
                                  <InputLabel id="demo-simple-select-label">
                                    Type select box
                                  </InputLabel>
                                  <Select
                                    style={{ textAlign: "left" }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Type select box"
                                    value={type}
                                    onChange={(e) => {
                                      setType(e.target.value);
                                    }}
                                  >
                                    <MenuItem value={"CallerID"}>
                                      CallerID
                                    </MenuItem>
                                    <MenuItem value={"AreaCode"}>
                                      AreaCode
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
                                  label="Caller ID Number"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  value={details}
                                  onChange={(e) => {
                                    setDetails(e.target.value);
                                  }}
                                />
                                <br />

                               
                                <FormControl
                                  fullWidth
                                  style={{ margin: " 5px 0 5px 0" }}
                                >
                                  <InputLabel id="demo-simple-select-label">
                                    Status
                                  </InputLabel>
                                  <Select
                                    style={{ textAlign: "left" }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    // value={age}
                                    label="Status"
                                    value={isActive}
                                    onChange={(e) => {
                                      setIsActive(e.target.value);
                                    }}
                                  >
                                    <MenuItem value={"true"}>Active</MenuItem>
                                    <MenuItem value={"false"}>
                                      Deactive
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="description"
                                  label="Description"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  value={description}
                                  onChange={(e) => {
                                    setDescription(e.target.value);
                                  }}
                                />

                            
                                <br />
                              </form>
                            </Typography>
                          </form>
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
                              marginTop: "20px",
                              marginLeft: "0px !important",
                              padding: "10px 20px !important",
                              textTransform: "capitalize !important",
                            }}
                            className="all_button_clr"
                            color="info"
                            onClick={handleCloseModal}
                            autoFocus
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              fontSize: "16px !impotant",
                              marginTop: "20px",
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
                      {/* edit-end */}


                     {/* Delete Confirmation Modal Start  */}
                            <Dialog
                              open={alertMessage}
                              onClose={handleAlertClose}
                              aria-labelledby="alert-dialog-title"
                              aria-describedby="alert-dialog-description"
                              sx={{ textAlign: "center" }}
                              //className="bg_imagess"
                            >
                              <DialogTitle
                                id="alert-dialog-title"
                                sx={{ color: "#133325", fontWeight: "600" }}
                              >
                                {value === "true"
                                  ? "Active Confirmation"
                                  : value === "false"
                                  ? "Deactive"
                                  : "Delete Confirmation"}
                              </DialogTitle>
                              <DialogContent>
                                <DialogContentText
                                  id="alert-dialog-description"
                                  sx={{ paddingBottom: "0px !important" }}
                                >
                                  Are you sure you want to{" "}
                                  {value === "true"
                                    ? "active"
                                    : value === "false"
                                    ? "deactive"
                                    : "delete "}{" "}
                                  {name} ?
                                </DialogContentText>
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
                                    marginTop: "20px",
                                    marginLeft: "0px !important",
                                    padding: "10px 20px !important",
                                    textTransform: "capitalize !important",
                                  }}
                                  className="all_button_clr"
                                  color="info"
                                  onClick={handleAlertClose}
                                  autoFocus
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="contained"
                                  sx={{
                                    fontSize: "16px !impotant",
                                    marginTop: "20px",
                                    background:
                                      value === "true"
                                        ? "green !important"
                                        : value === "false"
                                        ? "red !important"
                                        : "#f44336 !important",
                                    padding: "10px 20px !important",
                                    textTransform: "capitalize !important",
                                    marginLeft: "0px !important",
                                    marginRight: "0px !important",
                                  }}
                                  className="all_button_clr"
                                  color="error"
                                  onClick={handleDelete}
                                  startIcon={
                                    value === "true" ? (
                                      <CheckIcon />
                                    ) : value === "false" ? (
                                      <BlockIcon />
                                    ) : (
                                      <DeleteIcon />
                                    )
                                  }
                                >
                                  {value === "true"
                                    ? "Active"
                                    : value === "false"
                                    ? "Deactive"
                                    : "Delete"}
                                </Button>
                              </DialogActions>
                            </Dialog>
                            {/* Delete Confirmation Modal End  */}

                      {/* <!--table---> */}
                      <ThemeProvider theme={theme}>
                      <div style={{ height: '100%', width: '100%' }}>
                          <DataGrid
                                      rows={rows}
                                      columns={columns}
                                      checkboxSelection
                                      density="compact"
                                      headerClassName="custom-header"
                                      rowSelectionModel={selectedRows}
                                      onRowSelectionModelChange={
                                        handleSelectionChange
                                      }
                                      // getRowClassName={(params) =>
                                      //   isRowBordered(params) ? 'borderedGreen' : 'borderedRed'
                                      // }
                                      components={{ Toolbar: GridToolbar }}
                                      slots={{
                                        toolbar: CustomToolbar,
                                      }}
                                      autoHeight // Automatically adjust the height to fit all rows
                                      disableColumnResize={false} // Allow column resizing
                                      hideFooterPagination={
                                        window.innerWidth < 600
                                      } // Hide pagination for small screens
                                      sx={{
                                        "& .MuiDataGrid-cell": {
                                          fontSize: {
                                            xs: "12px",
                                            sm: "14px",
                                            md: "14px",
                                          }, // Responsive font sizes
                                          wordBreak: "break-word !important", // Break long words
                                          whiteSpace: "break-spaces !important", // Allow multi-line text
                                        },
                                      }}
                                    />
                        </div>
                      </ThemeProvider>

                      {/* <!--table-end--> */}
                    </div>
                    {/* <!--role-content--> */}
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-profile"
                    role="tabpanel"
                    aria-labelledby="pills-profile-tab"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SipCallBlock;
