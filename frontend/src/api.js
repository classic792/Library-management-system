// frontend/src/api.js
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

export const getAuthToken = () =>
  localStorage.getItem("userToken") || localStorage.getItem("adminToken");

export async function apiRequest(
  path,
  { method = "GET", body, auth = false } = {}
) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status; // <-- add status
    throw err;
  }
  return data;
}
