import axios from "axios";
import { GET_SIP_BILLING_FAIL, GET_SIP_BILLING_REQUEST, GET_SIP_BILLING_SUCCESS } from "../../constants/sipPortal/sipPortal_billingConstants";
import { toast } from "react-toastify";
import { api } from "../../../mockData";

export const getSipBilling = () => async (dispatch) => {
  const current_user = localStorage.getItem("current_user");
  const token = JSON.parse(localStorage.getItem(`user_${current_user}`));
      try {
        dispatch({ type: GET_SIP_BILLING_REQUEST });
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${api.dev}/api/userbillinghistory`,
          headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token.access_token} `
          },
        };
        await axios
          .request(config)
          .then((response) => {
            dispatch({
              type: GET_SIP_BILLING_SUCCESS,
              payload: response?.data?.data,
            });
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2500,
            });
          });
      } catch (error) {
        dispatch({ type: GET_SIP_BILLING_FAIL, payload: error.response.data.message });
      }
    };
