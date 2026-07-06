import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./recommendedmatches.css";

export default function RecommendedMatches() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [jobData, setJobData] = useState(null);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);

        const res = await api.get("/company/recommended-students");
        const jobs = res?.data?.data || [];
        const foundJob = jobs.find((j) => String(j.job_id) === String(jobId));

        setJobData(foundJob || null);
      } catch (e) {
        setMsg(e?.response?.data?.message || e.message || "Failed to load matches");
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [jobId]);

  const candidates = useMemo(() => {
    return jobData?.recommended_students || [];
  }, [jobData]);

  if (loading) {
    return (
      <div className="rmPage">
        <div className="rmShell">
          <div className="rmState">Loading...</div>
        </div>
      </div>
    );
  }

  if (msg) {
    return (
      <div className="rmPage">
        <div className="rmShell">
          <div className="rmState">{msg}</div>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="rmPage">
        <div className="rmShell">
          <div className="rmState">No matched job found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rmPage">
      <div className="rmShell">
        <div className="rmTop">
          <button
            className="rmBackBtn"
            onClick={() => navigate(-1)}
            type="button"
          >
            <i class="fa-solid fa-arrow-left"></i>
          </button>

          <div className="rmTopText">
            <h1 className="rmTitle">Recommended Candidates</h1>
            <p className="rmSubtitle">Top Matches for Your Job</p>
          </div>
        </div>

        <div className="rmJobHeader">
          <div className="rmJobTitle">{jobData.job_title}</div>
          <div className="rmApplicantsText">
            Applicants: {candidates.length}
          </div>
        </div>

        <div className="rmDivider"></div>

        <div className="rmCandidatesList">
          {candidates.length ? (
            candidates.map((student) => (
              <div className="rmCandidateCard" key={student.student_id}>
                <div className="rmCardLeft">
                  <div className="rmAvatarBox">
                    {(student?.name?.[0] || "S").toUpperCase()}
                  </div>
                </div>

                <div className="rmCardCenter">
                  <div className="rmCandidateTopRow">
                    <div className="rmCandidateName">{student.name}</div>

                    <div
                      className={`rmMatchBadge ${
                        (student.match_percentage || 0) >= 80
                          ? "green"
                          : (student.match_percentage || 0) >= 50
                          ? "yellow"
                          : "gray"
                      }`}
                    >
                      {Math.round(student.match_percentage || 0)}% Match
                    </div>
                  </div>

                  <div className="rmLine"></div>

                  <div className="rmSkillsLabel">Skills:</div>

                  <div className="rmSkillsText">
                    {student.matched_skills?.length
                      ? student.matched_skills.join(", ")
                      : "No matched skills"}
                  </div>

                  <div className="rmActions">
                    <button
                      className="rmBtn primary"
                      type="button"
                      onClick={() =>
                        navigate(`/company/students/${student.student_id}`)
                      }
                    >
                      View Profile
                    </button>

                    <button
                      className="rmBtn secondary"
                      type="button"
                      onClick={() => navigate("/threads")}
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rmState">No matched candidates for this job.</div>
          )}
        </div>
      </div>
    </div>
  );
}