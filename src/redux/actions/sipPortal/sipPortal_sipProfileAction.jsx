import { toast } from "react-toastify";
import { api } from "../../../mockData";
import { CREATE_SIP_SIP_PROFILE_FAIL, CREATE_SIP_SIP_PROFILE_REQUEST, CREATE_SIP_SIP_PROFILE_SUCCESS, DELETE_SIP_SIP_PROFILE_FAIL, DELETE_SIP_SIP_PROFILE_REQUEST, DELETE_SIP_SIP_PROFILE_SUCCESS, GET_SIP_SIP_PROFILE_FAIL, GET_SIP_SIP_PROFILE_REQUEST, GET_SIP_SIP_PROFILE_SUCCESS, UPDATE_SIP_SIP_PROFILE_FAIL, UPDATE_SIP_SIP_PROFILE_REQUEST, UPDATE_SIP_SIP_PROFILE_SUCCESS } from "../../constants/sipPortal/sipPortal_sipProfileConstants";
import axios from "axios";

export const getSIPSipProfile = () => async (dispatch) => {
    const current_user = localStorage.getItem("current_user");
    const token = JSON.parse(localStorage.getItem(`user_${current_user}`));
      try {
        dispatch({ type: GET_SIP_SIP_PROFILE_REQUEST });
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${api.dev}/api/usersipprofile`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.access_token} `,
          },
        };
        await axios
          .request(config)
          .then((response) => {
            dispatch({
              type: GET_SIP_SIP_PROFILE_SUCCESS,
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
          type: GET_SIP_SIP_PROFILE_FAIL,
          payload: error.response.data.message,
        });
      }
    };


    export const createSIPSipProfile =
    (
      sipProfile,
      handleClose,
      setResponse,
    ) =>
    async (dispatch) => {
      const current_user = localStorage.getItem("current_user");
    const token = JSON.parse(localStorage.getItem(`user_${current_user}`));
      try {
        dispatch({ type: CREATE_SIP_SIP_PROFILE_REQUEST });
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.access_token} `,
          },
        };
        const { data } = await axios.post(
          `${api.dev}/api/usersipprofile`,
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
        dispatch({ type: CREATE_SIP_SIP_PROFILE_SUCCESS, payload: data });
      } catch (error) {
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500,
        });
        dispatch({
          type: CREATE_SIP_SIP_PROFILE_FAIL,
          payload: error?.response?.data?.message,
        });
      }
    };

    export const updateSIPSipProfile =
  (updateSipProfile, handleCloseModal, setResponse,) =>
  async (dispatch) => {
    const current_user = localStorage.getItem("current_user");
  const token = JSON.parse(localStorage.getItem(`user_${current_user}`));
    try {
      dispatch({ type: UPDATE_SIP_SIP_PROFILE_REQUEST });
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token} `,
        },
      };
      const { data } = await axios.put(
        `${api.dev}/api/usersipprofile`,
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
      dispatch({ type: UPDATE_SIP_SIP_PROFILE_SUCCESS, payload: data });
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500,
      });
      dispatch({
        type: UPDATE_SIP_SIP_PROFILE_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

  export const deleteSIPSipProfile = (userData, setResponse, setSipProfileId) => async (dispatch) => {
  
    try {
      dispatch({ type: DELETE_SIP_SIP_PROFILE_REQUEST });
      const current_user = localStorage.getItem("current_user");
  const token = JSON.parse(localStorage.getItem(`user_${current_user}`));

      fetch(`${api.dev}/api/usersipprofile`, {
        method: 'DELETE',
        body: JSON.stringify(userData), // Using body instead of data for sending data
        headers: {
          'Authorization': `Bearer ${token.access_token}`,
          'Content-Type': 'application/json'
        },
      })
      .then(response => {
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
      .then(data => {
        // Handle successful response
        toast.success(data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });
        setResponse(data);
        setSipProfileId("");
        dispatch({ type: DELETE_SIP_SIP_PROFILE_SUCCESS, payload: data });
      })
      .catch(error => {
        // Handle fetch errors
      //   toast.error('Error deleting. Please try again later.', {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 1500,
      //   });
       });
    } 
     catch (error) {
      dispatch({ type: DELETE_SIP_SIP_PROFILE_FAIL, payload: error.response.data.message });
    }
  };