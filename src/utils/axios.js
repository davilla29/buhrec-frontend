// import axios from "axios";

// const BASE_URL =
//   import.meta.env.MODE === "development"
//     ? import.meta.env.VITE_BACKEND_LOCAL_URL
//     : import.meta.env.VITE_BACKEND_LIVE_URL;

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// });

// export default axiosInstance;

import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_BACKEND_LOCAL_URL
    : import.meta.env.VITE_BACKEND_LIVE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Add token fallback for mobile / iPhone Chrome
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
