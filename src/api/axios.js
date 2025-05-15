import axios from "axios";

// Create an instance of Axios with a base URL
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Replace with your Django backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;