// ==================== App.jsx ====================
import { Routes, Route, Navigate } from "react-router-dom";
import React from 'react';
import ErrorBoundary from "./pages/company/ErrorBoundary.jsx";
import Landing from "./pages/Landing/Landing.jsx";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import BlockedPage from "./pages/BlockedPage";
import CategoryJobs from "./pages/Landing/CategoryJobs.jsx";
import JobList from "./pages/Landing/JobList.jsx";
import Contact from "./pages/Landing/Contact.jsx";

// Company Components
import CompanyLayout from "./pages/company/CompanyLayout.jsx";
import CompanyDashboard from "./pages/company/CompanyDashboard.jsx";
import MyProjects from "./pages/company/MyProjects.jsx";
import PostProject from "./pages/company/PostProject.jsx";
import ManageJobs from "./pages/company/ManageJobs.jsx";
import JobCategories from "./pages/company/JobCategories";
import RecommendedMatches from "./pages/company/RecommendedMatches";
import Applicants from "./pages/company/Applicants.jsx";
import Tracking from "./pages/company/Tracking.jsx";
import Messages from "./pages/company/Messages.jsx";
import Payments from "./pages/company/Payments.jsx";
import Profile from "./pages/company/Profile.jsx";
import StudentCvPreview from "./pages/company/StudentCvPreview.jsx";
import LandingCompanyDetails from "./pages/Landing/LandingCompanyDetails.jsx";


// Student Components
import StudentLayout from "./pages/student/StudentLayout.jsx";
import StudentDashboard from "./pages/student/Dashboard";
import StudentOverview from "./pages/student/DashboardOverview.jsx";
import StudentProjects from "./pages/student/Projects.jsx";
import StudentProjectDetails from "./pages/student/ProjectDetails.jsx";
import Companies from "./pages/student/Companies.jsx";
import CompanyDetail from "./pages/student/CompanyDetail.jsx";
import StudentApplied from "./pages/student/Applied.jsx";
import StudentProfile from "./pages/student/Profile.jsx";
import StudentTracking from "./pages/student/Tracking.jsx";
import StudentMessages from "./pages/student/Messages.jsx";

// Admin Components
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Users from './pages/admin/Users.jsx'
import AdminCompanies from './pages/admin/AdminCompanies.jsx';
import AdminJobs from './pages/admin/AdminJobs.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProfile from './pages/admin/AdminProfile.jsx';
import ProtectedRoute from "./pages/components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/*Landing Page Routes*/}
      <Route path="/category/:category" element={<CategoryJobs />} />
      <Route path="/jobs" element={<JobList />} />
      <Route path="/company/:id" element={<LandingCompanyDetails />} />
      <Route path="/contact" element={<Contact />} />

      {/* 2. ADMIN NESTED ROUTES (Fixing your exact issue here) */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Jab koi direct /admin par aaye, toh index page loads companies dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="companies" element={<AdminCompanies />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
      </Route>

      {/* 3. COMPANY NESTED ROUTES */}
      <Route
        path="/company"
        element={
          <ProtectedRoute role="company">
            <CompanyLayout />
          </ProtectedRoute>
        }
      >
        
        <Route index element={<CompanyDashboard />} />
        <Route path="my-projects" element={<MyProjects />} />
        <Route path="post-project" element={<PostProject />} />
        <Route path="projects/:id/edit" element={<PostProject />} />
        <Route path="manage-jobs" element={<ManageJobs />} />
        <Route path="job-categories" element={<JobCategories />} />
        <Route path="recommended-matches/:jobId" element={<RecommendedMatches />} />
        <Route path="applicants" element={<ErrorBoundary><Applicants /></ErrorBoundary>} />
        <Route path="tracking" element={<Tracking />} />
        <Route path="messages" element={<Messages />} />
        <Route path="payments" element={<Payments />} />
        <Route path="profile" element={<Profile />} />
        <Route path="student-cv/:id" element={<StudentCvPreview />} />
        <Route path="*" element={<Navigate to="my-projects" replace />} />
      </Route>

      {/* 4. STUDENT NESTED ROUTES */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="projects" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="overview" element={<StudentOverview />} />
        <Route path="projects" element={<StudentProjects />} />
        <Route path="projects/:id" element={<StudentProjectDetails />} />
        <Route path="companies" element={<Companies />} />
        <Route path="companies/:id" element={<CompanyDetail />} />
        <Route path="applied" element={<StudentApplied />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="tracking" element={<StudentTracking />} />
        <Route path="messages" element={<StudentMessages />} />
        <Route path="*" element={<Navigate to="projects" replace />} />
      </Route>

      {/* GLOBAL FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}