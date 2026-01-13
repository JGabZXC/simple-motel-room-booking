import axios from "axios";

// const BASE_URL = "http://127.0.0.1:8000/api/v1/";
// const BASE_URL = "https://api.motel.jgabzxc.me/api/v1/";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosJSON = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const defaultAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
