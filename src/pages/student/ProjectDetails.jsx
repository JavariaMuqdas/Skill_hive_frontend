import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {FaRegBookmark } from "react-icons/fa6";
import api from "../../services/api";
import "./projectdetails.css";

export default function ProjectDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch project details within the component scope
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);

        const [detailRes, listRes] = await Promise.all([
          api.get(`/student/projects/${id}`),
          api.get(`/student/projects`),
        ]);

        setProject(detailRes?.data?.project || null);
        console.log("Backend se aya ua project data:",detailRes?.data?.project);
        setAllProjects(Array.isArray(listRes?.data) ? listRes.data : []);
      } catch (e) {
        setMsg(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 2. Apply for position function handler
  async function apply() {
    setMsg("");
    try {
      await api.post("/student/apply", {
        project_id: Number(id),
        cover_letter: coverLetter,
      });
      setMsg("Applied ✅");

      // Update local state so button flips immediately
      setProject(prev => ({ ...prev, is_applied: true }));

      setTimeout(() => nav("/student/applied"), 800);
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  }

  // 3. Dynamic Memoizations and Variable Computations
  const companyName =
    project?.company?.company_name ||
    project?.company_name ||
    "Employer";

  // Captures company ID dynamically from either object nested variant
  const companyId = project?.company_id || project?.company?.id || project?.company?._id;

  const employmentType = useMemo(() => {
    if (Array.isArray(project?.employment_type) && project.employment_type.length) {
      return project.employment_type.join(", ");
    }
    return project?.job_type || "Full Time";
  }, [project]);

  const locationText = project?.city || "New York";
  const categoryText = project?.category || "Design, Development";

  const salaryText = useMemo(() => {
    if (project?.salary_min && project?.salary_max) {
      return `${project.salary_min} - ${project.salary_max} / month`;
    }
    if (project?.salary_min) return `From $${project.salary_min} / month`;
    if (project?.salary_max) return `Up to $${project.salary_max} / month`;
    return "$150 - $180 / per month";
  }, [project]);

  const deadlineText = useMemo(() => {
    if (project?.deadline) {
      return new Date(project.deadline).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "Not Specified";
  }, [project]);

  const isJobClosed = useMemo(() => {
    if (!project?.deadline) return false;
    const deadlineDate = new Date(project.deadline);
    const today = new Date();
    return today > deadlineDate;
  }, [project]);

  const requiredSkills = Array.isArray(project?.required_skills)
    ? project.required_skills
    : [];

  const qualifications = Array.isArray(project?.job_requirements) && project.job_requirements.length
    ? project.job_requirements
    : requiredSkills;

  const postedText = "June 20, 2021";
  const companyInitial = companyName?.charAt(0)?.toUpperCase() || "E";

  // 4. Loading & Conditional Return Boundaries
  if (loading) return <div className="pjdLoading">Loading...</div>;
  if (!project) return <div className="pjdLoading">{msg || "Project not found"}</div>;

  return (
    <div className="pjdContainer">
      <header className="pjdHeaderCard">
        <div className="pjdHeaderLeft">
          <div className="pjdCompanyAvatar">{companyInitial}</div>
          <div className="pjdHeaderDetails">
            <div className="pjdTitleRow">
              <h1>{project.title || "Junior Graphic Designer (Web)"}</h1>
            </div>
            <div className="pjdHeaderMeta">
              <span><i className="fa-regular fa-building"></i> {categoryText}</span>
              <span><i className="fa-solid fa-location-dot"></i> {locationText}</span>
              <span><i className="fa-regular fa-calendar"></i> {postedText}</span>
              <span><i className="fa-solid fa-wallet"></i> {salaryText}</span>
            </div>
            <div className="pjdHeaderBadges">
              <span className="pjdBadgeType">{employmentType}</span>
            </div>
          </div>
        </div>

        <div className="pjdHeaderRight">
          <button type="button" className="pjdBookmarkBtn">
           <span><FaRegBookmark /></span>
          </button>
        </div>
      </header>

      <div className="pjdMainGrid">
        <main className="pjdLeftColumn">
          <article className="pjdContentCard">
            <section className="pjdContentSection">
              <h2>Job Description</h2>
              <p className="pjdTextParagraph">
                {project.description ||
                  "As a Product Designer, you will work within a Product Delivery Team fused with UX, engineering, product and data talent. You will help the team design beautiful interfaces that solve business challenges for our clients."}
              </p>
            </section>

            <section className="pjdContentSection">
              <h2>Key Responsibilities/Required Skills</h2>
              {qualifications.length ? (
                <ul className="pjdBulletList">
                  {qualifications.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <ul className="pjdBulletList">
                  <li>Be involved in every step of the product design cycle from discovery to developer handoff.</li>
                  <li>Work with BAs, product managers and tech teams to lead the Product Design.</li>
                  <li>Maintain quality of the design process and ensure code accurately reflects the design.</li>
                  <li>Accurately estimate design tickets during planning sessions.</li>
                </ul>
              )}
            </section>
          </article>
        </main>

        <aside className="pjdRightColumn">
          {/* Job Overview Card */}
          <div className="pjdSidebarCard">
            <h3>Job Overview</h3>
            <div className="pjdOverviewList">
              <div className="pjdOverviewItem">
                <i className="fa-regular fa-calendar-days"></i>
                <div>
                  <span className="pjdItemLabel">Date Posted</span>
                  <span className="pjdItemValue">{postedText}</span>
                </div>
              </div>
              <div className="pjdOverviewItem">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <span className="pjdItemLabel">Location</span>
                  <span className="pjdItemValue">{locationText}</span>
                </div>
              </div>
              <div className="pjdOverviewItem">
                <i className="fa-solid fa-wallet"></i>
                <div>
                  <span className="pjdItemLabel">Offered Salary:</span>
                  <span className="pjdItemValue">{salaryText}</span>
                </div>
              </div>
              <div className="pjdOverviewItem">
                <i className="fa-regular fa-hourglass-half"></i>
                <div>
                  <span className="pjdItemLabel">Deadline Date</span>
                  <span className="pjdItemValue">{deadlineText}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Profile Card */}
          <div className="pjdSidebarCard">
            <div className="pjdCompanySidebarHeader">
              <div className="pjdCompanySidebarAvatar">{companyInitial}</div>
              <div>
                <h4>{companyName}</h4>
                <button
                  type="button"
                  className="pjdViewProfileBtn"
                  onClick={() => {
                    if (companyId) {
                      nav(`/student/companies/${companyId}`);
                    } else {
                      setMsg("Error: Company profile link ID is missing.");
                    }
                  }}
                >
                  View Company Profile
                </button>
              </div>
            </div>

            <div className="pjdCompanyDetailsList">
              <div className="pjdCompanyDetailRow">
                <span>Categories:</span>
                <strong>{categoryText.split(",")[0]}</strong>
              </div>
              <div className="pjdCompanyDetailRow">
                <span>Founded Date:</span>
                <strong>2025</strong>
              </div>
              <div className="pjdCompanyDetailRow">
                <span>Location:</span>
                <strong>{locationText}</strong>
              </div>
            </div>
          </div>

          {/* Action / Cover Letter Section */}
          {/* <div className="pjdSidebarCard">
            <h3>Apply for this position</h3>
            <textarea
              className="pjdTextarea"
              placeholder="Write your cover letter here (optional)..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              disabled={project?.is_applied || isJobClosed}
            />

            {isJobClosed ? (
              <button type="button" className="pjdApplyPrimaryBtn jobClosedBtn" disabled>
                Job Closed
              </button>
            ) : project?.is_applied ? (
              <button type="button" className="pjdApplyPrimaryBtn alreadyAppliedBtn" disabled>
                Already Applied
              </button>
            ) : (
              <button type="button" className="pjdApplyPrimaryBtn" onClick={apply}>
                Apply Now
              </button> 
            )}

            {msg && <div className="pjdStatusMessage">{msg}</div>}
          </div> */}
          {/* Application Box Section */}
          {/* Application Form Section */}
<div className="pjdSidebarCard">
  <h3>Apply for this position</h3>
  
  <textarea
    className="pjdTextarea"
    placeholder={project?.is_applied ? "You have already applied for this job." : "Write your cover letter here (optional)..."}
    value={coverLetter}
    onChange={(e) => setCoverLetter(e.target.value)}
    disabled={project?.is_applied || isJobClosed}
  />

  {/* Clean ternary block to control button appearance */}
  {isJobClosed ? (
    <button type="button" className="pjdApplyPrimaryBtn jobClosedBtn" disabled>
      Job Closed
    </button>
  ) : project?.is_applied ? (
    <button 
      type="button" 
      className="pjdApplyPrimaryBtn alreadyAppliedBtn" 
      style={{ backgroundColor: '#64748b', color: '#ffffff', cursor: 'not-allowed' }} 
      disabled
    >
      Already Applied
    </button>
  ) : (
    <button type="button" className="pjdApplyPrimaryBtn" onClick={apply}>
      Apply Now
    </button>
  )}

  {msg && <div className="pjdStatusMessage">{msg}</div>}
</div>
        </aside>
      </div>
    </div>
  );
}