import { useState } from "react";
import { api, clearAuth, setAuth } from "./api";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (mode === "register") await api("/auth/register", { method: "POST", body: { username, password } });
      setAuth(username, password);
      onLogin(await api("/auth/me"));
    } catch (ex) {
      clearAuth();
      setErr(ex.message);
    }
  };

  return (
    <section className="narrow">
      <h1>{mode === "login" ? "Log in to start a quiz" : "Create your account"}</h1>
      <form onSubmit={submit} className="stack">
        <label>Username<input value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></label>
        {err && <p className="err" role="alert">{err}</p>}
        <button className="primary">{mode === "login" ? "Log in" : "Create account"}</button>
      </form>
      <p className="muted">
        {mode === "login" ? "New here? " : "Already have an account? "}
        <button className="link" onClick={() => { setMode(mode === "login" ? "register" : "login"); setErr(""); }}>
          {mode === "login" ? "Create an account" : "Log in"}
        </button>
      </p>
    </section>
  );
}
