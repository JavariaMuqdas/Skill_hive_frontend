import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Classic from "../student/cv-templates/Classic";
import Modern from "../student/cv-templates/Modern";
import Minimal from "../student/cv-templates/Minimal";

export default function StudentCvPreview() {
  const { id } = useParams(); // Extract student ID from the URL params

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

  useEffect(() => {
    const loadPreview = async () => {
      try {
        setLoading(true);
        setMsg("");

        // Ensure the id is valid
        if (!id) {
          setMsg("Invalid student ID.");
          return;
        }

        const res = await api.get(`/company/students/${id}/resume-preview`);
        const data = res?.data || {};

        console.log("CV preview API response:", data);

        setStudent(data?.student || null);
        setResume(data?.resume || null);
        setEducations(Array.isArray(data?.educations) ? data.educations : []);
        setExperiences(Array.isArray(data?.experiences) ? data.experiences : []);
        setSkills(Array.isArray(data?.skills) ? data.skills : []);
        setProjects(Array.isArray(data?.projects) ? data.projects : []);
        setLanguages(Array.isArray(data?.languages) ? data.languages : []);
        setCertificates(Array.isArray(data?.certificates) ? data.certificates : []);
        setTemplate(data?.resume?.default_template || "classic");
      } catch (e) {
        console.error("Failed to load CV preview:", e?.response?.data || e);
        setMsg(
          e?.response?.data?.message ||
            e.message ||
            "Failed to load CV preview."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPreview();
  }, [id]); // The effect runs when the student ID changes

  const userData = useMemo(() => {
    const hobbies = Array.isArray(resume?.hobbies) ? resume.hobbies : [];

    return {
      name: student?.user?.name || "",
      title: resume?.headline || "Student",
      email: student?.user?.email || "",
      phone: resume?.phone || student?.phone || "",
      location: resume?.address || student?.city || student?.address || "",
      address: resume?.address || student?.address || "",
      linkedin: resume?.linkedin || "",
      github: resume?.github || "",
      portfolio: resume?.portfolio || "",
      website: resume?.portfolio || "",
      gender: resume?.gender || "",
      dob: resume?.dob || "",
      objective: resume?.summary || "",
      summary: resume?.summary || "",
      hobbies,
      interests: hobbies,

      skills: [
        {
          label: "Skills",
          items: (skills || [])
            .map((s) => s?.skill || s?.name || "")
            .filter(Boolean),
        },
        {
          label: "Languages",
          items: (languages || [])
            .map((l) => {
              const language = l?.language || "";
              const proficiency = l?.proficiency || "";
              if (!language) return "";
              return proficiency ? `${language} (${proficiency})` : language;
            })
            .filter(Boolean),
        },
      ].filter((section) => section.items.length > 0),

      education: (educations || []).map((e) => ({
        level: e?.level || e?.education_level || "",
        degree: e?.degree || "",
        institute: e?.institute || "",
        major: e?.field || e?.degree || "",
        gpa: e?.grade || "",
        start: e?.start_date || "",
        end: e?.end_date || "",
        description: e?.description || "",
      })),

      experience: (experiences || []).map((x) => ({
        company: x?.company || "",
        role: x?.title || "",
        start: x?.start_date || "",
        end: x?.is_current ? "Present" : x?.end_date || "",
        points: Array.isArray(x?.responsibilities)
          ? x.responsibilities
          : x?.responsibilities
          ? [x.responsibilities]
          : [],
      })),

      activities: (projects || []).map((p) => ({
        title: p?.name || "Project",
        subTitle: p?.tech_stack || "",
        points: Array.isArray(p?.description)
          ? p.description
          : p?.description
          ? [p.description]
          : [],
        link: p?.link || "",
      })),

      certificates: (certificates || []).map((c) => ({
        id: c?.id,
        title: c?.title || "",
        issuer: c?.issuer || "",
        date: c?.issue_date || c?.date || "",
        image_url: c?.image_url || "",
      })),
    };
  }, [
    student,
    resume,
    skills,
    educations,
    experiences,
    projects,
    languages,
    certificates,
  ]);

  const renderTemplate = () => {
    if (template === "classic") return <Classic userData={userData} />;
    if (template === "modern") return <Modern userData={userData} />;
    if (template === "minimal") return <Minimal userData={userData} />;
    return <Classic userData={userData} />;
  };

  if (loading) return <p>Loading CV preview...</p>;
  if (msg) return <p>{msg}</p>;
  if (!student) return <p>Student not found.</p>;

  return <div style={{ padding: 20 }}>{renderTemplate()}</div>;
}