import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./companylayout.css";
import logo from "../../assets/SkillHiveLogo.png";
// import { FiLogOut, FiChevronDown } from "react-icons/fi";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaHouse, FaPlus,  FaBriefcase,FaSortDown, FaBuilding ,FaUser,FaArrowRightFromBracket,FaHourglassEnd} from "react-icons/fa6";



export default function CompanyLayout() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // URL track karne ke liye

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  // Live status mapping setup
  const companyStatus = user?.company?.status || "pending";
  const letter = (user?.name?.[0] || "C").toUpperCase();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("popup_displayed");
    navigate("/login", { replace: true });
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("popup_displayed");
    if (companyStatus === "pending" && !hasSeenPopup) {
      setShowPopup(true);
      sessionStorage.setItem("popup_displayed", "true");
    }
  }, [companyStatus]);

  // CRITICAL FIX: In links par manual access ko lock karna hai
  const prohibitedPaths = ["/company/post-project", "/company/manage-jobs", "/company/my-projects"];
  const isBypassingManually = prohibitedPaths.includes(location.pathname);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="jpShell">
      {/* AESTHETIC REVIEW POPUP */}
      {showPopup && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(15, 23, 42, 0.35)", backdropFilter: "blur(8px)",
          zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ background: "#fff", padding: "40px", borderRadius: "20px", maxWidth: "420px", width: "90%", textAlign: "center", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "50px", marginBottom: "16px" }}><FaHourglassEnd /></div>
            <h3 style={{ margin: "0 0 10px 0", color: "#0f172a" }}>Verification Pending</h3>
            <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
              Your company credentials are under verification. Core job recruitment features will unlock immediately upon admin authorization.
            </p>
            <button class="pending-btn" onClick={() => { setShowPopup(false); navigate("/company/profile"); }} style={{ width: "100%", padding: "12px", background: "#003F51", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "500" }}>
              Complete Corporate Profile
            </button>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="jpSide">
        <div className="jpBrand" onClick={() => navigate("/company")} role="button">
          <img src={logo} alt="SkillHive Logo" />
        </div>

        <nav className="jpNav">
          <NavLink end to="/company" className={({ isActive }) => "jpLink" + (isActive ? " active" : "")}>
            {/* <span className="jpIcon" style={{ fontSize: "24px", color: "red" }}><i className="fa-solid fa-house" style={{ fontFamily: '"Font Awesome 6 Free" !important', fontWeight: 900 }}></i></span> */}
            <span className="jpIcon"><FaHouse /></span>  
            <span className="jpLabel">Dashboard</span>
          </NavLink>

          <NavLink
            to="/company/post-project"
            className={({ isActive }) => "jpLink" + (isActive ? " active" : "")}
            style={{
              pointerEvents: companyStatus === "pending" ? "none" : "auto",
              opacity: companyStatus === "pending" ? 0.45 : 1,
            }}
          >
            <span className="jpIcon"><FaPlus/></span>  
            <span className="jpLabel">Post Job {companyStatus === "pending" && "🔒"}</span>
          </NavLink>

          <NavLink
            to="/company/manage-jobs"
            className={({ isActive }) => "jpLink" + (isActive ? " active" : "")}
            style={{
              pointerEvents: companyStatus === "pending" ? "none" : "auto",
              opacity: companyStatus === "pending" ? 0.45 : 1,
            }}
          >
            <span className="jpIcon"><FaBriefcase/></span>  
            <span className="jpLabel">Manage Jobs {companyStatus === "pending" && "🔒"}</span>
          </NavLink>

          <NavLink to="/company/profile" className={({ isActive }) => "jpLink" + (isActive ? " active" : "")}>
            <span className="jpIcon"><FaUser/></span>  
            <span className="jpLabel">Company Profile</span>
          </NavLink>
        </nav>

        {/* <div className="jpSideFooter">
          <button className="jpLogout" onClick={logout}>
            <FaArrowRightFromBracket/> Logout
          </button>
        </div> */}
      </aside>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="jpMain">
        <header className="jpTop">
          <div className="jpTopRight">
            <div className="jpUserWrap" ref={menuRef}>
              <button className="jpUserBtn" onClick={() => setMenuOpen((v) => !v)}>
                <div className="jpAvatar">{letter}</div>
                <div className="jpUserTxt">
                  <div className="jpUserName">{user?.name || "Company"}</div>
                  <div className="jpUserRole">Employer ({companyStatus})</div>
                </div>
                {/* <FiChevronDown className="jpCaret" /> */}
                <FaSortDown />
              </button>

              {menuOpen && (
                <div className="jpUserMenu">
                  <button className="jpMenuItem" onClick={() => navigate("/company/profile")}>Profile</button>
                  <button className="jpMenuItem danger" onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* INNER RENDER SCREEN VIEW */}
        <main className="jpContent">

          {/* PENDING POPUP (existing) */}
          {companyStatus === "pending" && isBypassingManually ? (
            <div style={{
              padding: "50px", textAlign: "center", background: "#fff",
              borderRadius: "16px", border: "1px solid #e2e8f0", marginTop: "20px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)"
            }}>
              <span style={{ fontSize: "64px", display: "block", marginBottom: "16px" }}>🔒</span>
              <h2 style={{ color: "#0f172a", marginBottom: "8px" }}>Access Restricted</h2>
              <p style={{ color: "#64748b", maxWidth: "460px", margin: "0 auto", fontSize: "14px", lineHeight: "1.6" }}>
                This operational tab is locked. Please configure your verification details under the **Company Profile** tab to request platform activation.
              </p>
              <button
                onClick={() => navigate("/company/profile")}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  background: "#4f46e5",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Go to Profile Setup
              </button>
            </div>
          ) : companyStatus === "blocked" ? (

            /* 🚫 BLOCKED POPUP (NEW ADD) */
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(15,23,42,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999
            }}>
              <div style={{
                background: "#fff",
                width: "100%",
                maxWidth: "520px",
                borderRadius: "16px",
                padding: "32px",
                textAlign: "center",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
              }}>

                <div style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "#fee2e2",
                  color: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  margin: "0 auto 20px"
                }}>
                  🚫
                </div>

                <h2 style={{ marginBottom: "10px" }}>Account Blocked</h2>

                <p style={{ color: "#64748b", marginBottom: "16px" }}>
                  Your company has been blocked by admin.
                </p>

                <div style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "10px",
                  padding: "12px",
                  marginBottom: "20px",
                  textAlign: "left"
                }}>
                  <strong>Reason:</strong><br />
                  {company?.block_reason || "Policy Violation"}
                </div>

                <button
                  onClick={() => window.location.href = "mailto:support@yourcompany.com"}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#ef4444",
                    color: "#fff",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Contact Customer Service
                </button>

                {/*NEW LOGOUT BUTTON */}
        <button
          onClick={logout}
          style={{
            width: "100%", padding: "12px", border: "1px solid #e2e8f0",
            borderRadius: "8px", background: "#f8fafc", color: "#475569",
            fontWeight: "600", cursor: "pointer"
          }}
        >
          Logout
        </button>

              </div>
            </div>

          ) : (
            <Outlet />
          )}

        </main>
      </div>
    </div>
  );
}