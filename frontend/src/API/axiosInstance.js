import axios from "axios";
import conf from "../conf/conf.js";

const api = axios.create({
  baseURL: `${conf.backendUrl}/api/v1`,
  withCredentials: true,
});

export default api;
