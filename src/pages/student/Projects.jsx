import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Projects() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [loc, setLoc] = useState("");
  const [jobType, setJobType] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const companyId = params.get("company_id");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const url = companyId
          ? `/student/projects?company_id=${companyId}`
          : `/student/projects`;

        const res = await api.get(url);
        setItems(res.data || []);
      } catch (e) {
        setErr(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [companyId]);

  const goToApply = (id) => navigate(`/student/projects/${id}`);

  // پہلی تصویر جیسے لوگو کے لیے انیشلز جنریٹ کرنے کا فنکشن
  const getInitials = (title = "") => {
    const parts = title.trim().split(" ").filter(Boolean);
    const a = parts[0]?.[0] || "J";
    return a.toUpperCase();
  };

  // ہر کارڈ کے لوگو کے لیے خوبصورت مختلف رنگ
  const getAvatarColor = (index) => {
    const colors = ["#007aff", "#121212", "#ff2d55", "#4cd964"];
    return colors[index % colors.length];
  };

  const locationOptions = useMemo(() => {
    const set = new Set(items.map((p) => (p.city || "").trim()).filter(Boolean));
    return ["", ...Array.from(set)];
  }, [items]);

  const jobTypeOptions = useMemo(() => {
    const set = new Set(items.map((p) => (p.job_type || "").trim()).filter(Boolean));
    return ["", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    const l = loc.trim().toLowerCase();
    const jt = jobType.trim().toLowerCase();

    return items.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const city = (p.city || "").toLowerCase();
      const type = (p.job_type || "").toLowerCase();

      const matchKeyword = !k || title.includes(k);
      const matchLoc = !l || city === l;
      const matchType = !jt || type === jt;

      return matchKeyword && matchLoc && matchType;
    });
  }, [items, keyword, loc, jobType]);

  const onSearch = (e) => {
    e.preventDefault();
  };

  const formatSalary = (p) => {
    if (p?.salary_min && p?.salary_max) {
      return `${p.salary_min} - ${p.salary_max} / month`;
    }
    if (p?.salary_min) return `From $${p.salary_min} / month`;
    if (p?.salary_max) return `Up to $${p.salary_max} / month`;
    if (p?.hourly_rate) return `$${p.hourly_rate} / hour`;
    return "$150 - $180 / week"; // فال بیک سیلری پہلی تصویر کے مطابق
  };

  return (
    <div className="sjWrap">
      {/* پہلی تصویر کی طرح ہیڈر معلومات اور فلٹرز کا کنٹینر */}
      <div className="sjHeaderRow">
        <div className="sjResultsCount">
          Showing 1 – {filtered.length} of {items.length} results
        </div>
        <div className="sjHeaderFilters">
          <div className="sjSortSelectGroup">
            <span className="sjSortLabel">Sort by</span>
            <select className="sjHeaderSelect" defaultValue="default">
              <option value="default">(Default)</option>
            </select>
          </div>
          <div className="sjPerPageGroup">
            <select className="sjHeaderSelect" defaultValue="12">
              <option value="12">12 Per Page</option>
            </select>
          </div>
        </div>
      </div>

      {/* سرچ اور فلٹر بار */}
      <form className="sjFilterBar" onSubmit={onSearch}>
        <div className="sjSearchField">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search jobs ..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <select
          className="sjSelect"
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
        >
          <option value="">All Locations</option>
          {locationOptions
            .filter((x) => x !== "")
            .map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>

        <select
          className="sjSelect"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        >
          <option value="">All Categories</option>
          {jobTypeOptions
            .filter((x) => x !== "")
            .map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
        </select>
      </form>

      {loading && (
        <div className="sjStateCard">
          <p>Loading jobs...</p>
        </div>
      )}

      {err && !loading && (
        <div className="sjStateCard sjError">
          <p>{err}</p>
        </div>
      )}

      {!loading && !err && filtered.length === 0 && (
        <div className="sjStateCard">
          <p>No active jobs found.</p>
        </div>
      )}

      {!loading && !err && filtered.length > 0 && (
        <div className="sjList">
          {filtered.map((p, index) => (
            <div
              key={p.id}
              className="sjJobCard"
              onClick={() => goToApply(p.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  goToApply(p.id);
                }
              }}
            >
              <div className="sjJobLeft">
                {/* پہلی تصویر جیسا سرکلر لوگو */}
                <div
                  className="sjJobAvatar"
                  style={{ backgroundColor: getAvatarColor(index) }}
                >
                  {getInitials(p.title)}
                </div>

                <div className="sjJobBody">
                  <div className="sjTitleRow">
                    <h3>{p.title || "Untitled Job"}</h3>
                  </div>

                  <div className="sjCompanyLine">
                    by <strong>{p.company?.company_name || "Employer"}</strong> in <span className="sjCategoryText">{p.category || "Design, Development"}</span>
                  </div>

                  {/* پہلی تصویر جیسے گول بیجز (Badges) */}
                  <div className="sjBadgeRow">
                    <span className={`sjJobBadge ${index % 2 === 0 ? 'fulltime' : 'temporary'}`}>
                      {p.job_type || (index % 2 === 0 ? "Full Time" : "Temporary")}
                    </span>
                    <span className="sjLocationBadge">
                      {p.city || "New York"}
                    </span>
                    <span className="sjDateBadge">
                      {index === 0 ? "June 20, 2021" : "May 3, 2021"}
                    </span>
                    <span className="sjSalaryBadge">
                      {formatSalary(p)}
                    </span>
                  </div>
                </div>
              </div>

              {/* پہلی تصویر کے دائیں طرف والے ایکشن آئیکنز */}
              <div className="sjJobRight">
                <button className="sjActionIconBtn" title="Bookmark">
                  <i class="fa-regular fa-bookmark"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .sjWrap {
          padding: 30px;
          background: #F4EEFA;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* ہیڈر ڈیزائن جو پہلی تصویر جیسا ہے */
        .sjHeaderRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          color: #64748b;
          font-size: 14px;
        }

        .sjHeaderFilters {
          display: flex;
          gap: 20px;
        }

        .sjSortSelectGroup, .sjPerPageGroup {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .sjHeaderSelect {
          border: none;
          background: transparent;
          color: #1e293b;
          font-weight: 500;
          cursor: pointer;
          outline: none;
        }

        .sjFilterBar {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 15px;
          margin-bottom: 25px;
        }

        .sjSearchField {
          height: 46px;
          border-radius: 10px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
        }

        .sjSearchField input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 14px;
        }

        .sjSelect {
          height: 46px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 0 14px;
          font-size: 14px;
          color: #475569;
          outline: none;
        }

        .sjList {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* کارڈ ڈیزائن - بالکل پہلی تصویر جیسا */
        .sjJobCard {
          background: #ffffff;
          border: 1px solid #edf2f7;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
          transition: box-shadow 0.2s ease;
          cursor: pointer;
        }

        .sjJobCard:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          cursor:default;
          border:1px solid #9462A1;
        }
          .sjJobCard h3:hover{
          color:#9463A1;
          cursor:pointer;
          }

        .sjJobLeft {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        /* سرکلر اوتار / لوگو */
        .sjJobAvatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 22px;
          font-weight: 700;
          font-family: serif; /* پہلی تصویر کے فونٹ اسٹائل کے لیے */
        }

        .sjTitleRow h3 {
          margin: 0 0 6px 0;
          font-size: 19px;
          font-weight: 600;
          color: #1e293b;
        }

        .sjCompanyLine {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 14px;
        }

        .sjCompanyLine strong {
          color: #0f172a;
        }

        .sjCategoryText {
          color: #64748b;
        }

        /* بیجز بار (Badge styling) */
        .sjBadgeRow {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .sjJobBadge, .sjLocationBadge, .sjDateBadge, .sjSalaryBadge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          background: #F6F7F9;
          color: #475569;
        }

        /* فل ٹائم اور ٹیمپریری کے رنگ */
        .sjJobBadge.fulltime {
          background: #003F51;
          color: #fff;
        }

        .sjJobBadge.temporary {
          background: #003F51;
          color: #fff;
        }

        /* پہلی تصویر کے دائیں طرف موجود آئیکنز کی اسٹائلنگ */
        .sjJobRight {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .sjActionIconBtn {
          background: transparent;
          border: none;
          color: #9462A1;
          font-size: 16px;
          cursor: pointer;
          transition: color 0.2s;
          padding: 4px;
        }

        .sjActionIconBtn:hover {
          color: #475569;
        }

        .sjStateCard {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        @media (max-width: 768px) {
          .sjFilterBar {
            grid-template-columns: 1fr;
          }
          .sjJobCard {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          .sjJobRight {
            width: 100%;
            justify-content: flex-end;
            border-top: 1px solid #f1f5f9;
            padding-top: 10px;
          }
        }
      `}</style>
    </div>
  );
}