import React, { useMemo, useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./student.css";
import api from "../../services/api";
import { FaBell, FaAngleDown , FaHouse,FaUser,FaBriefcase , FaBuilding,FaCheck} from "react-icons/fa6";
import logo from "../../assets/SkillHiveLogo.png";

export default function StudentLayout() {
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [notifOpen, setNotifOpen] = useState(false); // Notifications dropdown state
  const [notifications, setNotifications] = useState([]); // Notifications data
  const notifRef = useRef(null); // Ref for notifications dropdown

  // 1. Fetch Notifications from Backend
  useEffect(() => {
    // const fetchNotifications = async () => {
    //   try {
    //     const res = await api.get("/student/applications");
    //     // Filter: Sirf wo jobs dikhao jin par interview ka status 'in_review' hai
    //     const activeNotifs = res.data.filter(app => app.status === 'in_review');
    //     console.log("All Apps:", res.data);
    //     console.log("Filtered Notifs:", activeNotifs);
    //     setNotifications(activeNotifs);
    //   } catch (err) {
    //     console.error("Error fetching notifications", err);
    //   }
    // };
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/student/applications");
        const appsArray = Array.isArray(res.data) ? res.data : (res.data?.applications || []);

        // Sirf wo application dikhao jiska status 'in_review' ho 
        // AUR jis par waqayi interview ka remark likha ho
        const activeNotifs = appsArray.filter(app =>
          app.status === 'in_review' &&
          app.remarks === 'Interview invitation sent'
        );

        setNotifications(activeNotifs);
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };

    fetchNotifications();
    // Optional: Har 30 seconds baad refresh karein
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const name = user?.name || "Student";
  const role = user?.role || "student";
  const letter = useMemo(() => (name?.[0] || "S").toUpperCase(), [name]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    nav("/login", { replace: true });
  };

  // close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="thShell">
      {/* TOPBAR */}
      <header className="thTopbar">
        <div className="thTopbarInner">
          <div className="thBrand">
          </div>

          <div className="thTopRight">


            {/* 2. NOTIFICATION BELL WITH BADGE */}
            <div className="thUserMenu" ref={notifRef}>
              <button
                className="thIconBtn"
                title="Notifications"
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                style={{ position: 'relative' }}
              >
                <FaBell />
                {notifications.length > 0 && (
                  <span className="notifBadge">{notifications.length}</span>
                )}
              </button>

              {notifOpen && (
                <div className="thDropdown notifDropdown">
                  <div className="notifHeader">Notifications</div>
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className="notifItem" onClick={() => nav("/student/applied")}>
                        <div className="notifIcon"><i className="fa-solid fa-circle-check"></i></div>
                        <div>
                          <div className="notifText">Good News! <b>{n.project?.title}</b> invited you for an interview.</div>
                          <div className="notifTime">Check your email for details</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="notifEmpty">No new notifications</div>
                  )}
                </div>
              )}
            </div>

            <div className="thUserMenu" ref={menuRef}>
              <button
                className="thUserBtn"
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <div className="thAvatar">{letter}</div>
                <div className="thUserMeta">
                  <div className="thUserName">{name}</div>
                  <div className="thUserRole">{role}</div>
                </div>
                <div className="thCaret"><FaAngleDown /></div>
              </button>

              {menuOpen && (
                <div className="thDropdown">
                  <button className="thDropItem danger" onClick={logout} type="button">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="thBody">
        {/* SIDEBAR */}
        <aside className="thSidebar">
          <div className="thSideLogo">
            <img src={logo} alt="SkillHive Logo" />
          </div>

          <nav className="thNav">
            <NavLink to="/student/dashboard" className="thNavLink">
              <span className="thNavIcon"><FaHouse/></span> Dashboard
            </NavLink>
            <NavLink to="/student/projects" className="thNavLink">
              <span className="thNavIcon"><FaBriefcase/></span> Jobs
            </NavLink>
            <NavLink to="/student/companies" className="thNavLink">
              <span className="thNavIcon"><FaBuilding/></span> Companies
            </NavLink>
            {/* <NavLink to="/student/tracking" className="thNavLink">
              <span className="thNavIcon"><i className="fa-solid fa-file-zipper"></i></span> Tracking
            </NavLink> */}
            {/* <NavLink to="/student/messages" className="thNavLink">
              <span className="thNavIcon"><i className="fa-solid fa-message"></i></span> Messages
            </NavLink> */}
            <NavLink to="/student/applied" className="thNavLink">
              <span className="thNavIcon"><FaCheck /></span> Applied
            </NavLink>
            <NavLink to="/student/profile" className="thNavLink">
              <span className="thNavIcon"><FaUser/></span> Profile
            </NavLink>
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="thContent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}