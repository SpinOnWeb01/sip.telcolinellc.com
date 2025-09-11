import React, { lazy, Suspense, useEffect, useMemo } from "react";
import { Routes as Switch, Route } from "react-router-dom";
import Router from "./route";
import { useState } from "react";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import SipDashboard from "../user_portals/sip_portal/SipDashboard";
import SipLayout from "../user_portals/sip_portal/SipLayout";
import Extension from "../user_portals/sip_portal/Extension";
import CallCenter from "../user_portals/sip_portal/CallCenter";
import OperatorPanel from "../user_portals/sip_portal/OperatorPanel";
import SipDestination from "../user_portals/sip_portal/SipDestination";
import Report from "../user_portals/sip_portal/Report";
import SipCallBlock from "../user_portals/sip_portal/SipCallBlock";
import AdminDashboard from "../components/admin/AdminDashboard";
import User from "../components/admin/User";
import DidTfnNumber from "../components/admin/DidTfnNumber";
import ManageAddBuyer from "../components/admin/ManageAddBuyer";
import AdminExtension from "../components/admin/AdminExtension";
import AdminCallActive from "../components/admin/AdminCallActive";
import AdminLayout from "../components/admin/AdminLayout";
import ServerStats from "../components/admin/Serverstats";
import AdminQueue from "../components/admin/AdminQueue";
import SipCallActive from "../user_portals/sip_portal/SipCallActive";
import AdminMinutes from "../components/admin/AdminMinutes";
import AdminCarrier from "../components/admin/AdminCarrier";
import SipBilling from "../user_portals/sip_portal/SipBilling";
import SipQueueMember from "../user_portals/sip_portal/SipQueueMember";
import AdminView from "../components/admin/AdminView";
import AdminQueueMember from "../components/admin/AdminQueueMember";
import AdminLiveExtension from "../components/admin/AdminLiveExtension";
import AdminHistory from "../components/admin/AdminHistory";
import AdminAuditLog from "../components/admin/AdminAuditLogs";
import AdminivrUploads from "../components/admin/AdminivrUploads";
import AdminMOH from "../components/admin/AdminMOH";
import SipLiveExtension from "../user_portals/sip_portal/SipLiveExtension";
import AdminPermission from "../components/admin/AdminPermission";
import AdminACL from "../components/admin/AdminACL";
import SipAuditLogs from "../user_portals/sip_portal/SipAuditLogs";
import AdminAssistant from "../components/admin/AdminAssistant";
import SipRecording from "../user_portals/sip_portal/SipRecording";
import SipMoh from "../user_portals/sip_portal/SipMoh";
import SipQueue from "../user_portals/sip_portal/SipQueue";
import AdminQueueCalls from "../components/admin/AdminQueueCalls";
import AdminCallBlock from "../components/admin/AdminCallBlock";
import AdminMDR from "../components/admin/AdminMDR";
import AdminBillingMinut from "../components/admin/AdminBillingMinut";
import ResellerLayout from "../components/reseller/ResellerLayout";
import ResellerDashboard from "../components/reseller/ResellerDashboard";
import ResellerUser from "../components/reseller/ResellerUser";
import ResellerManageCampaign from "../components/reseller/ResellerManageCampaign";
import ResellerManageAddBuyer from "../components/reseller/ResellerManageAddBuyer";
import ResellerReport from "../components/reseller/ResellerReport";
import ResellerExtension from "../components/reseller/ResellerExtension";
import ResellerCallActive from "../components/reseller/ResellerCallActive";
import ResellerQueueCalls from "../components/reseller/ResellerQueueCalls";
import ResellerCallBlock from "../components/reseller/ResellerCallBlock";
import ResellerServerStats from "../components/reseller/ResellerServerstats";
import ResellerQueue from "../components/reseller/ResellerQueue";
import ResellerBillingMinut from "../components/reseller/ResellerBillingMinut";
import ResellerQueueMember from "../components/reseller/ResellerQueueMember";
import ResellerMinutes from "../components/reseller/ResellerMinutes";
import ResellerAuditLogs from "../components/reseller/ResellerAuditLogs";
import ResellerivrUploads from "../components/reseller/ResellerivrUploads";
import ResellerMOH from "../components/reseller/ResellerMOH";
import ResellerCarrier from "../components/reseller/ResellerCarrier";
import ResellerView from "../components/reseller/ResellerView";
import ResellerLiveExtension from "../components/reseller/ResellerLiveExtension";
import ResellerHistory from "../components/reseller/ResellerHistory";
import ResellerPermission from "../components/reseller/ResellerPermission";
import ResellerACL from "../components/reseller/ResellerACL";
import ResellerAssistant from "../components/reseller/ResellerAssistant";
import ResellerDidTfnNumber from "../components/reseller/ResellerDidTfnNumber";
import SessionExpired from "../pages/SessionExpired";
import AdminAclHistory from "../components/admin/AdminAclHistory";
import AdminProduct from "../components/admin/AdminProduct";
import AdminInvoice from "../components/admin/AdminInvoice";
import SipAccounts from "../user_portals/sip_portal/SipAccounts";
import AdminPayment from "../components/admin/AdminPayment";
import AdminSipProfile from "../components/admin/AdminSipProfile";
import SipProfile from "../user_portals/sip_portal/SipProfile";
import { useDispatch, useSelector } from "react-redux";
import { getAdminCallActive } from "../redux/actions/adminPortal/adminPortal_callActiveAction";
import dayjs from "dayjs";
import AdminRoles from "../components/admin/AdminRoles";
import ManageCampaign from "../components/admin/ManageCampaign";
import AdminLocal from "../components/admin/AdminLocal";
const AdminReport = lazy(() => import("../components/admin/AdminReport"));
Chart.register(CategoryScale);
function PrivateRoute() {
  const user = JSON.parse(localStorage.getItem("admin"));
  const reseller = JSON.parse(localStorage.getItem("reseller"));
  const current_user = localStorage.getItem("current_user");
  const [radioValue, setRadioValue] = useState("");
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  // -------------

  //state
  const color = localStorage.getItem("theme-color");
  const [colorThem, setColorTheme] = useState(color);
  //console.log(colorThem)
  //alert(colorThem)

  //effect
  useEffect(() => {
    //check for selected the ///localstorage value
    const currentThemeColor = localStorage.getItem("them-color");
    //if found set selected theme value in state
    if (currentThemeColor) {
      setColorTheme(currentThemeColor);
    }
  }, []);

  //set theme
  const handleClick = (theme) => {
    //alert(theme)
    setColorTheme(theme);
    localStorage.setItem("theme-color", theme);
  };
  // -------------

  useEffect(() => {
    dispatch(getAdminCallActive());
  }, [dispatch]);

  const mockDataTeam = useMemo(() => {
    const callactive = state?.getAdminCallActive?.callactive;
    if (callactive !== undefined) {
      const parsedData = Object.keys(callactive)
        .map((key) => {
          try {
            const parsedValue = JSON.parse(callactive[key]);
            return { id: key, ...parsedValue };
          } catch (err) {
            return null;
          }
        })
        .filter(Boolean);

      const filteredData = radioValue
        ? parsedData.filter((item) => item.CallDirection === radioValue)
        : parsedData;

      const sortedData = filteredData.sort(
        (a, b) => dayjs(b.TimeStamp) - dayjs(a.TimeStamp)
      );

      // Add srNo here
      return sortedData.map((item, index) => ({
        ...item,
        srNo: index + 1,
      }));
    }
    return [];
  }, [state?.getAdminCallActive?.callactive, radioValue]);

  return (
    <>
      {/* <Sidebar/> */}
      <Switch>
        {user !== null ? (
          <>
            <Route
              path={Router.ADMIN_DASHBOARD}
              element={
                <AdminLayout
                  colorThem={colorThem}
                  handleClick={handleClick}
                  mockDataTeam={mockDataTeam}
                  radioValue={radioValue}
                />
              }
            >
              <Route
                path={Router.ADMIN_DASHBOARD}
                element={<AdminDashboard colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_USER}
                element={<User colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_MANAGE_CAMPAIGN}
                element={<ManageCampaign colorThem={colorThem} />}
              />
              <Route
                path="/admin_portal/viewbuyer"
                element={<ManageAddBuyer colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_DID_TFN_NUMBER}
                element={<DidTfnNumber colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_REPORT}
                element={
                  <Suspense
                    fallback={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100vh",
                          textAlign: "center",
                          backgroundColor: "#f7efe5",
                        }}
                      >
                        Loading...
                      </div>
                    }
                  >
                    <AdminReport colorThem={colorThem} />
                  </Suspense>
                }
              />
              <Route
                path={Router.ADMIN_EXTENSION}
                element={<AdminExtension colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_PAYMENT}
                element={<AdminPayment colorThem={colorThem} />}
              />

              <Route
                path={Router.ADMIN_CALL_ACTIVE}
                element={
                  <AdminCallActive
                    colorThem={colorThem}
                    radioValue={radioValue}
                    setRadioValue={setRadioValue}
                    mockDataTeam={mockDataTeam}
                  />
                }
              />

              <Route
                path={Router.ADMIN_QUEUE_CALLS}
                element={<AdminQueueCalls colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_CALL_BLOCK}
                element={<AdminCallBlock colorThem={colorThem} />}
              />

              <Route
                path={Router.ADMIN_SERVER_STATS}
                element={<ServerStats colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_QUEUE}
                element={<AdminQueue colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_BILLING_MINUTES}
                element={<AdminBillingMinut colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_QUEUE_MEMBER}
                element={<AdminQueueMember colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_MINUTES}
                element={<AdminMinutes colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_LOCAL}
                element={<AdminLocal colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_MDR}
                element={<AdminMDR colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_PRODUCT}
                element={<AdminProduct colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_INVOICE}
                element={<AdminInvoice colorThem={colorThem} />}
              />

              <Route
                path={Router.ADMIN_AUDIT_LOGS}
                element={<AdminAuditLog colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_IVR_UPLOADS}
                element={<AdminivrUploads colorThem={colorThem} />}
              />

              <Route
                path={Router.AdminMOH}
                element={<AdminMOH colorThem={colorThem} />}
              />

              <Route
                path={Router.ADMIN_CARRIER}
                element={<AdminCarrier colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_VIEW}
                element={<AdminView colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_LIVE_EXTENSION}
                element={<AdminLiveExtension colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_SIP_PROFILE}
                element={<AdminSipProfile colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_HISTORY}
                element={<AdminHistory colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_ROLES}
                element={<AdminRoles colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_PERMISSIONS_ACCESS}
                element={<AdminPermission colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_ACL}
                element={<AdminACL colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_ACL_HISTORY}
                element={<AdminAclHistory colorThem={colorThem} />}
              />
              <Route
                path={Router.ADMIN_TFN_ASSISTANT}
                element={<AdminAssistant colorThem={colorThem} />}
              />
            </Route>
          </>
        ) : (
          <>
            <Route path="*" element={<SessionExpired />} />
          </>
        )}

        {reseller !== null ? (
          <>
            <Route
              path={Router.RESELLER_DASHBOARD}
              element={
                <ResellerLayout
                  colorThem={colorThem}
                  handleClick={handleClick}
                />
              }
            >
              <Route
                path={Router.RESELLER_DASHBOARD}
                element={<ResellerDashboard colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_USER}
                element={<ResellerUser colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_MANAGE_CAMPAIGN}
                element={<ResellerManageCampaign colorThem={colorThem} />}
              />
              <Route
                path="/reseller_portal/viewbuyer"
                element={<ResellerManageAddBuyer colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_DID_TFN_NUMBER}
                element={<ResellerDidTfnNumber colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_REPORT}
                element={<ResellerReport colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_EXTENSION}
                element={<ResellerExtension colorThem={colorThem} />}
              />

              <Route
                path={Router.RESELLER_CALL_ACTIVE}
                element={<ResellerCallActive colorThem={colorThem} />}
              />

              <Route
                path={Router.RESELLER_QUEUE_CALLS}
                element={<ResellerQueueCalls colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_CALL_BLOCK}
                element={<ResellerCallBlock colorThem={colorThem} />}
              />

              <Route
                path={Router.RESELLER_SERVER_STATS}
                element={<ResellerServerStats colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_QUEUE}
                element={<ResellerQueue colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_BILLING_MINUTES}
                element={<ResellerBillingMinut colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_QUEUE_MEMBER}
                element={<ResellerQueueMember colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_MINUTES}
                element={<ResellerMinutes colorThem={colorThem} />}
              />

              <Route
                path={Router.RESELLER_AUDIT_LOGS}
                element={<ResellerAuditLogs colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_IVR_UPLOADS}
                element={<ResellerivrUploads colorThem={colorThem} />}
              />

              <Route
                path={Router.RESELLER_MOH}
                element={<ResellerMOH colorThem={colorThem} />}
              />

              <Route
                path={Router.RESELLER_CARRIER}
                element={<ResellerCarrier colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_VIEW}
                element={<ResellerView colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_LIVE_EXTENSION}
                element={<ResellerLiveExtension colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_HISTORY}
                element={<ResellerHistory colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_PERMISSIONS_ACCESS}
                element={<ResellerPermission colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_ACL}
                element={<ResellerACL colorThem={colorThem} />}
              />
              <Route
                path={Router.RESELLER_TFN_ASSISTANT}
                element={<ResellerAssistant colorThem={colorThem} />}
              />
            </Route>
          </>
        ) : (
          <>
            <Route path="*" element={<SessionExpired />} />
          </>
        )}
        {current_user !== null ? (
          <>
            <Route path={Router.SIP_DASHBOARD} element={<SipLayout />}>
              <Route index element={<SipDashboard />} />
              <Route path={Router.SIP_EXTENSIONS} element={<Extension />} />
              <Route path={Router.SIP_CALL_CENTER} element={<CallCenter />} />
              <Route
                path={Router.SIP_OPERATOR_PANEL}
                element={<OperatorPanel />}
              />
              <Route
                path={Router.SIP_DESTINATION}
                element={<SipDestination />}
              />
              <Route path={Router.SIP_REPORT} element={<Report />} />
              <Route path={Router.SIP_CALL_BLOCK} element={<SipCallBlock />} />
              <Route path={Router.SIP_ACCOUNT} element={<SipAccounts />} />

              <Route
                path={Router.SIP_CALL_ACTIVE}
                element={<SipCallActive />}
              />
              <Route path={Router.SIP_RECORDING} element={<SipRecording />} />
              <Route path={Router.SIP_MOH} element={<SipMoh />} />
              <Route
                path={Router.SIP_LIVE_EXTENSION}
                element={<SipLiveExtension />}
              />
              <Route path={Router.SIP_BILLING} element={<SipBilling />} />
              <Route path={Router.SIP_QUEUE} element={<SipQueue />} />
              <Route
                path={Router.SIP_QUEUE_MEMBER}
                element={<SipQueueMember />}
              />
              <Route path={Router.SIP_AUDIT_LOGS} element={<SipAuditLogs />} />
              <Route path={Router.SIP_SIP_PROFILE} element={<SipProfile />} />
            </Route>
          </>
        ) : (
          <>
            <Route path="*" element={<SessionExpired />} />
          </>
        )}
      </Switch>
    </>
  );
}

export default PrivateRoute;
