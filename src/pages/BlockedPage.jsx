import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiPhone, FiMail } from "react-icons/fi";

export default function BlockedPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f3f4f6", // Light gray background like standard block pages
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        padding: "50px 40px",
        borderRadius: "16px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -10px rgba(0, 0, 0, 0.04)",
        maxWidth: "600px",
        width: "100%",
        textAlign: "center",
        borderTop: "8px solid #dc2626" // Solid Red Top bar
      }}>
        {/* Large Red Cross / Blocked Circle Icon */}
        <div style={{
          width: "80px",
          height: "80px",
          backgroundColor: "#fee2e2",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 25px auto"
        }}>
          <span style={{ fontSize: "40px", color: "#dc2626", fontWeight: "bold" }}>✕</span>
        </div>

        <h1 style={{ color: "#111827", fontSize: "2rem", margin: "0 0 10px 0", fontWeight: "700" }}>
          Sorry, you have been blocked
        </h1>
        <p style={{ color: "#6b7280", fontSize: "1.1rem", margin: "0 0 30px 0" }}>
          You are unable to access the SkillHive portal.
        </p>

        <div style={{
          backgroundColor: "#f9fafb",
          padding: "20px",
          borderRadius: "12px",
          textAlign: "left",
          marginBottom: "35px",
          border: "1px solid #e5e7eb"
        }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#374151", fontSize: "1.05rem", fontWeight: "600" }}>
            Reason & Support:
          </h3>
          <p style={{ color: "#4b5563", fontSize: "0.95rem", lineHeight: "1.5", marginBottom: "15px" }}>
            Apka account suspicious activity ya system policies ke mutabiq temporary/permanently block kar diya gaya hai. Agar aapko lagta hai yeh galti se hua hai, toh hmaray support center se rabta karein:
          </p>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#4b5563", marginBottom: "10px", fontSize: "0.95rem" }}>
            <FiPhone style={{ color: "#dc2626" }} /> <strong>Phone:</strong> <span>+92 300 1234567</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#4b5563", fontSize: "0.95rem" }}>
            <FiMail style={{ color: "#dc2626" }} /> <strong>Email:</strong> <span>support@skillhive.com</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#111827",
            color: "#ffffff",
            border: "none",
            padding: "12px 35px",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#1f2937"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#111827"}
        >
          <FiLogOut /> Back to Login
        </button>
      </div>
    </div>
  );
}