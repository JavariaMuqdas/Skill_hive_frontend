import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./student.css";

export default function Tracking() {
  const [assignments, setAssignments] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [tracking, setTracking] = useState([]);
  const [err, setErr] = useState("");

  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const projectOptions = useMemo(() => {
    const map = new Map();
    for (const a of assignments) {
      const pid = a?.project_id;
      if (!pid) continue;
      if (!map.has(String(pid))) map.set(String(pid), a);
    }
    return Array.from(map.values());
  }, [assignments]);

  // Load assignments
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setErr("");
        setAssignmentsLoading(true);

        const res = await api.get("/student/assignments");
        const list = res.data?.assignments || [];

        if (!mounted) return;

        setAssignments(list);

        const firstPid = list?.[0]?.project_id;
        setProjectId(firstPid ? String(firstPid) : "");
      } catch (e) {
        if (!mounted) return;
        setErr(e?.response?.data?.message || e.message || "Failed to load assignments");
      } finally {
        if (mounted) setAssignmentsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Load tracking for selected project (✅ FIXED ROUTE)
  useEffect(() => {
    if (!projectId) {
      setTracking([]);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setErr("");
        setTrackingLoading(true);
        setTracking([]);

        // ✅ correct route for student
        const res = await api.get(`/student/projects/${projectId}/tracking`, {
          signal: controller.signal,
        });

        setTracking(res.data?.tracking || []);
      } catch (e) {
        if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;

        const status = e?.response?.status;
        if (status === 404) {
          setErr("Tracking endpoint not found (404). Use: /api/student/projects/{project}/tracking");
        } else {
          setErr(e?.response?.data?.message || e.message || "Failed to load tracking");
        }
      } finally {
        setTrackingLoading(false);
      }
    })();

    return () => controller.abort();
  }, [projectId]);

  const noAssignments = !assignmentsLoading && assignments.length === 0;

  return (
    <div>
      <div className="sHead">
        <h1 className="sTitle">Tracking</h1>
        <p className="sSub">Project progress updates shared by company</p>
      </div>

      <div className="sFormCard">
        <label>Select Assigned Project</label>

        <select
          className="sInput"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          disabled={assignmentsLoading || noAssignments}
        >
          <option value="">
            {assignmentsLoading ? "Loading projects..." : "-- Select --"}
          </option>

          {projectOptions.map((a) => (
            <option key={`${a.id}-${a.project_id}`} value={String(a.project_id)}>
              {a.project?.title || `Project #${a.project_id}`}
            </option>
          ))}
        </select>

        {noAssignments && (
          <p className="sMsg">No assigned project yet (company must Accept first).</p>
        )}

        {err && <p className="sMsg sErr">{err}</p>}
      </div>

      {assignmentsLoading && <p>Loading...</p>}

      {projectId && !assignmentsLoading && trackingLoading && (
        <p className="sMsg">Loading tracking updates...</p>
      )}

      {projectId && !assignmentsLoading && !trackingLoading && !err && tracking.length === 0 && (
        <p className="sMsg">No tracking updates yet.</p>
      )}

      {!err &&
        tracking.map((t) => (
          <div className="sCard" key={t.id}>
            <div className="sCardMain">
              <div className="sCardTitle">
                {t?.title || "Untitled"} ({Number(t?.progress ?? 0)}%)
              </div>
              <div className="sCardMeta">{t?.note || "-"}</div>
            </div>
          </div>
        ))}
    </div>
  );
}
