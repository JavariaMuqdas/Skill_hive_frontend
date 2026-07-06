import React, { useMemo, useRef, useState } from "react";
import "./modern.css";
import {
  FaMars,
  FaCakeCandles,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaMapPin,
  FaFutbol,
} from "react-icons/fa6";

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

export default function ModernCV({ userData = {} }) {
  const {
    name,
    title,
    gender,
    dob,
    phone,
    email,
    website,
    location,
    linkedin,
    github,
    portfolio,
    summary,
    skills = [],
    awards = [],
    certifications = [],
    certificates = [],
    interests = [],
    education = [],
    experience = [],
    activities = [],
  } = userData;

  const safeWebsite = normalizeUrl(website);
  const safeLinkedin = normalizeUrl(linkedin);
  const safeGithub = normalizeUrl(github);
  const safePortfolio = normalizeUrl(portfolio);

  const hasPersonal =
    !!gender ||
    !!dob ||
    !!phone ||
    !!email ||
    !!location ||
    !!safeWebsite ||
    !!safeLinkedin ||
    !!safeGithub ||
    !!safePortfolio;

  const safeSkills = Array.isArray(skills) ? skills : [];

  const skillsBlock = safeSkills.find((s) => s?.label === "Skills");
  const languagesBlock = safeSkills.find((s) => s?.label === "Languages");

  const skillsItems = Array.isArray(skillsBlock?.items) ? skillsBlock.items : [];
  const languageItems = Array.isArray(languagesBlock?.items)
    ? languagesBlock.items
    : [];

  const certObjects = Array.isArray(certificates) ? certificates : [];
  const certStrings = Array.isArray(certifications) ? certifications : [];
  const hasCertObjects = certObjects.length > 0;
  const hasCertStrings = certStrings.length > 0;

  const safeAwards = Array.isArray(awards) ? awards : [];
  const safeEducation = Array.isArray(education) ? education : [];
  const safeExperience = Array.isArray(experience) ? experience : [];
  const safeActivities = Array.isArray(activities) ? activities : [];
  const safeInterests = Array.isArray(interests) ? interests : [];

  const inputRef = useRef(null);
  const [photoSrc, setPhotoSrc] = useState("https://via.placeholder.com/150");

  const onPickPhoto = () => inputRef.current?.click();

  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoSrc(String(ev.target?.result || ""));
    reader.readAsDataURL(file);
  };

  const upperName = useMemo(
    () => (name ? String(name).toUpperCase() : "YOUR NAME"),
    [name]
  );

  const upperTitle = useMemo(
    () => (title ? String(title).toUpperCase() : "PROFESSIONAL TITLE"),
    [title]
  );

  const renderContactRow = (icon, content, key) => (
    <div className="contactRow" key={key}>
      <div className="ico">{icon}</div>
      <span>{content}</span>
    </div>
  );

  const renderLinkRow = (href, label, key) => (
    <div className="contactRow" key={key}>
      <div className="ico">
        <FaGlobe />
      </div>
      <span>
        <a href={href} target="_blank" rel="noreferrer">
          {label}
        </a>
      </span>
    </div>
  );

  return (
    <div className="cvPage">
      <main className="resume">
        {/* LEFT */}
        <aside className="classicleft">
          <div className="nameBlock">
            <h1>{upperName}</h1>
            <h2>{upperTitle}</h2>
          </div>

          {/* CONTACT / PERSONAL */}
          {hasPersonal ? (
            <div className="contact">
              {gender && renderContactRow(<FaMars />, gender, "gender")}
              {dob && renderContactRow(<FaCakeCandles />, dob, "dob")}
              {phone && renderContactRow(<FaPhone />, phone, "phone")}
              {email && renderContactRow(<FaEnvelope />, email, "email")}
              {location && renderContactRow(<FaMapPin />, location, "location")}
              {safeLinkedin &&
                renderLinkRow(
                  safeLinkedin,
                  displayUrl(safeLinkedin),
                  "linkedin"
                )}
              {safeGithub &&
                renderLinkRow(safeGithub, displayUrl(safeGithub), "github")}
              {safePortfolio &&
                renderLinkRow(
                  safePortfolio,
                  displayUrl(safePortfolio),
                  "portfolio"
                )}
              {safeWebsite &&
                renderLinkRow(safeWebsite, displayUrl(safeWebsite), "website")}
            </div>
          ) : null}

          {/* SKILLS */}
          {skillsItems.length > 0 ? (
            <section className="leftSection">
              <h3 className="leftTitle">SKILLS</h3>
              <ul className="bulletList">
                {skillsItems.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* LANGUAGES */}
          {languageItems.length > 0 ? (
            <section className="leftSection">
              <h3 className="leftTitle">LANGUAGES</h3>
              <ul className="bulletList">
                {languageItems.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* AWARDS */}
          {safeAwards.length > 0 ? (
            <section className="leftSection">
              <h3 className="leftTitle">HONORS &amp; AWARDS</h3>
              {safeAwards.map((a, i) => (
                <p className="smallPara" key={i}>
                  {typeof a === "string" ? a : a?.title || ""}
                </p>
              ))}
            </section>
          ) : null}

          {/* CERTIFICATIONS */}
          {hasCertObjects || hasCertStrings ? (
            <section className="leftSection">
              <h3 className="leftTitle">CERTIFICATIONS</h3>

              {hasCertObjects
                ? certObjects.map((c, i) => (
                    <p className="smallPara" key={c.id || i}>
                      <strong>{c.title || "Certificate"}</strong>
                      {c.issuer || c.date ? (
                        <span className="muted">
                          {" "}
                          — {c.issuer || ""}
                          {c.date ? (c.issuer ? ` • ${c.date}` : c.date) : ""}
                        </span>
                      ) : null}
                      {c.image_url ? (
                        <>
                          {" "}
                          <a
                            href={normalizeUrl(c.image_url)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            (View)
                          </a>
                        </>
                      ) : null}
                    </p>
                  ))
                : null}

              {!hasCertObjects && hasCertStrings
                ? certStrings.map((c, i) => (
                    <p className="smallPara" key={i}>
                      {c}
                    </p>
                  ))
                : null}
            </section>
          ) : null}

          {/* INTERESTS */}
          {safeInterests.length > 0 ? (
            <section className="leftSection">
              <h3 className="leftTitle">INTERESTS</h3>
              {safeInterests.map((it, i) => (
                <p className="smallPara" key={i}>
                  <span className="interestLine">
                    <FaFutbol /> {typeof it === "string" ? it : it?.name || ""}
                  </span>
                </p>
              ))}
            </section>
          ) : null}
        </aside>

        {/* RIGHT */}
        <section className="right">
          <div className="top">
          </div>

          <div className="content">
            {/* OBJECTIVE */}
            {summary ? (
              <div className="section">
                <div className="sectionHeader">
                  <h3>OBJECTIVE</h3>
                  <div className="hr" />
                </div>
                <p className="objective">{summary}</p>
              </div>
            ) : null}

            {/* EDUCATION */}
            {safeEducation.length > 0 ? (
              <div className="section">
                <div className="sectionHeader">
                  <h3>EDUCATIONnnn</h3>
                  <div className="hr" />
                </div>

                {safeEducation.map((edu, i) => (
                  <div className="item" key={i}>
                    <div className="row1">
                      <p className="title">{edu.institute || edu.school || "Institute"}</p>
                      {edu.start || edu.end ? (
                        <p className="date">
                          {edu.start || ""}
                          {edu.start && edu.end ? " - " : ""}
                          {edu.end || ""}
                        </p>
                      ) : (
                        <span />
                      )}
                    </div>

                    {edu.major ? <p className="meta">Major: {edu.major}</p> : null}
                    {edu.gpa ? <p className="meta">- GPA: {edu.gpa}</p> : null}
                  </div>
                ))}
              </div>
            ) : null}

            {/* WORK EXPERIENCE */}
            {safeExperience.length > 0 ? (
              <div className="section">
                <div className="sectionHeader">
                  <h3>WORK EXPERIENCE</h3>
                  <div className="hr" />
                </div>

                {safeExperience.map((exp, i) => (
                  <div className="item" key={i}>
                    <div className="row1">
                      <p className="title">{exp.company || "Company"}</p>
                      {exp.start || exp.end ? (
                        <p className="date">
                          {exp.start || ""}
                          {exp.start && exp.end ? " - " : ""}
                          {exp.end || ""}
                        </p>
                      ) : (
                        <span />
                      )}
                    </div>

                    {exp.role ? <p className="meta">{exp.role}</p> : null}

                    {Array.isArray(exp.points) && exp.points.length > 0 ? (
                      <ul className="desc">
                        {exp.points.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}

            {/* ACTIVITIES */}
            {safeActivities.length > 0 ? (
              <div className="section">
                <div className="sectionHeader">
                  <h3>ACTIVITIES</h3>
                  <div className="hr" />
                </div>

                {safeActivities.map((act, i) => (
                  <div className="item" key={i}>
                    <div className="row1">
                      <p className="title">{act.title || "Activity"}</p>
                      {act.date ? <p className="date">{act.date}</p> : <span />}
                    </div>

                    {act.subTitle ? <p className="meta">{act.subTitle}</p> : null}

                    {Array.isArray(act.points) && act.points.length > 0 ? (
                      <ul className="desc">
                        {act.points.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}