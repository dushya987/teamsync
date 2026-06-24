import axios from "axios";
import { getItem } from "./storage";

const API_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getItem("teamsync_access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
