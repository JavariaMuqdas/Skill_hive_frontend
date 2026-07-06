import "./auth.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { FaGraduationCap,FaUser,FaEnvelope ,FaEye,FaBrain,FaPhone,FaBuilding, FaIndustry,FaGlobe } from "react-icons/fa6";

export default function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [studentPhone, setStudentPhone] = useState("");
  const [degree, setDegree] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [description, setDescription] = useState("");

  const canSubmit = useMemo(() => {
    if (!fullName || !email || !password) return false;

    if (role === "student") {
      return Boolean(studentPhone && degree && skills && resumeFile);
    }

    if (role === "company") {
      return Boolean(companyPhone && companyName && industry && description);
    }

    return false;
  }, [
    role,
    fullName,
    email,
    password,
    studentPhone,
    degree,
    skills,
    resumeFile,
    companyName,
    industry,
    description,
    companyPhone,
  ]);

  const onSelectRole = (r) => {
    setRole(r);
    setErr("");

    if (r === "student") {
      setCompanyName("");
      setWebsite("");
      setIndustry("");
      setCompanyPhone("");
      setDescription("");
    } else {
      setStudentPhone("");
      setDegree("");
      setSkills("");
      setResumeFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("role", role);
      formData.append("name", fullName.trim());
      formData.append("email", email.trim());
      formData.append("password", password);

      if (role === "student") {
        formData.append("phone", studentPhone.trim());
        formData.append("degree", degree.trim());
        formData.append("skills", skills.trim());
        formData.append("resume", resumeFile);
      }

      if (role === "company") {
        formData.append("company_phone", companyPhone.trim());
        formData.append("company_name", companyName.trim());
        formData.append("website", website.trim());
        formData.append("industry", industry.trim());
        formData.append("description", description.trim());
      }

      await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login", { state: { justSignedUp: true, email } });
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      const backendErrors = error?.response?.data?.errors;

      const firstValidationError =
        backendErrors && Object.values(backendErrors)[0]
          ? Object.values(backendErrors)[0][0]
          : null;

      setErr(backendMessage || firstValidationError || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage signupPage">
      <div className="authCard">
        <div className="authHeader">
          <div className="authTopIcon">
            <FaGraduationCap />
          </div>

          <div>
            <h2 className="authTitle">Create Account</h2>
            <p className="authSub">
              Choose your role and fill the form to get started
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="authForm">
          <div className="fieldGroup full">
            <label className="authLabel">Sign up as</label>

            <div className="authRoleGrid">
              <button
                type="button"
                className={role === "student" ? "authRoleBtn active" : "authRoleBtn"}
                onClick={() => onSelectRole("student")}
              >
                <span><FaUser/></span> Student
              </button>

              <button
                type="button"
                className={role === "company" ? "authRoleBtn active" : "authRoleBtn"}
                onClick={() => onSelectRole("company")}
              >
                <span><FaBuilding/></span> Company
              </button>
            </div>
          </div>

          <div className="fieldGroup">
            <label className="authLabel">Full Name</label>
            <div className="authInputWrap">
              <span className="authLeftIcon"><FaUser/></span>
              <input
                className="authInput"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="fieldGroup">
            <label className="authLabel">Email</label>
            <div className="authInputWrap">
              <span className="authLeftIcon"><FaEnvelope/></span>
              <input
                className="authInput"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>
          </div>

          <div className="fieldGroup">
            <label className="authLabel">Password</label>
            <div className="authInputWrap">
              <span className="authLeftIcon"><FaEye/></span>
              <input
                className="authInput"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>
          </div>

          {role === "student" && (
            <>
              <div className="fieldGroup">
                <label className="authLabel">Phone</label>
                <div className="authInputWrap">
                  <span className="authLeftIcon"><FaPhone/></span>
                  <input
                    className="authInput"
                    placeholder="Enter your phone"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="fieldGroup">
                <label className="authLabel">Degree</label>
                <div className="authInputWrap">
                  <span className="authLeftIcon"><FaGraduationCap/></span>
                  <input
                    className="authInput"
                    placeholder="e.g. BS Computer Science"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="fieldGroup">
                <label className="authLabel">Skills</label>
                <div className="authInputWrap">
                  <span className="authLeftIcon"><FaBrain/></span>
                  <input
                    className="authInput"
                    placeholder="e.g. React, Laravel, MySQL"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="fieldGroup full">
                <label className="authLabel">Resume (PDF/DOC)</label>
                <input
                  className="authInput fileInput"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
            </>
          )}

          {role === "company" && (
            <>
              <div className="fieldGroup">
                <label className="authLabel">Company Phone</label>
                <div className="authInputWrap">
                  <span className="authLeftIcon"><FaPhone/></span>
                  <input
                    className="authInput"
                    placeholder="Enter company phone"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="fieldGroup">
                <label className="authLabel">Company Name</label>
                <div className="authInputWrap">
                  <span className="authLeftIcon"><FaBuilding/></span>
                  <input
                    className="authInput"
                    placeholder="Enter company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="fieldGroup">
                <label className="authLabel">Website (optional)</label>
                <div className="authInputWrap">
                  <span className="authLeftIcon"><FaGlobe/></span>
                  <input
                    className="authInput"
                    placeholder="https://example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>

              <div className="fieldGroup">
                <label className="authLabel">Industry</label>
                <div className="authInputWrap">
                  <span className="authLeftIcon"><FaIndustry/></span>
                  <input
                    className="authInput"
                    placeholder="e.g. Software, Textile, Retail"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="fieldGroup full">
                <label className="authLabel">Company Description</label>
                <textarea
                  className="authInput textareaInput"
                  placeholder="Write a short description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {err ? <div className="authError full">{err}</div> : null}

          <button type="submit" className="authBtn full" disabled={loading || !canSubmit}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}