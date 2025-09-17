import React, { useEffect } from "react";
import "../../../src/style.css";
import { useLocation } from "react-router-dom";
import { Line, Pie } from "react-chartjs-2";
import GroupsIcon from "@mui/icons-material/Groups";
import { useDispatch, useSelector } from "react-redux";
import { ResponsivePie } from "@nivo/pie";
import PieChart from "../../components/chart/PieChart";
import Barchart from "../../components/chart/Barchart";
import Chordchart from "../../components/chart/Chordchart";
import RadialBar from "../../components/chart/RadialBar";
import CallIcon from "@mui/icons-material/Call";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";

import { Box, Paper, Typography } from "@mui/material";
import { getManageReport } from "../../redux/actions/sipPortal/sipPortal_reportAction";
import Cpuchart from "../../components/chart/Heatmap";
import dayjs from "dayjs";
import { IconBase } from "react-icons/lib";
import LocalMinutesCards from "./LocalMinutesCards";
const drawerWidth = 240;
function Dashboard({ colorThem }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const current_user = localStorage.getItem("current_user");
  const user = localStorage.getItem(`user_${current_user}`);
  const userId = user?.uid;
  //const location = useLocation();
  //const data = location?.state;
  useEffect(() => {
    dispatch(getManageReport({}));
  }, [dispatch]);

  let duration = [];
  let averageDuration = 0;
  let averageBillSec = 0;
  let billSec = [];
  const testData = () => {
    state?.allManageReport?.managereport?.data &&
      state?.allManageReport?.managereport?.data?.map((item, index) => {
        if (
          item?.user_uuid === JSON.stringify(userId) &&
          item.service_type === "MANAGE"
        ) {
          duration.push(item?.duration);
          const durations = duration.map((entry) => entry);
          const sumDurations = durations?.reduce(
            (sum, duration) => sum + duration,
            0
          );
          averageDuration = sumDurations / duration?.length;
          billSec.push(item?.billsec);
          const bill = billSec?.map((entry) => entry);
          const sumBillSec = bill?.reduce((sum, billsec) => sum + billsec, 0);
          averageBillSec = sumBillSec / billSec?.length;
        }
      });
  };

  
const cardData = [
  {
    Heading:"Local Minutes",
    title: "Total Missed Calls",
    value: 898,
    icon: <PhoneMissedIcon fontSize="large" />,
    border: "linear-gradient(135deg, #ff6b6b, #ff8787)",
    iconBg: "linear-gradient(135deg, #ff6b6b, #ff8787)",
  },
  {
    title: "Total Unique Calls",
    value: 0,
    icon: <GroupsIcon fontSize="large" />,
    border: "linear-gradient(135deg, #4facfe, #00f2fe)",
    iconBg: "linear-gradient(135deg, #4facfe, #00f2fe)",
  },

  {
    title: "Total Calls",
    value: 324,
    icon: <CallIcon fontSize="large" />,
    border: "linear-gradient(135deg, #43e97b, #38f9d7)",
    iconBg: "linear-gradient(135deg, #43e97b, #38f9d7)",
  },
  {
    heading:"Toll Free Minutes",
    title: "Total Missed Calls",
    value: 234,
    icon: <PhoneCallbackIcon fontSize="large" />,
    border: "linear-gradient(135deg, #f7971e, #ffd200)",
    iconBg: "linear-gradient(135deg, #f7971e, #ffd200)",
  },
  {
    title: "Total Unique Calls",
    value: 0,
    icon: <PhoneInTalkIcon fontSize="large" />,
    border: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    iconBg: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
  },

    {
    title: "Total Unique Calls",
    value: 0,
    icon: <PhoneInTalkIcon fontSize="large" />,
    border: "linear-gradient(135deg, #924802ff, #c46207ff)",
    iconBg: "linear-gradient(135deg, #924802ff, #c46207ff)",
  },
];


  testData();
  const data1 = [
    {
      id: "Average Call Duration",
      label: "Average Call Duration",
      value: averageDuration.toFixed(2),
      color: "hsl(240, 100%, 50%)",
    },
    {
      id: "Average Bill Sec",
      label: "Average Bill Sec",
      value: averageBillSec.toFixed(2),
      color: "hsl(358, 70%, 50%)",
    },
    // {
    //   "id": "Monthly Used Minutes",
    //   "label": "Monthly Used Minutes",
    //   "value": 4000,
    //   "color": "hsl(174, 70%, 50%)"
    // },
    // {
    //   "id": "Total Used Minutes",
    //   "label": "Total Used Minutes",
    //   "value": 332,
    //  // "color": "hsl(96, 70%, 50%)"
    // },
  ];



  return (
    <>
      {/* <section className="sidebar-sec">
        <div className="container-fluid">
           */}

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
                          <h3>Dashboard</h3>
                          {/* <p>
                          Quickly access information and tools related to your
                          account.
                        </p> */}
                        </div>

                            <div className="row g-4 mb-5">
<LocalMinutesCards/>
</div>

                        {/* 
                        <div className="row pb-xxl-3 pb-xl-3 pb-lg-3 pb-md-3 pb-sm-0 pb-xs-0 pb-0">
                          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                            <div className="dashboard_card_row d_card_one mb-2">
                              <div className="d_card_left">
                                <Typography variant="h2">
                                  Total missed calls
                                </Typography>
                                <Typography variant="h3">898</Typography>
                                <Typography variant="h4">today</Typography>
                              </div>
                              <div className="d_card_right">
                                <IconBase className="d_icon">
                                  <GroupsIcon />
                                </IconBase>
                              </div>
                            </div>
                          </div>

                          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                            <div className="dashboard_card_row d_card_two mb-2">
                              <div className="d_card_left">
                                <Typography variant="h2">
                                  Total unique calls
                                </Typography>
                                <Typography variant="h3">0</Typography>
                                <Typography variant="h4">today</Typography>
                              </div>
                              <div className="d_card_right">
                                <IconBase className="d_icon">
                                  <GroupsIcon />
                                </IconBase>
                              </div>
                            </div>
                          </div>

                          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                            <div className="dashboard_card_row d_card_three mb-2">
                              <div className="d_card_left">
                                <Typography variant="h2">
                                  Total calls{" "}
                                </Typography>
                                <Typography variant="h3">324</Typography>
                                <Typography variant="h4">today</Typography>
                              </div>
                              <div className="d_card_right">
                                <IconBase className="d_icon">
                                  <GroupsIcon />
                                </IconBase>
                              </div>
                            </div>
                          </div>

                          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                            <div className="dashboard_card_row d_card_four mb-0">
                              <div className="d_card_left">
                                <Typography variant="h2">
                                  Total Answered calls
                                </Typography>
                                <Typography variant="h3">234</Typography>
                                <Typography variant="h4">today</Typography>
                              </div>
                              <div className="d_card_right">
                                <IconBase className="d_icon">
                                  <GroupsIcon />
                                </IconBase>
                              </div>
                            </div>
                          </div>

                          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                            <div className="dashboard_card_row d_card_four mb-0">
                              <div className="d_card_left">
                                <Typography variant="h2">
                                  Total Active calls
                                </Typography>
                                <Typography variant="h3">0</Typography>
                                <Typography variant="h4">today</Typography>
                              </div>
                              <div className="d_card_right">
                                <IconBase className="d_icon">
                                  <GroupsIcon />
                                </IconBase>
                              </div>
                            </div>
                          </div>

                          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                            <div className="dashboard_card_row d_card_four mb-0">
                              <div className="d_card_left">
                                <Typography variant="h2">
                                  Total Active calls
                                </Typography>
                                <Typography variant="h3">0</Typography>
                                <Typography variant="h4">today</Typography>
                              </div>
                              <div className="d_card_right">
                                <IconBase className="d_icon">
                                  <GroupsIcon />
                                </IconBase>
                              </div>
                            </div>
                          </div>
                        </div> */}

                        {/* <!--table---> */}
                        <div className="row">
                          <div className="col-lg-6 py-lg-0 py-md-2 py-sm-2 ">
                            <div className="pie-container">
                              <h4>Calls Metrics</h4>
                              <Box m="20px">
                                <Box height="50vh">
                                  <ResponsivePie
                                    data={data1}
                                    margin={{
                                      top: 40,
                                      right: 80,
                                      bottom: 80,
                                      left: 80,
                                    }}
                                    innerRadius={0.5}
                                    padAngle={0.7}
                                    cornerRadius={3}
                                    activeOuterRadiusOffset={8}
                                    borderWidth={1}
                                    motionStiffness={90}
                                    motionDamping={15}
                                    animate={true}
                                    borderColor={{
                                      from: "color",
                                      modifiers: [["darker", 0.2]],
                                    }}
                                    arcLinkLabelsSkipAngle={10}
                                    arcLinkLabelsTextColor="#333333"
                                    arcLinkLabelsThickness={2}
                                    arcLinkLabelsColor={{ from: "color" }}
                                    arcLabelsSkipAngle={10}
                                    arcLabelsTextColor={{
                                      from: "color",
                                      modifiers: [["darker", 2]],
                                    }}
                                    defs={[
                                      {
                                        id: "dots",
                                        type: "patternDots",
                                        background: "inherit",
                                        color: "rgba(255, 255, 255, 0.3)",
                                        size: 4,
                                        padding: 1,
                                        stagger: true,
                                      },
                                      {
                                        id: "lines",
                                        type: "patternLines",
                                        background: "inherit",
                                        color: "rgba(255, 255, 255, 0.3)",
                                        rotation: -45,
                                        lineWidth: 6,
                                        spacing: 10,
                                      },
                                    ]}
                                    legends={[
                                      {
                                        anchor: "bottom",
                                        direction: "row",
                                        justify: false,
                                        translateX: 0,
                                        translateY: 56,
                                        itemsSpacing: 67,
                                        itemWidth: 100,
                                        itemHeight: 18,
                                        itemTextColor: "#999",
                                        itemDirection: "left-to-right",
                                        itemOpacity: 1,
                                        symbolSize: 18,
                                        symbolShape: "circle",
                                        effects: [
                                          {
                                            on: "hover",
                                            style: {
                                              itemTextColor: "#000",
                                            },
                                          },
                                        ],
                                      },
                                    ]}
                                  />
                                </Box>
                              </Box>
                            </div>
                          </div>
                          <div className="col-lg-6 py-lg-0 py-md-2 py-sm-2">
                            <div className="pie-container">
                              {/* <Box m="20px">
                            <Box height="50vh"> */}
                              <h4> Calls Weekly Trend</h4>
                              <RadialBar />
                              {/* <Cpuchart/>  */}
                            </div>
                            {/* </Box>
                        </Box> */}
                          </div>

                          {/* <div className="col-lg-6 mt-4">
                        
                          
                        <Barchart/> 
                         
                       
                      </div> */}
                          {/* <div className="col-lg-6 mt-4 mrgn_top">
                      
                        
                      <Chordchart/> 
                       
                     
                    </div> */}
                        </div>
                        {/* <!--table-end--> */}
                      </div>
                      {/* <!--role-contet--> */}
                    </div>
                    <div
                      className="tab-pane fade"
                      id="pills-profile"
                      role="tabpanel"
                      aria-labelledby="pills-profile-tab"
                    >
                      {/* <!--role-contet--> */}
                      <div className="tab_cntnt_box">
                        <div className="cntnt_title">
                          <h3>User list</h3>
                        </div>
                        <div className="tab_sub_cntnt">
                          <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Consequuntur debitis praesentium iusto quasi,
                            temporibus accusamus quis possimus saepe ipsa. Vel
                            magni molestiae quae alias harum id esse doloribus
                            ab commodi.
                          </p>
                          <form className="d-flex d-none">
                            <input
                              className="form-control me-2"
                              type="search"
                              placeholder="Search"
                              aria-label="Search"
                            />
                            {/* <!-- <button className="info-btn" type="submit">Search</button> --> */}
                          </form>
                        </div>

                        {/* <!--table---> */}
                        <div className="table_box">
                          <table className="table">
                            <thead>
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Handle</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                              </tr>
                              <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                              </tr>
                              <tr>
                                <th scope="row">3</th>
                                <td>Larry the Bird</td>
                                <td>@fat</td>
                                <td>@twitter</td>
                              </tr>
                              <tr>
                                <th scope="row">4</th>
                                <td>Larry the Bird</td>
                                <td>@twitter</td>
                                <td>@fat</td>
                              </tr>
                              <tr>
                                <th scope="row">5</th>
                                <td>Larry the Bird</td>
                                <td>@twitter</td>
                                <td>@twitter</td>
                              </tr>
                              <tr>
                                <th scope="row">6</th>
                                <td>Larry the Bird</td>
                                <td>@twitter</td>
                                <td>@twitter</td>
                              </tr>
                              <tr>
                                <th scope="row">7</th>
                                <td>Larry the Bird</td>
                                <td>@twitter</td>
                                <td>@twitter</td>
                              </tr>
                              <tr>
                                <th scope="row">8</th>
                                <td>Larry the Bird</td>
                                <td>@twitter</td>
                                <td>@twitter</td>
                              </tr>
                              <tr>
                                <th scope="row">9</th>
                                <td>Larry the Bird</td>
                                <td>@twitter</td>
                                <td>@twitter</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        {/* <!--table-end--> */}
                      </div>
                      {/* <!--role-contet--> */}
                    </div>
                    <div
                      className="tab-pane fade"
                      id="pills-contact"
                      role="tabpanel"
                      aria-labelledby="pills-contact-tab"
                    >
                      {/* <!--role-contet--> */}
                      <div className="tab_cntnt_box">
                        <div className="cntnt_title">
                          <h3>Add user</h3>
                        </div>
                        <div className="tab_sub_cntnt">
                          <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Consequuntur debitis praesentium iusto quasi,
                            temporibus accusamus quis possimus saepe ipsa. Vel
                            magni molestiae quae alias harum id esse doloribus
                            ab commodi.
                          </p>
                          <div className="inpt-lft">
                            <input
                              className="form-control me-2 w-25"
                              type="search"
                              placeholder="Search"
                              aria-label="Search"
                            />
                          </div>
                        </div>

                        {/* <!--table---> */}
                        <div className="row">
                          <div className="col-12">
                            <div className="add_row">
                              <form className="add_frm_box">
                                <div className="row">
                                  <div className="col-md-6 col-12 mb-3">
                                    <input
                                      type="name"
                                      className="form-control"
                                      id="fname"
                                      aria-describedby="nameHelp"
                                      placeholder="First Name"
                                    />
                                  </div>
                                  <div className="col-md-6 col-12 mb-3">
                                    <input
                                      type="name"
                                      className="form-control"
                                      id="lname"
                                      aria-describedby="lnameHelp"
                                      placeholder="Last Name"
                                    />
                                  </div>

                                  <div className="col-md-6 col-12 mb-3">
                                    <input
                                      type="email"
                                      className="form-control"
                                      id="email"
                                      aria-describedby="emailHelp"
                                      placeholder="Email"
                                    />
                                    <div id="emailHelp" className="form-text">
                                      We'll never share your email with anyone
                                      else.
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-12 mb-3">
                                    <input
                                      type="number"
                                      className="form-control"
                                      id="number"
                                      aria-describedby="emailHelp"
                                      placeholder="Phone Number"
                                    />
                                  </div>

                                  <div className="col-md-6 col-12 mb-3">
                                    <input
                                      type="password"
                                      className="form-control"
                                      id="password"
                                      aria-describedby="passwordHelp"
                                      placeholder="Password"
                                    />
                                  </div>
                                  <div className="col-md-6 col-12 mb-3">
                                    <input
                                      type="password"
                                      className="form-control"
                                      id="c_password"
                                      aria-describedby="passwordHelp"
                                      placeholder="Confirm Password"
                                    />
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <input
                                    type="password"
                                    className="form-control"
                                    id="exampleInputPassword1"
                                  />
                                </div>
                                <div className="mb-3 form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="exampleCheck1"
                                  />
                                  <label
                                    className="form-check-label"
                                    for="exampleCheck1"
                                  >
                                    Check me out
                                  </label>
                                </div>
                                <button
                                  type="submit"
                                  className="info-btn submit_button"
                                >
                                  Submit
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                        {/* <!--table-end--> */}
                      </div>
                      {/* <!--role-contet--> */}
                    </div>

                    <div
                      className="tab-pane fade"
                      id="pills-call"
                      role="tabpanel"
                      aria-labelledby="pills-call-tab"
                    >
                      <p style={{ color: "#fff" }}>1</p>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="pills-reports"
                      role="tabpanel"
                      aria-labelledby="pills-reports-tab"
                    >
                      <p style={{ color: "#fff" }}>2</p>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="pills-block"
                      role="tabpanel"
                      aria-labelledby="pills-block-tab"
                    >
                      <p style={{ color: "#fff" }}>3</p>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="pills-log"
                      role="tabpanel"
                      aria-labelledby="pills-log-tab"
                    >
                      <p style={{ color: "#fff" }}>4</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </div>
      </div>

      {/* </div>
      </section> */}
    </>
  );
}

export default Dashboard;
