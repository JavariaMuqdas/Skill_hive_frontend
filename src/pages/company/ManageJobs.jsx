import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./managejobs.css";
import { FaPen, FaTrashCan, FaX, FaSquareCheck } from "react-icons/fa6";

export default function ManageJobs() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [appCounts, setAppCounts] = useState({});
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  const JOBS_ENDPOINT = "/company/projects";
  const CATEGORIES_ENDPOINT = "/company/job-categories";

  const [requirementsModal, setRequirementsModal] = useState({
    open: false,
    title: "",
    requirements: [],
  });

  const normalize = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.data?.data)) return raw.data.data;
    if (Array.isArray(raw?.projects)) return raw.projects;
    if (Array.isArray(raw?.jobs)) return raw.jobs;
    return [];
  };

  useEffect(() => {
    loadJobs();
    loadCategories();
  }, []);

  async function loadJobs() {
    setLoading(true);
    setMsg("");

    try {
      const res = await api.get(JOBS_ENDPOINT);
      const data = normalize(res?.data);
      setJobs(data);
      setAppCounts({});
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message || "Failed to load jobs");
      setJobs([]);
      setAppCounts({});
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const res = await api.get(CATEGORIES_ENDPOINT);

      const data =
        res?.data?.data ||
        res?.data?.categories ||
        res?.data ||
        [];

      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log("Failed to load categories", e);
      setCategories([]);
    }
  }

  async function loadApplicantsCounts() {
    try {
      const endpoints = ["/company/applicants", "/company/applications"];
      let list = null;

      for (const url of endpoints) {
        try {
          const res = await api.get(url);
          const raw = res?.data;
          const data =
            raw?.data?.data ||
            raw?.data ||
            raw?.applicants ||
            raw?.applications ||
            raw;

          if (Array.isArray(data)) {
            list = data;
            break;
          }
        } catch (e) {}
      }

      if (!Array.isArray(list)) return;

      const counts = {};

      for (const a of list) {
        const jobId =
          a?.job_id ||
          a?.project_id ||
          a?.jobId ||
          a?.projectId ||
          a?.job?.id ||
          a?.project?.id;

        if (!jobId) continue;
        counts[jobId] = (counts[jobId] || 0) + 1;
      }

      setAppCounts(counts);
    } catch (e) {}
  }

  useEffect(() => {
    if (!jobs?.length) return;
    loadApplicantsCounts();
  }, [jobs]);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "published", label: "Published" },
    { value: "publish", label: "Publish" },
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
    { value: "closed", label: "Closed" },
  ];

  const getJobId = (j) => j?.id || j?._id;

  const getJobTitle = (j) =>
    j?.title || j?.job_title || j?.name || j?.position || "Untitled";

  const getStatus = (j) => String(j?.status || "").toLowerCase();

  const safeJsonParse = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const getJobRequirementsArray = (j) => {
    const raw =
      j?.job_requirements ??
      j?.requirements ??
      j?.required_skills ??
      j?.skills_required ??
      j?.skills ??
      j?.requirement ??
      j?.jobRequirements;

    if (!raw) return [];

    if (Array.isArray(raw)) {
      return raw
        .flatMap((item) => {
          if (typeof item === "string") return item;
          if (item?.name) return item.name;
          if (item?.skill) return item.skill;
          if (item?.title) return item.title;
          return [];
        })
        .map((item) => String(item).trim())
        .filter(Boolean);
    }

    if (typeof raw === "string") {
      const trimmed = raw.trim();
      const parsed = safeJsonParse(trimmed);

      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => {
            if (typeof item === "string") return item;
            if (item?.name) return item.name;
            if (item?.skill) return item.skill;
            if (item?.title) return item.title;
            return null;
          })
          .filter(Boolean)
          .map((item) => String(item).trim());
      }

      if (trimmed.includes(",")) {
        return trimmed
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }

      return trimmed ? [trimmed] : [];
    }

    return [];
  };

  const getJobRequirementsText = (j) => {
    const arr = getJobRequirementsArray(j);
    return arr.length ? arr.join(", ") : "No requirements added";
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return (jobs || []).filter((j) => {
      const title = String(getJobTitle(j)).toLowerCase();
      const requirements = String(getJobRequirementsText(j)).toLowerCase();
      const jobCategory = String(j?.category || "").trim();

      const matchQ =
        !query || title.includes(query) || requirements.includes(query);

      const s = getStatus(j);
      const matchStatus = status === "all" ? true : s === status;

      const matchCategory =
        category === "" ? true : jobCategory === String(category).trim();

      return matchQ && matchStatus && matchCategory;
    });
  }, [jobs, q, status, category]);

  function pillClass(raw) {
    const s = String(raw || "").toLowerCase();
    if (s === "published" || s === "publish" || s === "active") return "active";
    if (s === "draft") return "draft";
    if (s === "closed") return "closed";
    return "muted";
  }

  function pillLabel(raw) {
    const s = String(raw || "").toLowerCase();
    if (s === "published" || s === "publish" || s === "active") return "Active";
    if (s === "draft") return "Draft";
    if (s === "closed") return "Closed";
    return s ? s : "—";
  }

  async function onDelete(job) {
    const id = getJobId(job);
    if (!id) return;

    if (!window.confirm("Delete this job?")) return;

    try {
      await api.delete(`/company/projects/${id}`);
      setJobs((prev) => prev.filter((x) => getJobId(x) !== id));
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message || "Failed to delete");
    }
  }

  async function toggleStatus(job) {
    const id = getJobId(job);
    if (!id) return;

    const current = getStatus(job);
    const next = current === "closed" ? "published" : "closed";

    try {
      await api.patch(`/company/projects/${id}/status`, { status: next });
      setJobs((prev) =>
        prev.map((x) => (getJobId(x) === id ? { ...x, status: next } : x))
      );
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message || "Failed to update status");
    }
  }

  function onEdit(job) {
    const id = getJobId(job);
    if (!id) return;
    navigate(`/company/projects/${id}/edit`);
  }

  function onApplicants(job) {
    const id = getJobId(job);
    if (!id) return;
    navigate(`/company/applicants?jobId=${id}`);
  }

  function openRequirementsModal(job) {
    setRequirementsModal({
      open: true,
      title: getJobTitle(job),
      requirements: getJobRequirementsArray(job),
    });
  }

  function closeRequirementsModal() {
    setRequirementsModal({
      open: false,
      title: "",
      requirements: [],
    });
  }

  if (loading) return <div className="dashLoading">Loading...</div>;

  return (
    <div className="mj2Wrap">
      <div className="mj2Header">
        <div>
          <h1 className="mj2Title">Job Management</h1>
          <p className="mj2Sub">Manage your job postings and track applications</p>
        </div>

        <button
          className="mj2Primary"
          onClick={() => navigate("/company/post-project")}
          type="button"
        >
          + Add New Job
        </button>
      </div>

      <div className="mj2FiltersCard">
        <div className="mj2FiltersRow">
          <div className="mj2Search">
            <span className="mj2SearchIcon">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>

            <input
              className="mj2SearchInput"
              placeholder="Search jobs..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <select
            className="mj2Select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>

            {categories.map((cat, index) => (
              <option key={index} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>

          <select
            className="mj2Select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <button className="mj2RefreshBtn" type="button" onClick={loadJobs}>
            Refresh
          </button>
        </div>

        <div className="mj2Hint">
          Showing {filtered.length} of {(jobs || []).length} jobs
        </div>

        {msg ? (
          <div className="dashError" style={{ marginTop: 10 }}>
            {msg}
          </div>
        ) : null}
      </div>

      <div className="mj2TableCard mj2RefTableCard">
        <div className="mj2TableHead mj2RefTableHead">
          <div>Job title</div>
          <div>Status</div>
          <div>Applicants</div>
          <div>Operation</div>
        </div>

        {filtered.length ? (
          filtered.map((j) => {
            const id = getJobId(j) || getJobTitle(j);
            const title = getJobTitle(j);
            const requirements = getJobRequirementsArray(j);
            const previewRequirements = requirements.slice(0, 2);
            const remainingCount = requirements.length - 2;
            const jobId = getJobId(j);
            const applicantsCount = jobId ? appCounts[jobId] ?? 0 : 0;
            const isClosed = getStatus(j) === "closed";

            return (
              <div className="mj2Row mj2RefRow" key={id}>
                <div className="mj2JobCol">
                  <div className="mj2JobTitle">{title}</div>

                  <div className="mj2JobSubWrap">
                    {requirements.length > 0 ? (
                      <>
                        <div className="mj2JobSub">
                          {previewRequirements.join(", ")}
                        </div>

                        {remainingCount > 0 && (
                          <button
                            type="button"
                            className="mj2ViewMoreBtn"
                            onClick={() => openRequirementsModal(j)}
                          >
                            +{remainingCount} more
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="mj2JobSub">No requirements added</div>
                    )}
                  </div>
                </div>

                <div className="mj2StatusCol">
                  <span className={"mj2Pill mj2RefPill " + pillClass(j.status)}>
                    {pillLabel(j.status)}
                  </span>
                </div>

                <div className="mj2AppsCol mj2RefAppsCol">
                  <button
                    type="button"
                    className="mj2AppsBtn mj2RefAppsBtn"
                    onClick={() => onApplicants(j)}
                    title="View applicants"
                  >
                    {applicantsCount}
                  </button>
                </div>

                <div className="mj2OperationCol">
                  <button
                    className="mj2IconBtn"
                    onClick={() => onEdit(j)}
                    title="Edit"
                    type="button"
                  >
                    <FaPen />
                  </button>

                  <button
                    className="mj2IconBtn"
                    onClick={() => toggleStatus(j)}
                    title={isClosed ? "Activate" : "Close"}
                    type="button"
                  >
                    {isClosed ? <FaSquareCheck /> : <FaX />}
                  </button>

                  <button
                    className="mj2IconBtn danger"
                    onClick={() => onDelete(j)}
                    title="Delete"
                    type="button"
                  >
                    <FaTrashCan />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="mj2Empty">No jobs found</div>
        )}
      </div>

      {requirementsModal.open && (
        <div className="mj2ReqModalOverlay" onClick={closeRequirementsModal}>
          <div className="mj2ReqModal" onClick={(e) => e.stopPropagation()}>
            <div className="mj2ReqModalHeader">
              <h3 className="mj2ReqModalTitle">
                {requirementsModal.title} - Requirements
              </h3>

              <button
                type="button"
                className="mj2ReqCloseBtn"
                onClick={closeRequirementsModal}
              >
                ×
              </button>
            </div>

            <div className="mj2ReqModalBody">
              {requirementsModal.requirements.length ? (
                <ul className="mj2ReqList">
                  {requirementsModal.requirements.map((item, index) => (
                    <li key={`${item}-${index}`} className="mj2ReqListItem">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mj2ReqEmpty">No requirements added</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}