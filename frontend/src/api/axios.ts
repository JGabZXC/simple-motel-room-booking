import axios from "axios";

const BASE_URL = "http://127.0.0.1:80/api/v1/";

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
