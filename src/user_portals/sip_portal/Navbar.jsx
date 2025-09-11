import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Router from "../../routes/route";
import {
  Box,
  ListItemIcon,
  Menu,
  MenuItem,
  Tab,
  Tabs,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExtensionIcon from "@mui/icons-material/Extension";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import AppsIcon from "@mui/icons-material/Apps";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import { Call } from "@mui/icons-material";
import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import QueueMusicIcon from "@mui/icons-material/PlayCircleRounded";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
const tabConfig = {
  dashboard: {
    label: "Dashboard",
    icon: (
      <DashboardIcon
        style={{ color: "#fff", margin: "0", marginRight: "5px" }}
      />
    ),
  },
  did_tfn_number: {
    label: "Inbound",
    icon: (
      <ReceiptOutlinedIcon
        style={{ color: "#fff", margin: "0", marginRight: "5px" }}
      />
    ),
  },
  extensions: {
    label: "Outbound",
    icon: (
      <ExtensionIcon
        style={{ color: "#fff", margin: "0", marginRight: "5px" }}
      />
    ),
  },
  report: {
    label: "Report",
    icon: (
      <HelpOutlineOutlinedIcon
        style={{ color: "#fff", margin: "0", marginRight: "5px" }}
      />
    ),
  },
  account: {
    label: "Account",
    icon: (
      <AccountBalanceIcon
        style={{ color: "#fff", margin: "0", marginRight: "5px" }}
      />
    ),
  },
  call_block: {
    label: "CALL BLOCK",
    icon: (
      <PhoneDisabledIcon
        style={{ color: "#f5751D", fontSize: "20px !important" }}
      />
    ),
  },
  queue: {
    label: "QUEUE",
    icon: (
      <AddToQueueIcon
        style={{ color: "#f5751D", fontSize: "20px !important" }}
      />
    ),
  },
  queue_member: {
    label: "QUEUE MEMBER",
    icon: (
      <GroupAddIcon style={{ color: "#f5751D", fontSize: "20px !important" }} />
    ),
  },
  active_calls: {
    label: "LIVE CALLS",
    icon: <Call style={{ color: "#fb7804", fontSize: "20px !important" }} />,
  },
  audit_logs: {
    label: "AUDIT LOGS",
    icon: (
      <VerifiedUserIcon
        style={{ color: "#fb7804", fontSize: "20px !important" }}
      />
    ),
  },
  live_extension: {
    label: "LIVE EXTENSION",
    icon: (
      <OnlinePredictionIcon
        style={{ color: "#fb7804", fontSize: "20px !important" }}
      />
    ),
  },
  billing_history: {
    label: "BILLING HISTORY",
    icon: (
      <AccountBalanceWalletIcon
        style={{ color: "#fb7804", fontSize: "20px !important" }}
      />
    ),
  },
  moh: {
    label: "MOH",
    icon: (
      <QueueMusicIcon
        style={{ color: "#fb7804", fontSize: "20px !important" }}
      />
    ),
  },
  recording: {
    label: "RECORDING",
    icon: (
      <RecordVoiceOverIcon
        style={{ color: "#fb7804", fontSize: "20px !important" }}
      />
    ),
  },
  sip_profile: {
    label: "SIP PROFILES",
    icon: (
      <ContactPhoneIcon
        style={{ color: "#fb7804", fontSize: "20px !important" }}
      />
    ),
  },
  // Add other menu items here...
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const current_user = localStorage.getItem("current_user");
  const user = JSON.parse(localStorage.getItem(`user_${current_user}`));
  const [value, setValue] = useState(() => {
    // Retrieve the last selected tab from local storage or default to 0
    const storedValue = localStorage.getItem("selectedTab");
    return storedValue !== null ? parseInt(storedValue, 10) : 0;
  });

  useEffect(() => {
    // Store the current tab index in local storage whenever it changes
    localStorage.setItem("selectedTab", value);
  }, [value]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    // Perform navigation based on the selected tab index
    switch (newValue) {
      case 0:
        navigate(Router.SIP_DASHBOARD);
        break;
        case 1:
          navigate(Router.SIP_DESTINATION);
          break;
      case 2:
        navigate(Router.SIP_EXTENSIONS);
        break;
      case 3:
        navigate(Router.SIP_REPORT);
        break;
        case 4:
          navigate(Router.SIP_ACCOUNT);
          break;
      default:
        break;
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    handleClose(); // Close the menu
    navigate(path); // Navigate to the specified path
  };

  const filteredTabs = ["dashboard", "did_tfn_number", "extensions", "report", "account"]; //  Add other tabs here

  return (
    <>
      <Box sx={{ width: "100%", backgroundColor: "#603e21" }} className="sip_tabs">
        <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex" }}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            {filteredTabs.map((key) => (
              <Tab
                key={key}
                label={tabConfig[key].label}
                icon={tabConfig[key].icon}
                sx={{ display: "block", alignItems: "center",
                  
                 }}
              />
            ))}
            <Tab
              label="Apps"
              onClick={handleClick}
              icon={
                <AppsIcon
                  style={{ color: "#fff", margin: "0", marginRight: "5px" }}
                />
              }
              sx={{
                display: "block",
                alignItems: "center",
               
              }}
            />
            <Menu
              className="manag_app_box"
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {user?.blocked_features
  ?.filter((key) => key !== "moh" && key !== "queue" && key !== "queue_member")
  .map((key) => (
    <MenuItem key={key} onClick={() => handleMenuItemClick(key)}>
      <ListItemIcon>{tabConfig[key]?.icon}</ListItemIcon>
      {tabConfig[key]?.label}
    </MenuItem>
  ))}
            </Menu>
          </Tabs>
        </Box>
      </Box>
    </>
  );
}

export default Navbar;
