import { useEffect, useState } from "react";
import { api, clearAuth, hasAuth } from "./api";
import Auth from "./Auth.jsx";
import Quiz from "./Quiz.jsx";
import Admin from "./Admin.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("quiz");
  const [ready, setReady] = useState(!hasAuth());

  useEffect(() => {
    if (hasAuth()) api("/auth/me").then(setUser).catch(clearAuth).finally(() => setReady(true));
  }, []);

  const logout = () => { clearAuth(); setUser(null); setView("quiz"); };
  if (!ready) return null;

  return (
    <>
      <header>
        <strong className="brand">QuizRoom</strong>
        {user && (
          <nav>
            <button className={view === "quiz" ? "on" : ""} onClick={() => setView("quiz")}>Take a quiz</button>
            {user.role === "ADMIN" && (
              <button className={view === "admin" ? "on" : ""} onClick={() => setView("admin")}>Manage questions</button>
            )}
            <span className="who">{user.username}</span>
            <button onClick={logout}>Log out</button>
          </nav>
        )}
      </header>
      <main>
        {!user ? <Auth onLogin={setUser} /> : view === "admin" ? <Admin /> : <Quiz />}
      </main>
    </>
  );
}
