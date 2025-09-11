import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../../src/style.css";

import "./sip_style.css";
import { toast } from "react-toastify";
import axios from "axios";
import { api } from "../../mockData";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import { Dropdown } from "react-bootstrap";
// import LiveCall from "./LiveCall";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Popover,
  List,
  ListItem,
  Modal,
  Popper,
  TextField,
  Toolbar,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import CallIcon from "@mui/icons-material/Call";
import { Close } from "@mui/icons-material";
import { getSipBilling } from "../../redux/actions/sipPortal/sipPortal_billingAction";
import { getManageProfileExtension } from "../../redux/actions/sipPortal/managePortal_extensionAction";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Header() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const current_user = localStorage.getItem("current_user");
  const user = JSON.parse(localStorage.getItem(`user_${current_user}`));
  const token = JSON.parse(localStorage.getItem(`user_${current_user}`));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [extension, setExtension] = useState("");
  const [openmodal, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    setAnchorEl(null);
  };
  const handleClose = (event) => {
    setOpen(false);
    setExtension("")
  };
  const handlePopoverClose = () => setAnchorEl(null);
  const handlePopoverToggle = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  // modal=end====>

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const location = useLocation();

  const logout = async () => {
    const config = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token?.access_token} `,
    };
    const { data } = await axios.post(
      `${api.dev}/api/logout`,
      {},
      {
        headers: config,
      }
    );
    if (data?.status === 200) {
      toast.info(data?.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500,
      });
      localStorage.removeItem(`user_${current_user}`);
      localStorage.removeItem("current_user");
      localStorage.removeItem("selectedTab")
      navigate("/");
    }
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${api.dev}/api/userbillingresource`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.access_token} `,
      },
    };
    axios
      .request(config)
      .then((response) => {
        setData(response?.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  useEffect(() => {
    dispatch(getSipBilling());
    dispatch(getManageProfileExtension());
  }, []); // Empty dependency array ensures this effect runs once on mount

  return (
    <>
      <Box sx={{ flexGrow: 1 }} className="manage_boxx" >
        <Box className="manage_mobile_logo d-lg-none d-md-none d-sm-block d-block">
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            className="d-flex align-items-center justify-content-center"
          >
            <a href="/sip_portal" className="mobile_logo_center">
              <img
                src="/img/logo_white11.png"
                alt="Manage Logo"
                className="img-fluid d-block logo_image"
                style={{ cursor: "pointer" }}
              />
            </a>
          </Typography>
        </Box>
        <AppBar position="static" className="manage_top_header">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
              className="d-flex align-items-center"
            >
              <a href="/sip_portal">
                <img
                  src="/img/logo_white11.png"
                  alt="Manage Logo"
                  className="img-fluid d-block logo_image d-lg-block d-md-block d-sm-none d-none"
                  style={{ cursor: "pointer" }}
                />
              </a>
            </Typography>

            <div className="manage_rgiht_bdr d-flex align-items-center">
              <div className="dshbrd_hdr_icon">
                <div>
                  <Typography
                    style={{
                      color: "white",
                      fontSize: "14px",
                      display: "flex",
                    }}
                  >
                    US Minute:
                    {data?.data?.map((item, index) => {
                      return (
                        <>
                          <div key={index}>&nbsp;{user.billing_type === "Postpaid" ? "Unlimited" : item.remaining_minutes}</div>
                        </>
                      );
                    })}
                  </Typography>
                </div>
              </div>
              <ul className="hdr_profile">
                <li
                  className="popover-button"
                  variant="contained"
                  //onMouseLeave={handlePopoverClose}
                  onClick={handleOpen}
                  type="button"
                >
                  {/* Add a class to the image element */}
                  <img
                    src="/img/nav_author.jpg"
                    className="img-fluid d-block rounded-circle"
                    alt="profile"
                  />
                  <div className="profile_name">
                  
                    <b>{user?.user_name} </b>
                  </div>

                  <Popper
                    className="user_box"
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    style={{ zIndex: "999", position: "absolute" }}
                  >
                    <Box
                      className="user_innr_box"
                      sx={{ border: 1, p: 1, bgcolor: "background.paper" }}
                    >
                      <Box>
                        <Typography variant="h5">
                          <img
                            src="/img/nav_author.jpg"
                            className="img-fluid d-block user_rounded-circle"
                            alt="profile"
                          />
                          {user?.user_name}
                        </Typography>
                      </Box>

                      <List className="user_list">
                        <ListItem>
                          <Typography
                            className="user_button"
                            onClick={handleOpen}
                          >
                            Change Password
                          </Typography>
                        </ListItem>
                      </List>
                    </Box>
                  </Popper>
                </li>
              </ul>
              {/* modal */}
              <Modal
                keepMounted
                open={openmodal}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
                style={{ position: "absolute", zIndex: "9999999 !important" }}
              >
                <Box sx={style} className="bg_imagess">
                  <IconButton
                    onClick={handleClose}
                    sx={{ float: "inline-end" }}
                  >
                    <Close />
                  </IconButton>
                  <br />
                  <Typography
                    id="keep-mounted-modal-title"
                    variant="h6"
                    component="h2"
                    color={"#092b5f"}
                    fontSize={"18px"}
                    fontWeight={"600"}
                  >
                    Profile
                  </Typography>

                  <Typography
                    id="keep-mounted-modal-description"
                    sx={{ mt: 2 }}
                  >
                    <TextField
                      style={{ width: "100%", margin: " 5px 0 5px 0" }}
                      type="text"
                      label="Old Password"
                      variant="outlined"
                      name="oldpassword"
                    />
                    <TextField
                      style={{ width: "100%", margin: " 5px 0 5px 0" }}
                      type="text"
                      label="New Password"
                      variant="outlined"
                      name="newpassword"
                    />
                    <TextField
                      style={{ width: "100%", margin: " 5px 0 5px 0" }}
                      type="text"
                      label="Confirm Password"
                      variant="outlined"
                      name="confirmpassword"
                    />
                    <FormControl
                                    fullWidth
                                    style={{ width: "100%", margin: "7px 0" }}
                                  >
                                    <InputLabel id="demo-simple-select-label">
                                    Extension
                                    </InputLabel>
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      label="Extension"
                                      helperText="Select the language."
                                      style={{ textAlign: "left" }}
                                      value={extension}
                                      onChange={(e) => {
                                        setExtension(e.target.value);
                                      }}
                                    >
                                      {state?.getManageProfileExtension?.getManageProfileExtension.map((item, index) => (
                                        <MenuItem key={index} value={item}>
                                          {item}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                  </Typography>

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
                  >
                    save
                  </Button>
                </Box>
              </Modal>
              {/* modal-end */}
              <Dropdown>
                <Dropdown.Toggle
                  className="dropbtn"
                  id="dropdown-basic"
                  style={{
                    color: "white",
                    textTransform: "capitalize",
                    fontSize: "14px",
                  }}
                >
                  Services
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="/redirect_portal">
                    Redirect
                  </Dropdown.Item>
                  <Dropdown.Item href="/sip_portal">Sip</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                style={{ paddingRight: "0" }}
                onClick={logout}
              >
                <LogoutIcon className="call_icon " />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {/* <!--navbar-sec--> */}
        <Navbar />
      </Box>
    </>
  );
}

export default Header;
