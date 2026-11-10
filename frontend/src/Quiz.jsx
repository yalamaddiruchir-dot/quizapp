import { useEffect, useState } from "react";
import { api } from "./api";

const LETTERS = ["A", "B", "C", "D"];

export default function Quiz() {
  const [qs, setQs] = useState(null);
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState({});
  const [out, setOut] = useState(null);
  const [hist, setHist] = useState([]);
  const [err, setErr] = useState("");

  const loadHist = () => api("/quiz/results").then(setHist).catch(() => {});
  useEffect(() => { loadHist(); }, []);

  const start = async () => {
    setErr("");
    try {
      const data = await api("/quiz?count=10");
      if (!data.length) return setErr("There are no questions yet. Ask an admin to add some.");
      setQs(data); setI(0); setPicks({}); setOut(null);
    } catch (e) { setErr(e.message); }
  };

  const submit = async () => {
    try {
      const answers = Object.fromEntries(qs.map((q) => [q.id, picks[q.id] ?? null]));
      setOut(await api("/quiz/submit", { method: "POST", body: { answers } }));
      loadHist();
    } catch (e) { setErr(e.message); }
  };

  if (out) return <Results out={out} onAgain={() => { setQs(null); setOut(null); }} />;

  if (!qs)
    return (
      <section className="narrow">
        <h1>Ready for a quick quiz?</h1>
        <p className="muted">You get up to 10 random questions. You'll see your score and the right answers at the end.</p>
        {err && <p className="err" role="alert">{err}</p>}
        <button className="primary" onClick={start}>Start quiz</button>
        {hist.length > 0 && (
          <>
            <h2>Your past scores</h2>
            <ul className="plain">
              {hist.map((h) => (
                <li key={h.id}><strong>{h.score}/{h.total}</strong> <span className="muted">{new Date(h.takenAt).toLocaleString()}</span></li>
              ))}
            </ul>
          </>
        )}
      </section>
    );

  const q = qs[i];
  const last = i === qs.length - 1;
  return (
    <section className="narrow">
      <div className="bar" aria-hidden><span style={{ width: `${((i + 1) / qs.length) * 100}%` }} /></div>
      <p className="muted">Question {i + 1} of {qs.length}{q.category ? ` · ${q.category}` : ""}</p>
      <h1 className="question">{q.text}</h1>
      <div className="stack">
        {q.options.map((o, k) => (
          <button key={k} className={`opt ${picks[q.id] === k ? "picked" : ""}`} onClick={() => setPicks({ ...picks, [q.id]: k })}>
            <b>{LETTERS[k]}</b>{o}
          </button>
        ))}
      </div>
      {err && <p className="err" role="alert">{err}</p>}
      <div className="row">
        <button disabled={i === 0} onClick={() => setI(i - 1)}>Back</button>
        {last ? <button className="primary" onClick={submit}>Submit answers</button> : <button className="primary" onClick={() => setI(i + 1)}>Next question</button>}
      </div>
    </section>
  );
}

function Results({ out, onAgain }) {
  return (
    <section className="narrow">
      <h1 className="score">{out.score} / {out.total}</h1>
      <p className="muted">Here's how each answer went.</p>
      {out.review.map((r) => (
        <article key={r.id} className="rev">
          <h3>{r.text}</h3>
          {r.options.map((o, k) => (
            <p key={k} className={k === r.correct ? "ok" : k === r.selected ? "bad" : ""}>
              <b>{LETTERS[k]}</b>{o}
              {k === r.correct && " (correct)"}
              {k === r.selected && k !== r.correct && " (your answer)"}
            </p>
          ))}
          {r.selected == null && <p className="muted">You skipped this one.</p>}
        </article>
      ))}
      <button className="primary" onClick={onAgain}>Take another quiz</button>
    </section>
  );
}
