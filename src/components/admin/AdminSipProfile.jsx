import { Close, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@mui/styles";
import { getAllUsers } from "../../redux/actions/adminPortal/userAction";
import { createAdminSipProfile, deleteAdminSipProfile, getAdminSipProfile, updateAdminSipProfile } from "../../redux/actions/adminPortal/adminPortal_sipProfileAction";
const drawerWidth = 240;

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
      },
    },
  },
});

const useStyles = makeStyles({
  spacedRow: {
      // Adjust spacing here, e.g., margin, padding, etc.
      marginBottom: '10px',
    },
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

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton/>
      <GridToolbarDensitySelector />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

function AdminSipProfile({ colorThem }) {
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [primarySipServer, setPrimarySipServer] = useState("");
  const [secondarySipServer, setSecondarySipServer] = useState("");
  const [type, setType] = useState("");
  const [sipProfileId, setSipProfileId] = useState("");
  const [response, setResponse] = useState("");
  const [sName, setSname] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [userId, setUserId] = useState("");
  const [alertMessage, setAlertMessage] = useState(false);
  const [name, setName] = useState("");
  const state = useSelector((state) => state);
  const handleOpen = () => setOpen(true);
  const classes = useStyles();

  const handleAlertClose = () => {
    setSipProfileId("")
    setAlertMessage(false);
  }

  useEffect(() => {
    dispatch(getAdminSipProfile());
    dispatch(getAllUsers(""));
  }, [response]);

  const handleClose = () => {
    setOpen(false);
    setSipProfileId("");
    setDescription("");
    setType("");
    setSname("");
    setUserId("");
  };

  // =========modal

  const handleButtonClick = useCallback(
    (row) => {
      setOpenModal(true);
      setSecondarySipServer(row.secondary_server);
      setDescription(row.description);
      setPrimarySipServer(row.primary_server);
      setSipProfileId(row.sipProfileId);
      setUserId(row.user_id);
      setSname(row.name);
    },
    [setSipProfileId, setDescription, setSecondarySipServer,setPrimarySipServer, setUserId, setSname]
  ); // Memoize event handler

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setSecondarySipServer("");
    setSipProfileId("");
    setDescription("");
    setPrimarySipServer("");
    setUserId("");
    setSname("");
  }, [setSipProfileId, setDescription, setPrimarySipServer, setSecondarySipServer, setUserId, setSname]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      user_id: userId,
      description: description,
      primary_server: primarySipServer,
      secondary_server: secondarySipServer,
      name: sName
    });
    dispatch(
      createAdminSipProfile(
        data,
        handleClose,
        setResponse,
      )
    );
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      id: sipProfileId,
      description: description,
      primary_server: primarySipServer,
      secondary_server: secondarySipServer,
      user_id: userId,
      name: sName
      
    });
    dispatch(
      updateAdminSipProfile(
        data,
        handleCloseModal,
        setResponse,
      )
    );
  };

  const handleMessage = useCallback((data) => {
    setName(data?.primary_server)
    setSipProfileId(data?.sipProfileId)
    setAlertMessage(true);
  }, [setName]); // Memoize event handler

  const handleDelete = useCallback(
    (id) => {
      dispatch(deleteAdminSipProfile({ id: sipProfileId }, setResponse, setSipProfileId));
       setAlertMessage(false);
    },
    [sipProfileId,dispatch, setResponse, setSipProfileId]
  ); // Memoize event handler

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
            <Tooltip title="edit" disableInteractive interactive>
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
            <Tooltip title="delete" disableInteractive interactive>
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
      width: 180,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Name",
      width: 190,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "primary_server",
      headerName: "Primary Server",
      width: 250,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "secondary_server",
    //   headerName: "Secondary Server",
    //   width: 250,
    //   headerAlign: "center",
    //   align: "center",
    //   headerClassName: "custom-header",
    // },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },

   
  ];

  const rows = useMemo(() => {
    const calculatedRows = [];
    state?.getAdminSipProfile?.getSipProfile?.data &&
      state?.getAdminSipProfile?.getSipProfile?.data.forEach((item, index) => {
        calculatedRows.push({
          id: index + 1,
          description: item?.description,
          primary_server: item?.primary_server,
          secondary_server: item?.secondary_server,
          user_id: item?.user_id,
          sipProfileId: item?.id,
          username: item.username,
          name: item.name
        });
      });
    return calculatedRows;
  }, [state?.getAdminSipProfile?.getSipProfile?.data]);

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
                    <div className="">
                      <div
                        className="cntnt_title"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "end",
                        }}
                      >
                        <div>
                          <h3>SIP Profiles</h3>
                          {/* <p>
                          Quickly access information and tools related to your
                          account.
                        </p> */}
                        </div>
                        <IconButton
                          className="all_button_clr"
                          onClick={handleOpen}
                        >
                          Add
                          <AddOutlinedIcon />
                        </IconButton>

                       

                        <Dialog
                      open={open} //onClose={handleCloseModal}
                  
                    >
                      <Box >
                        <br />
                        <IconButton
                          className="close_icon"
                          onClick={handleClose}
                          sx={{ float: "inline-end" }}
                        >
                          <Close />
                        </IconButton>
                      </Box>

                      <DialogTitle
                        sx={{
                          color: "#07285d",
                          fontWeight: "600",
                          width: "auto",
                          textAlign: "center",
                        }}
                        className="extension_title"
                      >
                               Add SIP Profile
                      </DialogTitle>

                      <DialogContent>
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
                                    {state?.allUsers?.users?.map(
                                      (item, index) => {
                                        return (
                                          <MenuItem
                                            key={index}
                                            value={item?.id}
                                          >
                                            {item.username}
                                          </MenuItem>
                                        );
                                      }
                                    )}
                                  </Select>
                                </FormControl>

                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Name"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  value={sName}
                                  onChange={(e) => {
                                    setSname(e.target.value);
                                  }}
                                />
                                <br />


                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Primary SIP Server"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  value={primarySipServer}
                                  onChange={(e) => {
                                    setPrimarySipServer(e.target.value);
                                  }}
                                />
                                <br />

                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Secondary SIP Server"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  value={secondarySipServer}
                                  onChange={(e) => {
                                    setSecondarySipServer(e.target.value);
                                  }}
                                />
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
                          onClick={handleClose}
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
                          onClick={handleSubmit}
                        >
                          Save
                        </Button>
                      </DialogActions>
                    </Dialog>
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
                                    {state?.allUsers?.users?.map(
                                      (item, index) => {
                                        return (
                                          <MenuItem
                                            key={index}
                                            value={item?.id}
                                          >
                                            {item.username}
                                          </MenuItem>
                                        );
                                      }
                                    )}
                                  </Select>
                                </FormControl>

                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Name"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  value={sName}
                                  onChange={(e) => {
                                    setSname(e.target.value);
                                  }}
                                />
                                <br />

                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Primary SIP Server"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  value={primarySipServer}
                                  onChange={(e) => {
                                    setPrimarySipServer(e.target.value);
                                  }}
                                />
                                <br />

                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Secondary SIP Server"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  value={secondarySipServer}
                                  onChange={(e) => {
                                    setSecondarySipServer(e.target.value);
                                  }}
                                />
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
                sx={{ color: "#07285d", fontWeight: "600" }}
              >
                {"Delete Confirmation"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  id="alert-dialog-description"
                  sx={{ paddingBottom: "0px !important" }}
                >
                  Are you sure you want to delete {name} ?
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
                    padding: "10px 20px !important",
                    textTransform: "capitalize !important",
                    marginLeft: "0px !important",
                    marginRight: "0px !important",
                  }}
                  className="all_button_clr"
                  color="error"
                  onClick={handleDelete}
                  startIcon={<DeleteIcon />}
                >
                  Delete
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
                            headerClassName="custom-header"
                            components={{ Toolbar: GridToolbar }}
                            slots={{
                              toolbar: CustomToolbar,
                            }}
                            autoHeight
                          />
                        </div>
                      </ThemeProvider>

                      {/* <!--table-end--> */}
                    </div>
                    {/* <!--role-content--> */}
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

export default AdminSipProfile;
