import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function MyProjects() {
  const nav = useNavigate();

  const [rows, setRows] = useState([]);
  const [tab, setTab] = useState("all"); // all | draft | published | closed
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // 🔒 normalize any backend response shape
  const normalize = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.data?.data)) return raw.data.data;
    return [];
  };

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get("/company/projects");
      console.log("GET /company/projects =", res?.data);
      setRows(normalize(res?.data));
    } catch (e) {
      console.log("MyProjects load error:", e?.response?.data || e);
      setErr(e?.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (tab === "all") return rows;
    return rows.filter(
      (p) => String(p?.status || "").toLowerCase() === tab
    );
  }, [rows, tab]);

  const counts = useMemo(() => {
    const c = { all: rows.length, draft: 0, published: 0, closed: 0 };
    rows.forEach((p) => {
      const s = String(p?.status || "").toLowerCase();
      if (s in c) c[s] += 1;
    });
    return c;
  }, [rows]);

  // 🔁 status update (publish / close)
  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/company/projects/${id}/status`, { status });
      setRows((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to update status");
    }
  };

  // 🗑 delete
  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/company/projects/${id}`);
      setRows((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to delete project");
    }
  };

  const TabBtn = ({ value, label }) => (
    <button
      type="button"
      onClick={() => setTab(value)}
      style={{
        padding: "8px 12px",
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        background: tab === value ? "#003F51" : "#fff",
        color: tab === value ? "#fff" : "#111827",
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ padding: 18 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>My Projects</h2>
          <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>
            Manage drafts and published projects
          </div>
        </div>

        <Link
          to="/company/post-project"
          style={{
            textDecoration: "none",
            padding: "10px 14px",
            borderRadius: 12,
            background: "#003F51",
            color: "#fff",
            fontWeight: 500,
          }}
        >
          + Post New
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <TabBtn value="all" label={`All (${counts.all})`} />
        <TabBtn value="draft" label={`Drafts (${counts.draft})`} />
        <TabBtn value="published" label={`Published (${counts.published})`} />
        <TabBtn value="closed" label={`Closed (${counts.closed})`} />
        <button
          type="button"
          onClick={load}
          style={{
            marginLeft: "auto",
            padding: "8px 12px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 800,
          }}
        >
          Refresh
        </button>
      </div>

      {/* States */}
      {loading && (
        <div style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 12 }}>
          Loading…
        </div>
      )}

      {!loading && err && (
        <div
          style={{
            padding: 12,
            border: "1px solid #fecaca",
            background: "#fef2f2",
            borderRadius: 12,
            color: "#991b1b",
          }}
        >
          {err}
        </div>
      )}

      {!loading && !err && filtered.length === 0 && (
        <div style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 12 }}>
          {tab === "all" ? "No projects yet." : `No ${tab} projects.`}
        </div>
      )}

      {!loading && !err && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((p) => (
            <div
              key={p.id}
              style={{
                padding: 12,
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                background: "#fff",
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 900 }}>{p.title || "Untitled"}</div>
                <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>
                  {(p.city || "—")} • {String(p.job_type || "—").toUpperCase()} •{" "}
                  {p.category || "—"}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {p.status === "draft" && (
                  <>
                    <button
                      onClick={() => nav(`/company/projects/${p.id}/edit`)}
                      style={{ padding: "6px 10px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => updateStatus(p.id, "published")}
                      style={{ padding: "6px 10px" }}
                    >
                      Publish
                    </button>
                  </>
                )}

                {p.status === "published" && (
                  <button
                    onClick={() => updateStatus(p.id, "closed")}
                    style={{ padding: "6px 10px" }}
                  >
                    Close
                  </button>
                )}

                <button
                  onClick={() => deleteProject(p.id)}
                  style={{ padding: "6px 10px", color: "#b91c1c" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
