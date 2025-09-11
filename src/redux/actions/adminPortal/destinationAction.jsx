import axios from "axios";
import { CREATE_DESTINATION_FAIL, CREATE_DESTINATION_REQUEST, CREATE_DESTINATION_SUCCESS, GET_DID_FAIL, GET_DID_REQUEST, GET_DID_SUCCESS, UPDATE_DESTINATION_FAIL, UPDATE_DESTINATION_REQUEST, UPDATE_DESTINATION_SUCCESS } from "../../constants/adminPortal/destinationConstants";
import {api} from '../../../mockData';
import { toast } from "react-toastify";

export const getDid = (radioValue) => async (dispatch) => {
  const token = JSON.parse(localStorage.getItem("admin"));
    try {
      dispatch({ type: GET_DID_REQUEST });
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url:  `${api.dev}/api/didresource?is_active=${radioValue}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${token.access_token} `
        },
      };
      await axios
        .request(config)
        .then((response) => {
          dispatch({
            type: GET_DID_SUCCESS,
            payload: response?.data?.data,
          });
        })
        .catch((error) => {
          let errorMessage = "An error occurred while fetching data.";
          if (error.response) {
            if (error.response.status === 403) {
              errorMessage = "Permission Denied";
            } else if (error.response.status === 400 || error.response.status === 401 || error.response.status === 500) {
              errorMessage = error.response.data.message || "Bad Request";
            }
          }
          dispatch({ type: GET_DID_FAIL, payload: errorMessage });
        });
    } catch (error) {
      dispatch({ type: GET_DID_FAIL, payload: error.response.data.message });
    }
  };

  export const createDestination = (createdid, setOpen, setResponse) => async (dispatch) => {
    
    const token = JSON.parse(localStorage.getItem("admin"));
      try {
        dispatch({ type: CREATE_DESTINATION_REQUEST });
        const config = {
          headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token.access_token} `
          },
        };
        const { data } = await axios.post(
          
          
          `${api.dev}/api/didresource`,
          createdid,
          config
        );
       if (data?.status === 200) {
          toast.success(data?.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500,
          });
          setOpen(false);
          setResponse(data);      
        }  else {
          toast.error(data?.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2500,
          });
        }
        dispatch({ type: CREATE_DESTINATION_SUCCESS, payload: data });
      } catch (error) {
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500,
        });
        dispatch({
          type: CREATE_DESTINATION_FAIL,
          payload: error?.response?.data?.message,
        });
      }
    };

export const updateDestination = (updateDid, setResponse, setEdit, setTfnNumber ,setDestinationDescription, setSelectedValue, setUserId, setSubType, setRecording, setDestinationAction, setSuspendValue, setCarrierName) => async (dispatch) => {
    
      const token = JSON.parse(localStorage.getItem("admin"));
        try {
          dispatch({ type: UPDATE_DESTINATION_REQUEST });
          const config = {
            headers: {
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${token.access_token} `
            },
          };
          const { data } = await axios.put(
            
            
            `${api.dev}/api/didresource`,
            updateDid,
            config
          );
         if (data?.status === 200) {
            toast.success(data?.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500,
            });
            setResponse(data);   
            setEdit(false)
            setTfnNumber("")  
            setDestinationDescription("") 
            setSelectedValue("")
            setUserId("") 
            setSubType("")
            setRecording("") 
            setDestinationAction([])
            setSuspendValue("")
            setCarrierName("")  
          }  else {
            toast.error(data?.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2500,
            });
          }
          dispatch({ type: UPDATE_DESTINATION_SUCCESS, payload: data });
        } catch (error) {
          toast.error(error?.response?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2500,
          });
          dispatch({
            type: UPDATE_DESTINATION_FAIL,
            payload: error?.response?.data?.message,
          });
        }
      };

      export const updateAssignment = (updateAssignment, setResponse, setEdit) => async (dispatch) => {
    
        const token = JSON.parse(localStorage.getItem("admin"));
          try {
            dispatch({ type: UPDATE_DESTINATION_REQUEST });
            const config = {
              headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${token.access_token} `
              },
            };
            const { data } = await axios.put(
              
              
              `${api.dev}/api/didresource`,
              updateAssignment,
              config
            );
           if (data?.status === 200) {
              toast.success(data?.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500,
              });
              setResponse(data);   
              setEdit(false)    
            }  else {
              toast.error(data?.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2500,
              });
            }
            dispatch({ type: UPDATE_DESTINATION_SUCCESS, payload: data });
          } catch (error) {
            toast.error(error?.response?.data?.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2500,
            });
            dispatch({
              type: UPDATE_DESTINATION_FAIL,
              payload: error?.response?.data?.message,
            });
          }
        };