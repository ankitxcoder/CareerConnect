import axios from "axios";
export const BASE_URL = "http://localhost:9000/"
export const api = axios.create({
    baseURL:BASE_URL,
    headers: {
        "content-Type": "application/json",
    },
});