import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./student.css";

export default function Messages() {
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");

  async function loadThreads() {
    const res = await api.get("/threads");
    const list = res.data.threads || [];
    setThreads(list);
    if (!activeThreadId && list[0]?.id) setActiveThreadId(list[0].id);
  }

  async function loadMessages(threadId) {
    const res = await api.get(`/threads/${threadId}/messages`);
    setMessages(res.data.messages || []);
  }

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    if (activeThreadId) loadMessages(activeThreadId);
  }, [activeThreadId]);

  async function send() {
    setErr("");
    try {
      await api.post(`/threads/${activeThreadId}/messages`, { body: text });
      setText("");
      await loadMessages(activeThreadId);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  }

  return (
    <div>
      <div className="sHead">
        <h1 className="sTitle">Messages</h1>
        <p className="sSub">Chat with company about assigned projects</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 12 }}>
        <div className="sFormCard">
          <b>Threads</b>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {threads.length === 0 && <p className="sMsg">No thread yet (company must Accept first).</p>}
            {threads.map(t => (
              <button
                key={t.id}
                className={activeThreadId === t.id ? "sBtnPrimary" : "sBtnGhost"}
                onClick={() => setActiveThreadId(t.id)}
                style={{ textAlign: "left" }}
              >
                Project #{t.project_id}
              </button>
            ))}
          </div>
        </div>

        <div className="sFormCard">
          <b>Chat</b>
          <div style={{ marginTop: 10, maxHeight: 360, overflow: "auto", border: "1px solid #e5e7eb", borderRadius: 14, padding: 10 }}>
            {messages.map(m => (
              <div key={m.id} style={{ padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ fontWeight: 800, fontSize: 12, color: "#64748b" }}>
                  sender_user_id: {m.sender_user_id}
                </div>
                <div style={{ fontWeight: 700 }}>{m.body}</div>
              </div>
            ))}
          </div>

          {err && <p className="sMsg sErr">{err}</p>}

          <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
            <input
              className="sInput"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type message..."
            />
            <button className="sBtnPrimary" onClick={send} disabled={!activeThreadId || !text}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
