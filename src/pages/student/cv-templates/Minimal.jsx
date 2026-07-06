import React from "react";
import "./minimal.css";
import {
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaHome,
} from "react-icons/fa";

const normalizeUrl = (url) => {
  if (!url) return "";
  const trimmed = String(url).trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const displayUrl = (url) => {
  if (!url) return "";
  const t = String(url).trim();
  if (!t) return "";
  return t.replace(/^https?:\/\//i, "").replace(/\/$/, "");
};

export default function MinimalCV({ userData = {} }) {
  const {
    name,
    title,
    summary,
    phone,
    email,
    location,
    linkedin,
    address,

    skills = [],
    education = [],
    experience = [],

    awards = [],
    achievements = [],
    interests = [],
    hobbies = [],
  } = userData;

  const fullName = String(name || "ARNOLD SMITH").trim();
  const nameParts = fullName.split(" ").filter(Boolean);
  const firstName = nameParts[0] || "ARNOLD";
  const lastName = nameParts.slice(1).join(" ");

  const safeLinkedin = normalizeUrl(linkedin);
  const contactAddress = location || address || "New York – G14F56";

  const safeSkills = Array.isArray(skills) ? skills : [];

  const techBlock =
    safeSkills.find((s) => s?.label === "Technical Skills") ||
    safeSkills.find((s) => s?.label === "Tech Skills") ||
    safeSkills.find((s) => s?.label === "Technical");

  const softBlock =
    safeSkills.find((s) => s?.label === "Soft Skills") ||
    safeSkills.find((s) => s?.label === "Soft");

  const genericSkillsBlock = safeSkills.find((s) => s?.label === "Skills");
  const languagesBlock = safeSkills.find((s) => s?.label === "Languages");

  const techSkills = Array.isArray(techBlock?.items)
    ? techBlock.items
    : Array.isArray(genericSkillsBlock?.items)
      ? genericSkillsBlock.items
      : [];

  const softSkills = Array.isArray(softBlock?.items) ? softBlock.items : [];

  const allSkills =
    techSkills.length > 0
      ? [...techSkills, ...softSkills]
      : softSkills.length > 0
        ? softSkills
        : Array.isArray(genericSkillsBlock?.items)
          ? genericSkillsBlock.items
          : [];

  const languages = Array.isArray(languagesBlock?.items)
    ? languagesBlock.items
    : Array.isArray(userData?.languages)
      ? userData.languages
      : [];

  const achievementList =
    Array.isArray(awards) && awards.length > 0
      ? awards
      : Array.isArray(achievements)
        ? achievements
        : [];

  const hobbiesRaw =
    Array.isArray(hobbies) && hobbies.length > 0 ? hobbies : interests;
  const hobbiesList = Array.isArray(hobbiesRaw) ? hobbiesRaw : [];

  const expList = Array.isArray(experience) ? experience : [];
  const eduList = Array.isArray(education) ? education : [];

  return (
    <div className="mincv-page">
      <div className="cv">
        {/* HEADER */}
        <div className="header">
          <div className="name">
            <h1>
              {firstName} <span>{lastName}</span>
            </h1>
            <p>{title || "CREATIVE DIRECTOR"}</p>
          </div>

          <div className="contact">
            {phone ? (
              <p>
                {phone} <FaPhone />
              </p>
            ) : null}

            {email ? (
              <p>
                {email} <FaEnvelope />
              </p>
            ) : null}

            {safeLinkedin ? (
              <p>
                <a href={safeLinkedin} target="_blank" rel="noreferrer">
                  {displayUrl(safeLinkedin)}
                </a>{" "}
                <FaLinkedin />
              </p>
            ) : null}

            {contactAddress ? (
              <p>
                {contactAddress} <FaHome />
              </p>
            ) : null}
          </div>
        </div>

        <hr />

        {/* MAIN */}
        <div className="main">
          {/* LEFT COLUMN */}
          <div className="minimalleft">
            <h3>MY SKILLS</h3>
            {allSkills.length > 0 ? (
              <ul>
                {allSkills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            ) : (
              <ul>
                <li>GRAPHIC DESIGN</li>
                <li>USER EXPERIENCE</li>
                <li>WEB DEVELOPMENT</li>
                <li>RESPONSIVE DESIGN</li>
                <li>QUALITY TEST</li>
              </ul>
            )}

            {languages.length > 0 ? (
  <>
    <h3>LANGUAGES</h3>
    <ul>
      {languages.map((lang, i) => (
        <li key={i}>
          <b>{String(lang).toUpperCase()}</b>
        </li>
      ))}
    </ul>
  </>
) : null}

            {achievementList.length > 0 ? (
              <>
                <h3>AWARDS</h3>
                {achievementList.map((item, i) => (
                  <p key={i}>{typeof item === "string" ? item : item?.title}</p>
                ))}
              </>
            ) : null}

            {hobbiesList.length > 0 ? (
              <>
                <h3>INTEREST</h3>
                <ul>
                  {hobbiesList
                    .map((h) => (typeof h === "string" ? h : h?.name))
                    .filter(Boolean)
                    .map((hobby, i) => (
                      <li key={i}>{hobby}</li>
                    ))}
                </ul>
              </>
            ) : null}
          </div>

          {/* RIGHT COLUMN */}
          <div className="minimalright">
            <h3>PROFILE</h3>
            <p>
              {summary ||
                "Skilled and experienced professional with a proven track record of success. Expertise in delivering results, collaborating with teams, and improving processes."}
            </p>

            <h3>PROFESSIONAL EXPERIENCE</h3>
            {expList.length > 0 ? (
              expList.map((exp, i) => {
                const role = exp.role || exp.title || "YOUR JOB TITLE";
                const company = exp.company || exp.organization || "Company Name";
                const date =
                  exp.start || exp.end
                    ? `${exp.start || ""}${exp.start && exp.end ? " - " : ""}${exp.end || "Present"
                    }`
                    : exp.date || "";

                const points =
                  Array.isArray(exp.points) && exp.points.length > 0
                    ? exp.points
                    : exp.desc || exp.description
                      ? [exp.desc || exp.description]
                      : [];

                return (
                  <div className="job" key={i}>
                    <h4>{role}</h4>
                    <p>
                      <b>{company}</b>
                      {date ? ` - ${date}` : ""}
                    </p>
                    {points.length > 0 ? (
                      <ul>
                        {points.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <>
                <div className="job">
                  <h4>YOUR JOB TITLE</h4>
                  <p>
                    <b>Company Name</b> - 2017 - Present
                  </p>
                  <ul>
                    <li>Lorem ipsum dolor sit amet.</li>
                    <li>Fusce posuere magna sed pulvinar.</li>
                    <li>Nunc viverra imperdiet enim.</li>
                  </ul>
                </div>

                <div className="job">
                  <h4>YOUR JOB TITLE</h4>
                  <p>
                    <b>Company Name</b> - 2013 - 2017
                  </p>
                  <ul>
                    <li>Lorem ipsum dolor sit amet.</li>
                    <li>Fusce posuere magna sed pulvinar.</li>
                    <li>Vivamus a tellus.</li>
                  </ul>
                </div>
              </>
            )}

            <h3>EDUCATION</h3>
            {eduList.length > 0 ? (
              <div className="education">
                {eduList.map((edu, i) => {
                  const degree = edu.degree || edu.program || edu.level || edu.major || "YOUR DEGREE";
                  const institute =
                    edu.institute || edu.school || edu.university || "College Name";
                  const date =
                    edu.start || edu.end
                      ? `${edu.start || ""}${edu.start && edu.end ? " - " : ""}${edu.end || ""}`
                      : edu.years || "";

                  return (
                    <div key={i}>
                      <h4>{degree}</h4>
                      <p>
                        {institute}
                        {date ? ` - ${date}` : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="education">
                <div>
                  <h4>YOUR MASTERS</h4>
                  <p>College Name 2018</p>
                </div>

                <div>
                  <h4>YOUR DEGREE</h4>
                  <p>College Name - 2020</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}