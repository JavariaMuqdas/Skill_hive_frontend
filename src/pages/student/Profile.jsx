import React, { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import api from "../../services/api";
import "./student.css";
import Classic from "./cv-templates/Classic";
import Modern from "./cv-templates/Modern";
import Minimal from "./cv-templates/Minimal";
import { FaTrash, FaUser, FaPen, FaRegPenToSquare , FaX, FaPlus} from "react-icons/fa6";

const TEMPLATES = [
  { key: "classic", label: "Classic", preview: "/cv-templates/classic.jpeg" },
  { key: "modern", label: "Modern", preview: "/cv-templates/modern.jpeg" },
  { key: "minimal", label: "Minimal", preview: "/cv-templates/minimal.jpeg" },
];

function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="cvModalBackdrop" onClick={onClose}>
      <div className="cvModal" onClick={(e) => e.stopPropagation()}>
        <div className="cvModalHead">
          <h3>{title}</h3>
          <button className="cvIconBtn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="cvModalBody">{children}</div>
      </div>
    </div>
  );
}

// Auto-scale preview wrapper (no overflow/cut)
function CvPreview({ children, baseWidth = 1000 }) {
  const ref = useRef(null);
  const contentRef = useRef(null);
  const [scale, setScale] = useState(0.55);
  const [scaledHeight, setScaledHeight] = useState(0);

  useEffect(() => {
    if (!ref.current || !contentRef.current) return;

    const updateScale = () => {
      const w = ref.current.offsetWidth;
      const newScale = Math.min(1, (w - 16) / baseWidth);
      const contentHeight = contentRef.current.scrollHeight;

      setScale(newScale);
      setScaledHeight(contentHeight * newScale);
    };

    updateScale();

    const ro = new ResizeObserver(() => {
      updateScale();
    });

    ro.observe(ref.current);
    ro.observe(contentRef.current);

    return () => ro.disconnect();
  }, [baseWidth, children]);

  return (
    <div
      ref={ref}
      className="cvPreviewViewport"
      style={{
        height: scaledHeight ? `${scaledHeight}px` : "auto",
        overflow: "hidden",
      }}
    >
      <div
        className="cvPreviewScale"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${baseWidth}px`,
        }}
      >
        <div ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Toast({ show, message, type = "success", onClose }) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`thToast thToast-${type}`}>
      <span className="thToastMessage">{message}</span>
      <button className="thToastClose" onClick={onClose}>
        <i className="fas fa-times" />
      </button>
    </div>
  );
}

function toUrl(v) {
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function displayUrl(v) {
  if (!v) return "";
  return String(v).replace(/^https?:\/\//i, "");
}

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [student, setStudent] = useState(null);
  const [resume, setResume] = useState(null);

  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const [template, setTemplate] = useState("classic");
  const [downloading, setDownloading] = useState(false);
  const pdfRef = useRef(null);

  // Modals
  const [openPersonal, setOpenPersonal] = useState(false);
  const [openEdu, setOpenEdu] = useState(false);
  const [openExp, setOpenExp] = useState(false);
  const [openSkill, setOpenSkill] = useState(false);
  const [openProj, setOpenProj] = useState(false);
  const [openLang, setOpenLang] = useState(false);
  const [openCert, setOpenCert] = useState(false);
  const [openHobby, setOpenHobby] = useState(false);

  const [editEduId, setEditEduId] = useState(null);
  const [editExpId, setEditExpId] = useState(null);

  // Preview modal
  const [openPreview, setOpenPreview] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Forms
  const [personalForm, setPersonalForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
    linkedin: "",
    github: "",
    portfolio: "",
  });

  const [eduForm, setEduForm] = useState({
    level: "Degree",
    degree: "",
    institute: "",
    field: "",
    grade: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const [expForm, setExpForm] = useState({
    title: "",
    company: "",
    start_date: "",
    end_date: "",
    is_current: false,
    responsibilitiesText: "",
  });

  const [skillForm, setSkillForm] = useState({ skill: "" });

  const [projForm, setProjForm] = useState({
    name: "",
    tech_stack: "",
    link: "",
    descriptionText: "",
  });

  const [langForm, setLangForm] = useState({ language: "", proficiency: "" });

  const [certForm, setCertForm] = useState({
    title: "",
    issuer: "",
    date: "",
    imageFile: null,
    imagePreview: "",
    image_url: "",
  });

  const [hobbyForm, setHobbyForm] = useState({
    hobbiesText: "",
  });

  const selectedTemplate = useMemo(
    () => TEMPLATES.find((t) => t.key === template) || TEMPLATES[0],
    [template]
  );

  function showToast(message, type = "success") {
    setToast({
      show: true,
      message,
      type,
    });
  }

  async function loadAll() {
    setMsg("");
    setLoading(true);
    try {
      const [meRes, resumeRes] = await Promise.all([
        api.get("/student/me"),
        api.get("/student/resume"),
      ]);



      const st = meRes.data.student;
      setStudent(st);

      const data = resumeRes.data;
      setResume(data.resume || null);
      setEducations(data.educations || []);
      setExperiences(data.experiences || []);
      setSkills(data.skills || []);
      setProjects(data.projects || []);
      setLanguages(data.languages || []);
      setCertificates(data.certificates || []);

      const base = data.resume || {};

      setPersonalForm({
        full_name: st?.user?.name || "",
        email: st?.user?.email || "",
        phone: base.phone || st?.phone || "",
        address: base.address || "",
        dob: base.dob || st?.dob || "",
        gender: base.gender || st?.gender || "",
        linkedin: base.linkedin || "",
        github: base.github || "",
        portfolio: base.portfolio || "",
      });

      const hobbiesArr = Array.isArray(base.hobbies) ? base.hobbies : [];
      setHobbyForm({ hobbiesText: hobbiesArr.join("\n") });

      setTemplate(base.default_template || "classic");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line
  }, []);

  const userData = useMemo(() => {
    const fullName = student?.user?.name || "";
    const email = student?.user?.email || "";
    const baseHobbies = Array.isArray(resume?.hobbies) ? resume.hobbies : [];

    return {
      name: fullName,
      title: resume?.headline || "Student",
      gender: resume?.gender || "",
      dob: resume?.dob || "",
      phone: resume?.phone || "",
      email,
      website: resume?.portfolio || "",
      location: resume?.address || "",
      linkedin: resume?.linkedin || "",
      github: resume?.github || "",
      portfolio: resume?.portfolio || "",
      interests: baseHobbies,

      skills: [
        { label: "Skills", items: (skills || []).map((s) => s.skill) },
        {
          label: "Languages",
          items: (languages || []).map((l) =>
            l.proficiency ? `${l.language} (${l.proficiency})` : l.language
          ),
        },
      ].filter((x) => x.items && x.items.length),

      education: (educations || []).map((e) => ({
        level: e.level || e.education_level || "",
        institute: e.institute || "",
        major: e.field || e.degree || "",
        gpa: e.grade || "",
        start: e.start_date || "",
        end: e.end_date || "",
        description: e.description || "",
      })),

      experience: (experiences || []).map((x) => ({
        company: x.company || "",
        role: x.title || "",
        start: x.start_date || "",
        end: x.is_current ? "Present" : x.end_date || "",
        points: Array.isArray(x.responsibilities) ? x.responsibilities : [],
      })),

      activities: (projects || []).map((p) => ({
        title: p.name || "Project",
        subTitle: p.tech_stack || "",
        points: Array.isArray(p.description) ? p.description : [],
        link: p.link || "",
      })),

      certificates: (certificates || []).map((c) => ({
        id: c.id,
        title: c.title || c.certificate_title || "",
        issuer: c.issuer || c.institute || "",
        date: c.issue_date || c.date || "",
        image_url: c.image_url || "",
      })),
    };
  }, [student, resume, educations, experiences, skills, projects, languages, certificates]);

  async function onTemplateChange(v) {
    setTemplate(v);
    try {
      const res = await api.post("/student/resume/base", { default_template: v });
      setResume(res.data.resume);
    } catch (e) { }
  }



  async function savePersonal() {
  setMsg("");  // Clear any previous messages

  try {
    // Prepare the payload to be sent to the backend (no student_id needed)
    const payload = {
      // student_id: student?.id, 
      phone: personalForm.phone || null,
      address: personalForm.address || null,
      dob: personalForm.dob || null,
      gender: personalForm.gender || null,
      linkedin: personalForm.linkedin || null,
      github: personalForm.github || null,
      portfolio: personalForm.portfolio || null,
    };

    // Make the API request to save personal info
    const res = await api.post("/student/resume/base", payload);

    // Update the resume state with the returned data
    setResume(res.data.resume);

    // Show a success toast
    showToast("Personal info saved successfully!", "success");

    // Close the modal
    setOpenPersonal(false);
  } catch (e) {
    // Handle any errors
    setMsg(e?.response?.data?.message || e.message);
  }
}

  async function saveHobbies() {
    setMsg("");
    try {
      const hobbies = hobbyForm.hobbiesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      if (!hobbies.length) {
        setMsg("Please add at least 1 hobby. (Hobbies are required)");
        return;
      }

      const res = await api.post("/student/resume/base", { hobbies });
      setResume(res.data.resume);
      showToast("hobbies added", "success");
      setOpenHobby(false);
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  }

  function openEditEducation(e) {
    setEditEduId(e.id);
    setEduForm({
      level: e.level || e.education_level || "Degree",
      degree: e.degree || "",
      institute: e.institute || "",
      field: e.field || "",
      grade: e.grade || "",
      start_date: e.start_date || "",
      end_date: e.end_date || "",
      description: e.description || "",
    });
    setOpenEdu(true);
  }

  async function addEducation() {
    setMsg("");
    try {
      const payload = {
        level: eduForm.level,
        degree: eduForm.degree,
        institute: eduForm.institute,
        field: eduForm.field,
        grade: eduForm.grade || null,
        start_date: eduForm.start_date || null,
        end_date: eduForm.end_date || null,
        description: eduForm.description || null,
      };

      let res;
      if (editEduId) {
        res = await api.put(`/student/resume/education/${editEduId}`, payload);
        setEducations(
          educations.map((x) => (x.id === editEduId ? res.data.education : x))
        );
        setMsg("Education updated ✅");
      } else {
        res = await api.post("/student/resume/education", payload);
        setEducations([res.data.education, ...educations]);
        showToast("Education added", "success");
      }

      setOpenEdu(false);
      setEditEduId(null);
      setEduForm({
        level: "Degree",
        degree: "",
        institute: "",
        field: "",
        grade: "",
        start_date: "",
        end_date: "",
        description: "",
      });
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  }

  async function addExperience() {
    setMsg("");
    try {
      const responsibilities = expForm.responsibilitiesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: expForm.title,
        company: expForm.company,
        start_date: expForm.start_date || null,
        end_date: expForm.is_current ? null : expForm.end_date || null,
        is_current: expForm.is_current,
        responsibilities,
      };

      let res;
      if (editExpId) {
        res = await api.put(`/student/resume/experience/${editExpId}`, payload);
        setExperiences(
          experiences.map((x) => (x.id === editExpId ? res.data.experience : x))
        );
        setMsg("Experience updated ✅");
      } else {
        res = await api.post("/student/resume/experience", payload);
        setExperiences([res.data.experience, ...experiences]);
        showToast("Experience added", "success");
      }

      setOpenExp(false);
      setEditExpId(null);
      setExpForm({
        title: "",
        company: "",
        start_date: "",
        end_date: "",
        is_current: false,
        responsibilitiesText: "",
      });
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  }

  function openEditExperience(x) {
    setEditExpId(x.id);
    setExpForm({
      title: x.title || "",
      company: x.company || "",
      start_date: x.start_date || "",
      end_date: x.end_date || "",
      is_current: !!x.is_current,
      responsibilitiesText: Array.isArray(x.responsibilities)
        ? x.responsibilities.join("\n")
        : "",
    });
    setOpenExp(true);
  }

  // async function addSkill() {
  //   setMsg("");
  //   try {
  //     const payload = { skill: skillForm.skill };
  //     const res = await api.post("/student/resume/skill", payload);
  //     setSkills([res.data.skill, ...skills]);
  //     setOpenSkill(false);
  //     setSkillForm({ skill: "" });
  //     showToast("Skill added", "success");
  //   } catch (e) {
  //     setMsg(e?.response?.data?.message || e.message);
  //   }
  // }
  async function addSkill() {
    setMsg("");  // Clear previous message
    try {
      // Validate skill input
      if (!skillForm.skill.trim()) {
        setMsg("Skill name is required.");
        return;
      }

      // Prepare payload for the API request
      const payload = { skill: skillForm.skill };

      // Make API request to add skill
      const res = await api.post("/student/resume/skill", payload);

      // Update skills state to include the new skill
      setSkills([res.data.skill, ...skills]);

      // Close the modal after saving the skill
      setOpenSkill(false);

      // Reset the form
      setSkillForm({ skill: "" });

      // Display success message
      showToast("Skill added", "success");
    } catch (e) {
      // Handle any errors
      setMsg(e?.response?.data?.message || e.message);
    }
  }

  async function addProject() {
    setMsg("");  // Clear any previous messages

    try {
      // Validate that the name of the project is not empty
      if (!projForm.name.trim()) {
        setMsg("Project name is required.");
        return;
      }

      // Prepare payload to be sent to the backend
      const payload = {
        name: projForm.name,
        tech_stack: projForm.tech_stack,
        link: projForm.link || null,
        description: projForm.descriptionText || null,
      };

      // Log payload for debugging purposes
      console.log("Adding project with payload:", payload);

      // Send POST request to backend to add the project
      const res = await api.post("/student/resume/project", payload);

      // Check if response is successful
      if (res.status === 201) {
        // Add new project to the projects list
        setProjects([res.data.project, ...projects]);

        // Close the modal after saving the project
        setOpenProj(false);

        // Reset the form
        setProjForm({ name: "", tech_stack: "", link: "", descriptionText: "" });

        // Show success message
        showToast("Project added successfully!", "success");
      } else {
        setMsg("Failed to add the project.");
      }
    } catch (e) {
      // Handle errors
      console.error("Error adding project:", e);
      setMsg(e?.response?.data?.message || e.message);
    }
  }

  async function updateProject() {
    setMsg("");  // Clear any previous messages
    try {
      // Prepare the project data payload
      const payload = {
        name: projForm.name,
        tech_stack: projForm.tech_stack,
        link: projForm.link || null,
        description: projForm.descriptionText || null,
      };

      // Make API request to update the project
      const res = await api.put(`/student/resume/project/${editProjId}`, payload);

      // Update the projects list with the updated project
      setProjects(
        projects.map((x) => (x.id === editProjId ? res.data.project : x))
      );

      // Close the modal after saving
      setOpenProj(false);

      // Reset the form
      setEditProjId(null);
      setProjForm({ name: "", tech_stack: "", link: "", descriptionText: "" });

      // Show success message
      showToast("Project updated", "success");
    } catch (e) {
      // Handle errors
      setMsg(e?.response?.data?.message || e.message);
    }
  }

  async function addLanguage() {
    setMsg("");
    try {
      const res = await api.post("/student/resume/language", langForm);
      setLanguages([res.data.language, ...languages]);
      setOpenLang(false);
      setLangForm({ language: "", proficiency: "" });
      showToast("Language added", "success");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  }

  async function addCertificate() {
    setMsg("");
    try {
      const formData = new FormData();
      formData.append("title", certForm.title);
      formData.append("issuer", certForm.issuer || "");
      formData.append("date", certForm.date || "");

      if (certForm.image_url) {
        formData.append("image_url", certForm.image_url);
      }

      if (certForm.imageFile) {
        formData.append("image", certForm.imageFile);
      }

      const res = await api.post("/student/certificates", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCertificates([res.data, ...certificates]);

      setOpenCert(false);
      setCertForm({
        title: "",
        issuer: "",
        date: "",
        image_url: "",
        imageFile: null,
        imagePreview: "",
      });
      showToast("Certificate added", "success");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  }

  async function delRow(type, id) {
    setMsg("");
    try {
      if (type === "certificate") {
        await api.delete(`/student/certificates/${id}`);
        setCertificates(certificates.filter((x) => x.id !== id));
        setMsg("Deleted ✅");
        return;
      }

      await api.delete(`/student/resume/${type}/${id}`);
      if (type === "education")
        setEducations(educations.filter((x) => x.id !== id));
      if (type === "experience")
        setExperiences(experiences.filter((x) => x.id !== id));
      if (type === "skill") setSkills(skills.filter((x) => x.id !== id));
      if (type === "project")
        setProjects(projects.filter((x) => x.id !== id));
      if (type === "language")
        setLanguages(languages.filter((x) => x.id !== id));

      setMsg("Deleted ✅");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  }

  function getTemplateComponent() {
    console.log("Rendering template:", template);
    console.log("User Data:", resume); // This will log the resume data
    if (template === "classic") return <Classic userData={userData} />;
    if (template === "modern") return <Modern userData={userData} />;
    if (template === "minimal") return <Minimal userData={userData} />;

    return (
      <img
        src={selectedTemplate.preview}
        alt="Template preview"
        style={{
          width: "100%",
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,.08)",
        }}
      />
    );
  }

  async function downloadCv() {
    if (!pdfRef.current) {
      showToast("CV preview not ready.", "error");
      return;
    }

    try {
      setDownloading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const element = pdfRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // agar content 1 page ke andar fit ho sakta hai to extra page mat banao
      if (imgHeight <= pageHeight + 2) {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // tiny leftover ke liye blank page mat banao
        while (heightLeft > 20) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      const fileName = `${(student?.user?.name || "cv").replace(/\s+/g, "_")}_CV.pdf`;
      pdf.save(fileName);

      showToast("CV downloaded successfully", "success");
    } catch (e) {
      console.error(e);
      showToast("Failed to download CV", "error");
    } finally {
      setDownloading(false);
    }
  }
  function renderTemplate(full = false) {
    const node = getTemplateComponent();

    if (full) return <div style={{ width: "100%" }}>{node}</div>;

    const baseWidth = template === "minimal" ? 950 : 1000;
    return <CvPreview baseWidth={baseWidth}>{node}</CvPreview>;
  }

  const completion = useMemo(() => {
    const checks = {
      personalInfo: !!(resume?.phone || resume?.address || resume?.dob || resume?.gender),
      workHistory: experiences.length > 0,
      education: educations.length > 0,
      skills: skills.length > 0,
      languages: languages.length > 0,
      projects: projects.length > 0,
      hobbies: Array.isArray(resume?.hobbies) && resume.hobbies.length > 0,
    };

    const total = Object.keys(checks).length;
    const done = Object.values(checks).filter(Boolean).length;
    const percent = Math.round((done / total) * 100);

    return { checks, percent };
  }, [resume, experiences.length, educations.length, skills.length, languages.length, projects.length]);

  if (loading) return <p>Loading...</p>;
  if (!student) return <p className="sMsg sErr">{msg || "No student found."}</p>;

  const name = student?.user?.name || "User";
  const email = student?.user?.email || "";
  const phone = resume?.phone || "";
  const linkedin = resume?.linkedin || "";
  const github = resume?.github || "";
  const portfolio = resume?.portfolio || "";

  return (
    <div className="jobDash">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
      <div className="container">
        <main className="main-content">
          <section className="card">
            <div className="card-header">
              <h2>Personal Information</h2>
              <button
                className="icon-btn edit-btn"
                onClick={() => setOpenPersonal(true)}
                title="Edit"
              >
                <FaPen/>
              </button>
            </div>

            <div className="profile-header">
              <div className="profile-pic-container">
                <div className="progress-ring" style={{ "--p": completion.percent }} />
                <span className="percentage-label">{completion.percent}%</span>

                <div className="profile-pic">
                  <FaUser/>
                </div>
              </div>

              <div className="profile-info">
                <h1>{name}</h1>

                <p>
                  <span className="contact-text">{email || "Not yet added"}</span>{" "}
                  <i className="fas fa-lock lock-icon" />
                </p>
                <p>
                  <span className="contact-text">{phone || "Not yet added"}</span>{" "}
                  <i className="fas fa-lock lock-icon" />
                </p>

                <p className="pi-row">
                  <span className="pi-pill">
                    DOB: {resume?.dob ? resume.dob : "Not yet added"}
                  </span>
                  <span className="pi-pill">
                    Gender: {resume?.gender ? resume.gender : "Not yet added"}
                  </span>
                </p>

                <div className="linksRow">
                  {linkedin ? (
                    <a className="linkChip" href={toUrl(linkedin)} target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-linkedin"></i> {displayUrl(linkedin)}
                    </a>
                  ) : null}
                  {github ? (
                    <a className="linkChip" href={toUrl(github)} target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-github"></i> {displayUrl(github)}
                    </a>
                  ) : null}
                  {portfolio ? (
                    <a className="linkChip" href={toUrl(portfolio)} target="_blank" rel="noreferrer">
                      <i className="fa-solid fa-globe"></i> {displayUrl(portfolio)}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2>Education</h2>
              <button className="icon-btn" onClick={() => setOpenEdu(true)} title="Add">
                <FaPlus/>
              </button>
            </div>

            {educations.length ? (
              educations.map((e, idx) => (
                <div className="itemRow" key={e.id || idx}>
                  <div className="itemMain">
                    <div className="itemTitle">{e.institute || "Institute"}</div>
                    <div className="itemSub">{e.level || e.education_level || ""}</div>
                    <div className="itemSub">{e.field || e.degree || ""}</div>

                    {e.grade && <div className="itemSub">Grade/GPA: {e.grade}</div>}

                    <div className="year">
                      {(e.start_date || "") + (e.end_date ? ` - ${e.end_date}` : "")}
                    </div>
                  </div>

                  <div className="itemActions">
                    <button className="icon-btn" onClick={() => openEditEducation(e)} title="Edit">
                      <FaRegPenToSquare />
                    </button>

                    <button className="icon-btn" onClick={() => delRow("education", e.id)} title="Delete">
                      <FaTrash/>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="placeholder-text">No education added yet</p>
            )}
          </section>

          <section className="card">
            <div className="card-header">
              <h2>Skills</h2>
              <button className="icon-btn add-btn" onClick={() => setOpenSkill(true)} title="Add">
                <FaPlus/>
              </button>
            </div>

            {skills.length ? (
              <div className="pillWrap">
                {skills.map((s) => (
                  <span className="pill" key={s.id}>
                    {s.skill}
                    <button className="pillX" title="Delete" onClick={() => delRow("skill", s.id)}>
                      <FaX/>
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="placeholder-text">No skills have been added yet</p>
            )}
          </section>

          <section className="card">
            <div className="card-header">
              <h2>Experience</h2>
              <button className="icon-btn add-btn" onClick={() => setOpenExp(true)} title="Add">
                <FaPlus/>
              </button>
            </div>

            {experiences.length ? (
              experiences.map((x) => (
                <div className="itemRow" key={x.id}>
                  <div className="itemMain">
                    <p className="itemTitle">{x.title || "Untitled"}</p>
                    <p className="itemSub">{x.company || ""}</p>
                    {Array.isArray(x.responsibilities) && x.responsibilities.length ? (
                      <ul className="bullets">
                        {x.responsibilities.slice(0, 4).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  <div className="itemActions">
                    <button className="icon-btn" onClick={() => openEditExperience(x)} title="Edit">
                      <FaRegPenToSquare />
                    </button>
                    <button className="icon-btn" onClick={() => delRow("experience", x.id)} title="Delete">
                      <FaTrash/>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="placeholder-text">No work experience has been added yet</p>
            )}
          </section>

          <section className="card">
            <div className="card-header">
              <h2>Projects</h2>
              <button className="icon-btn add-btn" onClick={() => setOpenProj(true)} title="Add">
                <FaPlus />
              </button>
            </div>

            {projects.length ? (
              projects.map((p) => (
                <div className="itemRow" key={p.id}>
                  <div className="itemMain">
                    <p className="itemTitle">{p.name || "Project"}</p>
                    <p className="itemSub">{p.tech_stack || ""}</p>
                    {p.link ? (
                      <p className="content-text">
                        <a className="plainLink" href={toUrl(p.link)} target="_blank" rel="noreferrer">
                          {displayUrl(p.link)}
                        </a>
                      </p>
                    ) : null}
                  </div>
                  <div className="itemActions">
                    <button className="icon-btn" onClick={() => delRow("project", p.id)} title="Delete">
                      <FaTrash/>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="placeholder-text">No projects have been added yet</p>
            )}
          </section>

          <section className="card">
            <div className="card-header">
              <h2>Languages</h2>
              <button className="icon-btn add-btn" onClick={() => setOpenLang(true)} title="Add">
                <FaPlus />
              </button>
            </div>

            {languages.length ? (
              <div className="pillWrap">
                {languages.map((l) => (
                  <span className="pill" key={l.id}>
                    {l.proficiency ? `${l.language} (${l.proficiency})` : l.language}
                    <button className="pillX" title="Delete" onClick={() => delRow("language", l.id)}>
                      <FaX />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="placeholder-text">No languages have been added yet</p>
            )}
          </section>

          <section className="card">
            <div className="card-header">
              <h2>Certificates</h2>
              <button className="icon-btn add-btn" onClick={() => setOpenCert(true)} title="Add">
                <FaPlus />
              </button>
            </div>

            {certificates.length ? (
              certificates.map((c) => (
                <div className="itemRow" key={c.id}>
                  <div className="itemMain">
                    <p className="itemTitle">{c.title || "Certificate"}</p>
                    <p className="itemSub">{c.issuer || c.institute || ""}</p>
                    {c.date ? <p className="content-text">{c.date}</p> : null}
                  </div>
                  <div className="itemActions">
                    <button className="icon-btn" onClick={() => delRow("certificate", c.id)} title="Delete">
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="placeholder-text">No certificates have been added yet</p>
            )}
          </section>

          <section className="card">
            <div className="card-header">
              <h2>Hobbies</h2>
              <button className="icon-btn add-btn" onClick={() => setOpenHobby(true)} title="Add">
                <FaPlus />
              </button>
            </div>
            {Array.isArray(resume?.hobbies) && resume.hobbies.length ? (
              <div className="pillWrap">
                {resume.hobbies.map((h, i) => (
                  <span className="pill" key={i}>
                    {h}
                  </span>
                ))}
              </div>
            ) : (
              <p className="placeholder-text">No hobbies have been added yet</p>
            )}
          </section>
        </main>

        <aside className="sidebar">
          <button className="download-btn" onClick={downloadCv} disabled={downloading}>
            <i className="fa-solid fa-download"></i>{" "}
            {downloading ? "Downloading..." : "Download CV"}
          </button>

          <div className="sidebar-card completion-card">
            <h3>Template & Preview</h3>

            <div className="formMini">
              <label className="miniLabel">Template</label>
              <select
                className="miniSelect"
                value={template}
                onChange={(e) => onTemplateChange(e.target.value)}
              >
                {TEMPLATES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: 12 }}>
              {renderTemplate(false)}
              <button className="miniBtn" onClick={() => setOpenPreview(true)} style={{ marginTop: 10 }}>
                View Full Preview
              </button>
            </div>
          </div>

          <div className="sidebar-card completion-card">
            <h3>Update your profile for better job recommendations</h3>

            <div className="progress-section">
              <div className="progress-text">{completion.percent}% Complete</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${completion.percent}%` }} />
              </div>
            </div>

            <ul className="checklist">
              <li className={completion.checks.workHistory ? "complete" : "incomplete"}>
                <i className={completion.checks.workHistory ? "fas fa-check-circle" : "fas fa-arrow-right"} /> Work History
              </li>
              <li className={completion.checks.personalInfo ? "complete" : "incomplete"}>
                <i className={completion.checks.personalInfo ? "fas fa-check-circle" : "fas fa-arrow-right"} /> Personal Info
              </li>
              <li className={completion.checks.education ? "complete" : "incomplete"}>
                <i className={completion.checks.education ? "fas fa-check-circle" : "fas fa-arrow-right"} /> Education
              </li>
              <li className={completion.checks.skills ? "complete" : "incomplete"}>
                <i className={completion.checks.skills ? "fas fa-check-circle" : "fas fa-arrow-right"} /> Skills
              </li>
              <li className={completion.checks.projects ? "complete" : "incomplete"}>
                <i className={completion.checks.projects ? "fas fa-check-circle" : "fas fa-arrow-right"} /> Projects
              </li>
              <li className={completion.checks.languages ? "complete" : "incomplete"}>
                <i className={completion.checks.languages ? "fas fa-check-circle" : "fas fa-arrow-right"} /> Languages
              </li>
              <li className={completion.checks.hobbies ? "complete" : "incomplete"}>
                <i className={completion.checks.hobbies ? "fas fa-check-circle" : "fas fa-arrow-right"} /> Hobbies
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Hidden PDF render area */}
      {/* Hidden PDF render area */}
      <div
        style={{
          position: "fixed",
          left: "-10000px",
          top: 0,
          width: "794px",
          background: "#fff",
          zIndex: -1,
          padding: 0,
          margin: 0,
          opacity: 1,
          pointerEvents: "none",
        }}
      >
        <div
          ref={pdfRef}
          style={{
            width: "794px",
            background: "#fff",
            overflow: "visible",
            padding: 0,
            margin: 0,
            display: "block",
          }}
        >
          {getTemplateComponent()}
        </div>
      </div>

      <Modal
        open={openPreview}
        title={`${selectedTemplate.label} Template Preview`}
        onClose={() => setOpenPreview(false)}
      >
        {renderTemplate(true)}
      </Modal>

      <Modal open={openPersonal} title="Personal Information" onClose={() => setOpenPersonal(false)}>
        <label className="cvLabel">Full Name (required)</label>
        <input className="cvInput" value={personalForm.full_name} disabled />

        <label className="cvLabel">Email</label>
        <input className="cvInput" value={personalForm.email} disabled />

        <label className="cvLabel">Phone</label>
        <input
          className="cvInput"
          value={personalForm.phone}
          onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
        />

        <label className="cvLabel">Address/City</label>
        <input
          className="cvInput"
          value={personalForm.address}
          onChange={(e) => setPersonalForm({ ...personalForm, address: e.target.value })}
        />

        <label className="cvLabel">Date of Birth</label>
        <input
          className="cvInput"
          placeholder="YYYY-MM-DD"
          value={personalForm.dob}
          onChange={(e) => setPersonalForm({ ...personalForm, dob: e.target.value })}
        />

        <label className="cvLabel">Gender</label>
        <input
          className="cvInput"
          value={personalForm.gender}
          onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value })}
        />

        <label className="cvLabel">LinkedIn (optional)</label>
        <input
          className="cvInput"
          value={personalForm.linkedin}
          onChange={(e) => setPersonalForm({ ...personalForm, linkedin: e.target.value })}
        />

        <label className="cvLabel">GitHub (optional)</label>
        <input
          className="cvInput"
          value={personalForm.github}
          onChange={(e) => setPersonalForm({ ...personalForm, github: e.target.value })}
        />

        <label className="cvLabel">Portfolio (optional)</label>
        <input
          className="cvInput"
          value={personalForm.portfolio}
          onChange={(e) => setPersonalForm({ ...personalForm, portfolio: e.target.value })}
        />

        <div className="cvModalActions">
          <button className="cvBtn" onClick={() => setOpenPersonal(false)}>Cancel</button>
          <button className="cvPrimaryBtn" onClick={savePersonal}>Save</button>
        </div>
      </Modal>

      <Modal open={openEdu} title="Education" onClose={() => setOpenEdu(false)}>
        <label className="cvLabel">Level</label>
        <select
          className="cvSelect"
          value={eduForm.level}
          onChange={(e) => setEduForm({ ...eduForm, level: e.target.value })}
        >
          <option value="Matric">Matric</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Degree">Degree</option>
        </select>

        <label className="cvLabel">Degree / Program</label>
        <input
          className="cvInput"
          value={eduForm.degree}
          onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
        />

        <label className="cvLabel">Institute</label>
        <input
          className="cvInput"
          value={eduForm.institute}
          onChange={(e) => setEduForm({ ...eduForm, institute: e.target.value })}
        />

        <label className="cvLabel">Field/Major</label>
        <input
          className="cvInput"
          value={eduForm.field}
          onChange={(e) => setEduForm({ ...eduForm, field: e.target.value })}
        />

        <label className="cvLabel">Start Date</label>
        <input
          className="cvInput"
          placeholder="YYYY-MM-DD"
          value={eduForm.start_date}
          onChange={(e) => setEduForm({ ...eduForm, start_date: e.target.value })}
        />

        <label className="cvLabel">End Date</label>
        <input
          className="cvInput"
          placeholder="YYYY-MM-DD"
          value={eduForm.end_date}
          onChange={(e) => setEduForm({ ...eduForm, end_date: e.target.value })}
        />

        <label className="cvLabel">Marks/GPA</label>
        <input
          className="cvInput"
          value={eduForm.grade}
          onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })}
        />

        <label className="cvLabel">Description</label>
        <textarea
          className="cvTextarea"
          value={eduForm.description}
          onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
        />

        <div className="cvModalActions">
          <button
            className="cvBtn"
            onClick={() => {
              setOpenEdu(false);
              setEditEduId(null);
            }}
          >
            Cancel
          </button>
          <button className="cvPrimaryBtn" onClick={addEducation}>
            {editEduId ? "Save" : "Add"}
          </button>
        </div>
      </Modal>

      <Modal open={openExp} title="Experience" onClose={() => setOpenExp(false)}>
        <label className="cvLabel">Job Title</label>
        <input
          className="cvInput"
          value={expForm.title}
          onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
        />

        <label className="cvLabel">Company</label>
        <input
          className="cvInput"
          value={expForm.company}
          onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
        />

        <label className="cvLabel">Start Date</label>
        <input
          className="cvInput"
          placeholder="YYYY-MM-DD"
          value={expForm.start_date}
          onChange={(e) => setExpForm({ ...expForm, start_date: e.target.value })}
        />

        <div className="cvRow" style={{ marginTop: 8 }}>
          <label className="cvCheck">
            <input
              type="checkbox"
              checked={expForm.is_current}
              onChange={(e) => setExpForm({ ...expForm, is_current: e.target.checked })}
            />
            Current job
          </label>
        </div>

        {!expForm.is_current ? (
          <>
            <label className="cvLabel">End Date</label>
            <input
              className="cvInput"
              placeholder="YYYY-MM-DD"
              value={expForm.end_date}
              onChange={(e) => setExpForm({ ...expForm, end_date: e.target.value })}
            />
          </>
        ) : null}

        <label className="cvLabel">Responsibilities (one per line)</label>
        <textarea
          className="cvTextarea"
          value={expForm.responsibilitiesText}
          onChange={(e) => setExpForm({ ...expForm, responsibilitiesText: e.target.value })}
        />

        <div className="cvModalActions">
          <button
            className="cvBtn"
            onClick={() => {
              setOpenExp(false);
              setEditExpId(null);
            }}
          >
            Cancel
          </button>
          <button className="cvPrimaryBtn" onClick={addExperience}>
            {editExpId ? "Save" : "Add"}
          </button>
        </div>
      </Modal>

      <Modal open={openSkill} title="Add Skill" onClose={() => setOpenSkill(false)}>
        <label className="cvLabel">Skill Name</label>
        <input
          className="cvInput"
          value={skillForm.skill}
          onChange={(e) => setSkillForm({ skill: e.target.value })}
        />

        <div className="cvModalActions">
          <button className="cvBtn" onClick={() => setOpenSkill(false)}>
            Cancel
          </button>
          <button className="cvPrimaryBtn" onClick={addSkill}>
            Save
          </button>
        </div>
      </Modal>
      {/* //add project */}

      {/* //updating project */}
      <Modal open={openProj} title="Add Project" onClose={() => setOpenProj(false)}>
        <label className="cvLabel">Project Name</label>
        <input
          className="cvInput"
          value={projForm.name}
          onChange={(e) => setProjForm({ ...projForm, name: e.target.value })}
        />

        <label className="cvLabel">Tech Stack</label>
        <input
          className="cvInput"
          value={projForm.tech_stack}
          onChange={(e) => setProjForm({ ...projForm, tech_stack: e.target.value })}
        />

        <label className="cvLabel">Link (Optional)</label>
        <input
          className="cvInput"
          value={projForm.link}
          onChange={(e) => setProjForm({ ...projForm, link: e.target.value })}
        />

        <label className="cvLabel">Description (Optional)</label>
        <textarea
          className="cvTextarea"
          value={projForm.descriptionText}
          onChange={(e) => setProjForm({ ...projForm, descriptionText: e.target.value })}
        />

        <div className="cvModalActions">
          <button className="cvBtn" onClick={() => setOpenProj(false)}>
            Cancel
          </button>
          <button className="cvPrimaryBtn" onClick={addProject}>
            Save
          </button>
        </div>
      </Modal>

      <Modal open={openLang} title="Languages" onClose={() => setOpenLang(false)}>
        <label className="cvLabel">Language</label>
        <input
          className="cvInput"
          value={langForm.language}
          onChange={(e) => setLangForm({ ...langForm, language: e.target.value })}
        />

        <label className="cvLabel">Proficiency</label>
        <input
          className="cvInput"
          value={langForm.proficiency}
          onChange={(e) => setLangForm({ ...langForm, proficiency: e.target.value })}
        />

        <div className="cvModalActions">
          <button className="cvBtn" onClick={() => setOpenLang(false)}>Cancel</button>
          <button className="cvPrimaryBtn" onClick={addLanguage}>Add</button>
        </div>
      </Modal>

      <Modal open={openCert} title="Certificates" onClose={() => setOpenCert(false)}>
        <label className="cvLabel">Certificate Title</label>
        <input
          className="cvInput"
          value={certForm.title}
          onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
        />

        <label className="cvLabel">Issuer/Institute</label>
        <input
          className="cvInput"
          value={certForm.issuer}
          onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
        />

        <label className="cvLabel">Date</label>
        <input
          className="cvInput"
          value={certForm.date}
          onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
        />

        <label className="cvLabel">Certificate Image Upload (optional)</label>
        <input
          className="cvInput"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const preview = URL.createObjectURL(file);

            setCertForm((prev) => ({
              ...prev,
              imageFile: file,
              imagePreview: preview,
            }));
          }}
        />

        {certForm.imagePreview ? (
          <div style={{ marginTop: 10 }}>
            <img
              src={certForm.imagePreview}
              alt="preview"
              style={{
                width: "100%",
                maxHeight: 170,
                objectFit: "cover",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,.08)",
              }}
            />
          </div>
        ) : null}

        <div className="cvModalActions">
          <button className="cvBtn" onClick={() => setOpenCert(false)}>Cancel</button>
          <button className="cvPrimaryBtn" onClick={addCertificate}>Add</button>
        </div>
      </Modal>

      <Modal open={openHobby} title="Hobbies" onClose={() => setOpenHobby(false)}>
        <label className="cvLabel">Hobbies (one per line)</label>
        <textarea
          className="cvTextarea"
          value={hobbyForm.hobbiesText}
          onChange={(e) => setHobbyForm({ hobbiesText: e.target.value })}
        />

        <div className="cvModalActions">
          <button className="cvBtn" onClick={() => setOpenHobby(false)}>Cancel</button>
          <button className="cvPrimaryBtn" onClick={saveHobbies}>Save</button>
        </div>
      </Modal>
    </div>
  );
}