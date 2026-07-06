import { NavLink } from "react-router-dom";
import "./companyNavbar.css";

export default function CompanyNavbar() {
  const linkClass = ({ isActive }) => (isActive ? "tab active" : "tab");

  return (
    <div className="cnav">
      {/* ✅ relative paths */}
      <NavLink to="my-projects" className={linkClass}>
        My Projects
      </NavLink>

      <NavLink to="post-project" className={linkClass}>
        Post Project
      </NavLink>

      <NavLink to="profile" className={linkClass}>
        Profile
      </NavLink>

      {/* ❌ settings route not defined in App.jsx, so removed */}
      {/* If later needed, add route then enable this */}
      {/* 
      <NavLink to="settings" className={linkClass}>
        Settings
      </NavLink> 
      */}
    </div>
  );
}
