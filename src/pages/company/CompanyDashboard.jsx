import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { formatDistanceToNow, parseISO } from "date-fns";
import "./companydashboard.css";
import { FaUserGroup, FaBriefcase, FaUserCheck } from "react-icons/fa6";

export default function CompanyDashboard() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [company, setCompany] = useState(null);
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recommendedByJobs, setRecommendedByJobs] = useState([]);

  const [runningJobs, setRunningJobs] = useState([]);
  const [closedJobs, setClosedJobs] = useState([]);
  const [currentJobs, setCurrentJobs] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  // Function to open modal
  const openModal = (title, data) => {
    setModalTitle(title);
    setModalData(data);
    setShowModal(true);
  };

  const scrollRef = React.useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setMsg("");

        const [pRes, aRes, cRes, rRes] = await Promise.all([
          api.get("/company/projects"),
          api.get("/company/applicants"),
          api.get("/company/profile"),
          api.get("/company/recommended-students"),
        ]);

        const companyData = cRes?.data?.company || cRes?.data || null;
        const currentId = companyData?.id;

        let runningRes = { data: [] };
        let closedRes = { data: [] };
        let currentRes = { data: [] };

        if (currentId) {
          [runningRes, closedRes, currentRes] = await Promise.all([
            api.get(`/company/${currentId}/running-jobs`),
            api.get(`/company/${currentId}/closed-jobs`),
            api.get(`/company/${currentId}/current-jobs`),
          ]);
          console.log("Closed Jobs Count:", closedRes.data.length);
        }

        setProjects(pRes?.data?.data || pRes?.data || []);
        setApplications(aRes?.data?.applications || aRes?.data?.data || aRes?.data || []);
        setCompany(companyData);
        setRecommendedByJobs(rRes?.data?.data || []);

        setRunningJobs(runningRes?.data?.data || runningRes?.data || []);
        setClosedJobs(closedRes?.data?.data || closedRes?.data || []);
        setCurrentJobs(currentRes?.data?.data || currentRes?.data || []);
      } catch (e) {
        setMsg(e?.response?.data?.message || e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = useMemo(() => {
    const safeProjects = Array.isArray(projects) ? projects : [];
    const safeApps = Array.isArray(applications) ? applications : [];

    const activeJobs = safeProjects.filter(
      (p) => String(p?.status || "").toLowerCase() === "published"
    ).length;

    const totalApplicants = safeApps.length;

    const hired = safeApps.filter((a) => {
      const s = String(a?.status || a?.application_status || "").toLowerCase();
      return s === "hired" || s === "selected" || s === "accepted";
    }).length;

    return { activeJobs, totalApplicants, hired };
  }, [projects, applications]);

  const scrollCards = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -380 : 380,
      behavior: "smooth",
    });
  };

  const getFormattedTime = (createdAt) => {
    try {
      return formatDistanceToNow(parseISO(createdAt), { addSuffix: true });
    } catch {
      return "1 day ago";
    }
  };

  if (loading) return <div className="dashLoading">Loading...</div>;
  if (msg) return <div className="dashError">{msg}</div>;

  // 🚫 IF COMPANY IS BLOCKED: Return warning view immediately and stop further UI rendering
  // if (company?.status === "blocked") {
  //   return (
  //     <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
  //       <div style={{
  //         background: "#fff",
  //         border: "1px solid #fee2e2",
  //         borderRadius: "16px",
  //         padding: "40px 32px",
  //         maxWidth: "550px",
  //         width: "100%",
  //         boxShadow: "0 10px 25px rgba(220, 38, 38, 0.05)",
  //         textAlign: "center"
  //       }}>
  //         <div style={{ width: "64px", height: "64px", background: "#fee2e2", color: "#ef4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 24px" }}>
  //           🚫
  //         </div>

  //         <h3 style={{ margin: "0 0 12px 0", color: "#1e293b", fontSize: "22px", fontWeight: "600", lineHeight: "1.4" }}>
  //           Your company account has been blocked by the administrator.
  //         </h3>

  //         <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "12px", padding: "16px 20px", textAlign: "left", margin: "24px 0" }}>
  //           <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px", letterSpacing: "0.5px" }}>
  //             Reason:
  //           </span>
  //           <p style={{ margin: 0, fontSize: "14px", color: "#991b1b", fontWeight: "500", lineHeight: "1.5" }}>
  //             {company?.block_reason || "Policy Violation"}
  //           </p>
  //         </div>

  //         <p style={{ margin: 0, fontSize: "14px", color: "#64748b", fontWeight: "400" }}>
  //           Please contact support for assistance.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  if (company?.status === "blocked") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            width: "100%",
            maxWidth: "600px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid #fee2e2",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "#fee2e2",
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "38px",
              margin: "0 auto 20px",
            }}
          >
            🚫
          </div>

          <h2
            style={{
              margin: "0 0 12px",
              color: "#1e293b",
              fontSize: "24px",
              fontWeight: "700",
            }}
          >
            Account Blocked
          </h2>

          <p
            style={{
              color: "#64748b",
              fontSize: "15px",
              lineHeight: "1.7",
              marginBottom: "24px",
            }}
          >
            Your company account has been blocked by the administrator.
            Please contact Customer Service for further assistance.
          </p>

          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#dc2626",
                marginBottom: "6px",
                textTransform: "uppercase",
              }}
            >
              Block Reason
            </div>

            <div
              style={{
                color: "#991b1b",
                fontSize: "14px",
              }}
            >
              {company?.block_reason || "Policy Violation"}
            </div>
          </div>

          <button
            onClick={() =>
              window.location.href = "mailto:support@yourcompany.com"
            }
            style={{
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Contact Customer Service
          </button>
        </div>
      </div>
    );
  }

  // ✅ Normal Active Dashboard View
  return (
    <div className="dashWrap">
      <div className="jpWelcome">
        <div className="jpWelcomeTitle">Welcome back!</div>
        <div className="jpWelcomeCompany">
          <span>{company?.company_name || "Your Company"}</span>

          <span className={`companyStatusBadge ${company?.status}`}>
            {company?.status || "pending"}
          </span>
        </div>

      </div>

      <div className="dashGrid3">
        <div className="statCard blue clickableCard" onClick={() => navigate("/company/job-categories")}>
          <div className="statTop">
            <div className="statTitle">Active Jobs</div>
            <div className="statIcon"><FaBriefcase /></div>
          </div>
          <div className="statValue">{stats.activeJobs}</div>
        </div>

        <div className="statCard green">
          <div className="statTop">
            <div className="statTitle">Total Applicants</div>
            <div className="statIcon"><FaUserGroup /></div>
          </div>
          <div className="statValue">{stats.totalApplicants}</div>
        </div>

        <div className="statCard purple">
          <div className="statTop">
            <div className="statTitle">Hired</div>
            <div className="statIcon"><FaUserCheck /></div>
          </div>
          <div className="statValue">{stats.hired}</div>
        </div>
      </div>

      <div className="dashGrid2">
        <div className="panelCard">
          <div className="panelHead">
            <div>
              <div className="panelTitle">Current Jobs</div>
              <div className="panelSub">Published jobs currently in review</div>
            </div>
            <button className="panelLinkBtn" onClick={() => openModal("Current Jobs", currentJobs)}>View all</button>
          </div>
          <div className="panelBody">
            {currentJobs.length ? (
              currentJobs.slice(0, 3).map((p) => (
                <div className="rowItem" key={p.id}>
                  <div className="rowLeft">
                    <div className="rowBadge"><FaBriefcase /></div>
                    <div>
                      <div className="rowTitle">{p.title || "Current Job"}</div>
                      <div className="rowMeta">{p.city || "—"} • {p.category || "—"}</div>
                    </div>
                  </div>
                  <div className="rowPill ok">Current</div>
                </div>
              ))
            ) : (
              <div className="emptyText">No current jobs yet</div>
            )}
          </div>
        </div>

        <div className="panelCard">
          <div className="panelHead">
            <div>
              <div className="panelTitle">Running Jobs</div>
              <div className="panelSub">Jobs that are currently running</div>
            </div>
            <button className="panelLinkBtn" onClick={() => openModal("Running Jobs", runningJobs)}>View all</button>
          </div>
          <div className="panelBody">
            {runningJobs.length ? (
              runningJobs.slice(0, 3).map((job) => (
                <div className="rowItem" key={job.id}>
                  <div className="rowLeft">
                    <div className="rowBadge" style={{ backgroundColor: "#e8f5e9", color: "#2e7d32" }}>
                      <FaBriefcase />
                    </div>
                    <div>
                      <div className="rowTitle">{job.title || "Running Job"}</div>
                      <div className="rowMeta">{job.city || "—"} • {job.category || "—"}</div>
                    </div>
                  </div>
                  <div className="rowPill ok">Running</div>
                </div>
              ))
            ) : (
              <div className="emptyText">No running jobs yet</div>
            )}
          </div>
        </div>

        <div className="panelCard">
          <div className="panelHead">
            <div>
              <div className="panelTitle">Closed Jobs</div>
              <div className="panelSub">Jobs that have been closed</div>
            </div>
            <button className="panelLinkBtn" onClick={() => openModal("Closed Jobs", closedJobs)}>View all</button>
          </div>

          <div className="panelBody">
            {closedJobs.length ? (
              closedJobs.slice(0, 3).map((p) => (
                <div className="rowItem" key={p.id}>
                  <div className="rowLeft">
                    <div className="rowBadge"><FaBriefcase /></div>
                    <div>
                      <div className="rowTitle">{p.title || "Closed Job"}</div>
                      <div className="rowMeta">{p.city || "—"} • {p.category || "—"}</div>
                    </div>
                  </div>
                  <div className="rowPill closed">Closed</div>
                </div>
              ))
            ) : (
              <div className="emptyText">No closed jobs yet</div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modalOverlay" onClick={() => setShowModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>{modalTitle}</h3>
              <button className="closeBtn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modalBody">
              {modalData.length ? (
                modalData.map((p) => (
                  <div className="rowItem" key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                    <div className="rowLeft">
                      <div className="rowBadge"><i className="fa-solid fa-briefcase"></i></div>
                      <div>
                        <div className="rowTitle">{p.title}</div>
                        <div className="rowMeta">{p.city} • {p.category}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No jobs found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}