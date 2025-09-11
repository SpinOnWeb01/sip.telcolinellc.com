import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import All_Route from "./routes/AllRoute";
import { useEffect } from "react";
Chart.register(CategoryScale);
function App() {

  useEffect(() => {
    const handleTabClose = () => {
      // Clear specific data in localStorage when the tab is closed
      //localStorage.removeItem("authToken");
      localStorage.removeItem("selectedTab");
      // Add more keys as needed
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Optionally, clear sensitive data when the tab is hidden
      }
    };

    // Listen for tab close or reload
    window.addEventListener("beforeunload", handleTabClose);

    // Listen for tab visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // Cleanup event listeners
      window.removeEventListener("beforeunload", handleTabClose);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  
  return (
    <div className="App" >
      <All_Route />
      <ToastContainer />
    </div>
  );
}

export default App;
