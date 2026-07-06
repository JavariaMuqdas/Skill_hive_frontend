import { useEffect, useMemo, useState } from "react";
import "./profile.css";
import api from "../../services/api";

function ProfileSection({
  title,
  editable,
  loading,
  saving,
  onEdit,
  children,
  className = "",
}) {
  return (
    <section className={`cpSectionCard ${className}`}>
      <div className="cpSectionHead">
        <h3>{title}</h3>

        {!editable && (
          <button
            type="button"
            className="cpEditPill"
            onClick={onEdit}
            disabled={loading || saving}
          >
            <i className="fa-solid fa-pen" />
            Edit
          </button>
        )}
      </div>

      <div className="cpSectionBody">
        <aside className="cpSectionAside">
          <div className="cpAsideArt" />
        </aside>

        <div className="cpSectionContent">{children}</div>
      </div>
    </section>
  );
}

function Field({ label, icon, children, full = false }) {
  return (
    <div className={`cpField ${full ? "cpFieldFull" : ""}`}>
      <label className="cpLabel">{label}</label>
      <div className={`cpInputWrap ${icon ? "hasIcon" : ""}`}>
        {children}
        
      </div>
    </div>
  );
}

export default function Profile() {
  const API_BASE = (
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
  ).replace(/\/$/, "");

  const COMPANY_SIZES = useMemo(
    () => [
      "1–10",
      "11–50",
      "51–200",
      "201–500",
      "501–1000",
      "1001–5000",
      "5000+",
    ],
    []
  );

  const emptyForm = {
    company_name: "",
    phone: "",
    website: "",
    company_email: "",
    linkedin_url: "",

    industry: "",
    company_size: "",
    city: "",
    country: "",
    founded_year: "",

    description: "",
    short_description: "",
    overview: "",
    why_join_us: "",

    total_employees: "",
    dept_it: "",
    dept_hr: "",
    dept_marketing: "",
    dept_sales: "",
    dept_finance: "",
    dept_operations: "",

    logo: null,
    logo_path: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [previewUrl, setPreviewUrl] = useState("");
  const [logoName, setLogoName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [editableSections, setEditableSections] = useState({
    basic: false,
    about: false,
    workforce: false,
    contact: false,
  });

  const [isNewProfile, setIsNewProfile] = useState(false);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const isSectionEditable = (section) =>
    isNewProfile || editableSections[section];

  const isAnySectionEditable =
    isSectionEditable("basic") ||
    isSectionEditable("about") ||
    isSectionEditable("workforce") ||
    isSectionEditable("contact");

  const hasExistingProfileData = (data) => {
    const keysToCheck = [
      "company_name",
      "phone",
      "website",
      "company_email",
      "linkedin_url",
      "industry",
      "company_size",
      "city",
      "country",
      "founded_year",
      "description",
      "short_description",
      "overview",
      "why_join_us",
      "total_employees",
      "dept_it",
      "dept_hr",
      "dept_marketing",
      "dept_sales",
      "dept_finance",
      "dept_operations",
      "logo",
    ];

    return keysToCheck.some((key) => {
      const value = data?.[key];
      if (value === null || value === undefined) return false;
      if (typeof value === "string") return value.trim() !== "";
      return true;
    });
  };

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!msg) return;

    const timer = setTimeout(() => {
      setMsg("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [msg]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setErr("");
      setMsg("");

      try {
        const res = await api.get("/company/profile");
        const data = res?.data || {};
        const logoPath = data.logo || "";

        const mappedForm = {
          company_name: data.company_name ?? data.name ?? "",
          phone: data.phone ?? "",
          website: data.website ?? "",
          company_email: data.company_email ?? "",
          linkedin_url: data.linkedin_url ?? "",

          industry: data.industry ?? "",
          company_size: data.company_size ?? "",
          city: data.city ?? "",
          country: data.country ?? "",
          founded_year: data.founded_year ?? "",

          description: data.description ?? "",
          short_description: data.short_description ?? "",
          overview: data.overview ?? "",
          why_join_us: data.why_join_us ?? "",

          total_employees: data.total_employees ?? "",
          dept_it: data.dept_it ?? "",
          dept_hr: data.dept_hr ?? "",
          dept_marketing: data.dept_marketing ?? "",
          dept_sales: data.dept_sales ?? "",
          dept_finance: data.dept_finance ?? "",
          dept_operations: data.dept_operations ?? "",

          logo: null,
          logo_path: logoPath,
        };

        setForm(mappedForm);
        setLogoName(logoPath ? logoPath.split("/").pop() : "");

        if (data.logo_url) {
          setPreviewUrl(data.logo_url + "?v=" + Date.now());
        } else if (logoPath) {
          setPreviewUrl(`${API_BASE}/storage/${logoPath}?v=${Date.now()}`);
        } else {
          setPreviewUrl("");
        }

        const profileExists = hasExistingProfileData(data);
        setIsNewProfile(!profileExists);

        if (!profileExists) {
          setEditableSections({
            basic: true,
            about: true,
            workforce: true,
            contact: true,
          });
        }
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load company profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API_BASE]);

  const onLogoChange = (e) => {
    const file = e.target.files?.[0] || null;
    upd("logo", file);

    if (file) {
      setLogoName(file.name);
    } else {
      setLogoName(form.logo_path ? form.logo_path.split("/").pop() : "");
    }

    setPreviewUrl((old) => {
      if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
      return old;
    });

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else if (form.logo_path) {
      setPreviewUrl(`${API_BASE}/storage/${form.logo_path}?v=${Date.now()}`);
    } else {
      setPreviewUrl("");
    }
  };

  const onEditSection = (section) => {
    setErr("");
    setMsg("");
    setEditableSections((prev) => ({
      ...prev,
      [section]: true,
    }));
  };

  const onSave = async () => {
    setErr("");
    setMsg("");
    setSaving(true);

    try {
      const fd = new FormData();

      fd.append("company_name", form.company_name || "");
      fd.append("phone", form.phone || "");
      fd.append("website", form.website || "");
      fd.append("company_email", form.company_email || "");
      fd.append("linkedin_url", form.linkedin_url || "");

      fd.append("industry", form.industry || "");
      fd.append("company_size", form.company_size || "");
      fd.append("city", form.city || "");
      fd.append("country", form.country || "");
      fd.append("founded_year", form.founded_year || "");

      fd.append("description", form.description || "");
      fd.append("short_description", form.short_description || "");
      fd.append("overview", form.overview || "");
      fd.append("why_join_us", form.why_join_us || "");

      fd.append("total_employees", form.total_employees || "");
      fd.append("dept_it", form.dept_it || "");
      fd.append("dept_hr", form.dept_hr || "");
      fd.append("dept_marketing", form.dept_marketing || "");
      fd.append("dept_sales", form.dept_sales || "");
      fd.append("dept_finance", form.dept_finance || "");
      fd.append("dept_operations", form.dept_operations || "");

      if (form.logo) {
        fd.append("logo", form.logo);
      }

      const res = await api.post("/company/profile", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res?.data || {};
      const logoPath = data.logo || form.logo_path || "";

      setForm((prev) => ({
        ...prev,
        logo: null,
        logo_path: logoPath,
      }));

      setLogoName(logoPath ? logoPath.split("/").pop() : "");

      if (data.logo_url) {
        setPreviewUrl(data.logo_url + "?v=" + Date.now());
      } else if (logoPath) {
        setPreviewUrl(`${API_BASE}/storage/${logoPath}?v=${Date.now()}`);
      }

      setMsg("Profile updated successfully!");
      setIsNewProfile(false);

      setEditableSections({
        basic: false,
        about: false,
        workforce: false,
        contact: false,
      });
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const completionItems = [
    form.company_name,
    form.industry,
    form.company_size,
    form.city,
    form.country,
    form.founded_year,
    form.short_description,
    form.overview,
    form.website,
    previewUrl,
  ];

  const profileCompletion = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100
  );

  return (
    <div className="cpPage">
      {msg ? (
        <div className="cpToast cpToastSuccess" role="alert" aria-live="polite">
          <div className="cpToastContent">
            <i className="fa-solid fa-circle-check" />
            <span>{msg}</span>
          </div>

          <button
            type="button"
            className="cpToastClose"
            onClick={() => setMsg("")}
            aria-label="Close notification"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      ) : null}

      <div className="cpShell">
        <div className="cpHero">
          <div className="cpHeroTop">
            <div className="cpHeroIdentity">
              <h2>{form.company_name || "Company profile"}</h2>
              <p>Profile settings</p>
            </div>

            <div className="cpHeroLogo">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Company Logo"
                  onError={() => setPreviewUrl("")}
                />
              ) : (
                <span>
                  {(form.company_name || "C").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div className="cpHeroBottom">
            <div className="cpProgressMeta">
              <span>Profile {profileCompletion}% Complete</span>
            </div>

            <div className="cpProgressBar">
              <div
                className="cpProgressFill"
                style={{ width: `${Math.max(profileCompletion, 8)}%` }}
              />
            </div>
          </div>
        </div>

        {loading ? <div className="cpNotice">Loading...</div> : null}
        {err ? <div className="cpNotice cpNoticeError">{err}</div> : null}

        <ProfileSection
          title="Personal Profile"
          editable={isSectionEditable("basic")}
          loading={loading}
          saving={saving}
          onEdit={() => onEditSection("basic")}
        >
          <div className="cpGrid cpGrid2">
            <Field label="Company name">
              <input
                className="cpInput"
                value={form.company_name}
                onChange={(e) => upd("company_name", e.target.value)}
                disabled={loading || !isSectionEditable("basic")}
              />
            </Field>

            <Field label="Industry" icon={<i className="fa-solid fa-gear" />}>
              <input
                className="cpInput"
                value={form.industry}
                onChange={(e) => upd("industry", e.target.value)}
                disabled={loading || !isSectionEditable("basic")}
              />
            </Field>

            <Field
              label="Company size"
              icon={<i className="fa-solid fa-users" />}
            >
              <select
                className="cpInput"
                value={form.company_size}
                onChange={(e) => upd("company_size", e.target.value)}
                disabled={loading || !isSectionEditable("basic")}
              >
                <option value="">Select size</option>
                {COMPANY_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s} Employees
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Founded year"
              icon={<i className="fa-regular fa-calendar" />}
            >
              <input
                className="cpInput"
                placeholder="e.g. 2018"
                value={form.founded_year}
                onChange={(e) => upd("founded_year", e.target.value)}
                disabled={loading || !isSectionEditable("basic")}
              />
            </Field>

            <Field
              label="City"
              icon={<i className="fa-solid fa-location-dot" />}
            >
              <input
                className="cpInput"
                value={form.city}
                onChange={(e) => upd("city", e.target.value)}
                disabled={loading || !isSectionEditable("basic")}
              />
            </Field>

            <Field
              label="Country"
              icon={<i className="fa-solid fa-earth-asia" />}
            >
              <input
                className="cpInput"
                value={form.country}
                onChange={(e) => upd("country", e.target.value)}
                disabled={loading || !isSectionEditable("basic")}
              />
            </Field>
          </div>

          <div className="cpUploadCard">
            <div className="cpUploadPreview">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Company Logo"
                  onError={() => setPreviewUrl("")}
                />
              ) : (
                <div className="cpLogoPlaceholder">No Logo</div>
              )}
            </div>

            <div className="cpUploadInfo">
              <input
                id="companyLogo"
                type="file"
                className="cpFileHidden"
                accept="image/*"
                disabled={loading || !isSectionEditable("basic")}
                onChange={onLogoChange}
              />

              <label
                className={`cpUploadBtn ${
                  loading || !isSectionEditable("basic") ? "isDisabled" : ""
                }`}
                htmlFor={
                  loading || !isSectionEditable("basic")
                    ? undefined
                    : "companyLogo"
                }
              >
                Upload logo
              </label>

              <p className="cpUploadText">
                Explain what company name, logo and upload details.
              </p>

              <div className="cpFileName">{logoName || "No file chosen"}</div>
            </div>
          </div>
        </ProfileSection>

        <ProfileSection
          title="About the Company"
          editable={isSectionEditable("about")}
          loading={loading}
          saving={saving}
          onEdit={() => onEditSection("about")}
        >
          <div className="cpStack">
            <Field label="Short description" full>
              <textarea
                className="cpInput cpTextarea"
                maxLength={500}
                value={form.short_description}
                onChange={(e) => upd("short_description", e.target.value)}
                disabled={loading || !isSectionEditable("about")}
              />
            </Field>
            <div className="cpCharCount">
              {form.short_description?.length || 0}/500 characters
            </div>

            <Field label="Company overview" full>
              <textarea
                className="cpInput cpTextareaLg"
                maxLength={2000}
                value={form.overview}
                onChange={(e) => upd("overview", e.target.value)}
                disabled={loading || !isSectionEditable("about")}
              />
            </Field>
            <div className="cpCharCount">
              {form.overview?.length || 0}/2000 characters
            </div>

            <Field label="Why join us" full>
              <textarea
                className="cpInput cpTextarea"
                maxLength={500}
                value={form.why_join_us}
                onChange={(e) => upd("why_join_us", e.target.value)}
                disabled={loading || !isSectionEditable("about")}
              />
            </Field>
            <div className="cpCharCount">
              {form.why_join_us?.length || 0}/500 characters
            </div>
          </div>
        </ProfileSection>

        <ProfileSection
          title="Workforce"
          editable={isSectionEditable("workforce")}
          loading={loading}
          saving={saving}
          onEdit={() => onEditSection("workforce")}
        >
          <div className="cpGrid cpGrid2">
            <Field label="Total employees">
              <input
                className="cpInput"
                value={form.total_employees}
                onChange={(e) => upd("total_employees", e.target.value)}
                disabled={loading || !isSectionEditable("workforce")}
              />
            </Field>

            <Field label="IT / Development">
              <input
                className="cpInput"
                value={form.dept_it}
                onChange={(e) => upd("dept_it", e.target.value)}
                disabled={loading || !isSectionEditable("workforce")}
              />
            </Field>

            <Field label="HR">
              <input
                className="cpInput"
                value={form.dept_hr}
                onChange={(e) => upd("dept_hr", e.target.value)}
                disabled={loading || !isSectionEditable("workforce")}
              />
            </Field>

            <Field label="Marketing">
              <input
                className="cpInput"
                value={form.dept_marketing}
                onChange={(e) => upd("dept_marketing", e.target.value)}
                disabled={loading || !isSectionEditable("workforce")}
              />
            </Field>

            <Field label="Sales">
              <input
                className="cpInput"
                value={form.dept_sales}
                onChange={(e) => upd("dept_sales", e.target.value)}
                disabled={loading || !isSectionEditable("workforce")}
              />
            </Field>

            <Field label="Finance">
              <input
                className="cpInput"
                value={form.dept_finance}
                onChange={(e) => upd("dept_finance", e.target.value)}
                disabled={loading || !isSectionEditable("workforce")}
              />
            </Field>

            <Field label="Operations">
              <input
                className="cpInput"
                value={form.dept_operations}
                onChange={(e) => upd("dept_operations", e.target.value)}
                disabled={loading || !isSectionEditable("workforce")}
              />
            </Field>
          </div>
        </ProfileSection>

        <ProfileSection
          title="Contact"
          editable={isSectionEditable("contact")}
          loading={loading}
          saving={saving}
          onEdit={() => onEditSection("contact")}
        >
          <div className="cpGrid cpGrid2">
            <Field
              label="Official website"
              icon={<i className="fa-solid fa-globe" />}
            >
              <input
                className="cpInput"
                value={form.website}
                onChange={(e) => upd("website", e.target.value)}
                disabled={loading || !isSectionEditable("contact")}
              />
            </Field>

            <Field
              label="Company email"
              icon={<i className="fa-regular fa-envelope" />}
            >
              <input
                className="cpInput"
                value={form.company_email}
                onChange={(e) => upd("company_email", e.target.value)}
                disabled={loading || !isSectionEditable("contact")}
              />
            </Field>

            <Field
              label="Phone"
              icon={<i className="fa-solid fa-phone" />}
            >
              <input
                className="cpInput"
                value={form.phone}
                onChange={(e) => upd("phone", e.target.value)}
                disabled={loading || !isSectionEditable("contact")}
              />
            </Field>

            <Field
              label="LinkedIn profile"
              icon={<i className="fa-brands fa-linkedin-in" />}
            >
              <input
                className="cpInput"
                value={form.linkedin_url}
                onChange={(e) => upd("linkedin_url", e.target.value)}
                disabled={loading || !isSectionEditable("contact")}
              />
            </Field>
          </div>
        </ProfileSection>

        {isAnySectionEditable ? (
          <div className="cpBottomSave">
            <button
              className="cpPrimaryBtn cpBottomBtn"
              type="button"
              onClick={onSave}
              disabled={loading || saving}
            >
              <i className="fa-regular fa-floppy-disk" />
              {saving ? "Saving..." : "Save Profile Details"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}