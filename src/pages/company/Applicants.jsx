import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';
import api from "../../services/api";
import "./applicants.css";
import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/react-toastify.css';
import 'react-toastify/ReactToastify.css';
import { FaClock ,FaUsers,FaCheck,FaXmark} from "react-icons/fa6";

export default function ApplicantsOverview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [interview, setInterview] = useState(0);
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [recommendedCandidates, setRecommendedCandidates] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  //click edit button too add remarks
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ interview_marks: '', final_score: '' });

  const [schedule, setSchedule] = useState({});

  const handleScheduleChange = (candidateId, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        [field]: value
      }
    }));
  };
  // const handleScheduleAndMail = async (candidate) => {
  //   const candidateSchedule = schedule[candidate.id];

  //   if (!candidateSchedule?.date || !candidateSchedule?.time) {
  //     toast.error("Pehle Date aur Time select karein!");
  //     return;
  //   }

  //   try {
  //     // 1. Database mein save karein
  //     await axios.post('http://localhost:8000/api/save-interview-schedule', {
  //       applicationId: candidate.id,
  //       interviewDate: candidateSchedule.date,
  //       interviewTime: candidateSchedule.time
  //     });

  //     // 2. Phir Mail bhejien (Aapka purana mail function)
  //     await sendInterviewMail(candidate);

  //     toast.success("Schedule Saved & Mail Sent!");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Operation failed.");
  //   }
  // };
  const sendInterviewMail = async (candidate) => {
    const candidateSchedule = schedule[candidate.id];

    if (!candidateSchedule?.date || !candidateSchedule?.time) {
      toast.error("Please select both Date and Time first!");
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/send-interview-email', {
        email: candidate.email,
        name: candidate.name,
        jobTitle: candidate.project.title, //
        interviewDate: candidateSchedule.date,
        interviewTime: candidateSchedule.time,
        // companyName: ""
      });
      toast.success("Email sent successfully!");
    } catch (error) {
      toast.error("Failed to send email.");
    }
  };
  // Edit button par click karne ka function
  const handleEditClick = (candidate) => {
    setEditData({
      interview_marks: candidate.interview_marks || '',
      final_score: candidate.final_score || ''
    });
    setSelectedCandidate(candidate);
    setShowEditModal(true);
  };

  // Data save karne ka function
  // const handleSaveScores = async () => {
  //   try {
  //     await axios.post('http://localhost:8000/api/update-scores', {
  //       applicationId: selectedCandidate.applicationId,
  //       interview_marks: editData.interview_marks,
  //       final_score: editData.final_score
  //     });
  //     toast.success("Scores updated successfully!");
  //     setShowEditModal(false);
  //     // Refresh data here
  //   } catch (error) {
  //     toast.error("Failed to update scores.");
  //   }
  // };
  //   const handleSaveScores = async () => {
  //     // 1. Calculation karein
  //     const skillMatch = selectedCandidate.match_percentage || 0; // Maslan 100% ya 67%
  //     const interviewMarks = parseInt(editData.interview_marks) || 0;

  //     // Formula: (Skill % + Interview Marks) / 200 * 100 taake 100 mein se percentage nikal sakay
  //     const calculatedFinalScore = ((skillMatch + interviewMarks) / 10);

  //     try {
  //       console.log("updating to:",editData.interview_marks)
  //         await axios.post('http://localhost:8000/api/update-scores', {
  //             applicationId: selectedCandidate.id,
  //             interview_marks: interviewMarks,
  //             final_score: calculatedFinalScore // Ye database mein save hoga
  //         });

  //         toast.success("Scores updated!");
  //         setShowEditModal(false);
  //         fetchCandidates(); // Data dobara refresh karein taake progress bars fill ho jayen
  //     } catch (error) {
  //         toast.error("Error updating scores");
  //     }
  // };

  // to save schedule
  const saveInterviewSchedule = async (candidate) => {
    const candidateSchedule = schedule[candidate.id];

    if (!candidateSchedule?.date || !candidateSchedule?.time) {
      toast.error("Pehle Date aur Time select karein!");
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/save-interview-schedule', {
        applicationId: candidate.id,
        interviewDate: candidateSchedule.date,
        interviewTime: candidateSchedule.time,
      });

      toast.success("Schedule saved successfully!");
    } catch (error) {
      console.error(error.response?.data || error);
      toast.error("Schedule save nahi hua.");
    }
  };

  const handleSaveScores = async () => {
    // 1. Pehle values nikalien
    const rawMatchValue = selectedCandidate?.match_percentage || selectedCandidate?.match || 0;
    const skillMatch = parseFloat((String(selectedCandidate.matchPercentage).replace('%', ''))) || 0;
    const interviewInput = parseFloat(editData.interview_marks) || 0;
    const calculatedFinalScore = Math.round((skillMatch + interviewInput) / 2);

    console.log("Skill Match:", skillMatch, "Interview:", interviewInput, "Total:", calculatedFinalScore);
    console.log("Full object:", selectedCandidate);
    console.log("Debug - Skill:", skillMatch, "Interview:", interviewInput);

    try {
      // 2. API Call karein
      const response = await axios.post('http://localhost:8000/api/update-scores', {
        applicationId: selectedCandidate.id,
        interview_marks: interviewInput,
        final_score: calculatedFinalScore
      });

      if (response.status === 200) {
        // 3. FIXED: 'recommendedCandidates' use karein jo aapki array ka sahi naam hai
        const updatedData = recommendedCandidates.map((item) => {
          if (item.id === selectedCandidate.id) {
            return {
              ...item,
              interview_marks: interviewInput,
              final_score: calculatedFinalScore
            };
          }
          return item;
        });

        // 4. FIXED: 'setRecommendedCandidates' call karein (jo aapki state update karne ka function hai)
        setRecommendedCandidates(updatedData);

        // Modal band karein
        setShowEditModal(false);
        toast.success("Scores updated successfully!");
      }
    } catch (error) {
      console.error("Error updating scores:", error);
      toast.error("Update failed.");
    }
  };
  const jobId = searchParams.get("jobId");

  const normalizeSkill = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

  const toSkillArray = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);

    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  const getMatchedSkills = (requiredSkills, applicantSkills) => {
    const normalizedRequired = [
      ...new Set(requiredSkills.map(normalizeSkill).filter(Boolean)),
    ];

    const applicantMap = new Map();

    applicantSkills.forEach((skill) => {
      const normalized = normalizeSkill(skill);
      if (normalized && !applicantMap.has(normalized)) {
        applicantMap.set(normalized, skill);
      }
    });

    return normalizedRequired
      .filter((req) => applicantMap.has(req))
      .map((req) => applicantMap.get(req));
  };

  const calculateMatchPercentage = (requiredSkills, applicantSkills) => {
    const cleanRequired = [
      ...new Set(requiredSkills.map(normalizeSkill).filter(Boolean)),
    ];

    if (cleanRequired.length === 0) return 0;

    const matchedSkills = getMatchedSkills(requiredSkills, applicantSkills);
    return (matchedSkills.length / cleanRequired.length) * 100;
  };

  const mapUiToApiStatus = (uiStatus) => {
    if (uiStatus === "Accepted") return "accepted";
    if (uiStatus === "Rejected") return "rejected";
    return "in_review";
  };

  const handleStatusChange = async (applicationId, status) => {
    await updateApplicantStatus(applicationId, status);
  };
  // newwwwwwwwww
  // const handleContactCandidate = async (candidate) => {
  //   try {
  //     setLoading(true);
  //     // Backend ko application ID aur candidate ki email bhej rahe hain
  //     await api.post(`/company/applications/${candidate.applicationId}/contact`, {
  //       email: candidate.email,
  //       name: candidate.name,
  //       jobTitle: job.title
  //     });
  //     alert("Interview email sent to " + candidate.name);
  //   } catch (e) {
  //     alert("Failed to send email.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // Opens the modal
  const handleContactCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowContactModal(true);
  };

  // Logic for Interview Email
  // const sendInterviewEmail = async () => {
  //   if (!selectedCandidate) return;

  //   // Your API call logic here...

  //   // REPLACE alert with toast
  //   toast.success(`Interview email sent to ${selectedCandidate.name}`);

  //   setShowContactModal(false);
  // };
  // const sendInterviewEmail = async () => {
  //   if (!selectedCandidate) return;

  //   try {
  //     // 1. Backend ki API ko hit karein (Jo kal banayi thi)
  //     // Yahan '/api/send-interview-email' ki jagah apna asli URL dalein
  //     await axios.post('http://localhost:8000/api/send-interview-email', {
  //       email: selectedCandidate.email,
  //       name: selectedCandidate.name,
  //       jobId: 2 // Ya jo bhi dynamic ID hai
  //     });

  //     // 2. Agar backend se success response aaye to Toaster dikhayein
  //     toast.success(`Interview email sent to ${selectedCandidate.name}`);
  //     setShowContactModal(false);

  //   } catch (error) {
  //     console.error("Email error:", error);
  //     toast.error("Email send nahi ho saki. Server check karein.");
  //   }
  // };
  const sendInterviewEmail = async () => {
  if (!selectedCandidate) return;

  try {
    await axios.post('http://localhost:8000/api/send-interview-email', {
      applicationId: selectedCandidate.applicationId || selectedCandidate.id,
      email: selectedCandidate.email,
      name: selectedCandidate.name,
      jobTitle: job?.title ?? "Job Position",
      companyName: "Your Company Name"
    });

    toast.success(`Interview email sent to ${selectedCandidate.name}`);
    setShowContactModal(false);
  } catch (error) {
    console.error(error.response?.data || error);
    toast.error("Interview email send nahi hui.");
  }
};

  // Logic for Selection Email
  // const sendSelectionEmail = async () => {
  //   if (!selectedCandidate) return;

  //   // Your API call logic here...

  //   // REPLACE alert with toast
  //   toast.success(`Selection email sent to ${selectedCandidate.name}`);

  //   setShowContactModal(false);
  // };
  // const sendSelectionEmail = async () => {
  //   if (!selectedCandidate) return;

  //   try {
  //     // 1. Backend ki Selection API ko hit karein
  //     await axios.post('http://localhost:8000/api/send-selection-email', {
  //       email: selectedCandidate.email,
  //       name: selectedCandidate.name
  //     });

  //     // 2. Success Notification
  //     toast.success(`Selection email sent to ${selectedCandidate.name}`);
  //     setShowContactModal(false);

  //   } catch (error) {
  //     toast.error("Selection email failed!");
  //   }
  // };
  //   const sendSelectionEmail = async () => {
  //   if (!selectedCandidate) return;

  //   try {
  //     // Note: Yahan hum applicationId lazmi bhejenge
  //     await axios.post('http://localhost:8000/api/send-selection-email', {
  //       applicationId: selectedCandidate.applicationId, 
  //       email: selectedCandidate.email,
  //       name: selectedCandidate.name,
  //       jobTitle: job?.title || "Software Engineer" // Dynamic title
  //     });

  //     toast.success(`Selection email sent to ${selectedCandidate.name}`);
  //     setShowContactModal(false);

  //   } catch (error) {
  //     console.error("Selection Error:", error.response);
  //     toast.error("Selection email failed! Check console for details.");
  //   }
  // };
  const sendSelectionEmail = async () => {
    if (!selectedCandidate) return;

    try {
      // Sahi data bhejien jo controller expect kar raha hai
      await axios.post('http://localhost:8000/api/send-selection-email', {
        applicationId: selectedCandidate.applicationId, // Interview mail ki tarah yahan bhi ID lazmi hai
        email: selectedCandidate.email,
        name: selectedCandidate.name,
        jobTitle: job?.title || "Selected Candidate"
      });

      toast.success(`Selection email sent to ${selectedCandidate.name}`);
      setShowContactModal(false);

    } catch (error) {
      console.error("Backend Error Details:", error.response?.data); // Isse asal error pata chalay ga
      toast.error("Selection email failed! Check console.");
    }
  };

  const StatusDropdown = ({ currentStatus, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = (e) => {
      e.stopPropagation();
      setIsOpen(!isOpen);
    };

    const handleStatusSelect = (status) => {
      onStatusChange(status);
      setIsOpen(false);
    };

    return (
      <div
        className="statusDropdown"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`aoStatusBadge ${currentStatus
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
          onClick={toggleDropdown}
        >
          {currentStatus}
        </div>

        {isOpen && (
          <div className="dropdownMenu">
            <div
              className="dropdownItem"
              onClick={() => handleStatusSelect("In Review")}
            >
              In Review
            </div>
            <div
              className="dropdownItem"
              onClick={() => handleStatusSelect("Accepted")}
            >
              Accepted
            </div>
            <div
              className="dropdownItem"
              onClick={() => handleStatusSelect("Rejected")}
            >
              Rejected
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const closeDropdown = () => setOpenDropdownId(null);
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setMsg("");

        // if (!jobId) {
        //   setMsg("Job ID is missing.");
        //   setJob(null);
        //   setApplicants([]);
        //   setRecommendedCandidates([]);
        //   return;
        // }

        if (!jobId) {
          setMsg("Please select a job from 'manage jobs' to view the stats.");
          //   setJob(null);
          //   setApplicants([]);
          //   setRecommendedCandidates([]);
          return;
        }

        const [jobRes, applicantsRes] = await Promise.all([
          api.get(`/company/projects/${jobId}`),
          api.get(`/company/applicants`, { params: { jobId } }),
        ]);

        const project = jobRes?.data?.data || jobRes?.data || null;
        const apps =
          applicantsRes?.data?.applications ||
          applicantsRes?.data?.data ||
          applicantsRes?.data ||
          [];

        if (!project) {
          setMsg("Job not found.");
          setJob(null);
          setApplicants([]);
          setRecommendedCandidates([]);
          return;
        }

        setJob(project);
        setApplicants(Array.isArray(apps) ? apps : []);

        const requiredSkills = toSkillArray(project?.required_skills);

        const rankedApplicants = (Array.isArray(apps) ? apps : []).map(
          (applicant) => {
            const applicantSkills =
              applicant?.student?.resume_skills
                ?.map((s) => s.skill)
                .filter(Boolean) || [];

            const matchedSkills = getMatchedSkills(
              requiredSkills,
              applicantSkills
            );

            const matchPercentage = calculateMatchPercentage(
              requiredSkills,
              applicantSkills
            );

            return {
              ...applicant,
              applicationId: applicant?.id,
              studentId: applicant?.student?.id,
              name: applicant?.student?.user?.name || "Student",
              email: applicant?.student?.user?.email || "No email",
              skills: applicantSkills,
              matchedSkills,
              matchPercentage,
            };
          }
        );

        const sortedApplicants = rankedApplicants.sort(
          (a, b) => b.matchPercentage - a.matchPercentage
        );

        const topThree = sortedApplicants
          .filter((candidate) => candidate.matchPercentage > 0)
          .slice(0, 3);

        setRecommendedCandidates(topThree);
      } catch (e) {
        setMsg(
          e?.response?.data?.message ||
          e.message ||
          "Failed to load applicants."
        );
        setJob(null);
        setApplicants([]);
        setRecommendedCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [jobId]);

  const mapStatusToUi = (statusRaw) => {
    const status = String(statusRaw || "").toLowerCase();

    if (status === "accepted") return "Accepted";
    if (status === "rejected") return "Rejected";
    if (status === "in_review") return "In Review";
    if (status === "applied") return "In Review";
    return "In Review";
  };

  const handleViewProfile = (person) => {
    const studentId = person?.studentId || person?.student?.id;

    if (person?.resumeUrl) {
      window.open(person.resumeUrl, "_blank");
      return;
    }

    if (studentId) {
      navigate(`/company/student-cv/${studentId}`);
    } else {
      console.error("Student ID not found!");
    }
  };

  const normalizedApplicants = useMemo(() => {
    return applicants.map((a) => {
      const skills =
        a?.student?.resume_skills?.map((s) => s.skill).filter(Boolean) || [];

      return {
        raw: a,
        id: a?.id,
        applicationId: a?.id,
        studentId: a?.student?.id,
        name: a?.student?.user?.name || "Student",
        email: a?.student?.user?.email || "No email",
        appliedDate: a?.created_at
          ? new Date(a.created_at).toISOString().slice(0, 10)
          : "—",
        location: a?.student?.city || a?.student?.address || "Not specified",
        experience: a?.student?.experience || "—",
        status: mapStatusToUi(a?.status),
        skills,
        resumeUrl:
          a?.student?.resume_url ||
          a?.student?.cv_url ||
          a?.student?.profile_url ||
          null,
      };
    });
  }, [applicants]);

  const stats = useMemo(() => {
    const totalApplied = normalizedApplicants.length;
    const inReview = normalizedApplicants.filter(
      (a) => a.status === "In Review"
    ).length;
    const accepted = normalizedApplicants.filter(
      (a) => a.status === "Accepted"
    ).length;
    const rejected = normalizedApplicants.filter(
      (a) => a.status === "Rejected"
    ).length;

    return { totalApplied, inReview, accepted, rejected };
  }, [normalizedApplicants]);

  const filteredApplicants = useMemo(() => {
    let arr = [...normalizedApplicants];

    if (filter !== "All") {
      arr = arr.filter((a) => a.status === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q)
      );
    }

    return arr;
  }, [normalizedApplicants, filter, search]);

  const updateApplicantStatus = async (applicationId, nextUiStatus) => {
    try {
      setUpdatingStatusId(applicationId);
      setMsg("");

      const apiStatus = mapUiToApiStatus(nextUiStatus);

      await api.patch(`/company/applications/${applicationId}/status`, {
        status: apiStatus,
      });

      setApplicants((prev) =>
        prev.map((item) =>
          item.id === applicationId ? { ...item, status: apiStatus } : item
        )
      );

      setOpenDropdownId(null);
    } catch (e) {
      setMsg(
        e?.response?.data?.message ||
        e.message ||
        "Failed to update application status."
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleCardClick = (status) => {
    setFilter(status);
  };

  if (loading) {
    return (
      <div className="aoPage">
        <div className="aoEmpty">Loading...</div>
      </div>
    );
  }

  if (msg) {
    return (
      <div className="aoPage">
        <div className="aoEmpty">{msg}</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="aoPage">
        <div className="aoEmpty">Job not found.</div>
      </div>
    );
  }

  return (
    <div className="aoPage">
      <div className="aoTopbar">
        <div className="aoWelcome">Applications Overview</div>
      </div>

      <div className="aoHero">
        <div className="aoHeroLeft">
          <div className="aoHeroLabel">JOB POSITION</div>
          <div className="aoHeroTitle">{job?.title || "Untitled Job"}</div>

          <div className="aoHeroMeta">
            <span className="aoPill">{job?.city || "Not specified"}</span>
            <span className="aoPill">{job?.job_type || "—"}</span>
            <span className="aoPill">{job?.category || "—"}</span>
          </div>
        </div>

        <div className="aoHeroRight">
          <div className="aoAppsBadge">
            <span className="aoAppsCount">{stats.totalApplied}</span>
            <span>Applications</span>
          </div>
          <div className="aoPostedDate">
            Posted{" "}
            {job?.created_at
              ? new Date(job.created_at).toISOString().slice(0, 10)
              : "—"}
          </div>
        </div>
      </div>

      <div className="aoStatsGrid">
        <div className="aoStatCard" onClick={() => handleCardClick("All")}>
          <div className="aoStatIcon cyan"><FaUsers/></div>
          <div className="aoStatValue">{stats.totalApplied}</div>
          <div className="aoStatLabel">Total Applied</div>
        </div>

        <div
          className="aoStatCard"
          onClick={() => handleCardClick("In Review")}
        >
          <div className="aoStatIcon yellow"><FaClock/></div>
          <div className="aoStatValue">{stats.inReview}</div>
          <div className="aoStatLabel">In Review</div>
        </div>

        <div
          className="aoStatCard"
          onClick={() => handleCardClick("Accepted")}
        >
          <div className="aoStatIcon green"><FaCheck/></div>
          <div className="aoStatValue">{stats.accepted}</div>
          <div className="aoStatLabel">Accepted</div>
        </div>

        <div
          className="aoStatCard"
          onClick={() => handleCardClick("Rejected")}
        >
          <div className="aoStatIcon red"><FaXmark/></div>
          <div className="aoStatValue">{stats.rejected}</div>
          <div className="aoStatLabel">Rejected</div>
        </div>
      </div>

      <div className="aoList">Applicants List</div>

      <div className="aoApplicantsList">
        {filteredApplicants.length ? (
          filteredApplicants.map((applicant) => (
            <div className="aoApplicantCard" key={applicant.applicationId}>
              <div className="aoApplicantTop">
                <div className="aoApplicantIdentity">
                  <div className="aoAvatar">
                    {applicant.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="aoApplicantInfo">
                    <div className="aoApplicantNameRow">
                      <div className="aoApplicantName">{applicant.name}</div>
                    </div>

                    <div className="aoApplicantSub">{applicant.email}</div>
                    <div className="aoApplicantMeta">
                      <span>Applied {applicant.appliedDate}</span>
                      <span>{applicant.location}</span>
                      <span>{applicant.experience}</span>
                    </div>
                  </div>
                </div>

                <StatusDropdown
                  currentStatus={applicant.status}
                  onStatusChange={(status) =>
                    handleStatusChange(applicant.id, status)
                  }
                />
              </div>

              <div className="aoTags">
                {applicant.skills.length ? (
                  applicant.skills.map((tag, i) => (
                    <span className="aoTag" key={i}>
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="aoTag">No skills</span>
                )}
              </div>

              <div className="aoApplicantBottom">
                <div className="aoActions">
                  <button
                    className="aoBtn resumeBtn"
                    onClick={() => handleViewProfile(applicant)}
                  >
                    Resume
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="aoEmpty">No applicants found for this job.</div>
        )}
      </div>

      <div className="aoSectionHead">
        <div className="aoSectionTitle">Recommended Candidates</div>
      </div>

      {(() => {
        const filteredRecommendedCandidates = recommendedCandidates.filter(
          (candidate) =>
            candidate.matchedSkills && candidate.matchedSkills.length > 0
        );

        return filteredRecommendedCandidates.length > 0 ? (
          <div className="aoRecommendedGrid">
            {filteredRecommendedCandidates.map((candidate) => {
              const match = Math.round(candidate.matchPercentage || 0);
              const interview = (candidate.interviewMarks || 0);
              const final = (candidate.finalScore || 0);

              return (
                <div className="aoCandidateCard" key={candidate.applicationId}>
                  <div className="aoCardTop">
                    <div className="aoProfileGroup">
                      <div className="aoInitialAvatar">
                        {candidate.name
                          ? candidate.name.charAt(0).toUpperCase()
                          : "A"}
                      </div>

                      <div className="aoNameMeta">
                        <div className="aoCandName">{candidate.name}</div>
                        <div className="aoCandEmail">
                          <span className="aoMailIcon"><i class="fa-regular fa-envelope"></i></span>
                          {candidate.email}
                        </div>
                      </div>
                    </div>

                    <div className="aoMatchArea">
                      <div
                        className="aoMatchCircleContainer"
                        style={{
                          background: `conic-gradient(#10b981 ${match * 3.6
                            }deg, #e7f2ee 0deg)`,
                        }}
                      >
                        <div className="aoCircleInner">
                          <span>{match}%</span>
                        </div>
                      </div>
                      <div className="aoMatchText">Match</div>
                    </div>
                  </div>

                  <div className="aoDivider" />

                  <div className="aoSkillsBox">
                    <div className="aoSmallLabel">Matching Skills</div>
                    <div className="aoChipContainer">
                      {candidate.matchedSkills.map((skill, index) => (
                        <span key={index} className="aoSkillChip">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="aoCardActions">
                    <button
                      className="aoBtnSecondary"
                      onClick={() => handleViewProfile(candidate)}
                    >
                      <i class="fa-regular fa-user"></i> View Profile
                    </button>

                    <button
                      className="aoBtnPrimary"
                      onClick={() => handleContactCandidate(candidate)}
                    >
                      <i className="fa-regular fa-camera"></i> Contact
                    </button>
                  </div>

                  <div className="interview-schedule-section">
                    <input
                      type="date"
                      className="form-control mb-2"
                      onChange={(e) => handleScheduleChange(candidate.id, 'date', e.target.value)}
                    />
                    <input
                      type="time"
                      className="form-control mb-2"
                      onChange={(e) => handleScheduleChange(candidate.id, 'time', e.target.value)}
                    />
                    <button
                      className="aoBtnPrimary"
                      onClick={() => saveInterviewSchedule(candidate)}
                    >
                      Save Schedule
                    </button>
                  </div>

                  <div className="aoDivider" />



                  <div className="aoScoreRow">
                    <div className="aoScoreLabelRow">
                      <div>
                        <div className="aoSmallLabel">Interview Marks</div>
                        <div className="aoSubText">(out of 100)</div>
                      </div>

                      <button
                        className="aoEditLink"
                        onClick={() => handleEditClick(candidate)}
                      >
                        <i class="fa-regular fa-pen-to-square"></i> Edit
                      </button>
                    </div>



                    <div className="aoBarWrapper">
                      <div className="aoBarTrack">
                        <div
                          className="aoBarFill purple"
                          style={{
                            // Agar marks hain toh blue warna light grey
                            width: `${candidate.interview_marks || 0}%`,
                            backgroundColor: !candidate.interview_marks || candidate.interview_marks === 0 ? '#e5e7eb' : '#4f46e5'
                          }}
                        />
                      </div>
                      {/* 0% ya actual value show karne ke liye */}
                      <span className="aoBarValueText">
                        {candidate.interview_marks ? `${candidate.interview_marks}%` : '0%'}
                      </span>
                    </div>

                  </div>

                  <div className="aoDivider" />

                  <div className="aoScoreRow">
                    <div className="aoSmallLabel">Final Score</div>

                    <div className="aoBarWrapper">
                      <div className="aoBarTrack">
                        <div
                          className="aoBarFill orange"
                          style={{ width: `${candidate.final_score || 0}%` }}
                        />
                      </div>
                      <span className="aoBarValueText">
                        {candidate.final_score ? `${candidate.final_score}%` : '0%'}
                      </span>
                    </div>
                  </div>

                  {/* <div className="aoCardActions">
                    <button
                      className="aoBtnSecondary"
                      onClick={() => handleViewProfile(candidate)}
                    >
                      <i class="fa-regular fa-user"></i> View Profile
                    </button>

                    <button
                      className="aoBtnPrimary"
                      onClick={() => handleContactCandidate(candidate)}
                    >
                      <i className="fa-regular fa-camera"></i> Contact
                    </button>
                  </div> */}
                </div>
              );
            })}
            {/* //show edit model */}
            {showEditModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                  <h2 className="text-xl font-bold mb-4">Update Marks & Score</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium">Interview Marks (out of 100)</label>
                      <input
                        type="number"
                        className="w-full border p-2 rounded mt-1"
                        value={editData.interview_marks}
                        onChange={(e) => setEditData({ ...editData, interview_marks: e.target.value })}
                      />
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium">Final Score (%)</label>
                      <input
                        type="number"
                        className="w-full border p-2 rounded mt-1"
                        value={editData.final_score}
                        onChange={(e) => setEditData({ ...editData, final_score: e.target.value })}
                      />
                    </div> */}
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button onClick={() => setShowEditModal(false)} className="bg-gray-200 rounded">Cancel</button>
                    <button onClick={handleSaveScores} className="bg-blue-600 text-white rounded">Save Changes</button>
                  </div>
                </div>
              </div>
            )}

            {showContactModal && (
              <div className="modal-overlay">
                <div className="contact-popup-card">
                  <div className="popup-header">
                    <h3>Contact Options (Popup)</h3>
                    <button className="close-x" onClick={() => setShowContactModal(false)}>×</button>
                  </div>

                  {/* Card 1: Interview */}
                  <div className="option-item">
                    <div className="icon-circle purple">
                      <i class="fa-solid fa-user-clock"></i>
                    </div>
                    <div className="option-details">
                      <h4>Send Email for Interview</h4>
                      <p>If you want to send an email to this student for interview, click the button below.</p>
                      <button className="btn-action-purple" onClick={sendInterviewEmail}>
                        <i className="fa-regular fa-envelope"></i> Send Email
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Selection */}
                  <div className="option-item">
                    <div className="icon-circle green">
                      <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <div className="option-details">
                      <h4>Send Email for Selection</h4>
                      <p>If you have selected this student and want to send a selection email, click the button below.</p>
                      <button className="btn-action-green" onClick={sendSelectionEmail}>
                        <i className="fa-regular fa-envelope"></i> Send Email
                      </button>
                    </div>
                  </div>

                  <div className="popup-footer">
                    <button className="btn-cancel-plain" onClick={() => setShowContactModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        ) : (
          <div className="aoEmpty aoEmptyRed">
            No recommended candidates for this job.
          </div>
        );
      })()}
    </div>
  );
}