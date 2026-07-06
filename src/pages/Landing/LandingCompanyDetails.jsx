import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../../services/api";
import {
    Bookmark,
    Briefcase,
    Mail,
    MapPin,
    Phone,
    Globe,
    Linkedin,
    Facebook,
    Twitter
} from "lucide-react";
import "./LandingCompanyDetails.css";

export default function CompanyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [company, setCompany] = useState(null);
    const [openJobs, setOpenJobs] = useState(0);

    useEffect(() => {
        const fetchCompanyDetail = async () => {
            try {
                const response = await api.get(`/company-detail/${id}`);

                setCompany(response.data.data.company);
                setOpenJobs(response.data.data.open_jobs || 0);
            } catch (error) {
                console.error("Failed to fetch company detail:", error);
            }
        };

        fetchCompanyDetail();
    }, [id]);

    if (!company) {
        return (
            <>
                <Navbar />
                <p style={{ textAlign: "center", marginTop: "80px" }}>
                    Loading company...
                </p>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <section className="companyDetailHero">
                <div className="companyDetailInner">
                    <div className="companyHeroLeft">
                        <div className="companyDetailLogo">
                            {company.company_name
                                ? company.company_name.charAt(0).toUpperCase()
                                : "C"}
                        </div>

                        <div>
                            <h1>
                                {company.company_name}
                                <span>Featured</span>
                            </h1>

                            <div className="companyHeroMeta">
                                <span>
                                    <Briefcase size={16} />
                                    {company.industry || "Not specified"}
                                </span>

                                <span>
                                    <MapPin size={16} />
                                    {company.city || company.country || "Not specified"}
                                </span>

                                <span>
                                    <Phone size={16} />
                                    {company.phone || "Not specified"}
                                </span>

                                <span>
                                    <Mail size={16} />
                                    {company.company_email || "Not specified"}
                                </span>
                            </div>

                            <button
                                className="companyOpenJobBtn"
                                type="button"
                                onClick={() => navigate(`/jobs?company_id=${company.id}`)}
                            >
                                Open Job - {openJobs}
                            </button>
                        </div>
                    </div>

                    <div className="companyHeroActions">
                        <button className="privateMessageBtn" type="button">
                            Private Message
                        </button>

                        <button className="companySaveBtn" type="button">
                            <Bookmark size={18} />
                        </button>
                    </div>
                </div>
            </section>

            <section className="companyDetailPage">
                <main className="companyAbout">
                    <h2>About Company</h2>

                    <p>
                        {company.description ||
                            company.overview ||
                            company.short_description ||
                            "No company description available."}
                    </p>

                    {company.overview && (
                        <p>{company.overview}</p>
                    )}

                    {company.why_join_us && (
                        <>
                            <h2>Why Join Us</h2>
                            <p>{company.why_join_us}</p>
                        </>
                    )}

                    <div className="companySocialBox">
                        <strong>Social Profiles:</strong>

                        <span><Facebook size={17} /></span>
                        <span><Twitter size={17} /></span>
                        {company.linkedin_url && (
                            <a
                                href={company.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Linkedin size={17} />
                            </a>
                        )}
                        {company.website && (
                            <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Globe size={17} />
                            </a>
                        )}
                    </div>
                </main>

                <aside className="companyInfoBox">
                    <div className="companyInfoRow">
                        <strong>Categories:</strong>
                        <span>{company.industry || "Not specified"}</span>
                    </div>

                    <div className="companyInfoRow">
                        <strong>Founded Date:</strong>
                        <span>{company.founded_year || "Not specified"}</span>
                    </div>

                    <div className="companyInfoRow">
                        <strong>Company Size:</strong>
                        <span>{company.company_size || "Not specified"}</span>
                    </div>

                    <div className="companyInfoRow">
                        <strong>Total Employees:</strong>
                        <span>{company.total_employees || "Not specified"}</span>
                    </div>

                    <div className="companyInfoRow">
                        <strong>Location:</strong>
                        <span>{company.city || company.country || "Not specified"}</span>
                    </div>

                    <div className="companyInfoRow">
                        <strong>Phone Number:</strong>
                        <span>{company.phone || "Not specified"}</span>
                    </div>

                    <div className="companyInfoRow">
                        <strong>Email:</strong>
                        <span>{company.company_email || "Not specified"}</span>
                    </div>

                    <div className="companyInfoRow">
                        <strong>Socials:</strong>
                        <span className="companySocials">
                            <Facebook size={16} />
                            <Twitter size={16} />
                            <Linkedin size={16} />
                            <Globe size={16} />
                        </span>
                    </div>

                    {company.website && (
                        <a
                            className="companyWebsiteBtn"
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {company.website}
                        </a>
                    )}
                </aside>
            </section>
        </>
    );
}