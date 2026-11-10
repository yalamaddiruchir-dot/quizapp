const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
let token = sessionStorage.getItem("auth"); // cleared when the tab closes

export const setAuth = (u, p) => { token = btoa(`${u}:${p}`); sessionStorage.setItem("auth", token); };
export const clearAuth = () => { token = null; sessionStorage.removeItem("auth"); };
export const hasAuth = () => !!token;

export async function api(path, opts = {}) {
  const res = await fetch(BASE + path, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Basic ${token}` } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Wrong username or password.");
    if (res.status === 403) throw new Error("You don't have permission to do that.");
    if (res.status === 409) throw new Error("That username is taken. Choose another.");
    if (res.status === 400) throw new Error("Some fields are missing or too short. Check the form and try again.");
    throw new Error(`Something went wrong (code ${res.status}).`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
