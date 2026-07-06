import "./navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/SkillHiveLogo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
    } else {
      const section = document.getElementById(sectionId);
      section?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="navWrap">
      <div className="navInner">
        <div className="navLogo" onClick={() => navigate("/")}>
          <img src={logo} alt="SkillHive Logo" />
        </div>

        <nav className="navLinks">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => goToSection("recent-jobs")}>Jobs</button>
          <button onClick={() => goToSection("companies")}>Companies</button>
          <button onClick={() => navigate("/contact")}>Contact</button>
        </nav>

        <div className="navBtns">
          <button className="navBtnOutline" onClick={() => navigate("/login")}>
            Login
          </button>

          <button className="navBtnPrimary" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}