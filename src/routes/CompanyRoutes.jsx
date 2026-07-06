import { Routes, Route, Navigate } from "react-router-dom";
import PostProject from "../pages/company/PostProject";
import MyProjects from "../pages/company/MyProjects";

// ✅ simple guard
const CompanyGuard = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "company"

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "company") return <Navigate to="/unauthorized" replace />;

  return children;
};

export default function CompanyRoutes() {
  return (
    <CompanyGuard>
      <Routes>
        {/* ✅ relative paths because App has /company/* */}
        <Route path="my-projects" element={<MyProjects />} />
        <Route path="post-project" element={<PostProject />} />

        {/* ✅ default fallback */}
        <Route path="*" element={<Navigate to="my-projects" replace />} />
      </Routes>
    </CompanyGuard>
  );
}
