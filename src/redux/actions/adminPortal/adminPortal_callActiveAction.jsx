import socketIOClient from 'socket.io-client';
import {
  GET_ADMIN_CALL_ACTIVE_FAIL,
  GET_ADMIN_CALL_ACTIVE_REQUEST,
  GET_ADMIN_CALL_ACTIVE_SUCCESS
} from "../../constants/adminPortal/adminPortal_callActiveConstants";
import { api } from '../../../mockData';
import { initSocket } from '../../../socket_service/socketService';

// let socket = null; // 🔒 Keep socket reference outside of the function

// export const getAdminCallActive = () => async (dispatch) => {
//   try {
//     dispatch({ type: GET_ADMIN_CALL_ACTIVE_REQUEST });

//     // ✅ Prevent multiple socket connections
//     if (!socket) {
//       socket = socketIOClient(`${api.dev}`, {
//         transports: ["websocket"], // optional, force websocket
//         reconnectionAttempts: 5,    // limit reconnection attempts
//         timeout: 10000              // timeout in ms
//       });

//       // 🛑 Handle connection errors
//       socket.on("connect_error", (err) => {
//         console.error("Socket connection failed:", err.message);
//         dispatch({ type: GET_ADMIN_CALL_ACTIVE_FAIL, payload: "Socket connection failed" });
//         socket.disconnect();
//         socket = null; // reset socket so it can try again later if needed
//       });

//       // ✅ Listen to backend events
//       socket.on("call_details", (data) => {
//         if (data?.data !== undefined) {
//           dispatch({
//             type: GET_ADMIN_CALL_ACTIVE_SUCCESS,
//             payload: data.data
//           });
//         }
//       });
//     }

//     // Cleanup function if needed later
//     return () => {
//       if (socket) {
//         socket.disconnect();
//         socket = null;
//       }
//     };
//   } catch (error) {
//     dispatch({ type: GET_ADMIN_CALL_ACTIVE_FAIL, payload: error.message });
//   }
// };

// export const getAdminCallActive = () => async (dispatch) => {
//   try {
//     dispatch({ type: GET_ADMIN_CALL_ACTIVE_REQUEST });

//     const socket = initSocket(`${api.dev}`);

//     // 🔄 Listen only once, avoid duplicate listeners
//     socket.off("call_details").on("call_details", (data) => {
//       if (data?.data) {
//         dispatch({
//           type: GET_ADMIN_CALL_ACTIVE_SUCCESS,
//           payload: data.data
//         });
//       }
//     });

//   } catch (error) {
//     dispatch({
//       type: GET_ADMIN_CALL_ACTIVE_FAIL,
//       payload: error.message
//     });
//   }
// };

export const getAdminCallActive = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ADMIN_CALL_ACTIVE_REQUEST });
    const socket = socketIOClient(`${api.dev}`);

    // Listen for events from the server
    socket.on('call_details', (data) => {
      if (data?.data !== undefined) {
        const newDataCount = Object.keys(data.data).length;
        dispatch({
          type: GET_ADMIN_CALL_ACTIVE_SUCCESS,
          payload: data?.data
        });
      }
    });

    // Clean up function
    return () => {
      socket.disconnect();
    };
  } catch (error) {
    dispatch({ type: GET_ADMIN_CALL_ACTIVE_FAIL, payload: error.message });
  }
};
