import axios from "axios";
import { getSession } from "next-auth/react";
// Create an instance of axios with baseURL
const axiosInstance = axios.create({
  baseURL: "http://172.20.10.3:4000", 
  timeout: 10000, // 10 seconds
});

// Get the current time zone (safe on both server and client)
// const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Add request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
   
    if (typeof window !== "undefined") {
      // Get the session from NextAuth
      const session:any = await getSession();
      // Ensure headers are initialized and check for session
      if (config.headers && session?.user?.accessToken) {
        config.headers["Authorization"] = `Bearer ${session.user.accessToken}`;
      }
    }
  
    return config;
  },
  (error) => {
    console.log(error,"error");
    
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (typeof window !== "undefined") {
      console.log(error,"error1234");
      
      // Handle 401 errors in the browser
      if (error.response && error.response.status === 401) {
        // Get the current path
        const currentPath = window.location.pathname + window.location.search;
        // Redirect to sign-in with the current path as callbackUrl
        window.location.href = `/sign-in?callbackUrl=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;