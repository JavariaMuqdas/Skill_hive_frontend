// ==================== AdminLayout.jsx ====================
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./adminlayout.css";
import { FaUser, FaCaretDown, FaBriefcase, FaBuilding, FaUsers, FaHouse } from "react-icons/fa6";
import logo from "../../assets/SkillHiveLogo.png";

export default function AdminLayout() {
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const letter = (user?.name?.[0] || "A").toUpperCase();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
      {/* SIDEBAR */}
      <aside className="jpSide">
        <div className="jpBrand" onClick={() => navigate("/admin/dashboard")} role="button">
          <img src={logo} alt="SkillHive Logo" />
        </div>

        <nav className="jpNav">
          {/* Proper Admin Links mapped to App.jsx nested paths */}
          <NavLink to="/admin/Dashboard" className={({ isActive }) => "jpLink" + (isActive ? " active" : "")}>
            <span className="jpIcon"><FaHouse /></span>
            <span className="jpLabel">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/Companies" className={({ isActive }) => "jpLink" + (isActive ? " active" : "")}>
            <span className="jpIcon"><FaBuilding /></span>
            <span className="jpLabel">Companies</span>
          </NavLink>

          <NavLink to="/admin/users" className={({ isActive }) => "jpLink" + (isActive ? " active" : "")}>
            <span className="jpIcon"><FaUsers /></span>
            <span className="jpLabel">Users</span>
          </NavLink>

          <NavLink to="/admin/jobs" className={({ isActive }) => "jpLink" + (isActive ? " active" : "")}>
            <span className="jpIcon"><FaBriefcase /></span>
            <span className="jpLabel">Jobs</span>
          </NavLink>


          {/* <NavLink to="/admin/reports" className={({ isActive }) => "jpLink" + (isActive ? " active" : "")}>
            <span className="jpIcon"><i className="fa-solid fa-user-group"></i></span>
            <span className="jpLabel">Reports</span>
          </NavLink>
           */}

          <NavLink to="/admin/Profile" className={({ isActive }) => "jpLink" + (isActive ? " active" : "")}>
            <span className="jpIcon"><FaUser /></span>
            <span className="jpLabel">Profile</span>
          </NavLink>
        </nav>

        <div className="jpSideFooter">
          <button className="jpLogout" onClick={logout} type="button">
            <FaCaretDown /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="jpMain">
        {/* TOPBAR */}
        <header className="jpTop">
          <div className="jpTopRight">
            <div className="jpUserWrap" ref={menuRef}>
              <button className="jpUserBtn" type="button" onClick={() => setMenuOpen((v) => !v)}>
                <div className="jpAvatar">{letter}</div>
                <div className="jpUserTxt">
                  <div className="jpUserName">{user?.name || "Admin"}</div>
                  <div className="jpUserRole">Super Admin</div>
                </div>
                <FaCaretDown className="jpCaret" />
              </button>

              {menuOpen && (
                <div className="jpUserMenu">
                  <button className="jpMenuItem danger" onClick={logout} type="button">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic component content goes here */}
        <main className="jpContent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}