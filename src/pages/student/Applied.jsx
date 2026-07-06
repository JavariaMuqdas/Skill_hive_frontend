import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./applied.css";

export default function Applied() {
  const [apps, setApps] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/student/applications");
        setApps(res.data.applications || []);
      } catch (e) {
        setErr(e?.response?.data?.message || e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const normalizeStatus = (status) => {
    if (!status) return "in_review";

    const s = status.toLowerCase().trim();

    if (s === "accepted" || s === "accept") return "accepted";
    // if (s === "shortlisted" || s === "shortlist") return "shortlisted";
    if (s === "rejected" || s === "reject") return "rejected";
    // if (s === "withdrawn" || s === "withdraw") return "withdrawn";
    if (s === "applied") return "in_review";
    if (s === "in review" || s === "in_review") return "in_review";

    return "in_review";
  };

  const getStatusLabel = (status) => {
    const s = normalizeStatus(status);

    if (s === "accepted") return "Accepted";
    // if (s === "shortlisted") return "Shortlisted";
    if (s === "rejected") return "Rejected";
    // if (s === "withdrawn") return "Withdrawn";
    return "In Review";
  };

  const getStatusClass = (status) => {
    const s = normalizeStatus(status);

    if (s === "accepted") return "applied-status applied-status-accepted";
    // if (s === "shortlisted") return "applied-status applied-status-shortlisted";
    if (s === "rejected") return "applied-status applied-status-rejected";
    // if (s === "withdrawn") return "applied-status applied-status-withdrawn";
    return "applied-status applied-status-review";
  };

  const filteredApps = useMemo(() => {
    return apps.filter((a) => {
      const title = a.project?.title || a.job?.title || `Project #${a.project_id || a.job_id || a.id}`;
      const company =
        a.company_name ||
        a.project?.company?.company_name ||
        a.project?.company?.name ||
        "";
      const keyword = search.toLowerCase();

      return (
        title.toLowerCase().includes(keyword) ||
        company.toLowerCase().includes(keyword)
      );
    });
  }, [apps, search]);

  const reviewCount = apps.filter(
    (a) => normalizeStatus(a.status) === "in_review"
  ).length;

  const acceptedCount = apps.filter(
    (a) => normalizeStatus(a.status) === "accepted"
  ).length;

  // const shortlistedCount = apps.filter(
  //   (a) => normalizeStatus(a.status) === "shortlisted"
  // ).length;

  const rejectedCount = apps.filter(
    (a) => normalizeStatus(a.status) === "rejected"
  ).length;

  // const withdrawnCount = apps.filter(
  //   (a) => normalizeStatus(a.status) === "withdrawn"
  // ).length;

  return (
    <div className="applied-page">
      <div className="applied-hero">
        <div>
          <h1 className="applied-title">Applied Jobs</h1>
          <p className="applied-subtitle">
            Jobs you have applied to and their status.
          </p>
        </div>

        <div className="applied-searchWrap">
          <input
            type="text"
            className="applied-search"
            placeholder="Search applied jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="applied-summary">
        <div className="applied-chip active">
          <span>All Applications</span>
          <strong>{apps.length}</strong>
        </div>

        <div className="applied-chip review">
          <span>In Review</span>
          <strong>{reviewCount}</strong>
        </div>

        <div className="applied-chip accepted">
          <span>Accepted</span>
          <strong>{acceptedCount}</strong>
        </div>

        {/* <div className="applied-chip shortlisted">
          <span>Shortlisted</span>
          <strong>{shortlistedCount}</strong>
        </div> */}

        <div className="applied-chip rejected">
          <span>Rejected</span>
          <strong>{rejectedCount}</strong>
        </div>

        {/* <div className="applied-chip withdrawn">
          <span>Withdrawn</span>
          <strong>{withdrawnCount}</strong>
        </div> */}
      </div>

      {loading && <p className="sMsg">Loading...</p>}
      {err && <p className="sMsg sErr">{err}</p>}

      {!loading && !err && filteredApps.length === 0 && (
        <div className="applied-tableWrap">
          <div className="empty-state">No applications found.</div>
        </div>
      )}

      {!loading && !err && filteredApps.length > 0 && (
        <div className="applied-tableWrap">
          <table className="applied-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Company</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Last Update</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>

            <tbody>
              {filteredApps.map((a) => {

                const title =
                  a.job_title ||
                  a.project?.title ||
                  `Project #${a.project_id || a.id}`;

                const category =
                  a.job_category ||
                  a.project?.category ||
                  "No Category";

                const company =
                  a.company_name ||
                  a.project?.company?.company_name ||
                  "Unknown Company";

                const industry =
                  a.company_industry ||
                  a.project?.company?.industry ||
                  "No Industry";

                const statusLabel = getStatusLabel(a.status);
                const statusClass = getStatusClass(a.status);

                return (
                  <tr key={a.id}>
                    <td>
                      <div className="job-cell">
                        <div className="job-icon">
                          {title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="job-title">{title}</div>
                          <div className="job-meta">{category}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="company-cell">
                        <div className="company-logo">
                          {company.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="company-name">{company}</div>
                          <div className="company-meta">{industry}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="job-date">{formatDate(a.created_at)}</div>
                    </td>

                    <td>
                      <span className={statusClass}>{statusLabel}</span>
                    </td>

                    <td>
                      <div className="job-date">
                        {formatDate(a.updated_at || a.created_at)}
                      </div>
                    </td>

                    {/* <td>
                      <div className="action-cell">
                        <button className="view-btn">View</button>
                        <button className="more-btn">⋯</button>
                      </div>
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="applied-footer">
            Showing 1 - {filteredApps.length} of {apps.length} applications
          </div>
        </div>
      )}
    </div>
  );
}