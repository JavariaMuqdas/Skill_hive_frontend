import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    Search,
    MapPin,
    Briefcase,
    Bookmark,
    DollarSign,
    ChevronDown,
    X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../../services/api";
import "./categoryJobs.css";

export default function CategoryJobs() {
    const { category } = useParams();
    const navigate = useNavigate();

    const decodedCategory = decodeURIComponent(category || "");

    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [city, setCity] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(decodedCategory);
    const [jobType, setJobType] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setSelectedCategory(decodedCategory);
    }, [decodedCategory]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/job-categories");
                setCategories(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                setCategories([]);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);

                const response = await api.get("/category-jobs", {
                    params: {
                        category: selectedCategory,
                        keyword: keyword || undefined,
                        city: city || undefined,
                        job_type: jobType || undefined,
                    },
                });

                setJobs(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch category jobs:", error);
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [selectedCategory, keyword, city, jobType]);

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        navigate(`/category/${encodeURIComponent(value)}`);
    };

    const clearAllFilters = () => {
        setKeyword("");
        setCity("");
        setJobType("");
    };

    const removeFilter = (type) => {
        if (type === "keyword") setKeyword("");
        if (type === "city") setCity("");
        if (type === "jobType") setJobType("");
    };

    const activeFilters = useMemo(() => {
        const filters = [];

        if (keyword.trim()) {
            filters.push({
                type: "keyword",
                label: keyword,
            });
        }

        if (city.trim()) {
            filters.push({
                type: "city",
                label: city,
            });
        }

        if (jobType.trim()) {
            filters.push({
                type: "jobType",
                label: jobType,
            });
        }

        return filters;
    }, [keyword, city, jobType]);

    const formatSalary = (min, max) => {
        if (!min && !max) return "Salary not mentioned";
        if (min && max) return `${min} - ${max} / month`;
        if (min) return `${min}+ / month`;
        return `Up to ${max} / month`;
    };

    const getJobInitials = (title) => {
        if (!title) return "J";

        const words = title
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (words.length === 1) {
            return words[0].slice(0, 2).toUpperCase();
        }

        return words
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    const resultText = () => {
        if (loading) return "Loading jobs...";

        if (activeFilters.length === 0) {
            return `Showing all ${jobs.length} results`;
        }

        if (jobs.length === 1) {
            return "Showing the single result";
        }

        return `Showing ${jobs.length} results`;
    };

    return (
        <>
            <Navbar />

            <section className="catJobsHero">
                <h1>{selectedCategory}</h1>

                <div className="catBreadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <span>Jobs</span>
                    <span>/</span>
                    <strong>{selectedCategory}</strong>
                </div>
            </section>

            <section className="catJobsMainBg">
                <div className="catJobsPage">
                    <aside className="catFilterBox">
                        <div className="filterGroup">
                            <h3>Search by Keywords</h3>

                            <div className="filterInput">
                                <Search size={22} />
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
                                <MapPin size={22} />
                                <input
                                    type="text"
                                    placeholder="City or postcode"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="filterGroup">
                            <h3>Category</h3>

                            <div className="filterSelectReal">
                                <Briefcase size={20} />

                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.title} value={cat.title}>
                                            {cat.title}
                                        </option>
                                    ))}
                                </select>

                                <ChevronDown size={16} />
                            </div>
                        </div>

                        <div className="filterGroup">
                            <h3>Job type</h3>

                            <div className="filterSelectReal">
                                <select
                                    value={jobType}
                                    onChange={(e) => setJobType(e.target.value)}
                                >
                                    <option value="">Job type</option>
                                    <option value="remote">Remote</option>
                                    <option value="onsite">Onsite</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>

                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </aside>

                    <main className="catJobsListArea">
                        <h2>Your Selected</h2>

                        {activeFilters.length > 0 && (
                            <div className="selectedBar">
                                {activeFilters.map((filter) => (
                                    <button
                                        key={filter.type}
                                        className="selectedChip"
                                        type="button"
                                        onClick={() => removeFilter(filter.type)}
                                    >
                                        <X size={13} />
                                        {filter.label}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    className="clearAllBtn"
                                    onClick={clearAllFilters}
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        <div className="resultTop">
                            <p>{resultText()}</p>

                            <button className="sortBtn" type="button">
                                Sort by Default <ChevronDown size={16} />
                            </button>
                        </div>

                        <div className="categoryJobCards">
                            {!loading && jobs.length === 0 && (
                                <p className="noJobsMsg">No results found.</p>
                            )}

                            {jobs.map((job) => (
                                <div className="categoryJobCard" key={job.id}>
                                    <div className="catJobLogo">{getJobInitials(job.title)}</div>

                                    <div className="catJobContent">
                                        <div className="catJobTitleRow">
                                            <h3>{job.title}</h3>
                                            <span className="jobFeatured">Featured</span>
                                        </div>

                                        <div className="catJobMeta">
                                            <span>
                                                <Briefcase size={16} />
                                                {job.category}
                                            </span>

                                            <span>
                                                <MapPin size={16} />
                                                {job.city || "Not mentioned"}
                                            </span>

                                            <span>
                                                <DollarSign size={16} />
                                                {formatSalary(job.salary_min, job.salary_max)}
                                            </span>
                                        </div>

                                        <div className="catJobTags">
                                            <span className="blueTag">{job.job_type || "Full-time"}</span>
                                            <span className="orangeTag">Urgent</span>
                                        </div>
                                    </div>


                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </section>
        </>
    );
}