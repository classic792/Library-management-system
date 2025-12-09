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

  // try to read JSON, fall back to text
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = { __raw: await res.text() };
  }

  if (!res.ok) {
    const message = data?.message || data?.error || data?.__raw || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.response = data;
    throw err;
  }
  return data;
}
