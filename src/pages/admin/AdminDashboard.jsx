import React, { useEffect, useState } from "react";
import "./AdminDashboard.css"; // Ensure your CSS handles these classes
import { FaBookBookmark, FaBriefcase, FaBuilding, FaFolder } from "react-icons/fa6";
import jobIllustration from "../../assets/10030688.png";


const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [currentJobs, setCurrentJobs] = useState([]);
    const [runningJobs, setRunningJobs] = useState([]);
    const [closedJobs, setClosedJobs] = useState([]);
    const [modalData, setModalData] = useState({ title: "", jobs: [], status: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [dashboardStats, setDashboardStats] = useState({
        totalJobs: 0,
        totalCompanies: 0,
        totalAppliedJobs: 0,
    });

    // const openViewAllModal = (section) => {
    //     setModalData({
    //         title: section.title,
    //         jobs: section.jobsData
    //     });
    //     setIsModalOpen(true);
    // };

    const fetchAdminDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            // API endpoint changed to admin
            const response = await fetch("http://127.0.0.1:8000/api/admin/dashboard-stats", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            const data = await response.json();

            setDashboardStats({
                totalJobs: data.totalJobs || 0,
                totalCompanies: data.totalCompanies || 0,
                totalAppliedJobs: data.totalAppliedJobs || 0,
            });

            setCurrentJobs(data.currentJobs || []);
            setRunningJobs(data.runningJobs || []);
            setClosedJobs(data.closedJobs || []);
        } catch (error) {
            console.error("Admin dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminDashboardData();
    }, []);



    const stats = [
        { title: "Total Jobs", count: dashboardStats.totalJobs, color: "red", icon: FaBriefcase, label: "Jobs" },
        { title: "Total Companies", count: dashboardStats.totalCompanies, color: "blue", icon: FaBuilding, label: "Companies" },
        { title: "Total Applications", count: dashboardStats.totalAppliedJobs, color: "yellow", icon: FaFolder, label: "Applications" },
        { title: "Saved Jobs", count: 0, color: "purple", icon: FaBookBookmark, label: "Saved Jobs" },
    ];

    const jobSections = [
        { title: "Current Jobs", subtitle: "Published jobs currently in review", status: "current", statusClass: "current", icon: FaBriefcase, jobsData: currentJobs },
        { title: "Running Jobs", subtitle: "Jobs that are currently running", status: "running", statusClass: "running", icon: FaBriefcase, jobsData: runningJobs },
        { title: "Closed Jobs", subtitle: "Jobs that have been closed", status: "Closed", statusClass: "closed", icon: FaBriefcase, jobsData: closedJobs },
    ];
    const getBadgeColors = (statusText) => {
        const status = statusText.toLowerCase();

        // Current Jobs = Grey
        if (status.includes("current")) {
            return {
                bg: "#E5E7EB",
                text: "#4B5563"
            };
        }

        // Closed Jobs = Red
        if (status.includes("closed")) {
            return {
                bg: "#FEE2E2",
                text: "#DC2626"
            };
        }

        // Running Jobs = Green
        if (status.includes("running")) {
            return {
                bg: "#DCFCE7",
                text: "#16A34A"
            };
        }

        return {
            bg: "#F3F4F6",
            text: "#6B7280"
        };
    };
    const openViewAllModal = (section) => {
        console.log("Modal clicked for:", section.title);
        setModalData({
            title: section.title,
            jobs: section.jobsData,
            status: section.status
        });
        setIsModalOpen(true);
    };

    // ... (getBadgeColors, openViewAllModal functions stay same as your previous code)

    if (loading) return <div className="dashboard"><h2>Loading Admin Dashboard...</h2></div>;

    return (
        <div className="dashboard">
            <div className="section-header">
                <h2>Dashboard</h2>
            </div>

            <section className="welcome-card">
                <div className="welcome-text">
                    <h1>Welcome Back, Admin</h1>
                    <p>Manage users, monitor company activity, review job listings, and ensure smooth platform operations.</p>
                </div>
                <div className="welcome-illustration">
                    <img src={jobIllustration} alt="Job illustration" /></div>
            </section>

            {/* info cards */}
            <div className="section-header">
                <h2>Overview</h2>
            </div>
            <div className="folder-grid">
                {stats.map((item, index) => (
                    <div className="folder-card" key={index}>
                        <div className={`folder-icon ${item.color}`}>
                            <item.icon />
                        </div>

                        <div className="folder-content">
                            <h2>{item.count}</h2>
                            <p>{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="section-header">
                <h2>Recent Jobs</h2>
            </div>

            {/* Dynamic Job Sections Grid */}
            <section className="admin-stats-section">
                <div className="admin-stats-grid">
                    {jobSections.map((section, index) => {
                        const colors = getBadgeColors(section.status);

                        return (
                            <div className="admin-stats-card" key={index}>
                                <div className="admin-stats-header">
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
                                        className="admin-stats-view-btn"
                                        onClick={() => openViewAllModal(section)}
                                    >
                                        View all
                                    </button>
                                </div>

                                <div className="admin-stats-list">
                                    {section.jobsData && section.jobsData.length > 0 ? (
                                        // YAHAN .slice(0, 4) WAPAS LAGAYA HAI: Card mein sirf 4 hi dikhein gi
                                        section.jobsData.slice(0, 4).map((job, idx) => (
                                            <div className="admin-stats-job-item" key={job.id || `job-${idx}`}>
                                                <div className={`admin-stats-job-icon ${section.statusClass}`}>
                                                    <section.icon />
                                                </div>

                                                <div className="admin-stats-job-content">
                                                    <h3>{job.title || "No Title"}</h3>
                                                    <p>
                                                        <strong>{job.category || "No Category"}</strong>
                                                        {job.location && ` • 📍 ${job.location}`}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`admin-stats-badge ${section.statusClass}`}
                                                    style={{
                                                        padding: "6px 12px",
                                                        borderRadius: "50px",
                                                        fontWeight: "400",
                                                        fontSize: "15px",
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



            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{modalData.title} ({modalData.jobs.length})</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-jobs-list">
                            {modalData.jobs.map((job, idx) => (
                                <div key={idx} className="modal-job-item">
                                    <div className="job-info">
                                        <h4>{job.title}</h4>
                                        <p className="job-meta">
                                           {job.category || "No Category"} • {job.location || "Location"}
                                        </p>
                                    </div>
                                    <span className={`status-badge ${modalData.status}`}>
                                        {modalData.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );

};

export default AdminDashboard;