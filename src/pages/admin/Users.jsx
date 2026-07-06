import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./users.module.css";
import { FaPencil,FaFilter,FaUser,FaLock,FaEye,FaTrash,FaBan,FaDownload}  from "react-icons/fa6";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeActionMenu, setActiveActionMenu] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get("http://127.0.0.1:8000/api/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users from database:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const toggleActionMenu = (id) => {
        setActiveActionMenu(activeActionMenu === id ? null : id);
    };

    const filteredUsers = users.filter((user) => {
        const nameToSearch = user.name || "";
        const emailToSearch = user.email || "";
        const userRole = user.role || "";

        return (
            userRole.toLowerCase() === "student" &&
            (
                nameToSearch.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emailToSearch.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const exportUsers = () => {
        const headers = ["Name", "Email", "Role", "Status", "Joined On"];

        const rows = filteredUsers.map((user) => [
            user.name || "No Name",
            user.email || "-",
            user.role || "Student",
            user.status || "Active",
            user.created_at ? new Date(user.created_at).toLocaleDateString() : "-",
        ]);

        const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "users-list.csv";
        link.click();

        window.URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.container}>
            <div className={styles.companiesHeader}>
                <h2>Users List</h2>

                <button className={styles.exportBtn} onClick={exportUsers}>
                    <FaDownload/>
                    Export
                </button>
            </div>

            <section className={styles.tableCard}>
                <div className={styles.toolbar}>
                    <div className={styles.searchBox}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button className={styles.filterBtn}>
                        <FaFilter/>
                    </button>
                </div>

                <div className={styles.tableWrapper}>
                    {loading ? (
                        <div className={styles.loadingState}>Loading real-time records from database...</div>
                    ) : (
                        <table className={styles.customTable}>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined On</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((user, index) => {
                                        const userName = user.name || "No Name";
                                        const userEmail = user.email || "-";
                                        const userRole = user.role || "Student";
                                        const userStatus = user.status || "Active";

                                        const joinedDate = user.created_at
                                            ? new Date(user.created_at).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })
                                            : "-";

                                        return (
                                            <tr key={user.id || index}>
                                                <td>
                                                    <div className={styles.userInfoCell}>
                                                        <div className={styles.avatar}>
                                                            {userName[0].toUpperCase()}
                                                        </div>
                                                        <span className={styles.userNameText}>{userName}</span>
                                                    </div>
                                                </td>

                                                <td>{userEmail}</td>

                                                <td>
                                                    <span
                                                        className={`${styles.badge} ${userRole.toLowerCase() === "company"
                                                                ? styles.badgeCompany
                                                                : styles.badgeStudent
                                                            }`}
                                                    >
                                                        {userRole}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`${styles.statusBadge} ${userStatus.toLowerCase() === "active"
                                                                ? styles.statusActive
                                                                : styles.statusInactive
                                                            }`}
                                                    >
                                                        {userStatus}
                                                    </span>
                                                </td>

                                                <td>{joinedDate}</td>

                                                <td className={styles.actionCell}>
                                                    <button
                                                        onClick={() => toggleActionMenu(user.id)}
                                                        className={styles.actionMenuBtn}
                                                    >
                                                        ⋮
                                                    </button>

                                                    {activeActionMenu === user.id && (
                                                        <div className={styles.actionMenuPopover}>
                                                            <div className={styles.popoverItem}><FaEye/> View Profile</div>
                                                            <div className={styles.popoverItem}><FaPencil/> Edit User</div>
                                                            <div className={styles.popoverItem}><FaLock/> Reset Password</div>
                                                            <div className={`${styles.popoverItem} ${styles.textDanger}`}>
                                                                <FaBan/> Deactivate User
                                                            </div>
                                                            <div className={`${styles.popoverItem} ${styles.textDanger}`}>
                                                                <FaTrash/> Delete User
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className={styles.emptyState}>
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {!loading && filteredUsers.length > 0 && (
                    <div className={styles.tableFooter}>
                        <span>
                            {startIndex + 1} -{" "}
                            {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
                            {filteredUsers.length} entries
                        </span>

                        <div className={styles.paginationControls}>
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                ‹
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={currentPage === i + 1 ? styles.activePageBtn : ""}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                ›
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Users;