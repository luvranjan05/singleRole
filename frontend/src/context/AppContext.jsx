import { createContext, useState, useEffect } from "react";
import { AppConstants } from "../util/constants";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  axios.defaults.withCredentials = true; // Enable sending cookies with requests
  const backendUrl = AppConstants.BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Fetch user profile info
  const getUserData = async () => {
    try {
      const response = await axios.get(backendUrl + "/profile");
      if (response.status === 200) {
        setUserData(response.data);
      } else {
        toast.error("Failed to fetch user profile!");
      }
    } catch (error) {
      toast.error("Error fetching profile: " + error.message);
    }
  };

  // Check if user is authenticated (e.g., on reload)
  const getAuthState = async () => {
    try {
      const response = await axios.get(backendUrl + "/is-authenticated");
      if (response.status === 200) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserData(null);
      const msg =
        error.response?.data?.message ||
        "Failed to fetch authentication state!";
      toast.error(msg);
    }
  };

  // ✅ Call getAuthState ONCE when app loads
  useEffect(() => {
    getAuthState();
  }, []);

  const ContextValue = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={ContextValue}>
      {children}
    </AppContext.Provider>
  );
};
