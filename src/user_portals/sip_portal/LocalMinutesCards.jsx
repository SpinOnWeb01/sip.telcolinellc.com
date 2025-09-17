import React from "react";
import { Paper, Box, Typography, Grid } from "@mui/material";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import GroupsIcon from "@mui/icons-material/Groups";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import CallIcon from "@mui/icons-material/Call";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";

export default function LocalMinutesCards() {
  const current_user = localStorage.getItem("current_user");
  const user = JSON.parse(localStorage.getItem(`user_${current_user}`));
  function CardContent({ title, value, icon, iconBg, iconShadow }) {
    return (
      <>
        <Box>
          <Typography variant="subtitle2" sx={titleStyle}>
            {title}
          </Typography>
          <Typography variant="h3" sx={valueStyle}>
            {value}
          </Typography>
        </Box>

        <Box sx={iconBox(iconBg, iconShadow)}>{icon}</Box>
      </>
    );
  }

  // 🎨 Styles
  const cardStyle = {
    position: "relative",
    borderRadius: "20px",
    padding: "13px 16px",
    background: "#ffffffcc",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px) scale(1.02)",
      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
    },
  };

  const cardBorder = {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "20px",
    padding: "2px",
    WebkitMask:
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    pointerEvents: "none",
  };

  const titleStyle = {
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#333",
    opacity: 0.8,
  };

  const valueStyle = {
    fontWeight: 900,
    my: 1,
    color: "#111",
    fontSize: { xs: "1.5rem", md: "2rem" },
  };

  const iconBox = (bg, shadowColor) => ({
    background: bg,
    borderRadius: "50%",
    width: 60,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0px 0px 15px ${shadowColor}`,
    color: "#fff",
    transform: "scale(1)",
    transition: "transform 0.3s ease-in-out",
    "&:hover": { transform: "scale(1.1) rotate(5deg)" },
  });

  return (
    <>
      <Box sx={{ mb: 0 }}>
        {/* ✅ Toll Free Section */}
        {user.toll_total_minutes !== null &&
          user.toll_total_used_minutes !== null &&
          user.toll_remaining_minutes !== null && (
            <h4 style={{ marginBottom: 8, fontWeight: 400 }}>
              Toll Free Minutes
            </h4>
          )}

        <Grid container spacing={4} sx={{ mb: 3 }}>
          {/* Card 1 */}
          {user.toll_total_minutes === null ? (
            <></>
          ) : (
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  ...cardStyle,
                  "&::before": {
                    ...cardBorder,
                    background: "linear-gradient(135deg, #ff6b6b, #ff8787)",
                  },
                }}
              >
                <CardContent
                  title="Total Minutes"
                  value={user.toll_total_minutes.toFixed(2)}
                  icon={<QueryBuilderIcon fontSize="large" />}
                  iconBg="linear-gradient(135deg, #ff6b6b, #ff8787)"
                  iconShadow="#ff6b6b"
                />
              </Paper>
            </Grid>
          )}

          {/* Card 2 */}
          {user.toll_total_used_minutes === null ? (
            <></>
          ) : (
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  ...cardStyle,
                  "&::before": {
                    ...cardBorder,
                    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                  },
                }}
              >
                <CardContent
                  title="Total Used Minutes"
                  value={user.toll_total_used_minutes.toFixed(2)}
                  icon={<PhoneInTalkIcon fontSize="large" />}
                  iconBg="linear-gradient(135deg, #4facfe, #00f2fe)"
                  iconShadow="#4facfe"
                />
              </Paper>
            </Grid>
          )}

          {/* Card 3 */}
          {user.toll_remaining_minutes === null ? (
            <></>
          ) : (
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  ...cardStyle,
                  "&::before": {
                    ...cardBorder,
                    background: "linear-gradient(135deg, #43e97b, #38f9d7)",
                  },
                }}
              >
                <CardContent
                  title="Total Remaining Minutes"
                  value={user.toll_remaining_minutes.toFixed(2)}
                  icon={<CallIcon fontSize="large" />}
                  iconBg="linear-gradient(135deg, #43e97b, #38f9d7)"
                  iconShadow="#43e97b"
                />
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* ✅ Local Section */}
        {user.local_total_minutes !== null &&
          user.local_total_used_minutes !== null &&
          user.local_remaining_minutes !== null && (
            <h4 style={{ marginBottom: 8, fontWeight: 400 }}>Local Minutes</h4>
          )}

        <Grid container spacing={4}>
          {user.local_total_minutes === null ? (
            <></>
          ) : (
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  ...cardStyle,
                  "&::before": {
                    ...cardBorder,
                    background: "linear-gradient(135deg, #f7971e, #ffd200)",
                  },
                }}
              >
                <CardContent
                  title="Total Minutes"
                  value={user.local_total_minutes.toFixed(2)}
                  icon={<QueryBuilderIcon fontSize="large" />}
                  iconBg="linear-gradient(135deg, #f7971e, #ffd200)"
                  iconShadow="#f7971e"
                />
              </Paper>
            </Grid>
          )}

          {/* Card 2 */}
          {user.local_total_used_minutes === null ? (
            <></>
          ) : (
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  ...cardStyle,
                  "&::before": {
                    ...cardBorder,
                    background: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
                  },
                }}
              >
                <CardContent
                  title="Total Used Minutes"
                  value={user.local_total_used_minutes.toFixed(2)}
                  icon={<PhoneInTalkIcon fontSize="large" />}
                  iconBg="linear-gradient(135deg, #a18cd1, #fbc2eb)"
                  iconShadow="#a18cd1"
                />
              </Paper>
            </Grid>
          )}

          {/* Card 3 */}
          {user.local_remaining_minutes === null ? (
            <></>
          ) : (
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  ...cardStyle,
                  "&::before": {
                    ...cardBorder,
                    background: "linear-gradient(135deg, #924802ff, #c46207ff)",
                  },
                }}
              >
                <CardContent
                  title="Total Remaining Minutes"
                  value={user.local_remaining_minutes.toFixed(2)}
                  icon={<CallIcon fontSize="large" />}
                  iconBg="linear-gradient(135deg, #924802ff, #c46207ff)"
                  iconShadow="#924802"
                />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
