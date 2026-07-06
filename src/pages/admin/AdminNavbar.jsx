// src/components/admin/AdminNavbar.jsx
import React from 'react';
import './adminnavbar.css';

const AdminNavbar = ({ pageTitle, subTitle, searchTerm, setSearchTerm }) => {
    return (
        <header className="top-navbar">
            <div className="breadcrumb">
                <h3>{pageTitle || 'Admin Panel'}</h3>
                <p>Dashboard &gt; <span>{subTitle || 'Overview'}</span></p>
            </div>

            <div className="navbar-right">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search anything..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="notification-bell">🔔</div>
                <div className="admin-profile">
                    <div className="avatar">A</div>
                    <div className="admin-info">
                        <h4>Admin</h4>
                        <p>Super Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
