import React, { useEffect, useState } from "react";
// import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "./landing.css";
import { FaFacebookF,FaInstagram,FaTwitter,FaLinkedinIn } from "react-icons/fa";
import heroBgImg from "../../assets/3644996.png";
import {
    FaGraduationCap,
    FaLandmark,
    FaBookOpen,
    FaHandshake,
    FaGlobe,
    FaMedal,
    FaDollarSign,
    FaClock,
    FaArrowRight,
    FaChevronLeft,
    FaChevronRight,
    FaLocationDot,
    FaShieldHalved,
    FaLayerGroup,
    FaRibbon,
    FaBook,
} from "react-icons/fa6";

import {
    Bookmark, Facebook, Twitter, Instagram, Linkedin, ArrowUp,
    Search, MapPin, FileText, MessageSquare,
    BadgeCheck, Users, BarChart3, ShieldCheck,
    Zap, ArrowRight, Briefcase, Code, Palette,
    PenTool, TrendingUp, Headphones, ChevronRight, ChevronLeft,
    GraduationCap, Globe, BookOpen, Award, Clock, DollarSign, FlaskConical
} from "lucide-react";
import api from "../../services/api";
/* ─────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────── */
// const companies = [
//     { name: "Google", logo: "🔵" },
//     { name: "Microsoft", logo: "🟦" },
//     { name: "Amazon", logo: "🟠" },
//     { name: "Meta", logo: "🔷" },
//     { name: "Apple", logo: "⬛" },
//     { name: "Netflix", logo: "🔴" },
// ];

const companies = [
    {
        name: "Sagments",
        location: "New York",
        logo: "S",
        jobs: 2,
        className: "sagments",
    },
    {
        name: "Upwork",
        location: "New York",
        logo: "Up",
        jobs: 3,
        className: "upwork",
    },
    {
        name: "Invision",
        location: "Miami",
        logo: "in",
        jobs: 1,
        className: "invision",
    },
    {
        name: "Stripe",
        location: "Los Angeles",
        logo: "S",
        jobs: 1,
        className: "stripe",
    },
];

// const categories = [
//     { icon: <Code size={26} />, title: "Software Development", jobs: "12,400+", color: "cat-blue" },
//     { icon: <Palette size={26} />, title: "Graphic Designer", jobs: "5,200+", color: "cat-purple" },
//     { icon: <TrendingUp size={26} />, title: "Marketing", jobs: "7,800+", color: "cat-green" },
//     { icon: <Briefcase size={26} />, title: "App Development", jobs: "9,100+", color: "cat-orange" },
//     { icon: <PenTool size={26} />, title: "Writing", jobs: "3,300+", color: "cat-pink" },
//     { icon: <Headphones size={26} />, title: "Support", jobs: "4,600+", color: "cat-teal" },
//     { icon: <BarChart3 size={26} />, title: "Finance", jobs: "6,700+", color: "cat-indigo" },
//     { icon: <Users size={26} />, title: "HR", jobs: "2,900+", color: "cat-red" },
// ];



// const featuredJobs = [
//     {
//         title: "Junior Graphic Designer (Web)",
//         company: "Design",
//         location: "New York",
//         type: "Full-time",
//         logo: "O",
//         urgent: true,
//     },
//     {
//         title: "Finance Manager & Health",
//         company: "Design",
//         location: "New York",
//         type: "Full-time",
//         logo: "M",
//         urgent: true,
//     },
//     {
//         title: "General Ledger Accountant",
//         company: "Design",
//         location: "New York",
//         type: "Full-time",
//         logo: "Up",
//     },
//     {
//         title: "Junior Graphic Designer (Web)",
//         company: "Design",
//         location: "New York",
//         type: "Full-time",
//         logo: "O",
//         urgent: true,
//     },
//     {
//         title: "Finance Manager & Health",
//         company: "Design",
//         location: "New York",
//         type: "Full-time",
//         logo: "M",
//         urgent: true,
//     },
//     {
//         title: "General Ledger Accountant",
//         company: "Design",
//         location: "New York",
//         type: "Full-time",
//         logo: "Up",
//     },
//     {
//         title: "Junior Graphic Designer (Web)",
//         company: "Design",
//         location: "New York",
//         type: "Full-time",
//         logo: "O",
//         urgent: true,
//     },
//     {
//         title: "Finance Manager & Health",
//         company: "Design",
//         location: "New York",
//         type: "Full-time",
//         logo: "M",
//         urgent: true,
//     },
//     {
//         title: "General Ledger Accountant",
//         company: "Design",
//         location: "New York",
//         type: "Full-time",
//         logo: "Up",
//     },
// ];

/* ─────────────────────────────────────────────
   SCHOLARSHIP DATA
───────────────────────────────────────────── */
const SCH_CATEGORIES = [
    { key: "national", label: "National", icon: FaLandmark, },
    { key: "international", label: "International", icon: FaLayerGroup, },
    { key: "bs", label: "BS / Undergrad", icon: FaGraduationCap, },
    { key: "masters", label: "Masters / MS", icon: FaBook, },
    { key: "phd", label: "PhD / Doctoral", icon: FaMedal, },
    { key: "female", label: "Female-only", icon: FaRibbon, },
];

const SCHOLARSHIPS = {
    national: [
        {
            title: "Ehsaas Undergraduate Scholarship",
            provider: "Government of Pakistan / HEC",
            logo: FaLandmark, amount: "Fully Funded", deadline: "Rolling Admissions",
            type: "Need-based", typeCls: "badge-need",
            desc: "One of Pakistan's largest scholarship programs. Covers full tuition and a monthly stipend. 50% of seats are reserved for female students enrolled in public universities.",
            pills: ["Public University", "50% Female Seats", "Tuition + Stipend"],
            link: "https://ehsaas.hec.gov.pk",
            linkLabel: "ehsaas.hec.gov.pk",
        },
        {
            title: "PEEF Scholarship",
            provider: "Punjab Educational Endowment Fund",
            logo: FaLandmark, amount: "Tuition Support", deadline: "Annual",
            type: "Merit + Need", typeCls: "badge-merit",
            desc: "Very popular provincial scholarship for Punjab students. Supports Intermediate through BS programs, awarded on combined academic merit and financial need basis.",
            pills: ["Punjab Province", "Intermediate → BS", "Merit + Need"],
            link: "https://www.peef.org.pk",
            linkLabel: "peef.org.pk",
        },
        {
            title: "HEC Need-Based Scholarship",
            provider: "Higher Education Commission",
            logo: FaLandmark, amount: "Tuition + Stipend", deadline: "Semester-wise",
            type: "Need-based", typeCls: "badge-need",
            desc: "Provided by HEC to financially deserving students in selected universities across Pakistan. Covers tuition fees and a monthly stipend throughout the degree program.",
            pills: ["HEC", "Selected Universities", "All Provinces"],
            link: "https://www.hec.gov.pk/english/scholarshipsgrants/NBS/Pages/default.aspx",
            linkLabel: "hec.gov.pk — Need-Based",
        },
        {
            title: "BISP Undergraduate Scholarship",
            provider: "Government of Pakistan + HEC",
            logo: FaLandmark, amount: "Financial Assistance", deadline: "Annual",
            type: "Need-based", typeCls: "badge-need",
            desc: "Offered under the Benazir Income Support Programme. Targets low-income families to reduce education inequality and provide financial assistance for BS-level students.",
            pills: ["Low-income Families", "BS Level", "Equality Initiative"],
            link: "https://bisp.gov.pk",
            linkLabel: "bisp.gov.pk",
        },
        {
            title: "LUMS National Outreach Programme",
            provider: "Lahore University of Management Sciences",
            logo: FaLandmark, amount: "Fully Funded", deadline: "January – February",
            type: "Fully Funded", typeCls: "badge-full",
            desc: "Prestigious university-based scholarship at one of Pakistan's top private institutions. Covers full tuition plus living expenses for talented but financially constrained students.",
            pills: ["Full Tuition", "Living Expenses", "LUMS"],
            link: "https://nop.lums.edu.pk",
            linkLabel: "nop.lums.edu.pk",
        },
        {
            title: "SIBA Talent Hunt Program (STHP)",
            provider: "Sindh Institute of Business Administration",
            logo: FaLandmark, amount: "Tuition Support", deadline: "Annual",
            type: "Merit + Need", typeCls: "badge-merit",
            desc: "Targeted at Sindh-based students in Engineering, IT, and Business fields. Awarded on a merit-and-need basis — a great opportunity for students from Sindh.",
            pills: ["Sindh Province", "Engineering / IT / Business", "Merit + Need"],
            link: "https://www.iobm.edu.pk/talent-hunt-scholarship/",
            linkLabel: "iobm.edu.pk/talent-hunt",
        },
        {
            title: "Diya Pakistan Scholarship",
            provider: "Diya Pakistan (NGO)",
            logo: FaLandmark, amount: "Partial Financial Support", deadline: "Rolling",
            type: "Need-based", typeCls: "badge-need",
            desc: "NGO-based scholarship providing partial financial support for BS, MS, and PhD students. Focused on enabling underprivileged students to access quality higher education.",
            pills: ["BS / MS / PhD", "NGO-backed", "Partial Aid"],
            link: "https://www.diyapakistan.org",
            linkLabel: "diyapakistan.org",
        },
        {
            title: "Scottish Scholarship (Females)",
            provider: "Government of Pakistan",
            logo: FaLandmark, amount: "Fully Funded", deadline: "Annual",
            type: "Fully Funded", typeCls: "badge-full",
            desc: "Government-supported fully funded initiative exclusively for female students. Covers fields of Education, Health, and Agriculture to promote women's access to higher education.",
            pills: ["Females Only", "Education / Health / Agri", "Govt Supported"],
            link: "https://www.hec.gov.pk/english/scholarshipsgrants/Pages/NationalScholarships.aspx",
            linkLabel: "hec.gov.pk — National Scholarships",
        },
        {
            title: "Provincial Benevolent Fund",
            provider: "Punjab / KP Governments",
            logo: FaLandmark, amount: "Varies by Province", deadline: "Annual",
            type: "Need-based", typeCls: "badge-need",
            desc: "Available in Punjab and KP provinces for children of government employees. Offered at multiple education levels from intermediate to graduate programs.",
            pills: ["Govt Employees' Children", "Punjab / KP", "Multiple Levels"],
            link: "https://finance.gov.pk",
            linkLabel: "finance.gov.pk",
        },
    ],
    international: [
        {
            title: "Chevening Scholarship",
            provider: "UK Foreign Commonwealth & Development Office",
            logo: FaLayerGroup, amount: "Fully Funded", deadline: "November (annual)",
            type: "Merit-based", typeCls: "badge-merit",
            desc: "UK government's flagship scholarship for future global leaders. Covers full tuition, living allowance, return flights, and visa costs for one-year Masters programs at UK universities.",
            pills: ["UK", "Masters (1 Year)", "Future Leaders"],
            link: "https://www.chevening.org/scholarships/",
            linkLabel: "chevening.org",
        },
        {
            title: "Fulbright Scholarship",
            provider: "US Embassy / HEC Pakistan",
            logo: FaLayerGroup, amount: "Fully Funded", deadline: "April (annual)",
            type: "Merit-based", typeCls: "badge-merit",
            desc: "Prestigious US government scholarship for Pakistani professionals and students. Fully funded Masters and PhD programs at leading American universities. Highly competitive.",
            pills: ["USA", "Masters / PhD", "Highly Prestigious"],
            link: "https://www.fulbright.org.pk",
            linkLabel: "fulbright.org.pk",
        },
        {
            title: "DAAD Scholarship",
            provider: "German Academic Exchange Service",
            logo: FaLayerGroup, amount: "€934 / month +", deadline: "Varies by program",
            type: "Merit-based", typeCls: "badge-merit",
            desc: "German government scholarship for postgraduate and doctoral study in Germany. Includes monthly stipend, health insurance, and travel allowance. Many programs available in English.",
            pills: ["Germany", "Masters / PhD", "English Programs OK"],
            link: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
            linkLabel: "daad.de",
        },
        {
            title: "Commonwealth Scholarship",
            provider: "Commonwealth Secretariat",
            logo: FaLayerGroup, amount: "Fully Funded", deadline: "Country-specific",
            type: "Merit-based", typeCls: "badge-merit",
            desc: "Open to citizens of Commonwealth nations. Covers postgraduate and doctoral programs at top UK universities. Focuses on candidates who can drive positive change in their home country.",
            pills: ["UK Universities", "PG / PhD", "Commonwealth Citizens"],
            link: "https://cscuk.fcdo.gov.uk/apply/",
            linkLabel: "cscuk.fcdo.gov.uk",
        },
        {
            title: "Erasmus+ Scholarship",
            provider: "European Union",
            logo: FaLayerGroup, amount: "€700 – €1,000 / month", deadline: "Varies by university",
            type: "Merit-based", typeCls: "badge-merit",
            desc: "EU-funded scholarship enabling study at top European universities. Covers tuition, living stipend, and travel costs. Available for Bachelor, Masters, and Doctorate students.",
            pills: ["Europe", "All Levels", "Exchange Program"],
            link: "https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/studying-abroad",
            linkLabel: "erasmus-plus.ec.europa.eu",
        },
        {
            title: "Australia Awards",
            provider: "Australian Government (DFAT)",
            logo: FaLayerGroup, amount: "Fully Funded", deadline: "April – June",
            type: "Merit + Need", typeCls: "badge-merit",
            desc: "Fully funded scholarship for Pakistani students for Masters programs in Australia. Covers tuition, living expenses, flights, and health cover. Strong focus on development sectors.",
            pills: ["Australia", "Masters", "Development Focus"],
            link: "https://www.australiaawards.gov.au",
            linkLabel: "australiaawards.gov.au",
        },
    ],
    bs: [
        {
            title: "Ehsaas Undergraduate Scholarship",
            provider: "Government of Pakistan / HEC",
            logo: FaGraduationCap, amount: "Fully Funded", deadline: "Rolling",
            type: "Need-based", typeCls: "badge-need",
            desc: "Pakistan's flagship undergraduate need-based scholarship. Full tuition coverage plus monthly stipend at public universities, with 50% seats reserved for female students.",
            pills: ["BS Level", "Public University", "Need-based"],
            link: "https://ehsaas.hec.gov.pk",
            linkLabel: "ehsaas.hec.gov.pk",
        },
        {
            title: "PEEF BS Scholarship",
            provider: "Punjab Educational Endowment Fund",
            logo: FaGraduationCap, amount: "Tuition Support", deadline: "Annual",
            type: "Merit + Need", typeCls: "badge-merit",
            desc: "One of the most widely used provincial scholarships in Pakistan, specifically supporting Intermediate to BS-level students in Punjab on a merit-and-need basis.",
            pills: ["BS", "Punjab", "Annual Cycle"],
            link: "https://www.peef.org.pk",
            linkLabel: "peef.org.pk",
        },
        {
            title: "LUMS National Outreach Programme",
            provider: "LUMS",
            logo: FaGraduationCap, amount: "Fully Funded", deadline: "January – February",
            type: "Fully Funded", typeCls: "badge-full",
            desc: "Full undergraduate scholarship at LUMS for talented but financially constrained students. Covers full tuition, accommodation, and all living expenses for the duration of the degree.",
            pills: ["BS", "LUMS", "Full Coverage"],
            link: "https://nop.lums.edu.pk",
            linkLabel: "nop.lums.edu.pk",
        },
        {
            title: "BISP Undergraduate",
            provider: "Government of Pakistan + HEC",
            logo: FaGraduationCap, amount: "Financial Assistance", deadline: "Annual",
            type: "Need-based", typeCls: "badge-need",
            desc: "Financial assistance for BS students from low-income families under the Benazir Income Support Programme. Part of the government's broader social protection agenda.",
            pills: ["BS", "Low-income", "Govt + HEC"],
            link: "https://bisp.gov.pk",
            linkLabel: "bisp.gov.pk",
        },
        {
            title: "STHP — Sindh Talent Hunt",
            provider: "SIBA, Sindh Government",
            logo: FaGraduationCap, amount: "Tuition Support", deadline: "Annual",
            type: "Merit + Need", typeCls: "badge-merit",
            desc: "Targets undergraduate students from Sindh in Engineering, IT, and Business disciplines. A strong provincial option for BS-level applicants with academic merit.",
            pills: ["BS", "Sindh", "Engineering / IT / Business"],
            link: "https://www.iobm.edu.pk/talent-hunt-scholarship/",
            linkLabel: "iobm.edu.pk/talent-hunt",
        },
    ],
    masters: [
        {
            title: "HEC MS Leading to PhD",
            provider: "Higher Education Commission",
            logo: FaBook, amount: "Fully Funded", deadline: "Semester-wise",
            type: "Merit-based", typeCls: "badge-merit",
            desc: "HEC's flagship program to develop future PhD scholars within Pakistan. Covers MS fees and monthly stipend at top domestic universities with expectation of PhD enrollment.",
            pills: ["MS → PhD Track", "HEC", "Research Focus"],
            link: "https://www.hec.gov.pk/english/scholarshipsgrants/Pages/NationalScholarships.aspx",
            linkLabel: "hec.gov.pk — National Scholarships",
        },
        {
            title: "Fulbright Masters",
            provider: "US Embassy / HEC Pakistan",
            logo: FaBook, amount: "Fully Funded", deadline: "April (annual)",
            type: "Merit-based", typeCls: "badge-merit",
            desc: "For Pakistani professionals seeking a Masters degree at a top US university. Fully funded including tuition, living allowance, and health insurance. Extremely competitive and prestigious.",
            pills: ["Masters", "USA", "Mid-career Professionals"],
            link: "https://www.fulbright.org.pk",
            linkLabel: "fulbright.org.pk",
        },
        {
            title: "Chevening Masters",
            provider: "UK Government",
            logo: FaBook, amount: "Fully Funded", deadline: "November (annual)",
            type: "Merit-based", typeCls: "badge-merit",
            desc: "UK government's premier scholarship for one-year Masters programs. Fully funded including tuition, monthly stipend, return airfare, and visa costs at any UK university.",
            pills: ["Masters (1 Year)", "UK", "Leadership Focus"],
            link: "https://www.chevening.org/scholarships/",
            linkLabel: "chevening.org",
        },
        {
            title: "DAAD Masters Germany",
            provider: "German Academic Exchange Service",
            logo: FaBook, amount: "€934 / month +", deadline: "Varies by program",
            type: "Merit-based", typeCls: "badge-merit",
            desc: "Comprehensive funding for Masters study across Germany. Includes monthly living stipend, health insurance, and travel allowance. Hundreds of English-medium programs available.",
            pills: ["Masters", "Germany", "English Programs"],
            link: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
            linkLabel: "daad.de",
        },
        {
            title: "Australia Awards Masters",
            provider: "Australian Government",
            logo: FaBook, amount: "Fully Funded", deadline: "April – June",
            type: "Merit + Need", typeCls: "badge-merit",
            desc: "Fully funded Masters scholarship for Pakistani students in Australia. Covers all tuition, living expenses, flights, and Overseas Student Health Cover for the duration of study.",
            pills: ["Masters", "Australia", "Full Coverage"],
            link: "https://www.australiaawards.gov.au",
            linkLabel: "australiaawards.gov.au",
        },
    ],
    phd: [
        {
            title: "HEC Indigenous PhD",
            provider: "Higher Education Commission",
            logo: FaMedal, amount: "Fully Funded", deadline: "Semester-wise",
            type: "Merit-based", typeCls: "badge-merit",
            desc: "HEC's flagship domestic doctoral program. Covers all tuition fees and a monthly stipend for full-time PhD research at accredited Pakistani universities.",
            pills: ["PhD", "Pakistan", "Full Funding"],
            link: "https://www.hec.gov.pk/english/scholarshipsgrants/Pages/NationalScholarships.aspx",
            linkLabel: "hec.gov.pk — National Scholarships",
        },
        {
            title: "HEC Overseas PhD",
            provider: "Higher Education Commission",
            logo: FaMedal, amount: "Fully Funded", deadline: "Annual",
            type: "Merit-based", typeCls: "badge-merit",
            desc: "Sends Pakistani scholars abroad for doctoral programs at world-ranked universities. Fully funded: tuition, monthly stipend, return flights, and health insurance included.",
            pills: ["PhD", "Abroad", "Fully Funded"],
            link: "https://www.hec.gov.pk/english/scholarshipsgrants/Pages/OverseasScholarships.aspx",
            linkLabel: "hec.gov.pk — Overseas Scholarships",
        },
        {
            title: "Fulbright PhD",
            provider: "US Embassy",
            logo: FaMedal, amount: "Fully Funded", deadline: "April (annual)",
            type: "Merit-based", typeCls: "badge-merit",
            desc: "Doctoral-level Fulbright award for Pakistani scholars pursuing PhD programs at top US universities. Fully funded and globally prestigious — one of the most competitive awards available.",
            pills: ["PhD", "USA", "Globally Prestigious"],
            link: "https://www.fulbright.org.pk",
            linkLabel: "fulbright.org.pk",
        },
        {
            title: "Commonwealth PhD",
            provider: "Commonwealth Secretariat",
            logo: FaMedal, amount: "Fully Funded", deadline: "Country-specific",
            type: "Merit-based", typeCls: "badge-merit",
            desc: "Fully funded doctoral study at leading UK universities for Commonwealth citizens. Focuses on candidates with the potential to make a meaningful development impact in their home country.",
            pills: ["PhD", "UK Universities", "Commonwealth"],
            link: "https://cscuk.fcdo.gov.uk/apply/",
            linkLabel: "cscuk.fcdo.gov.uk",
        },
        {
            title: "DAAD PhD Fellowship",
            provider: "German Academic Exchange Service",
            logo: FaMedal, amount: "€1,200 / month +", deadline: "Varies by program",
            type: "Merit-based", typeCls: "badge-merit",
            desc: "Research-focused doctoral fellowship in Germany. Covers monthly living stipend, health insurance, and travel. Strong in STEM, social sciences, and engineering disciplines.",
            pills: ["PhD", "Germany", "Research Focus"],
            link: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
            linkLabel: "daad.de",
        },
        {
            title: "Diya Pakistan PhD Support",
            provider: "Diya Pakistan (NGO)",
            logo: FaMedal, amount: "Partial Aid", deadline: "Rolling",
            type: "Need-based", typeCls: "badge-need",
            desc: "NGO-based partial financial support for PhD students from low-income backgrounds. Designed to help bridge financial gaps during doctoral research in Pakistan or abroad.",
            pills: ["PhD", "NGO", "Need-based"],
            link: "https://www.diyapakistan.org",
            linkLabel: "diyapakistan.org",
        },
    ],
    female: [
        {
            title: "Scottish Scholarship",
            provider: "Government of Pakistan",
            logo: FaRibbon, amount: "Fully Funded", deadline: "Annual",
            type: "Fully Funded", typeCls: "badge-full",
            desc: "Government-supported fully funded initiative exclusively for female students. Covers programs in Education, Health, and Agriculture to promote women's access to higher education in Pakistan.",
            pills: ["Females Only", "Govt Supported", "Education / Health / Agri"],
            link: "https://www.hec.gov.pk/english/scholarshipsgrants/Pages/NationalScholarships.aspx",
            linkLabel: "hec.gov.pk — National Scholarships",
        },
        {
            title: "Ehsaas (50% Female Quota)",
            provider: "Government of Pakistan",
            logo: FaRibbon, amount: "Fully Funded", deadline: "Rolling",
            type: "Need-based", typeCls: "badge-need",
            desc: "Open to all, but 50% of all Ehsaas scholarship seats are reserved specifically for female students — making it one of the most impactful programs for women's higher education in Pakistan.",
            pills: ["50% Female Quota", "Public University", "Need-based"],
            link: "https://ehsaas.hec.gov.pk",
            linkLabel: "ehsaas.hec.gov.pk",
        },
        {
            title: "Women in Tech — Microsoft",
            provider: "Microsoft",
            logo: FaRibbon, amount: "$7,500", deadline: "Apr 30, 2026",
            type: "Merit-based", typeCls: "badge-merit",
            desc: "Microsoft's scholarship encouraging gender diversity in technology. Open to women pursuing STEM degrees at universities in the USA or UK. Awarded on academic merit.",
            pills: ["Females Only", "STEM Fields", "USA / UK"],
            link: "https://www.microsoft.com/en-us/diversity/programs/women-in-stem-scholarship",
            linkLabel: "microsoft.com/scholarships",
        },
        {
            title: "Google Generation Scholarship",
            provider: "Google",
            logo: FaRibbon, amount: "$10,000", deadline: "Mar 15, 2026",
            type: "Merit-based", typeCls: "badge-merit",
            desc: "Google's scholarship program supporting aspiring computer scientists, with special focus on women and underrepresented groups. Open globally to undergraduate and graduate students.",
            pills: ["Computer Science", "Global", "Women Encouraged"],
            link: "https://buildyourfuture.withgoogle.com/scholarships/google-scholarship-recipients",
            linkLabel: "buildyourfuture.withgoogle.com",
        },
        {
            title: "PEEF Female Priority",
            provider: "Punjab Educational Endowment Fund",
            logo: FaRibbon, amount: "Tuition Support", deadline: "Annual",
            type: "Merit + Need", typeCls: "badge-merit",
            desc: "PEEF gives priority consideration to female applicants across Punjab, especially for students from rural and underserved districts. Covers BS-level tuition fees.",
            pills: ["Females Priority", "Punjab", "BS Level"],
            link: "https://www.peef.org.pk",
            linkLabel: "peef.org.pk",
        },
    ],
};

const SCH_SUMMARY_STATS = [
    { icon: <GraduationCap size={18} />, val: "1,200+", lbl: "Scholarships Listed" },
    { icon: <Globe size={18} />, val: "80+", lbl: "Countries" },
    { icon: <BookOpen size={18} />, val: "50+", lbl: "Fields of Study" },
    { icon: <Award size={18} />, val: "$2M+", lbl: "Awarded Annually" },
];

/* ─────────────────────────────────────────────
   SCHOLARSHIP SLIDER
───────────────────────────────────────────── */
function ScholarshipSlider() {
    const [activeCat, setActiveCat] = useState("national");

    const items = SCHOLARSHIPS[activeCat] || [];
    const handleCat = (key) => setActiveCat(key);

    const renderCards = (isDuplicate = false) => (
        items.map((s) => (
            <div
                className="schCard"
                key={`${isDuplicate ? "duplicate" : "main"}-${s.title}`}
                aria-hidden={isDuplicate ? "true" : undefined}
            >
                <div className="schCardTop">
                    <div className="schLogo"><s.logo /></div>
                    <span className={`schTypeBadge ${s.typeCls}`}>{s.type}</span>
                </div>

                <h4 className="schTitle">{s.title}</h4>
                <p className="schProvider">{s.provider}</p>
                <p className="schDesc">{s.desc}</p>

                <div className="schPills">
                    {s.pills.slice(0, 2).map((p) => (
                        <span key={p} className="schPill">{p}</span>
                    ))}
                </div>

                <div className="schCardBottom">
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="schApplyBtn">
                        Apply Now <ArrowRight size={16} />
                    </a>

                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="schWebsiteLink">
                        <Globe size={15} /> {s.linkLabel}
                    </a>
                </div>
            </div>
        ))
    );

    return (
        <>
            <div className="schSummary">
                {SCH_SUMMARY_STATS.map((s, i) => (
                    <div key={i} className="schSumItem">
                        <span className="schSumIco">{s.icon}</span>
                        <span><strong>{s.val}</strong> {s.lbl}</span>
                    </div>
                ))}
            </div>

            <div className="schTabs">
                {SCH_CATEGORIES.map((c) => {
                    const Icon = c.icon;

                    return (
                        <button
                            key={c.key}
                            className={`schTab${activeCat === c.key ? " active" : ""}`}
                            onClick={() => handleCat(c.key)}
                            type="button"
                        >
                            <Icon size={16} />
                            <span>{c.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="schSliderArea">
                <div className="schSliderWrap" aria-label="Featured scholarships">
                    <div className="schTrack" key={activeCat}>
                        <div className="schTrackGroup">
                            {renderCards(false)}
                        </div>
                        <div className="schTrackGroup" aria-hidden="true">
                            {renderCards(true)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ─────────────────────────────────────────────
   MAIN LANDING PAGE
───────────────────────────────────────────── */
export default function Landing() {
    const navigate = useNavigate();
    const [recentJobs, setRecentJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [topCompanies, setTopCompanies] = useState([]);
    const [platformStats, setPlatformStats] = useState({
        active_users: 0,
        companies: 0,
        jobs_posted: 0,
    });

    const [heroKeyword, setHeroKeyword] = useState("");
    const [heroLocation, setHeroLocation] = useState("");

    const formatStat = (number) => {
        return `${number}+`;
    };
    const handlePopularSearch = (keyword) => {
        setHeroKeyword(keyword);
        navigate(`/jobs?keyword=${encodeURIComponent(keyword)}`);
    };
    const handleHeroSearch = () => {
        const params = new URLSearchParams();

        if (heroKeyword.trim()) {
            params.set("keyword", heroKeyword.trim());
        }

        if (heroLocation.trim()) {
            params.set("location", heroLocation.trim());
        }

        navigate(`/jobs?${params.toString()}`);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryIcons = [
                    <Code size={30} />,
                    <Palette size={30} />,
                    <TrendingUp size={30} />,
                    <Briefcase size={30} />,
                    <PenTool size={30} />,
                    <Headphones size={30} />,
                    <BarChart3 size={30} />,
                    <Users size={30} />,
                ];

                const response = await api.get("/job-categories");

                console.log("Category API response:", response.data);

                const dbCategories = response.data.data || [];

                const formattedCategories = dbCategories.map((cat, index) => ({
                    title: cat.title,
                    jobs: cat.jobs,
                    icon: categoryIcons[index] || <Briefcase size={30} />,
                    isBlank: false,
                }));

                const blankCount = Math.max(0, 8 - formattedCategories.length);

                const blankCards = Array.from({ length: blankCount }, () => ({
                    title: "",
                    jobs: "",
                    icon: null,
                    isBlank: true,
                }));

                setCategories([...formattedCategories, ...blankCards]);
            } catch (error) {
                console.error("Failed to fetch job categories:", error);
                setCategories([]);
            }
        };

        fetchCategories();
    }, []);
    useEffect(() => {
        const fetchRecentJobs = async () => {
            try {
                const response = await api.get("/recent-jobs");

                const jobs = response.data.data || [];

                setRecentJobs(jobs);
            } catch (error) {
                console.error("Failed to fetch recent jobs:", error);
                setRecentJobs([]);
            }
        };

        fetchRecentJobs();
    }, []);
    useEffect(() => {
        const fetchPlatformStats = async () => {
            try {
                const response = await api.get("/platform-stats");
                setPlatformStats(response.data.data || {
                    active_users: 0,
                    companies: 0,
                    jobs_posted: 0,
                });
            } catch (error) {
                console.error("Failed to fetch platform stats:", error);
            }
        };
        fetchPlatformStats();
    }, []);
    useEffect(() => {
        const fetchTopCompanies = async () => {
            try {
                const response = await api.get("/top-companies");
                setTopCompanies(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch top companies:", error);
                setTopCompanies([]);
            }
        };

        fetchTopCompanies();
    }, []);
    return (
        <>
            <div className="landingNavShell">
                <Navbar />
            </div>

            {/* ── HERO ── */}
            <section className="hero heroModern" id="home">
                <div className="heroLeft">
                    <div className="heroBadge">
                        <FaShieldHalved />
                        Skill-based hiring made simple
                    </div>

                    <h2 className="heroHeading">
                        Find your next opportunity with
                        <span className="heroAccent"> SkillHive</span>
                    </h2>
                    <p className="heroDesc">
                        Discover jobs, internships and career opportunities matched with your real skills, experience and goals.
                    </p>

                    <div className="heroHighlights">
                        <span><BadgeCheck size={17} /> Verified companies</span>
                        <span><Zap size={17} /> Smart matching</span>
                        <span><ShieldCheck size={17} /> Secure hiring</span>
                    </div>

                    <div className="searchBox">
                        <div className="searchField">
                            <Search size={18} className="searchIco" />
                            <input
                                type="text"
                                placeholder="Job title, keywords or company"
                                value={heroKeyword}
                                onChange={(e) => setHeroKeyword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleHeroSearch();
                                    }
                                }}
                            />
                        </div>

                        <div className="searchDivider" />

                        <div className="searchField">
                            <MapPin size={18} className="searchIco" />
                            <input
                                type="text"
                                placeholder="All Location"
                                value={heroLocation}
                                onChange={(e) => setHeroLocation(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleHeroSearch();
                                    }
                                }}
                            />
                        </div>

                        <button className="searchBtn" onClick={handleHeroSearch}>
                            Find Jobs
                        </button>
                    </div>
                    <div className="popularTags">
                        <span className="tagLabel">Popular Searches :</span>
                        {["Designer", "Developer", "Tester", "Writing", "Project Manager"].map(t => (
                            <button
                                key={t}
                                className="tag"
                                type="button"
                                onClick={() => handlePopularSearch(t)}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="heroRight">
                    {/* ── UPDATED HERO VISUAL with real image ── */}
                    <div className="heroVisual">
                        <div className="heroVisualTopline">
                            <span>Career Match</span>
                            <strong>Live Jobs</strong>
                        </div>
                        {/* Decorative blobs / rings */}
                        <div className="heroBlobBg" />
                        <div className="heroRingOuter" />
                        <div className="heroRingInner" />

                        <div className="heroIllustration">
                            {/* ── Real hero image replacing emoji ── */}
                            <div className="heroImgFrame">
                                <img
                                    src={heroBgImg}
                                    alt="Student studying"
                                    className="heroImg"
                                />
                                {/* subtle glow ring behind image */}
                                <div className="heroImgGlow" />
                            </div>

                            {/* Floating pop cards */}
                            <div className="heroPop pop1">
                                <div className="popAva">👩</div>
                                <div>
                                    <div className="popNum">+480</div>
                                    <div className="popLbl">Happy Candidates</div>
                                </div>
                            </div>
                            <div className="heroPop pop2">
                                <span>✅</span>
                                <div>
                                    <div className="popNum">Hired!</div>
                                    <div className="popLbl">Senior Designer</div>
                                </div>
                            </div>
                            <div className="heroPop pop3">
                                <span>📩</span>
                                <div>
                                    <div className="popNum">New Match</div>
                                    <div className="popLbl">React Developer</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="heroStats">
                        <div className="hStat">
                            <div className="hStatNum">2.4M+</div>
                            <div className="hStatLbl">Active Users</div>
                        </div>
                        <div className="hStatDiv" />
                        <div className="hStat">
                            <div className="hStatNum">50K+</div>
                            <div className="hStatLbl">Companies</div>
                        </div>
                        <div className="hStatDiv" />
                        <div className="hStat">
                            <div className="hStatNum">150K+</div>
                            <div className="hStatLbl">Jobs Posted</div>
                        </div>
                    </div> */}
                    <div className="heroStats">
                        <div className="hStat">
                            <div className="hStatNum">
                                {formatStat(platformStats.active_users)}
                            </div>
                            <div className="hStatLbl">Active Users</div>
                        </div>

                        <div className="hStatDiv" />

                        <div className="hStat">
                            <div className="hStatNum">
                                {formatStat(platformStats.companies)}
                            </div>
                            <div className="hStatLbl">Companies</div>
                        </div>

                        <div className="hStatDiv" />

                        <div className="hStat">
                            <div className="hStatNum">
                                {formatStat(platformStats.jobs_posted)}
                            </div>
                            <div className="hStatLbl">Jobs Posted</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── COMPANY STRIP ── */}
            <section className="catSection">
                <div className="secHeader">
                    <div>
                        <h2 className="secTitle">Popular Job Categories</h2>
                        <p className="secSub">2020 jobs live — 293 added today.</p>
                    </div>
                </div>

                {/* <div className="catGrid">
                    {categories.length === 0 ? (
                        <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
                            No categories found.
                        </p>
                    ) : (
                        categories.map((cat, index) => (
                            <div
                                key={cat.title || `blank-${index}`}
                                className={`catCard ${cat.isBlank ? "blankCatCard" : ""}`}
                            >
                                {!cat.isBlank && (
                                    <>
                                        <div className="catIconWrap">{cat.icon}</div>

                                        <div className="catContent">
                                            <h3 className="catTitle">{cat.title}</h3>
                                            <p className="catJobs">({cat.jobs} open positions)</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div> */}
                <div className="catGrid">
                    {categories.length === 0 ? (
                        <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
                            No categories found.
                        </p>
                    ) : (
                        categories.map((cat, index) => (
                            <div
                                key={cat.title || `blank-${index}`}
                                className={`catCard ${cat.isBlank ? "blankCatCard" : ""}`}
                                onClick={() => {
                                    if (!cat.isBlank) {
                                        navigate(`/category/${encodeURIComponent(cat.title)}`);
                                    }
                                }}
                                style={{ cursor: cat.isBlank ? "default" : "pointer" }}
                            >
                                {!cat.isBlank && (
                                    <>
                                        <div className="catIconWrap">{cat.icon}</div>

                                        <div className="catContent">
                                            <h3 className="catTitle">{cat.title}</h3>
                                            <p className="catJobs">({cat.jobs} open positions)</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* ── SCHOLARSHIPS ── */}

            <section className="schSection">
                <div className="schTopIcon"><FaGraduationCap /></div>

                <div className="secHeader">
                    <h2 className="secTitle">Featured Scholarships</h2>
                    <p className="secSub">
                        Explore opportunities tailored for your academic journey
                    </p>
                </div>

                <ScholarshipSlider />
            </section>

            {/* Featured Jobs Section */}
            <section className="jobsSection" id="recent-jobs">
                <div className="secHeader">
                    <h2 className="secTitle">Recent Jobs</h2>
                    <p className="secSub">
                        Know your worth and find the job that qualify your life
                    </p>
                </div>
                <div className="jobsGrid">
                    {recentJobs.length === 0 ? (
                        <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
                            No jobs found.
                        </p>
                    ) : (
                        recentJobs.map((job, index) => (
                            <div key={job.id || index} className="jobCard">
                                <button className="bookmarkBtn" type="button">
                                    <Bookmark size={18} />
                                </button>

                                <div className="jobInfo">
                                    <div className="jobTitleRow">
                                        <div className="jobLogo">
                                            {job.title ? job.title.charAt(0).toUpperCase() : "J"}
                                        </div>

                                        <h4 className="jobTitle">{job.title}</h4>
                                    </div>

                                    <div className="jobMeta">
                                        <span>
                                            <Briefcase size={16} />
                                            {job.category || "General"}
                                        </span>

                                        <span>
                                            <MapPin size={16} />
                                            {job.city || "Not specified"}
                                        </span>
                                    </div>

                                    <div className="jobTags">
                                        <span className="jobType full">
                                            {job.employment_type || job.job_type || "Full Time"}
                                        </span>

                                        {job.work_mode && (
                                            <span className="urgentTag">
                                                {job.work_mode}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button
                    className="loadMoreBtn"
                    type="button"
                    onClick={() => navigate("/jobs")}
                >
                    Load More Listing
                </button>
            </section>
            {/*Companies Section */}
            <section className="companiesSection" id="companies">
                <div className="companiesHeader">
                    <div>
                        <h2 className="companiesTitle">Top Company Registered</h2>
                        <p className="companiesSub">
                            Some of the companies we’ve helped recruit excellent applicants over the years.
                        </p>
                    </div>

                    <button className="browseCompaniesBtn" type="button">
                        Browse All Company <ArrowRight size={16} />
                    </button>
                </div>

                <div className="companiesGrid">
                    {topCompanies.length === 0 ? (
                        <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
                            No companies found.
                        </p>
                    ) : (
                        topCompanies.map((company, index) => (
                            <div className="companyCard" key={company.id || index}>
                                <div className="companyLogo">
                                    {company.logo_url ? (
                                        <img
                                            src={company.logo_url}
                                            alt={company.company_name}
                                            className="companyLogoImg"
                                        />
                                    ) : (
                                        company.company_name
                                            ? company.company_name.charAt(0).toUpperCase()
                                            : "C"
                                    )}
                                </div>

                                <h4
                                    className="companyName"
                                    onClick={() => navigate(`/company/${company.id}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {company.company_name}
                                </h4>

                                <div className="companyLocation">
                                    <MapPin size={16} />
                                    <span>{company.city || company.country || "Not specified"}</span>
                                </div>

                                <button
                                    className="openJobsBtn"
                                    type="button"
                                    onClick={() => navigate(`/jobs?company_id=${company.id}`)}
                                >
                                    Open Job - {company.open_jobs || 0}
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="companyDots">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span className="active"></span>
                    <span></span>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="featSection">
                <div className="featGrid">
                    <div className="featCol">
                        <h3 className="featColTitle blue">For Job Seekers</h3>
                        <div className="line blue" />
                        {[
                            { icon: <Search size={18} />, title: "Smart Job Matching", desc: "AI-powered algorithm matches you with relevant opportunities." },
                            { icon: <FileText size={18} />, title: "Resume Builder", desc: "Create professional resumes with an intuitive builder." },
                            { icon: <MessageSquare size={18} />, title: "Direct Communication", desc: "Connect directly with hiring managers through secure messaging." },
                            { icon: <BadgeCheck size={18} />, title: "Skill Assessment", desc: "Showcase your abilities with verified skill tests and badges." },
                        ].map(f => (
                            <div key={f.title} className="featCard">
                                <div className="featIcon blue">{f.icon}</div>
                                <div><h4>{f.title}</h4><p>{f.desc}</p></div>
                            </div>
                        ))}
                    </div>
                    <div className="featCol">
                        <h3 className="featColTitle purplee">For Employers</h3>
                        <div className="line purple" />
                        {[
                            { icon: <Users size={18} />, title: "Talent Pool Access", desc: "Access a database of pre-screened candidates for your team." },
                            { icon: <BarChart3 size={18} />, title: "Analytics Dashboard", desc: "Track hiring performance with detailed insights and analytics." },
                            { icon: <ShieldCheck size={18} />, title: "Verified Candidates", desc: "Background verification ensures trustworthy professionals." },
                            { icon: <Zap size={18} />, title: "Quick Hiring", desc: "Streamlined process reduces time-to-hire with smart tools." },
                        ].map(f => (
                            <div key={f.title} className="featCard highlight">
                                <div className="featIcon purple">{f.icon}</div>
                                <div><h4>{f.title}</h4><p>{f.desc}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ANALYTICS ── */}
            <section className="paWrap">
                <h2 className="paTitle">Platform <span>Analytics</span></h2>
                <p className="paSub">Real-time insights and data-driven results that showcase the power of our platform.</p>
                <div className="paGrid">
                    {[
                        { val: "2.4M+", lbl: "Active Users" },
                        { val: "150K+", lbl: "Jobs Posted" },
                        { val: "89K+", lbl: "Successful Hires" },
                        { val: "94%", lbl: "Match Rate" },
                    ].map(a => (
                        <div key={a.lbl} className="paCard">

                            <div className="paValue">{a.val}</div>
                            <div className="paLabel">{a.lbl}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="superioFooter">
                <div className="footerInner">
                    <div className="footerTop">
                        <div className="footerBrandCol">
                            <div className="footerLogoRow">
                                <div className="footerLogo">S</div>
                                <h3 className="footerBrandName">SkillHive</h3>
                            </div>

                            <h4 className="footerCallTitle">Call us</h4>
                            <a href="tel:1234567890" className="footerPhone">
                                123 456 7890
                            </a>

                            <p className="footerAddress">
                                328 Queensberry Street, North Melbourne VIC
                                <br />
                                3051, Pakistan.
                            </p>

                            <a href="mailto:support@superio.com" className="footerEmail">
                                support@skillhive.com
                            </a>
                        </div>

                        <div className="footerLinksCol">
                            <h4>For Candidates</h4>
                            <a href="#">Browse Jobs</a>
                            <a href="#">Browse Candidates</a>
                            <a href="#">Candidate Dashboard</a>
                        </div>

                        <div className="footerLinksCol">
                            <h4>For Employers</h4>
                            <a href="#">All Employers</a>
                            <a href="#">Employer Dashboard</a>
                            <a href="#">Submit Job</a>
                            <a href="#">Job Packages</a>
                        </div>

                        <div className="footerLinksCol">
                            <h4>About Us</h4>
                            <a href="#">Contact Us</a>
                            <a href="#">About Us</a>
                            <a href="#">Terms</a>
                            <a href="#">Packages</a>
                            <a href="#">FAQ</a>
                        </div>

                        <div className="footerLinksCol">
                            <h4>Helpful Resources</h4>
                            <a href="#">Site Map</a>
                            <a href="#">Terms of Use</a>
                            <a href="#">Privacy Center</a>
                            <a href="#">Security Center</a>
                            <a href="#">Accessibility Center</a>
                        </div>
                    </div>

                    <div className="footerBottom">
                        <p>© 2026 SkillHive. All Right Reserved.</p>

                        <div className="footerSocials">
                            <a href="#"><FaFacebookF size={16} /></a>
                            <a href="#"><FaTwitter size={16} /></a>
                            <a href="#"><FaInstagram size={16} /></a>
                            <a href="#"><FaLinkedinIn size={16} /></a>
                        </div>
                    </div>
                </div>

            </footer>
        </>
    );
}