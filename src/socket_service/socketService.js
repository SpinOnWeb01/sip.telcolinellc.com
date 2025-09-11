import io from "socket.io-client";

let socket;

export const initSocket = (url) => {
  if (!socket) {
    socket = io(url, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      timeout: 10000
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
