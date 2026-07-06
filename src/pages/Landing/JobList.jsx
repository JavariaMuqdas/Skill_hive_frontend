import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../../services/api";
import { useSearchParams } from "react-router-dom";
import {
    Bookmark,
    Briefcase,
    MapPin,
    Search
} from "lucide-react";
import "./jobList.css";

export default function JobList() {
    const [searchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);

    const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
const [location, setLocation] = useState(searchParams.get("location") || "");
const [companyId, setCompanyId] = useState(searchParams.get("company_id") || "");
    const [category, setCategory] = useState("");
    const [jobType, setJobType] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(0);
    

    const fetchJobs = async (page = 1) => {
        
        try {
            
            const response = await api.get("/jobs-list", {
    params: {
        page,
        keyword,
        location,
        category,
        job_type: jobType,
        company_id: companyId
    }
});

            const result = response.data.data;

            setJobs(result.data || []);
            setCurrentPage(result.current_page || 1);
            setLastPage(result.last_page || 1);
            setTotal(result.total || 0);
            setFrom(result.from || 0);
            setTo(result.to || 0);
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
            setJobs([]);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get("/job-categories");
            setCategories(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
    fetchJobs(1);
}, [keyword, location, category, jobType, companyId]);
//     useEffect(() => {
//     const urlKeyword = searchParams.get("keyword") || "";
//     const urlLocation = searchParams.get("location") || "";

//     setKeyword(urlKeyword);
//     setLocation(urlLocation);
// }, [searchParams]);

useEffect(() => {
    const urlKeyword = searchParams.get("keyword") || "";
    const urlLocation = searchParams.get("location") || "";
    const urlCompanyId = searchParams.get("company_id") || "";

    setKeyword(urlKeyword);
    setLocation(urlLocation);
    setCompanyId(urlCompanyId);
}, [searchParams]);

    return (
        <>
            <Navbar />

            <section className="jobListHero">
                <h1>Job List</h1>
                <p>Home / Job List</p>
            </section>

            <section className="jobListPage">
                <aside className="jobFilterBox">
                    <div className="filterGroup">
                        <h3>Search by Keywords</h3>

                        <div className="filterInput">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Job title, keywords..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filterGroup">
                        <h3>Location</h3>

                        <div className="filterInput">
                            <MapPin size={18} />
                            <input
                                type="text"
                                placeholder="City or postcode"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filterGroup">
                        <h3>Category</h3>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Choose a category...</option>

                            {categories.map((cat, index) => (
                                <option key={index} value={cat.title}>
                                    {cat.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filterGroup">
                        <h3>Job Type</h3>

                        <select
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                        >
                            <option value="">Job type</option>
                            <option value="Onsite">Onsite</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>
                </aside>

                <main className="jobListContent">
                    <div className="jobListTop">
                        <p>
                            Showing {from || 0} – {to || 0} of {total || 0} results
                        </p>

                        <button className="sortBtn" type="button">
                            Sort by Default
                        </button>
                    </div>

                    <div className="jobListCards">
                        {jobs.length === 0 ? (
                            <p>No jobs found.</p>
                        ) : (
                            jobs.map((job, index) => (
                                <div className="jobListCardd" key={job.id || index}>
                                    <div className="jobListLogo">
                                        {job.title ? job.title.charAt(0).toUpperCase() : "J"}
                                    </div>

                                    <div className="jobListInfo">
                                        <h3>
                                            {job.title}
                                            
                                        </h3>

                                        <div className="jobListMeta">
                                            <span>
                                                <Briefcase size={16} />
                                                {job.category || "General"}
                                            </span>

                                            <span>
                                                <MapPin size={16} />
                                                {job.city || "Not specified"}
                                            </span>

                                            {job.salary_min && job.salary_max && (
                                                <span>
                                                    ${job.salary_min} - ${job.salary_max}
                                                </span>
                                            )}
                                        </div>

                                        <div className="jobListTags">
                                            <span className="fullTag">
                                                {job.employment_type || job.job_type || "Full Time"}
                                            </span>

                                            {job.work_mode && (
                                                <span className="urgentTag">
                                                    {job.work_mode}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button className="jobListBookmark" type="button">
                                        <Bookmark size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {lastPage > 1 && (
                        <div className="pagination">
                            {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={page === currentPage ? "active" : ""}
                                    onClick={() => fetchJobs(page)}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </main>
            </section>
        </>
    );
}