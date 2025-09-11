import { Close, Edit, Label } from "@mui/icons-material";
import {
  Box,
  Button,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  Modal,
  MenuItem,
  Select,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Tooltip,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@mui/styles";
import "../../Switcher.scss";
import axios from "axios";
import { api } from "../../mockData";
import {
  createManageQueue,
  getManageQueue,
  updateManageQueue,
} from "../../redux/actions/sipPortal/managePortal_queueAction";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
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
  spacedRow: {
    // Adjust spacing here, e.g., margin, padding, etc.
    marginBottom: "10px",
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
      <GridToolbarColumnsButton/>
      <GridToolbarDensitySelector />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

const array = [
  "ringall",
  "leastrecent",
  "fewestcalls",
  "random",
  "rrmemory",
  "linear",
  "wrandom",
  "rrordered",
];

function SipQueue() {
  const current_user = localStorage.getItem("current_user");
  const token = JSON.parse(localStorage.getItem(`user_${current_user}`));
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [response, setResponse] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [queueName, setQueueName] = useState("");
  const [ringtimeout, setRingtimeout] = useState("");
  const [values, setValues] = useState([]);
  const [moh, setMoh] = useState("");
  const [strategy, setStrategy] = useState("");
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setStrategy("");
    setQueueName("");
    setMoh("");
  };

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setStrategy("");
    setQueueName("");
    setMoh("");
  }, []);

  const handleButtonClick = useCallback((row) => {
    setOpenModal(true);
    setQueueName(row.name);
    setStrategy(row.strategy);
    setMoh(row.moh);
    setRingtimeout(row.ringtimeout)
  }, []); // Memoize event handler

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      name: queueName,
      ringtimeout: ringtimeout,
      strategy: strategy,
      moh: moh,
    });

    dispatch(
      createManageQueue(
        data,
        setOpen,
        setResponse,
        setQueueName,
        setMoh,
        setRingtimeout
      )
    );
  };

  const handleUpdate = useCallback(
    (e) => {
      e.preventDefault();
      let data = JSON.stringify({
        name: queueName,
        ringtimeout: ringtimeout,
        strategy: strategy,
        moh: moh,
      });
      dispatch(
        updateManageQueue(
          data,
          setOpenModal,
          setResponse,
          setQueueName,
          setMoh,
          setRingtimeout
        )
      );
    },
    [
      strategy,
      queueName,
      moh,
      ringtimeout,
      setOpenModal,
      setResponse,
      setQueueName,
      setMoh,
      setRingtimeout,
    ]
  );

  const getMenuItemContent = (name) => {
    // Define content based on the strategy name
    switch (name) {
      case "ringall":
        return "Rings all agents at once, connecting the call to the first one who answers.";
      case "leastrecent":
        return "Sends the call to the agent who has been idle the longest.";
      case "fewestcalls":
        return "Sends the call to the agent who has handled the fewest calls.";
      case "random":
        return "Chooses an agent randomly to receive the call.";
      case "rrmemory":
        return "Remembers the last agent selected and starts the search for the next available agent from the next position.";
      case "linear":
        return "Distributes calls to agents in a predefined order, typically in rotation.";
      case "wrandom":
        return "Randomly selects an agent, with higher-weighted agents having a greater chance of selection.";
      case "rrordered":
        return "Distributes calls in a round-robin manner but considers agent priority or weight for ordering.";
      // Add cases for other strategy names as needed
      default:
        return name;
    }
  };

  useEffect(() => {
    dispatch(getManageQueue());
  }, [response]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${api.dev}/api/getuserprofilemoh`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token} `,
      },
    };
    axios
      .request(config)
      .then((response) => {
        setValues(response?.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const columns = [
    {
      field: "action",
      headerName: "Action",
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 200,
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <IconButton onClick={() => handleButtonClick(params.row)}>
              <Edit
                index={params.row.id}
                style={{ cursor: "pointer", color: "#603e21" }}
              />
            </IconButton>
          </div>
        );
      },
    },
    {
      field: "username",
      headerName: "UserName",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 200,
      align: "center",
    },
    {
      field: "name",
      headerName: "Queue Name",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 200,
      align: "center",
    },

    {
      field: "strategy",
      headerName: "Strategy",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 200,
      align: "center",
    },
    {
      field: "ringtimeout",
      headerName: "Ringtimeout",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 200,
      align: "center",
    },

    {
      field: "moh",
      headerName: "Music On Hold",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 200,
      align: "center",
    },
    // {
    //     field: "member",
    //     headerName: "Member/Extension",
    //     headerClassName: "custom-header",
    //     headerAlign: "center",
    //     width: 280,
    //     align: "center",
    //   },
   
  ];

  const rows = useMemo(() => {
    const calculatedRows = [];
    state?.getManageQueue?.getQueue &&
      state?.getManageQueue?.getQueue?.forEach((item, index) => {
        calculatedRows.push({
          id: index + 1,
          name: item?.name,
          strategy: item?.strategy,
          username: item?.username,
          user_id: item?.user_id,
          moh: item?.moh,
          ringtimeout: item?.ringtimeout,
        });
      });
    return calculatedRows;
  }, [state?.getManageQueue?.getQueue]);
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
                          <h3>Queue</h3>
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
                                Add Queue
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
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Queue Name"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  name="queueName"
                                  value={queueName}
                                  onChange={(e) => setQueueName(e.target.value)}
                                />
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Ring Timeout"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  name="ringtimeout"
                                  value={ringtimeout}
                                  onChange={(e) => {
                                    const numericValue = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                    setRingtimeout(numericValue);
                                  }}
                                  inputProps={{
                                    inputMode: "numeric",
                                    // pattern: '[0-9]*',
                                  }}
                                />

                                <FormControl
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                >
                                  <InputLabel id="demo-multiple-checkbox-label">
                                    Strategy
                                  </InputLabel>
                                  <Select
                                    style={{ textAlign: "left" }}
                                    labelId="demo-multiple-checkbox-label"
                                    label="Strategy"
                                    id="demo-multiple-checkbox"
                                    fullWidth
                                    value={strategy}
                                    onChange={(e) => {
                                      setStrategy(e.target.value);
                                    }}
                                  >
                                    {array.map((name, index) => (
                                      <MenuItem key={index} value={name}>
                                        <Tooltip
                                          title={getMenuItemContent(name)}
                                          placement="right"
                                        >
                                          <span>{name}</span>
                                        </Tooltip>
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>

                                <FormControl
                                  fullWidth
                                  style={{ width: "100%", margin: "7px 0" }}
                                >
                                  <InputLabel id="demo-simple-select-label">
                                    Music On Hold
                                  </InputLabel>

                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Music On Hold"
                                    helperText="Select the language."
                                    style={{ textAlign: "left" }}
                                    value={moh}
                                    onChange={(e) => {
                                      setMoh(e.target.value);
                                    }}
                                    required
                                  >
                                    {values?.data?.map((item, index) => {
                                      return (
                                        <MenuItem key={index} value={item}>
                                          {item}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
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
                      {/* edit-modal */}
                      <Dialog
                        open={openModal}
                        onClose={handleCloseModal}
                        sx={{ textAlign: "center" }}
                      >
                        <Box>
                          <IconButton
                            onClick={handleCloseModal}
                            sx={{
                              float: "inline-end",
                              margin: "10px 10px 0px 0px",
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
                        >
                          <Box>
                            <img src="/img/mdl_icon.png" alt="user icon" />
                          </Box>
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
                                  // height: "348px",
                                  height: "auto",
                                  // overflow: "auto",
                                  paddingTop: "10px",
                                  padding: "5px",
                                  width: "auto",
                                }}
                              >
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Queue Name"
                                  variant="outlined"
                                  name="queueName"
                                  value={queueName}
                                  onChange={(e) => setQueueName(e.target.value)}
                                  disabled
                                />
                                <br />

                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Ring Timeout"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  name="ringtimeout"
                                  value={ringtimeout}
                                  onChange={(e) => {
                                    const numericValue = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                    setRingtimeout(numericValue);
                                  }}
                                  inputProps={{
                                    inputMode: "numeric",
                                    // pattern: '[0-9]*',
                                  }}
                                />

                                <FormControl
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                >
                                  <InputLabel id="demo-multiple-checkbox-label">
                                    Strategy
                                  </InputLabel>
                                  <Select
                                    style={{ textAlign: "left" }}
                                    labelId="demo-multiple-checkbox-label"
                                    label="Strategy"
                                    id="demo-multiple-checkbox"
                                    fullWidth
                                    value={strategy}
                                    onChange={(e) => {
                                      setStrategy(e.target.value);
                                    }}
                                  >
                                    {array.map((name, index) => (
                                      <MenuItem key={index} value={name}>
                                        <Tooltip
                                          title={getMenuItemContent(name)}
                                          placement="right"
                                        >
                                          <span>{name}</span>
                                        </Tooltip>
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>

                                <br />

                                <FormControl
                                  fullWidth
                                  style={{ width: "100%", margin: "7px 0" }}
                                >
                                  <InputLabel id="demo-simple-select-label">
                                    Music On Hold
                                  </InputLabel>

                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Music On Hold"
                                    helperText="Select the language."
                                    style={{ textAlign: "left" }}
                                    value={moh}
                                    onChange={(e) => {
                                      setMoh(e.target.value);
                                    }}
                                    required
                                  >
                                    {values?.data?.map((item, index) => {
                                      return (
                                        <MenuItem key={index} value={item}>
                                          {item}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
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
                              // marginTop: "20px",
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
                              // marginTop: "20px",
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
                      {/* end-edit-modal*/}
                      {/* <!--table---> */}
                      <ThemeProvider theme={theme}>
                      <div style={{ height: '100%', width: '100%' }}>
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

export default SipQueue;
