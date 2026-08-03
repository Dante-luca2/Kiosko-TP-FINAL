import axios from "axios";

export const api = axios.create({
    baseURL: "https://localhost:3000/api",
    timeout: 5000,
    headers: { "X-Custom-Header": "foobar" },
});