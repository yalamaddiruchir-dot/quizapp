import { useEffect, useState } from "react";
import { api } from "./api";

const EMPTY = { text: "", optionA: "", optionB: "", optionC: "", optionD: "", correct: 0, category: "" };
const FIELDS = ["optionA", "optionB", "optionC", "optionD"];

export default function Admin() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState("");

  const load = () => api("/admin/questions").then(setList).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await api(editId ? `/admin/questions/${editId}` : "/admin/questions", {
        method: editId ? "PUT" : "POST",
        body: { ...form, correct: Number(form.correct) },
      });
      setForm(EMPTY); setEditId(null); load();
    } catch (ex) { setErr(ex.message); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try { await api(`/admin/questions/${id}`, { method: "DELETE" }); load(); } catch (ex) { setErr(ex.message); }
  };

  const edit = (q) => { setEditId(q.id); setForm({ ...EMPTY, ...q }); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <section className="narrow">
      <h1>{editId ? "Edit question" : "Add a question"}</h1>
      <form onSubmit={save} className="stack">
        <label>Question<textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} required maxLength={500} /></label>
        {FIELDS.map((f, k) => (
          <label key={f} className="optrow">
            <input type="radio" name="correct" checked={Number(form.correct) === k} onChange={() => setForm({ ...form, correct: k })} aria-label={`Mark option ${k + 1} correct`} />
            <input value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} placeholder={`Option ${"ABCD"[k]}`} required />
          </label>
        ))}
        <p className="muted">Select the radio button next to the correct option.</p>
        <label>Category (optional)<input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
        {err && <p className="err" role="alert">{err}</p>}
        <div className="row">
          <button className="primary">{editId ? "Save changes" : "Add question"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm(EMPTY); }}>Cancel edit</button>}
        </div>
      </form>

      <h2>All questions ({list.length})</h2>
      {list.length === 0 && <p className="muted">No questions yet. Add your first one above.</p>}
      {list.map((q) => (
        <article key={q.id} className="rev">
          <h3>{q.text}</h3>
          <p className="muted">Correct: {"ABCD"[q.correct]} · {q[FIELDS[q.correct]]}{q.category ? ` · ${q.category}` : ""}</p>
          <div className="row"><button onClick={() => edit(q)}>Edit</button><button className="danger" onClick={() => remove(q.id)}>Delete</button></div>
        </article>
      ))}
    </section>
  );
}
