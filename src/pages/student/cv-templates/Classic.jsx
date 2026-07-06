import React, { useMemo } from "react";
import "./classic.css";

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

export default function Classic({ userData = {} }) {
  const {
    name,
    title,
    phone,
    email,
    location,
    address,
    website,
    github,
    linkedin,
    gender,
    dob,
    objective,
    profileImage,

    skills = [],
    education = [],
    experience = [],
    activities = [],
    hobbies = [],
    interests = [],
    certifications = [],
    honors = [],
  } = userData;

  const skillsBlock = Array.isArray(skills)
    ? skills.find((s) => s?.label === "Skills")
    : null;

  const languagesBlock = Array.isArray(skills)
    ? skills.find((s) => s?.label === "Languages")
    : null;

  const skillsItems = Array.isArray(skillsBlock?.items) ? skillsBlock.items : [];
  const languageItems = Array.isArray(languagesBlock?.items)
    ? languagesBlock.items
    : [];

  const eduList = Array.isArray(education) ? education : [];
  const expList = Array.isArray(experience) ? experience : [];
  const activitiesList = Array.isArray(activities) ? activities : [];

  const hobbiesRaw =
    Array.isArray(hobbies) && hobbies.length > 0 ? hobbies : interests;
  const hobbiesList = Array.isArray(hobbiesRaw) ? hobbiesRaw : [];

  const websiteUrl = normalizeUrl(website);
  const githubUrl = normalizeUrl(github);
  const linkedinUrl = normalizeUrl(linkedin);

  const fullName = useMemo(() => (name ? String(name) : ""), [name]);
  const displayTitle = useMemo(
    () => (title ? String(title) : "Student"),
    [title]
  );

  const contactAddress = location || address || "";
  const profileText = objective || "";

  const leftSkills = skillsItems.slice(0, Math.ceil(skillsItems.length / 2));
  const rightSkills = skillsItems.slice(Math.ceil(skillsItems.length / 2));

  return (
    <div className="classicCvPage">
      <div className="classicCvContainer">
        {/* HEADER */}
        <div className="classicHeader">
          <div className="classicHeaderLeft">
            <h1>{fullName || "Student Name"}</h1>
            <h3>{displayTitle}</h3>

            <ul className="classicContact">
              {contactAddress ? <li>📍 {contactAddress}</li> : null}
              {phone ? <li>📞 {phone}</li> : null}
              {email ? <li>✉ {email}</li> : null}
              {gender ? <li>👤 {gender}</li> : null}
              {dob ? <li>🎂 {dob}</li> : null}
              {websiteUrl ? (
                <li>
                  🌐{" "}
                  <a href={websiteUrl} target="_blank" rel="noreferrer">
                    {displayUrl(websiteUrl)}
                  </a>
                </li>
              ) : null}
              {linkedinUrl ? (
                <li>
                  💼{" "}
                  <a href={linkedinUrl} target="_blank" rel="noreferrer">
                    {displayUrl(linkedinUrl)}
                  </a>
                </li>
              ) : null}
              {githubUrl ? (
                <li>
                  💻{" "}
                  <a href={githubUrl} target="_blank" rel="noreferrer">
                    {displayUrl(githubUrl)}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          {profileImage ? (
            <div className="classicHeaderRight">
              <img src={profileImage} alt={fullName || "Student"} />
            </div>
          ) : null}
        </div>

        {/* PROFILE */}
        <div className="classicSection">
          <div className="classicSectionTitle">Professional Profile</div>
          <p>{profileText || "No professional summary added."}</p>
        </div>

        {/* CORE SKILLS */}
        <div className="classicSection">
          <div className="classicSectionTitle">Core Skills</div>

          {skillsItems.length > 0 ? (
            <div className="classicSkills">
              <ul>
                {leftSkills.map((skill, i) => (
                  <li key={`left-skill-${i}`}>{skill}</li>
                ))}
              </ul>

              <ul>
                {rightSkills.map((skill, i) => (
                  <li key={`right-skill-${i}`}>{skill}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No skills added.</p>
          )}
        </div>

        {/* LANGUAGES */}
        {languageItems.length > 0 ? (
          <div className="classicSection">
            <div className="classicSectionTitle">Languages</div>
            <ul className="classicSimpleList">
              {languageItems.map((lang, i) => (
                <li key={i}>{lang}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* HONORS */}
        {Array.isArray(honors) && honors.length > 0 ? (
          <div className="classicSection">
            <div className="classicSectionTitle">Honors & Awards</div>
            <ul className="classicSimpleList">
              {honors.map((item, i) => (
                <li key={i}>
                  {typeof item === "string"
                    ? item
                    : `${item.year ? `${item.year}: ` : ""}${item.title || ""}`}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* CERTIFICATIONS */}
        {Array.isArray(certifications) && certifications.length > 0 ? (
          <div className="classicSection">
            <div className="classicSectionTitle">Certifications</div>
            <ul className="classicSimpleList">
              {certifications.map((item, i) => (
                <li key={i}>
                  {typeof item === "string"
                    ? item
                    : `${item.year ? `${item.year}: ` : ""}${item.title || ""}`}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* INTERESTS */}
        {hobbiesList.length > 0 ? (
          <div className="classicSection">
            <div className="classicSectionTitle">Interests</div>
            <ul className="classicSimpleList">
              {hobbiesList
                .map((h) => (typeof h === "string" ? h : h?.name))
                .filter(Boolean)
                .map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
            </ul>
          </div>
        ) : null}

        {/* CAREER SUMMARY */}
        <div className="classicSection">
          <div className="classicSectionTitle">Career Summary</div>

          {expList.length === 0 ? (
            <p>No experience added.</p>
          ) : (
            expList.map((job, idx) => {
              const company = job.company || job.organization || "Company";
              const role = job.role || job.title || "Job Title";
              const jobLocation = job.location || job.city || "";
              const start = job.start || "";
              const end = job.end || "Present";
              const years =
                start || end ? `${start}${start && end ? " – " : ""}${end}` : "";

              const points =
                Array.isArray(job.points) && job.points.length > 0
                  ? job.points
                  : job.desc || job.description
                  ? [job.desc || job.description]
                  : [];

              return (
                <div className="classicJob" key={idx}>
                  <h4>{years || role}</h4>
                  <b>
                    {company}
                    {jobLocation ? `, ${jobLocation}` : ""}
                  </b>
                  {role && years ? <p>{role}</p> : null}

                  {points.length > 0 ? (
                    <ul>
                      {points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        {/* EDUCATION */}
        <div className="classicSection">
          <div className="classicSectionTitle">Education</div>

          {eduList.length === 0 ? (
            <p>No education added.</p>
          ) : (
            <div className="classicEducation">
              {eduList.map((edu, idx) => {
                const degree =
                  edu.degree || edu.program || edu.level || edu.major || "Degree";
                const institute =
                  edu.institute || edu.school || edu.university || "Institute";
                const start = edu.start || "";
                const end = edu.end || "";
                const years =
                  start || end ? `${start}${start && end ? " - " : ""}${end}` : "";

                return (
                  <div key={idx}>
                    <h4>{degree}</h4>
                    <p>
                      {institute}
                      {years ? ` - ${years}` : ""}
                    </p>
                    {edu.gpa ? <p>GPA: {edu.gpa}</p> : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ACTIVITIES */}
        {activitiesList.length > 0 ? (
          <div className="classicSection">
            <div className="classicSectionTitle">Activities</div>

            {activitiesList.map((act, i) => {
              if (typeof act === "string") {
                return (
                  <div className="classicJob" key={i}>
                    <h4>{act}</h4>
                  </div>
                );
              }

              const actTitle = act.title || "Activity";
              const actSub = act.subTitle || act.role || "";
              const actPoints =
                Array.isArray(act.points) && act.points.length > 0
                  ? act.points
                  : act.desc || act.description
                  ? [act.desc || act.description]
                  : [];

              return (
                <div className="classicJob" key={i}>
                  <b>{actTitle}</b>
                  {actSub ? <p>{actSub}</p> : null}
                  {actPoints.length > 0 ? (
                    <ul>
                      {actPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}