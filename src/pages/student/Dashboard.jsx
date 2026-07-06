import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { FaRegFolder, FaBuilding, FaRegCircleCheck, FaRegBookmark, FaBriefcase, FaMapLocation } from "react-icons/fa6";
// import "@fortawesome/fontawesome-free/css/all.min.css";
import jobIllustration from "../../assets/10030688.png";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend se dynamic arrays load karne ke liye states
  const [currentJobs, setCurrentJobs] = useState([]);
  const [runningJobs, setRunningJobs] = useState([]);
  const [closedJobs, setClosedJobs] = useState([]);

  // Modal (Popup) ke liye states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: "", jobs: [], status: "" });

  const [dashboardStats, setDashboardStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalAppliedJobs: 0,
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No authentication token found.");
        setLoading(false);
        return;
      }

      const statsRes = await fetch("http://127.0.0.1:8000/api/student/dashboard-stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!statsRes.ok) {
        throw new Error(`API Error: ${statsRes.status}`);
      }

      const statsData = await statsRes.json();
      console.log("Dashboard API Response:", statsData);

      setDashboardStats({
        totalJobs: statsData.totalJobs || 0,
        totalCompanies: statsData.totalCompanies || 0,
        totalAppliedJobs: statsData.totalAppliedJobs || 0,
      });

      setCurrentJobs(statsData.currentJobs || []);
      setRunningJobs(statsData.runningJobs || []);
      setClosedJobs(statsData.closedJobs || []);

    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    { title: "Total Jobs", count: dashboardStats.totalJobs, color: "red", icon: FaRegFolder, label: "Jobs" },
    { title: "Total Companies", count: dashboardStats.totalCompanies, color: "blue", icon: FaBuilding, label: "Companies" },
    { title: "Applied Jobs", count: dashboardStats.totalAppliedJobs, color: "yellow", icon: FaRegCircleCheck, label: "Applications" },
    { title: "Saved Jobs", count: 0, color: "orange", icon: FaRegBookmark, label: "Saved Jobs" },
  ];

  const jobSections = [
    { title: "Current Jobs", subtitle: "Published jobs currently in review", status: "Current", statusClass: "current", icon: FaBriefcase, jobsData: currentJobs },
    { title: "Running Jobs", subtitle: "Jobs that are currently running", status: "Running", statusClass: "running", icon: FaBriefcase, jobsData: runningJobs },
    { title: "Closed Jobs", subtitle: "Jobs that have been closed", status: "Closed", statusClass: "closed", icon: FaBriefcase, jobsData: closedJobs },
  ];

  const getBadgeColors = (statusText) => {
    const status = statusText.toLowerCase();
    if (status.includes("current")) return { bg: "#E0E0E0", text: "#4F4F4F" };
    if (status.includes("closed")) return { bg: "#F8D7DA", text: "#721C24" };
    return { bg: "#D4EDDA", text: "#155724" };
  };

  const openViewAllModal = (section) => {
    setModalData({
      title: section.title,
      jobs: section.jobsData,
      status: section.status
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="section-header">
        <h2>Dashboard</h2>
      </div>

      <section className="welcome-card">
        <div className="welcome-text">
          <h1>Welcome Back Iram</h1>
          <p>Explore opportunities that match your interests and qualifications. Apply for jobs, and take the next step in your career.</p>
        </div>
        <div className="welcome-illustration">


          <img src={jobIllustration} alt="Job illustration" />
        </div>
      </section>

      <div className="section-header">
        <h2>Overview</h2>
      </div>

      {/* <div className="folder-grid">
        {stats.map((item, index) => (
          <div className={`folder-card ${item.color}`} key={index}>
            <div className="folder-icon"><i className={item.icon}></i></div>
            <h3>{item.title}</h3>
            <div className="folder-info"><p>□ {item.count} {item.label}</p></div>
          </div>
        ))}
      </div> */}
      <div className="folder-grid">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div className={`folder-card ${item.color}`} key={index}>
              <div className="folder-icon">
                <Icon />
              </div>

              <div className="folder-text">
                <h2>{item.count}</h2>
                <p>{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="section-header">
        <h2>Recent Jobs</h2>
      </div>

      {/* Dynamic Job Sections Grid */}
      <section className="company-stats-section">
        <div className="company-stats-grid">
          {jobSections.map((section, index) => {
            const colors = getBadgeColors(section.status);

            return (
              <div className="company-stats-card" key={index}>
                <div className="company-stats-header">
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <h2>{section.title}</h2>
                      {/* Yeh badge total count (jaise 5) dikhayega */}
                      <span className="section-count-badge">{section.jobsData.length}</span>
                    </div>
                    <p>{section.subtitle}</p>
                  </div>
                  {/* Is button par click karne se poora ka poora array modal mein jayega */}
                  <button
                    className="company-stats-view-btn"
                    onClick={() => openViewAllModal(section)}
                  >
                    View all
                  </button>
                </div>

                <div className="company-stats-list">
                  {section.jobsData && section.jobsData.length > 0 ? (
                    // YAHAN .slice(0, 4) WAPAS LAGAYA HAI: Card mein sirf 4 hi dikhein gi
                    section.jobsData.slice(0, 4).map((job, idx) => (
                      <div className="company-stats-job-item" key={job.id || `job-${idx}`}>
                        <div className={`company-stats-job-icon ${section.statusClass}`}>
                          <section.icon />
                        </div>

                        <div className="company-stats-job-content">
                          <h3>{job.title || "No Title"}</h3>
                          <p>
                            <strong>{job.category || "No Category"}</strong>
                            {job.location && (
                              <span>
                                {" • "}
                                <FaMapLocation style={{ fontSize: "12px", marginRight: "4px" }} />
                                {job.location}
                              </span>
                            )}
                          </p>
                        </div>

                        <span
                          className={`company-stats-badge ${section.statusClass}`}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "50px",
                            fontWeight: "600",
                            fontSize: "12px",
                            display: "inline-block",
                            backgroundColor: colors.bg,
                            color: colors.text,
                            border: "0px",
                          }}
                        >
                          {section.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state-container">
                      <div className="empty-state-icon"><i className="fa-regular fa-folder-open"></i></div>
                      <p className="no-jobs-text">No {section.title} available right now</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* View All Modal (Popup Window) */}
      {isModalOpen && (
        <div className="custom-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <h2>{modalData.title} ({modalData.jobs.length})</h2>
              <button className="custom-modal-close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="custom-modal-body">
              <div className="company-stats-list">
                {modalData.jobs.map((job) => {
                  const modalColors = getBadgeColors(modalData.status);
                  return (
                    <div className="company-stats-job-item" key={job.id} style={{ marginBottom: "12px" }}>
                      <div className="company-stats-job-content">
                        <h3 style={{ fontSize: "16px", margin: "0 0 4px 0" }}>{job.title}</h3>
                        <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>
                          <strong>{job.category || "No Category"}</strong> • {job.location || "Location"}
                        </p>
                      </div>
                      <span
                        className="company-stats-badge"
                        style={{
                          padding: "6px 12px",
                          borderRadius: "50px",
                          fontWeight: "600",
                          fontSize: "13px",
                          backgroundColor: modalColors.bg,
                          color: modalColors.text,
                        }}
                      >
                        {modalData.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Global Recent Jobs List */}
      <div className="job-grid">
        {jobs.slice(0, 3).map((job) => (
          <div className="job-card" key={job._id || job.id}>
            <div className="job-icon blue"><i className="fa-solid fa-briefcase"></i></div>
            <div className="job-content">
              <h3>{job.title}</h3>
              <p>{job.companyName || "Company"}</p>
              <span>📍 {job.salary || "Salary not mentioned"}</span>
            </div>
            <div className="job-actions">
              <button className="save-btn">Save</button>
              <button className="apply-btn">Apply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;