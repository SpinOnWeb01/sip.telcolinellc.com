import { api } from "../../../mockData";
import axios from "axios";
import { toast } from "react-toastify";
import {
  CREATE_ADMIN_SIP_PROFILE_FAIL,
  CREATE_ADMIN_SIP_PROFILE_REQUEST,
  CREATE_ADMIN_SIP_PROFILE_SUCCESS,
  DELETE_ADMIN_SIP_PROFILE_FAIL,
  DELETE_ADMIN_SIP_PROFILE_REQUEST,
  DELETE_ADMIN_SIP_PROFILE_SUCCESS,
  GET_ADMIN_SIP_PROFILE_FAIL,
  GET_ADMIN_SIP_PROFILE_REQUEST,
  GET_ADMIN_SIP_PROFILE_SUCCESS,
  UPDATE_ADMIN_SIP_PROFILE_FAIL,
  UPDATE_ADMIN_SIP_PROFILE_REQUEST,
  UPDATE_ADMIN_SIP_PROFILE_SUCCESS,
} from "../../constants/adminPortal/adminPortal_sipProfileConstants";

export const getAdminSipProfile = () => async (dispatch) => {
  const token = JSON.parse(localStorage.getItem(`admin`));
  try {
    dispatch({ type: GET_ADMIN_SIP_PROFILE_REQUEST });
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${api.dev}/api/adminsipprofile`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token} `,
      },
    };
    await axios
      .request(config)
      .then((response) => {
        dispatch({
          type: GET_ADMIN_SIP_PROFILE_SUCCESS,
          payload: response?.data,
        });
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500,
        });
      });
  } catch (error) {
    dispatch({
      type: GET_ADMIN_SIP_PROFILE_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const createAdminSipProfile =
  (sipProfile, handleClose, setResponse) => async (dispatch) => {
    const token = JSON.parse(localStorage.getItem(`admin`));
    try {
      dispatch({ type: CREATE_ADMIN_SIP_PROFILE_REQUEST });
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token} `,
        },
      };
      const { data } = await axios.post(
        `${api.dev}/api/adminsipprofile`,
        sipProfile,
        config
      );
      if (data?.status === 200) {
        toast.success(data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });
        handleClose();
        setResponse(data);
      } else {
        toast.error(data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500,
        });
      }
      dispatch({ type: CREATE_ADMIN_SIP_PROFILE_SUCCESS, payload: data });
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500,
      });
      dispatch({
        type: CREATE_ADMIN_SIP_PROFILE_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

export const updateAdminSipProfile =
  (updateSipProfile, handleCloseModal, setResponse) => async (dispatch) => {
    const token = JSON.parse(localStorage.getItem(`admin`));
    try {
      dispatch({ type: UPDATE_ADMIN_SIP_PROFILE_REQUEST });
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token} `,
        },
      };
      const { data } = await axios.put(
        `${api.dev}/api/adminsipprofile`,
        updateSipProfile,
        config
      );
      if (data?.status === 200) {
        toast.success(data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });
        handleCloseModal();
        setResponse(data);
      } else {
        toast.error(data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500,
        });
      }
      dispatch({ type: UPDATE_ADMIN_SIP_PROFILE_SUCCESS, payload: data });
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500,
      });
      dispatch({
        type: UPDATE_ADMIN_SIP_PROFILE_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

export const deleteAdminSipProfile =
  (userData, setResponse, setCallBlockId) => async (dispatch) => {
    try {
      dispatch({ type: DELETE_ADMIN_SIP_PROFILE_REQUEST });
      const token = JSON.parse(localStorage.getItem(`admin`));

      fetch(`${api.dev}/api/adminsipprofile`, {
        method: "DELETE",
        body: JSON.stringify(userData), // Using body instead of data for sending data
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200) {
            // Parse JSON response
            return response.json();
          } else if(response.status === 400){
            toast.error("Unlink the SIP profile from DID", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500,
            });
          }else{
            // Handle error status
            throw new Error(`Request failed with status ${response.status}`);
          }
        })
        .then((data) => {
          // Handle successful response
          toast.success(data?.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500,
          });
          setResponse(data);
          setCallBlockId("");
          dispatch({ type: DELETE_ADMIN_SIP_PROFILE_SUCCESS, payload: data });
        })
        .catch((error) => {
          console.log('error', error)
          // Handle fetch errors
          // toast.error("Error deleting. Please try again later.", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1500,
          // });
        });
    } catch (error) {
      dispatch({
        type: DELETE_ADMIN_SIP_PROFILE_FAIL,
        payload: error.response.data.message,
      });
    }
  };
