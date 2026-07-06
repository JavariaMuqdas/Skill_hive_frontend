import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./company.css";

export default function Tracking() {
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(""); // "projectId|studentId"
  const [tracking, setTracking] = useState([]);

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [progress, setProgress] = useState(0);

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // load assignments for company
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/company/assignments");
        const list = res.data.assignments || [];
        setAssignments(list);

        if (list[0]?.project_id && list[0]?.student_id) {
          setSelected(`${list[0].project_id}|${list[0].student_id}`);
        }
      } catch (e) {
        setErr(e?.response?.data?.message || e.message);
      }
    })();
  }, []);

  const projectId = selected ? selected.split("|")[0] : "";
  const studentId = selected ? selected.split("|")[1] : "";

  async function loadTracking(pid, sid) {
    if (!pid || !sid) return;
    try {
      setErr("");
      // ✅ IMPORTANT: load tracking for selected student
      const res = await api.get(`/company/projects/${pid}/tracking?student_id=${sid}`);
      setTracking(res.data.tracking || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  }

  // load tracking for selected project + student
  useEffect(() => {
    if (!projectId || !studentId) return;
    loadTracking(projectId, studentId);
  }, [projectId, studentId]);

  async function addUpdate() {
    setMsg("");
    setErr("");
    try {
      // ✅ IMPORTANT: send student_id to backend
      await api.post(`/company/projects/${projectId}/tracking`, {
        student_id: Number(studentId),
        title,
        note,
        progress: Number(progress),
      });

      setTitle("");
      setNote("");
      setProgress(0);
      setMsg("Tracking update added ✅");

      // refresh list
      await loadTracking(projectId, studentId);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  }

  return (
    <div className="cPage">
      <div className="cHead">
        <h2 className="cTitle">Tracking</h2>
        <p className="cSub">Add progress updates for accepted projects</p>
      </div>

      {err && <p style={{ color: "red" }}>{err}</p>}
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <div className="cTrackGrid">
        {/* Left: Form + Updates */}
        <div className="cChatCard">
          <div style={{ padding: 14 }}>
            <label style={{ fontWeight: 800 }}>Select Assignment (Project + Student)</label>

            <select
              className="cInput"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              style={{ marginTop: 8 }}
            >
              <option value="">-- Select --</option>

              {assignments.map((a) => (
                <option key={a.id} value={`${a.project_id}|${a.student_id}`}>
                  {/* ✅ if WorkController updated, this will show name */}
                  {a.project?.title || `Project #${a.project_id}`} —{" "}
                  {a.student?.user?.name ? a.student.user.name : `Student #${a.student_id}`}
                </option>
              ))}
            </select>

            {!selected && (
              <p style={{ marginTop: 10 }}>
                No active assignment yet. Accept a student first.
              </p>
            )}

            {selected && (
              <>
                <div style={{ marginTop: 14, fontWeight: 900 }}>Add Update</div>

                <input
                  className="cInput"
                  placeholder="Update title (e.g. UI completed)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ marginTop: 10 }}
                />

                <textarea
                  className="cInput"
                  placeholder="Note (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ marginTop: 10, minHeight: 110 }}
                />

                <input
                  className="cInput"
                  type="number"
                  placeholder="Progress (0-100)"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  style={{ marginTop: 10 }}
                />

                <button
                  className="cBtnPrimary"
                  type="button"
                  onClick={addUpdate}
                  disabled={!title || !projectId || !studentId}
                  style={{ marginTop: 10 }}
                >
                  Add Update
                </button>
              </>
            )}
          </div>

          {/* Updates List */}
          <div style={{ padding: 14, borderTop: "1px solid #eee" }}>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Updates</div>

            {selected && tracking.length === 0 && <p>No tracking updates yet.</p>}

            {tracking.map((t) => (
              <div
                key={t.id}
                style={{
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 10,
                }}
              >
                <div style={{ fontWeight: 900 }}>
                  {t.title} ({t.progress}%)
                </div>
                <div style={{ color: "#6b7280", marginTop: 4 }}>
                  {t.note || "-"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick info */}
        <div className="cSideCard">
          <h3 className="cSectionTitle">Assignment Info</h3>
          <div style={{ color: "#6b7280" }}>
            Selected Project ID: <b>{projectId || "-"}</b>
            <br />
            Selected Student ID: <b>{studentId || "-"}</b>
          </div>

          <button className="cBtnPrimary" type="button" style={{ marginTop: 14 }}>
            Mark as Complete ✅
          </button>
        </div>
      </div>
    </div>
  );
}
