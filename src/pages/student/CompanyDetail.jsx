import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./student.css";

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const BASE_URL = "http://127.0.0.1:8000/storage/";

  async function loadCompany() {
    try {
      setLoading(true);
      setMsg("");

      const res = await api.get(`/student/companies/${id}`);

      // backend now returns direct company object
      setCompany(res.data);
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) loadCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p className="loading">Loading company...</p>;

  if (msg)
    return (
      <div className="companyDetailWrapper">
        <Link to="/student/companies" className="backLink">
          ← Back to Companies
        </Link>
        <p className="errorMsg">{msg}</p>
      </div>
    );

  if (!company)
    return (
      <div className="companyDetailWrapper">
        <Link to="/student/companies" className="backLink">
          ← Back to Companies
        </Link>
        <p className="errorMsg">Company not found.</p>
      </div>
    );

  // ✅ IMPORTANT: compute AFTER company exists (prevents crash)
  const jobsCount = company?.published_jobs_count ?? 0;

  // ---- Safe Fields ----
  const name = company.company_name || company.name || "Unnamed Company";
  const founded = company.founded_year || company.foundedYear || company.year || "—";
  const employees = company.total_employees ?? company.company_size ?? "—";
  const type = company.company_type || company.companyType || company.industry || "Private";
  const location = company.location || company.city || company.address || "—";
  const website = company.website || company.web || "";
  const email = company.email || company.company_email || "";
  const description = company.description || "No description available.";

  return (
    <div className="companyDetailWrapper">
      <Link to="/student/companies" className="backLink">
        ← Back to Companies
      </Link>

      {/* Header */}
      <div className="companyDetailHeader">
        <div className="companyDetailLogoBox">
          {company.logo ? (
            <img
              src={BASE_URL + company.logo}
              alt={name}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="companyDetailLogoPlaceholder">{name?.[0]}</div>
          )}
        </div>

        <div className="companyDetailTitle">
          <h1 className="companyDetailName">{name}</h1>
          <p className="companyDetailSub">
            {type} • Founded {founded} • {employees} employees
          </p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="companyDetailGrid">
        <div className="detailCard">
          <h4>Founded</h4>
          <p>{founded}</p>
        </div>

        <div className="detailCard">
          <h4>Employees</h4>
          <p>{employees}</p>
        </div>

        <div className="detailCard">
          <h4>Company Type</h4>
          <p>{type}</p>
        </div>

        <div className="detailCard">
          <h4>Location</h4>
          <p>{location}</p>
        </div>

        <div className="detailCard">
          <h4>Website</h4>
          {website ? (
            <a href={website} target="_blank" rel="noreferrer">
              {website}
            </a>
          ) : (
            <p>—</p>
          )}
        </div>

        <div className="detailCard">
          <h4>Email</h4>
          {email ? <a href={`mailto:${email}`}>{email}</a> : <p>—</p>}
        </div>
      </div>

      {/* About */}
      <div className="companyDetailAbout">
        <h3>About</h3>
        <p>{description}</p>
      </div>

      <button
        className="viewJobsBtn"
        disabled={jobsCount === 0}
        onClick={() => navigate(`/student/projects?company_id=${id}`)}
        title={jobsCount === 0 ? "No active jobs for this company" : ""}
      >
        View Active Jobs ({jobsCount})
      </button>
    </div>
  );
}