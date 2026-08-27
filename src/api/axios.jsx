import axios from "axios";

const BASE_URL = "https://api.freemasonledger.com/api";
// const BASE_URL = "http://localhost:3501/api";
export const BASE_API_URL = BASE_URL.replace(/\/api$/, "");

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
