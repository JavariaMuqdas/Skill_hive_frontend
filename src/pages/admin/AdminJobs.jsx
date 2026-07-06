import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./AdminJobs.css";
import {FaFilter,FaDownload,FaTrash,FaEye} from "react-icons/fa6";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filterMenuRef = useRef(null);
  const itemsPerPage = 10;

  const parseSkills = (skills) => {
    try {
      if (Array.isArray(skills)) return skills;
      return skills ? JSON.parse(skills) : [];
    } catch {
      return [skills];
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://127.0.0.1:8000/api/admin/jobs?status=${statusFilter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs from database:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [statusFilter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const toggleDropdown = (index, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const openModal = (job, type) => {
    setSelectedJob(job);
    setModalType(type);
    setActiveDropdown(null);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setModalType(null);
  };

  const handleFilterSelect = (status) => {
    setStatusFilter(status);
    setIsFilterOpen(false);
  };

  const filteredJobs = jobs.filter((job) => {
    const title = job.title || "";
    const company = job.company || "";

    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const getTypeClass = (type) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("full")) return "type-full";
    if (t.includes("part")) return "type-part";
    return "type-other";
  };

  const getStatusClass = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "active" || s === "approved" || s === "published") return "status-published";
    if (s === "pending" || s === "draft") return "status-draft";
    return "status-closed";
  };

  const exportJobs = () => {
    const headers = [
      "Job Title",
      "Category",
      "Location",
      "Job Type",
      "Applications",
      "Status",
      "Posted On",
    ];

    const rows = filteredJobs.map((job) => [
      job.title || "Untitled",
      job.category || "-",
      job.location || "-",
      job.type || job.job_type || "Full-time",
      job.applications || 0,
      job.status || "published",
      job.created_at ? new Date(job.created_at).toLocaleDateString() : "-",
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "jobs-list.csv";
    link.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <h2>Jobs List</h2>

        <button className="export-btn" onClick={exportJobs}>
          <FaDownload/>
          Export
        </button>
      </div>

      <section className="jobs-card">
        <div className="jobs-toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-area" ref={filterMenuRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`filter-btn ${statusFilter !== "all" ? "active-filter-btn" : ""}`}
            >
              <FaFilter/>
            </button>

            {isFilterOpen && (
              <div className="filter-dropdown-menu">
                {["all", "published", "closed", "draft"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterSelect(status)}
                    className={`dropdown-item ${
                      statusFilter === status ? "selected" : ""
                    }`}
                  >
                    {status === "all" ? "All Jobs" : status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading-state">Loading records from database...</div>
          ) : (
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Job Type</th>
                  <th>Applications</th>
                  <th>Status</th>
                  <th>Posted On</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedJobs.length > 0 ? (
                  paginatedJobs.map((job, index) => {
                    const postedOn = job.created_at
                      ? new Date(job.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-";

                    return (
                      <tr key={job.id || index}>
                        <td>
                          <button
                            className="job-title-btn"
                            onClick={() => openModal(job, "view")}
                          >
                            {job.title || "Untitled"}
                          </button>
                        </td>

                        <td>{job.category || "-"}</td>
                        <td>{job.location || "-"}</td>

                        <td>
                          <span className={`type-badge ${getTypeClass(job.type || job.job_type)}`}>
                            {job.type || job.job_type || "Full-time"}
                          </span>
                        </td>

                        <td className="center-cell">{job.applications || 0}</td>

                        <td>
                          <span className={`status-badge ${getStatusClass(job.status)}`}>
                            {job.status || "published"}
                          </span>
                        </td>

                        <td>{postedOn}</td>

                        <td className="action-cell">
                          <button
                            className="action-dots"
                            onClick={(e) => toggleDropdown(index, e)}
                          >
                            ⋮
                          </button>

                          {activeDropdown === index && (
                            <div className="action-dropdown">
                              <button onClick={() => openModal(job, "view")}>
                                <FaEye/> View Details
                              </button>
                              <button
                                className="delete-option"
                                onClick={() => openModal(job, "delete")}
                              >
                                <FaTrash/> Delete Job
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      No jobs found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filteredJobs.length > 0 && (
          <div className="table-footer">
            <span>
              {startIndex + 1} -{" "}
              {Math.min(startIndex + itemsPerPage, filteredJobs.length)} of{" "}
              {filteredJobs.length} entries
            </span>

            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active-page" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </section>

      {selectedJob && modalType === "view" && (
        <div className="drawer-overlay">
          <div className="details-drawer">
            <div className="drawer-header">
              <h2>Job Details</h2>
              <button onClick={closeModal}>×</button>
            </div>

            <div className="details-grid">
              {[
                { label: "Job Title", value: selectedJob.title },
                { label: "Category", value: selectedJob.category },
                { label: "City", value: selectedJob.location },
                { label: "Job Type", value: selectedJob.job_type || selectedJob.type },
                { label: "Deadline", value: selectedJob.deadline },
              ].map((item, index) => (
                <div key={index}>
                  <p>{item.label}</p>
                  <h4>{item.value || "N/A"}</h4>
                </div>
              ))}
            </div>

            <div className="details-grid">
              {selectedJob.salary_type?.toLowerCase() === "hourly" ? (
                <div>
                  <p>Hourly Rate</p>
                  <h4>
                    {selectedJob.hourly_rate
                      ? `PKR ${selectedJob.hourly_rate} / hour`
                      : "Not Specified"}
                  </h4>
                </div>
              ) : (
                <>
                  <div>
                    <p>Salary Min</p>
                    <h4>
                      {selectedJob.salary_min ? `PKR ${selectedJob.salary_min}` : "N/A"}
                    </h4>
                  </div>
                  <div>
                    <p>Salary Max</p>
                    <h4>
                      {selectedJob.salary_max ? `PKR ${selectedJob.salary_max}` : "N/A"}
                    </h4>
                  </div>
                </>
              )}
            </div>

            <div className="drawer-section">
              <p className="section-label">Required Skills</p>
              <div className="skills-wrap">
                {selectedJob.required_skills ? (
                  parseSkills(selectedJob.required_skills).map((skill, index) => (
                    <span key={index}>{skill}</span>
                  ))
                ) : (
                  <p>No skills listed</p>
                )}
              </div>
            </div>

            <div className="drawer-section">
              <p className="section-label">Description</p>
              <p className="description-text">{selectedJob.description || "N/A"}</p>
            </div>

            <button className="close-drawer-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {selectedJob && modalType === "delete" && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>

            <div className="delete-icon"><FaTrash/></div>

            <h3>Remove Job</h3>
            <p>
              Are you sure you want to delete the post for{" "}
              <strong>"{selectedJob.title}"</strong>?
            </p>

            <div className="modal-actions">
              <button onClick={closeModal}>Cancel</button>
              <button
                className="danger-btn"
                onClick={() => {
                  alert("Job Deleted Successfully!");
                  closeModal();
                }}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;