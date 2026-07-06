import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminCompanies.css";
import { FaFilter ,FaDownload} from "react-icons/fa";  

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [postedJobs, setPostedJobs] = useState([]);
  const [isJobsLoading, setIsJobsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const filteredCompanies = companies.filter((company) => {
    const name = company.company_name || "";
    const email = company.company_email || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || company.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/companies",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportCompanies = () => {
    const headers = ["Company Name", "Email", "Industry", "Status"];
    const rows = filteredCompanies.map((company) => [
      company.company_name || "No Name",
      company.company_email || "-",
      company.industry || "-",
      company.status || "pending",
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "companies-list.csv";
    link.click();

    window.URL.revokeObjectURL(url);
  };

  const handleViewPostedJobs = async (companyId) => {
    setIsJobsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/admin/companies/${companyId}/jobs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPostedJobs(response.data);
      setModalType("view_jobs");
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Failed to fetch jobs.");
    } finally {
      setIsJobsLoading(false);
    }
  };

  const handleApproveSubmit = async () => {
    if (!selectedCompany) return;

    setIsActionLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://127.0.0.1:8000/api/admin/companies/${selectedCompany.id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setCompanies(
          companies.map((company) =>
            company.id === selectedCompany.id
              ? { ...company, status: "approved" }
              : company
          )
        );

        alert("Company Approved Successfully!");
        closeModal();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve the company.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBlockSubmit = async () => {
    if (!blockReason) {
      alert("Please select a reason first!");
      return;
    }

    setIsActionLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://127.0.0.1:8000/api/admin/companies/${selectedCompany.id}/block`,
        {
          reason: blockReason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setCompanies(
          companies.map((company) =>
            company.id === selectedCompany.id
              ? { ...company, status: "blocked" }
              : company
          )
        );

        alert("Company Blocked Successfully!");
        closeModal();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to block the company.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedCompany) return;

    setIsActionLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/admin/companies/${selectedCompany.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setCompanies(
          companies.filter((company) => company.id !== selectedCompany.id)
        );

        alert("Company Deleted Permanently!");
        closeModal();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete the company.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const toggleDropdown = (index, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const openModal = (company, type) => {
    setSelectedCompany(company);
    setModalType(type);
    setActiveDropdown(null);
  };

  const closeModal = () => {
    setSelectedCompany(null);
    setModalType(null);
    setBlockReason("");
  };

  return (
    <div className="companies-page">
      <div className="companies-header">
        <h2>Companies List</h2>

        <button className="export-btn" onClick={exportCompanies}>
          <FaDownload/>
          Export
        </button>
      </div>

      <section className="companies-card">
    

        <div className="companies-toolbar">
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-area">
            <button
              className="filter-btn"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            >
              <FaFilter/>
            </button>

            {isFilterDropdownOpen && (
              <div className="filter-dropdown">
                {["all", "approved", "pending", "blocked"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={filterStatus === status ? "active-filter" : ""}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="table-scroll">
          {loading ? (
            <div className="loading-text">Loading records from database...</div>
          ) : (
            <table className="companies-table">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Email</th>
                  <th>Industry</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedCompanies.length > 0 ? (
                  paginatedCompanies.map((company, index) => {
                    const compName = company.company_name || "No Name";
                    const compEmail = company.company_email || "-";
                    const compIndustry = company.industry || "-";
                    const currentStatus = company.status || "pending";

                    return (
                      <tr key={company.id || index}>
                        <td>
                          <div className="company-name-cell">
                            <div className="company-avatar">
                              {compName !== "No Name"
                                ? compName[0].toUpperCase()
                                : "C"}
                            </div>
                            <span>{compName}</span>
                          </div>
                        </td>

                        <td>{compEmail}</td>
                        <td>{compIndustry}</td>

                        <td>
                          <span className={`status-badge ${currentStatus}`}>
                            {currentStatus}
                          </span>
                        </td>

                        <td className="action-cell">
                          <button
                            className="action-dots"
                            onClick={(e) => toggleDropdown(index, e)}
                          >
                            ⋮
                          </button>

                          {activeDropdown === index && (
                            <div className="action-dropdown">
                              <button onClick={() => openModal(company, "view")}>
                                👁️ View Details
                              </button>

                              {currentStatus !== "approved" && (
                                <button
                                  onClick={() => openModal(company, "approve")}
                                >
                                  ✅ Approve Company
                                </button>
                              )}

                              {currentStatus !== "blocked" && (
                                <button
                                  onClick={() => openModal(company, "block")}
                                >
                                  🛡️ Block Company
                                </button>
                              )}

                              <button
                                className="delete-option"
                                onClick={() => openModal(company, "delete")}
                              >
                                🗑️ Delete Company
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-row">
                      No companies found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filteredCompanies.length > 0 && (
          <div className="pagination-row">
            <p>
              {startIndex + 1} -{" "}
              {Math.min(startIndex + itemsPerPage, filteredCompanies.length)} of{" "}
              {filteredCompanies.length} entries
            </p>

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

      {selectedCompany && modalType === "view" && (
        <div className="drawer-overlay">
          <div className="details-drawer">
            <div className="drawer-header">
              <h4>Company Details</h4>
              <button onClick={closeModal}>×</button>
            </div>

            <div className="drawer-profile">
              <div className="drawer-avatar">
                {selectedCompany.company_name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3>{selectedCompany.company_name}</h3>
                <span>{selectedCompany.status || "Pending"}</span>
              </div>
            </div>

            <div className="drawer-section">
              <h5>Contact Information</h5>
              <p>Email: {selectedCompany.company_email || "-"}</p>
              <p>Phone: {selectedCompany.phone || "-"}</p>
            </div>

            <div className="drawer-section">
              <h5>Company Information</h5>
              <p>Industry: {selectedCompany.industry || "-"}</p>
              <p>
                Joined At:{" "}
                {selectedCompany.created_at
                  ? new Date(selectedCompany.created_at).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <button
              className="view-jobs-btn"
              onClick={() => handleViewPostedJobs(selectedCompany.id)}
              disabled={isJobsLoading}
            >
              {isJobsLoading ? "Loading..." : "View Posted Jobs ↗"}
            </button>
          </div>
        </div>
      )}

      {selectedCompany && modalType === "approve" && (
        <div className="modal-overlay">
          <div className="small-modal">
            <h4>Approve Company?</h4>
            <p>
              Allow <strong>{selectedCompany.company_name}</strong> to post jobs?
            </p>

            <div className="modal-actions">
              <button onClick={closeModal} disabled={isActionLoading}>
                Cancel
              </button>
              <button onClick={handleApproveSubmit} disabled={isActionLoading}>
                {isActionLoading ? "Approving..." : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCompany && modalType === "block" && (
        <div className="modal-overlay">
          <div className="small-modal">
            <h4>Block Company?</h4>

            <select
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              disabled={isActionLoading}
            >
              <option value="">Select a reason</option>
              <option value="Fake Account / Details">
                Fake Account / Details
              </option>
              <option value="Suspicious Activity">Suspicious Activity</option>
              <option value="Policy Violation">Policy Violation</option>
            </select>

            <div className="modal-actions">
              <button onClick={closeModal} disabled={isActionLoading}>
                Cancel
              </button>
              <button
                className="danger-btn"
                onClick={handleBlockSubmit}
                disabled={isActionLoading}
              >
                {isActionLoading ? "Blocking..." : "Block Company"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCompany && modalType === "delete" && (
        <div className="modal-overlay">
          <div className="small-modal">
            <h4 className="danger-title">Delete Company permanently?</h4>
            <p>
              Remove <strong>{selectedCompany.company_name}</strong>?
            </p>

            <div className="modal-actions">
              <button onClick={closeModal} disabled={isActionLoading}>
                Cancel
              </button>
              <button
                className="danger-btn"
                onClick={handleDeleteSubmit}
                disabled={isActionLoading}
              >
                {isActionLoading ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCompany && modalType === "view_jobs" && (
        <div className="modal-overlay">
          <div className="jobs-modal">
            <div className="jobs-modal-header">
              <h4>Jobs Posted by {selectedCompany.company_name}</h4>
              <button onClick={closeModal}>×</button>
            </div>

            <div className="jobs-table-wrap">
              <table className="companies-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Posted On</th>
                  </tr>
                </thead>

                <tbody>
                  {postedJobs.length > 0 ? (
                    postedJobs.map((job, index) => (
                      <tr key={index}>
                        <td>{job.title}</td>
                        <td>{job.category || "N/A"}</td>
                        <td>
                          <span className="status-badge approved">
                            {job.status}
                          </span>
                        </td>
                        <td>{new Date(job.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-row">
                        No jobs found for this company.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanies;