import React, { useEffect, useMemo, useState, useRef } from "react";
import api from "../../services/api";
import "./jobcategories.css";

const MAIN_CATEGORIES = [
  {
    key: "part-time",
    label: "Part-Time",
    shortLabel: "PART-TIME",
    icon: "fa-solid fa-clock",
    colorClass: "greenCard",
    fields: ["employment_type"],
  },
  {
    key: "full-time",
    label: "Full-Time",
    shortLabel: "FULL-TIME",
    icon: "fa-solid fa-briefcase",
    colorClass: "blueCard",
    fields: ["employment_type"],
  },
  {
    key: "contract",
    label: "Contract",
    shortLabel: "CONTRACT",
    icon: "fa-solid fa-file-signature",
    colorClass: "redCard",
    fields: ["employment_type"],
  },
  {
    key: "temporary",
    label: "Temporary",
    shortLabel: "TEMPORARY",
    icon: "fa-solid fa-hourglass-half",
    colorClass: "darkCard",
    fields: ["employment_type"],
  },
  {
    key: "project-freelance",
    label: "Project / Freelance",
    shortLabel: "PROJECT / FREELANCE",
    icon: "fa-solid fa-diagram-project",
    colorClass: "purpleCard",
    fields: ["employment_type"],
  },
  {
    key: "paid-internship",
    label: "Paid Internship",
    shortLabel: "PAID INTERNSHIP",
    icon: "fa-solid fa-user-graduate",
    colorClass: "orangeCard",
    fields: ["employment_type"],
  },
  {
    key: "unpaid-internship",
    label: "Unpaid Internship",
    shortLabel: "UNPAID INTERNSHIP",
    icon: "fa-solid fa-user-graduate",
    colorClass: "tealCard",
    fields: ["employment_type"],
  },
];

const SUB_CATEGORIES = [
  {
    key: "remote",
    label: "Remote",
    icon: "fa-solid fa-laptop-house",
    fields: ["work_mode", "job_type", "location_type"],
  },
  {
    key: "onsite",
    label: "Onsite",
    icon: "fa-solid fa-building",
    fields: ["work_mode", "job_type", "location_type"],
  },
  {
    key: "hybrid",
    label: "Hybrid",
    icon: "fa-solid fa-building-user",
    fields: ["work_mode", "job_type", "location_type"],
  },
];

export default function JobCategories() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedMain, setSelectedMain] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const sliderRef = useRef(null);

  const scrollMainCards = (direction) => {
    if (!sliderRef.current) return;

    const card = sliderRef.current.querySelector(".categoryBadgeCard");
    const cardWidth = card ? card.offsetWidth + 18 : 220;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const res = await api.get("/company/projects");
        setProjects(res?.data?.data || []);
      } catch (e) {
        setMsg(e?.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const normalizeValue = (value) =>
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[()]/g, "")
      .replace(/[\/]/g, "-")
      .replace(/[_\s]+/g, "-")
      .replace(/-+/g, "-");

  const normalize = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((v) => normalizeValue(v))
        .filter(Boolean);
    }

    return normalizeValue(value);
  };

  const fieldToArray = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (value === null || value === undefined || value === "") return [];
    return [value];
  };

  const hasCategoryMatch = (rawValue, categoryKey) => {
    const normalizedCategory = normalizeValue(categoryKey);
    const values = fieldToArray(rawValue).map((item) => normalizeValue(item));

    return values.some((value) => {
      if (categoryKey === "project-freelance") {
        return [
          "project",
          "freelance",
          "project-freelance",
          "project-freelance",
        ].includes(value);
      }

      if (categoryKey === "paid-internship") {
        return [
          "paid-internship",
          "internship-paid",
          "paidinternship",
        ].includes(value);
      }

      if (categoryKey === "unpaid-internship") {
        return [
          "unpaid-internship",
          "internship-unpaid",
          "unpaidinternship",
        ].includes(value);
      }

      return value === normalizedCategory;
    });
  };

  const matchesMainCategory = (job, categoryKey) => {
    if (!categoryKey) return true;

    const config = MAIN_CATEGORIES.find((item) => item.key === categoryKey);
    if (!config) return true;

    return config.fields.some((field) => hasCategoryMatch(job?.[field], categoryKey));
  };

  const matchesSubCategory = (job, subCategoryKey) => {
    if (!subCategoryKey) return true;

    const config = SUB_CATEGORIES.find((item) => item.key === subCategoryKey);
    if (!config) return true;

    return config.fields.some((field) => {
      const rawValue = job?.[field];
      const values = fieldToArray(rawValue).map((item) => normalizeValue(item));
      return values.includes(normalizeValue(subCategoryKey));
    });
  };

  const formatField = (value) => {
    if (Array.isArray(value)) {
      return value.filter(Boolean).join(", ");
    }
    return value || "";
  };

  const mainCategoryCards = useMemo(() => {
    return MAIN_CATEGORIES.map((cat) => {
      const count = projects.filter((job) => matchesMainCategory(job, cat.key)).length;
      return { ...cat, count };
    });
  }, [projects]);

  const subCategoryButtons = useMemo(() => {
    return SUB_CATEGORIES.map((sub) => {
      const count = projects.filter((job) => {
        const mainMatch = selectedMain ? matchesMainCategory(job, selectedMain) : true;
        const subMatch = matchesSubCategory(job, sub.key);
        return mainMatch && subMatch;
      }).length;

      return { ...sub, count };
    });
  }, [projects, selectedMain]);

  const filteredProjects = useMemo(() => {
    const arr = Array.isArray(projects) ? [...projects] : [];

    arr.sort((a, b) => {
      const da = new Date(a?.created_at || a?.createdAt || 0).getTime();
      const db = new Date(b?.created_at || b?.createdAt || 0).getTime();
      return db - da;
    });

    return arr.filter((job) => {
      const mainMatch = selectedMain ? matchesMainCategory(job, selectedMain) : true;
      const subMatch = selectedSub ? matchesSubCategory(job, selectedSub) : true;
      return mainMatch && subMatch;
    });
  }, [projects, selectedMain, selectedSub]);

  const activeFilters = useMemo(() => {
    const filters = [];

    if (selectedMain) {
      const main = MAIN_CATEGORIES.find((item) => item.key === selectedMain);
      if (main) filters.push(main);
    }

    if (selectedSub) {
      const sub = SUB_CATEGORIES.find((item) => item.key === selectedSub);
      if (sub) filters.push(sub);
    }

    return filters;
  }, [selectedMain, selectedSub]);

  const getListTitle = () => {
    const mainLabel = MAIN_CATEGORIES.find((item) => item.key === selectedMain)?.label;
    const subLabel = SUB_CATEGORIES.find((item) => item.key === selectedSub)?.label;

    if (mainLabel && subLabel) return `${mainLabel} • ${subLabel} Jobs`;
    if (mainLabel) return `${mainLabel} Jobs`;
    if (subLabel) return `${subLabel} Jobs`;
    return "All Jobs";
  };

  const clearAllFilters = () => {
    setSelectedMain(null);
    setSelectedSub(null);
  };

  if (loading) return <div className="dashLoading">Loading...</div>;
  if (msg) return <div className="dashError">{msg}</div>;

  return (
    <div className="jobCatWrap">
      <div className="jobCatHeader">
        <div className="jobCatHeaderLeft">
          <h1 className="jobCatTitle">Job Categories</h1>
          <p className="jobCatSub">
            Browse jobs by employment type and work mode
          </p>
        </div>

        <div className="jobCatHeaderRight">
          <button className="clearFilterBtn" onClick={clearAllFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      <div className="filterSection">
        <div className="sectionHeading">
          <h3>Employment Type</h3>
        </div>

        <div className="mainCategorySliderWrap">
          <button
            type="button"
            className="sliderArrow left"
            onClick={() => scrollMainCards("left")}
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>

          <div className="mainCategorySlider" ref={sliderRef}>
            {mainCategoryCards.map((cat) => (
              <button
                type="button"
                key={cat.key}
                className={`categoryBadgeCard ${cat.colorClass} ${selectedMain === cat.key ? "active" : ""
                  }`}
                onClick={() =>
                  setSelectedMain((prev) => (prev === cat.key ? null : cat.key))
                }
              >
                <div className="categoryBadgeTop">
                  <div className="categoryBadgeIcon">
                    <i className={cat.icon}></i>
                  </div>
                </div>

                <div className="categoryBadgeBody">
                  <div className="categoryBadgeLabel">{cat.shortLabel}</div>
                  <div className="categoryBadgeCount">{cat.count}</div>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="sliderArrow right"
            onClick={() => scrollMainCards("right")}
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
        </div>
      </div>

      <div className="filterSection">
        <div className="sectionHeading">
          <h3>Work Mode</h3>
        </div>

        <div className="subCategoryPills">
          {subCategoryButtons.map((sub) => (
            <button
              type="button"
              key={sub.key}
              className={`subCategoryPill ${selectedSub === sub.key ? "active" : ""}`}
              onClick={() =>
                setSelectedSub((prev) => (prev === sub.key ? null : sub.key))
              }
            >
              <i className={sub.icon}></i>
              <span>{sub.label}</span>
              <strong>{sub.count}</strong>
            </button>
          ))}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="activeFiltersRow">
          <span className="activeFiltersLabel">Active Filters:</span>

          <div className="activeFilterChips">
            {activeFilters.map((filter) => (
              <div className="activeFilterChip" key={filter.key}>
                <i className={filter.icon}></i>
                <span>{filter.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="jobListCard">
        <div className="jobListHead">
          <div>
            <div className="jobListTitle">{getListTitle()}</div>
            <div className="jobListSub">
              Showing {filteredProjects.length} job
              {filteredProjects.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="jobListBody">
          {filteredProjects.length ? (
            <div className="jobTableWrap">
              <div className="jobTableHeader">
                <div>Job Position</div>
                <div>Category</div>
                <div>Salary Range</div>
                <div>Location</div>
                <div>Status</div>
                <div>Posted Date</div>
              </div>

              {filteredProjects.map((job) => {
                const postedDate = job?.created_at || job?.createdAt;
                const formattedDate = postedDate
                  ? new Date(postedDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  : "—";

                const salaryRange =
                  job?.salary_range ||
                  job?.salary ||
                  (job?.salary_min && job?.salary_max
                    ? `${job.salary_min} - ${job.salary_max}`
                    : job?.salary_min
                      ? `From ${job.salary_min}`
                      : job?.salary_max
                        ? `Up to ${job.salary_max}`
                        : "—");

                const location =
                  formatField(job?.hiring_locations) ||
                  [job?.city, job?.location].filter(Boolean).join(", ") ||
                  "—";

                const employmentTypeText =
                  formatField(job?.employment_type) || "";

                const workingScheduleText =
                  formatField(job?.working_schedule) ||
                  formatField(job?.work_schedule) ||
                  "";

                const workModeText =
                  formatField(job?.work_mode) ||
                  formatField(job?.job_type) ||
                  formatField(job?.location_type) ||
                  "";

                const metaText = [
                  employmentTypeText,
                  workingScheduleText,
                  workModeText,
                ]
                  .filter(Boolean)
                  .join(" • ");

                return (
                  <div
                    className="jobTableRow"
                    key={job.id || job._id || `${job.title}-${formattedDate}`}
                  >
                    <div className="jobPositionCell">
                      <div className="jobPositionTitle">
                        {job.title || job.name || "Untitled Job"}
                      </div>
                      <div className="jobPositionMeta">{metaText || "—"}</div>
                    </div>

                    <div className="jobCategoryCell">
                      {job.category || "—"}
                    </div>

                    <div>{salaryRange}</div>

                    <div>{location}</div>

                    <div>
                      <span
                        className={`jobStatus ${normalizeValue(job?.status) === "published"
                            ? "published"
                            : normalizeValue(job?.status) === "closed"
                              ? "closed"
                              : "draft"
                          }`}
                      >
                        {job?.status || "Unknown"}
                      </span>
                    </div>

                    <div>{formattedDate}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="emptyStateBox">
              <div className="emptyStateIcon">
                <i className="fa-solid fa-folder-open"></i>
              </div>
              <div className="emptyStateTitle">No jobs found</div>
              <div className="emptyStateText">
                There are no jobs available for the selected filters.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}