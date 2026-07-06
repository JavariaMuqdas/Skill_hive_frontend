import React, { useEffect, useState } from "react";
import "./AdminProfile.css";
import { FaEnvelope, FaLock } from "react-icons/fa6";
import api from "../../services/api";

const AdminProfile = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const res = await api.get("/admin/profile");

      setFormData({
        email: res.data.admin.email || "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Password and confirm password do not match");
      return;
    }

    try {
      await api.put("/admin/profile", {
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });

      alert("Profile updated successfully");

      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="admin-profile-wrapper">
      <h2 className="page-title">Edit Profile</h2>

      <form className="profile-panel" onSubmit={handleSubmit}>
        <h3 className="section-title">My Profile</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FaLock /> New Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave empty if you do not want to change password"
            />
          </div>

          <div className="form-group">
            <label>
              <FaLock /> Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <button type="submit" className="save-btn">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default AdminProfile;