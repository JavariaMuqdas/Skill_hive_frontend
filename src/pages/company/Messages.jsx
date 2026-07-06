import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./company.css";

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
    <div className="cPage">
      <div className="cHead">
        <h2 className="cTitle">Messages</h2>
        <p className="cSub">Chat with students (thread per project)</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 12 }}>
        {/* Left list */}
        <div className="cSideCard">
          <h3 className="cSectionTitle">Threads</h3>

          {threads.length === 0 && <p>No chat yet. Accept a student first.</p>}

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            {threads.map((t) => (
              <button
                key={t.id}
                className={activeThreadId === t.id ? "cBtnPrimary" : "cBtnSmall"}
                onClick={() => setActiveThreadId(t.id)}
                style={{ textAlign: "left" }}
              >
                Project #{t.project_id} — Student #{t.student_id}
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="cChatCard">
          <div className="cChatBox">
            {messages.map((m) => (
              <div key={m.id} className={"cMsg " + (m.sender_user_id ? "me" : "other")}>
                <div className="cMsgFrom">sender_user_id: {m.sender_user_id}</div>
                <div className="cMsgTxt">{m.body}</div>
              </div>
            ))}
          </div>

          {err && <p style={{ color: "red", padding: "0 14px" }}>{err}</p>}

          <div className="cChatInput">
            <input
              className="cInput"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type message..."
            />
            <button className="cBtnPrimary" type="button" onClick={send} disabled={!activeThreadId || !text}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
