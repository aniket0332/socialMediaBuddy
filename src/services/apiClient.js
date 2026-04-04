import { logout } from "../utils/auth";
import { API_ENDPOINTS } from "../config/api.config";

const getAuthHeader = () => {
  const token = localStorage.getItem("idToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    logout();
    throw new Error("Unauthorized - Logged out");
  }
  return response;
};

export const apiGet = async (url) => {
  const res = await fetch(url, {
    headers: getAuthHeader(),
  });
  await handleResponse(res);
  return res.json();
};

export const apiPost = async (url, body) => {
  const res = await fetch(url, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(body),
  });
  await handleResponse(res);
  return res.json();
};

export const apiPut = async (url, body) => {
  const res = await fetch(url, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(body),
  });
  await handleResponse(res);
  return res.json();
};

export const apiDelete = async (url) => {
  const res = await fetch(url, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  await handleResponse(res);
  return res.json();
};

export { API_ENDPOINTS, getAuthHeader };