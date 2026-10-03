import axios from "axios";
export const BASE_URL = "https://careerconnect-bkgz.onrender.com";
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "content-Type": "application/json",
  },
});
