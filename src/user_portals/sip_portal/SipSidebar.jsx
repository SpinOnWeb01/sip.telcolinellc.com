import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Router from "../../routes/route";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon as MuiListItemIcon,
  IconButton,
  useMediaQuery,
  useTheme,
  Collapse,
  Tooltip
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
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import ReceiptIcon from "@mui/icons-material/Receipt";
import KeyIcon from "@mui/icons-material/Key";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import StyleIcon from "@mui/icons-material/Style";
import SettingsIcon from "@mui/icons-material/Settings";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AddCardIcon from "@mui/icons-material/AddCard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

const drawerWidth = 240;

const tabConfig = {
  dashboard: {
    label: "Dashboard",
    icon: <DashboardIcon />,
    path: Router.SIP_DASHBOARD
  },
  did_tfn_number: {
    label: "Inbound",
    icon: <ReceiptOutlinedIcon />,
    path: Router.SIP_DESTINATION
  },
  extensions: {
    label: "Outbound",
    icon: <ExtensionIcon />,
    path: Router.SIP_EXTENSIONS
  },
  report: {
    label: "Report",
    icon: <HelpOutlineOutlinedIcon />,
    path: Router.SIP_REPORT
  },
  account: {
    label: "Account",
    icon: <AccountBalanceIcon />,
    path: Router.SIP_ACCOUNT,
    
  },
  call_block: {
    label: "CALL BLOCK",
    icon: <PhoneDisabledIcon />,    
    path: Router.SIP_CALL_BLOCK
  },
  queue: {
    label: "QUEUE",
    icon: <AddToQueueIcon />,    
    path: Router.SIP_QUEUE
  },
  queue_member: {
    label: "QUEUE MEMBER",
    icon: <GroupAddIcon />,
    path:Router.SIP_QUEUE_MEMBER
  },
  active_calls: {
    label: "LIVE CALLS",
    icon: <Call />,
    path: Router.SIP_CALL_ACTIVE
  },
  audit_logs: {
    label: "AUDIT LOGS",
    icon: <VerifiedUserIcon />,
    path: Router.SIP_AUDIT_LOGS
  },
  live_extension: {
    label: "LIVE EXTENSION",
    icon: <OnlinePredictionIcon />,    
    path: Router.SIP_LIVE_EXTENSION
  },
  billing_history: {
    label: "BILLING HISTORY",
    icon: <AccountBalanceWalletIcon />,
    path: Router.SIP_BILLING
  },
  moh: {
    label: "MOH",
    icon: <QueueMusicIcon />,
    path: Router.SIP_MOH
  },
  recording: {
    label: "RECORDING",
    icon: <RecordVoiceOverIcon />,
    path: Router.SIP_RECORDING
  },
  sip_profile: {
    label: "SIP PROFILES",
    icon: <ContactPhoneIcon />,
    path: Router.SIP_SIP_PROFILE
  },
};

function SipSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // 'apps' or 'settings'
  const [selectedTab, setSelectedTab] = useState("dashboard");
  
  const current_user = localStorage.getItem("current_user");
  const user = JSON.parse(localStorage.getItem(`user_${current_user}`));

  useEffect(() => {
    // Determine the selected tab based on current path
    const pathToTabMap = {
      [Router.SIP_DASHBOARD]: "dashboard",
      [Router.SIP_DESTINATION]: "did_tfn_number",
      [Router.SIP_EXTENSIONS]: "extensions",
      [Router.SIP_REPORT]: "report",
      [Router.SIP_ACCOUNT]: "account",
    };
    
    // Also check for app menu items
    const appPathToKeyMap = {};
    if (user?.blocked_features) {
      user.blocked_features.forEach(key => {
        if (tabConfig[key]?.path) {
          appPathToKeyMap[tabConfig[key].path] = key;
        }
      });
    }
    
    const allPathMaps = {...pathToTabMap, ...appPathToKeyMap};
    const currentTab = Object.entries(allPathMaps).find(([path]) => 
      location.pathname.includes(path)
    );
    
    if (currentTab) {
      setSelectedTab(currentTab[1]);
    }
  }, [location, user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabClick = (tabKey) => {
    setSelectedTab(tabKey);
    if (tabConfig[tabKey].path) {
      navigate(tabConfig[tabKey].path);
    }
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleMenuToggle = (menu) => {
    // If the clicked menu is already open, close it
    // Otherwise, open the clicked menu and close any other
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const filteredTabs = ["dashboard", "did_tfn_number", "extensions", "report"];
  const appMenuItems = user?.blocked_features?.filter(
    (key) => key !== "moh" && key !== "queue" && key !== "queue_member"
  ) || [];

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      backgroundColor: '#603e21',
      color: 'white',
    }}>
      <List sx={{ padding: '5px 0' }}>
        {filteredTabs.map((key) => (
          <ListItem key={key} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={selectedTab === key}
              onClick={() => handleTabClick(key)}
              sx={{
                padding: '5px 16px 5px 20px',
                borderBottom: '1px solid #4f3017',
                minHeight: 48,
                justifyContent: 'initial',
             
                '&:hover': {
                  backgroundColor: '#7a5330',
                  color: 'white',
                },
                color: 'white',
              }}
            >
              <MuiListItemIcon sx={{ 
                color: 'inherit', 
                minWidth: 0,
                mr: 3,
                justifyContent: 'center'
              }}>
                {tabConfig[key].icon}
              </MuiListItemIcon>
              <ListItemText 
                primary={tabConfig[key].label} 
                sx={{ opacity: 1 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* Apps Menu */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => handleMenuToggle('apps')}
            sx={{
              padding: '5px 16px 5px 20px',
              borderBottom: '1px solid #4f3017',
              minHeight: 40,
              justifyContent: 'initial',
              '&:hover': {
                backgroundColor: '#7a5330',
                color: 'white',
              },
              color: 'white',
            }}
          >
            <MuiListItemIcon sx={{ 
              color: 'inherit', 
              minWidth: 0,
              mr: 3,
              justifyContent: 'center'
            }}>
              <AppsIcon />
            </MuiListItemIcon>
            <ListItemText primary="Apps" sx={{ opacity: 1 }} />
            {openMenu === 'apps' ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        
        <Collapse in={openMenu === 'apps'} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {appMenuItems.map((key) => (
              <ListItem key={key} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => handleTabClick(key)}
                  sx={{
                    pl: 4,
                    padding: '5px 16px 5px 20px',
                    borderBottom: '1px solid #4f3017',
                    minHeight: 40,
                    justifyContent: 'initial',
                 
                    '&:hover': {
                      backgroundColor: '#7a5330',
                      color: 'white',
                    },
                    color: 'white',
                  }}
                >
                  <MuiListItemIcon sx={{ 
                    color: 'inherit', 
                    minWidth: 0,
                    mr: 3,
                    justifyContent: 'center'
                  }}>
                    {tabConfig[key]?.icon}
                  </MuiListItemIcon>
                  <ListItemText primary={tabConfig[key]?.label} sx={{ opacity: 1 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>

        {/* Settings Menu */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => handleMenuToggle('settings')}
            sx={{
              padding: '5px 16px 5px 20px',
              borderBottom: '1px solid #4f3017',
              minHeight: 40,
              justifyContent: 'initial',
              '&:hover': {
                backgroundColor: '#7a5330',
                color: 'white',
              },
              color: 'white',
            }}
          >
            <MuiListItemIcon sx={{ 
              color: 'inherit', 
              minWidth: 0,
              mr: 3,
              justifyContent: 'center'
            }}>
              <SettingsIcon />
            </MuiListItemIcon>
            <ListItemText primary="Settings" sx={{ opacity: 1 }} />
            {openMenu === 'settings' ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        
        <Collapse in={openMenu === 'settings'} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => handleTabClick("audit_logs")}
                sx={{
                  pl: 4,
                  padding: '5px 16px 5px 20px',
                  borderBottom: '1px solid #4f3017',
                  minHeight: 48,
                  justifyContent: 'initial',
                 
                  '&:hover': {
                    backgroundColor: '#7a5330',
                    color: 'white',
                  },
                  color: 'white',
                }}
              >
                <MuiListItemIcon sx={{ 
                  color: 'inherit', 
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'center'
                }}>
                  <VerifiedUserIcon />
                </MuiListItemIcon>
                <ListItemText primary="Audit logs" sx={{ opacity: 1 }} />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => handleTabClick("recording")}
                sx={{
                  pl: 4,
                  padding: '5px 16px 5px 20px',
                  borderBottom: '1px solid #4f3017',
                  minHeight: 40,
                  justifyContent: 'initial',
                 
                  '&:hover': {
                    backgroundColor: '#7a5330',
                    color: 'white',
                  },
                  color: 'white',
                }}
              >
                <MuiListItemIcon sx={{ 
                  color: 'inherit', 
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'center'
                }}>
                  <RecordVoiceOverIcon />
                </MuiListItemIcon>
                <ListItemText primary="Recordings" sx={{ opacity: 1 }} />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => handleTabClick("moh")}
                sx={{
                  pl: 4,
                  padding: '5px 16px 5px 20px',
                  borderBottom: '1px solid #4f3017',
                  minHeight: 48,
                  justifyContent: 'initial',
              
                  '&:hover': {
                    backgroundColor: '#7a5330',
                    color: 'white',
                  },
                  color: 'white',
                }}
              >
                <MuiListItemIcon sx={{ 
                  color: 'inherit', 
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'center'
                }}>
                  <QueueMusicIcon />
                </MuiListItemIcon>
                <ListItemText primary="MOH" sx={{ opacity: 1 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        {/* Mobile menu button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              position: 'fixed', 
              top: 10, 
              right: 16, 
              zIndex: theme.zIndex.drawer + 1,
              backgroundColor: '#603e21',
              color: 'white',
              '&:hover': {
                backgroundColor: '#7a5330',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        {/* The sidebar drawer */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={isMobile ? handleDrawerToggle : undefined}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              marginTop: isMobile ? "0rem" : "4rem",
              backgroundColor: '#603e21',
              color: 'white',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          {/* Your main content goes here */}
        </Box>
      </Box>
    </>
  );
}

export default SipSidebar;