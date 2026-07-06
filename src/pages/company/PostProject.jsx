import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./postProject.css";

const initial = {
  title: "",
  category: "",
  description: "",
  hiring_locations: [],
  job_requirements: [],

  employment_type: [],
  work_mode: [],
  working_schedule: "",
  salary_type: "hourly",
  hourly_rate: "",
  salary_min: "",
  salary_max: "",
  salary_negotiable: false,
  hiring_multiple_candidates: false,
  deadline_date: "",

  attachment: null,
  attachment_url: null,
};

const steps = [
  { key: "about", label: "About" },
  { key: "details", label: "Details" },
];

const employmentOptions = [
  "Part-time",
  "Full-time",
  "Contract",
  "Temporary",
  "Project / Freelance",
  "Paid Internship",
  "Unpaid Internship",
];

const workModeOptions = ["Remote", "Onsite", "Hybrid"];

const scheduleOptions = [
  "Monday to Friday",
  "Weekend",
  "Day shift",
  "Night shift",
];

export default function PostProject() {
  const nav = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(initial);
  const [currentStep, setCurrentStep] = useState("about");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [fieldErr, setFieldErr] = useState({});

  const [locationInput, setLocationInput] = useState("");
  const [showRequirementInput, setShowRequirementInput] = useState(false);
  const [requirementDraft, setRequirementDraft] = useState("");
  const [toast, setToast] = useState("");
  const upd = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayValue = (key, value) => {
    setForm((prev) => {
      const arr = Array.isArray(prev[key]) ? prev[key] : [];
      const exists = arr.includes(value);

      return {
        ...prev,
        [key]: exists ? arr.filter((item) => item !== value) : [...arr, value],
      };
    });
  };

  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      setLoading(true);
      setErr("");
      setMsg("");
      setFieldErr({});

      try {
        const res = await api.get(`/company/projects/${id}`);
        const p = res?.data?.data || {};

        setForm({
          title: p?.title || "",
          category: p?.category || "",
          description: p?.description || "",
          hiring_locations: Array.isArray(p?.hiring_locations)
            ? p.hiring_locations
            : p?.city
              ? [p.city]
              : [],
          job_requirements: Array.isArray(p?.job_requirements)
            ? p.job_requirements
            : Array.isArray(p?.required_skills)
              ? p.required_skills
              : [],
          employment_type: Array.isArray(p?.employment_type)
            ? p.employment_type
            : p?.employment_type
              ? [p.employment_type]
              : [],
          work_mode: Array.isArray(p?.work_mode)
            ? p.work_mode
            : p?.job_type
              ? [String(p.job_type).charAt(0).toUpperCase() + String(p.job_type).slice(1)]
              : [],
          working_schedule: Array.isArray(p?.working_schedule)
            ? p.working_schedule[0] || ""
            : p?.working_schedule || "",
          salary_type: p?.salary_type || "hourly",
          hourly_rate: p?.hourly_rate ?? "",
          salary_min: p?.salary_min ?? "",
          salary_max: p?.salary_max ?? "",
          salary_negotiable: Boolean(p?.salary_negotiable),
          hiring_multiple_candidates: Boolean(p?.hiring_multiple_candidates),
          deadline_date: p?.deadline_date || "",
          attachment: null,
          attachment_url: p?.attachment_url || null,
        });
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load job.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const validateStep = () => {
    const errors = {};

    if (currentStep === "about") {
      if (!form.title.trim()) errors.title = ["Job title is required."];
      if (!form.category.trim()) errors.category = ["Category is required."];
      if (!form.description.trim()) errors.description = ["Description is required."];
    }

    if (currentStep === "details") {
      if (!form.employment_type.length) {
        errors.employment_type = ["Select at least one employment type."];
      }

      if (!form.work_mode.length) {
        errors.work_mode = ["Select at least one work mode."];
      }

      if (!form.working_schedule) {
        errors.working_schedule = ["Select a working schedule."];
      }

      if (!form.deadline_date) {
        errors.deadline_date = ["Deadline date is required."];
      }

      if (form.deadline_date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(form.deadline_date);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          errors.deadline_date = ["Deadline date cannot be in the past."];
        }
      }

      if (form.salary_type === "hourly" && !form.hourly_rate) {
        errors.hourly_rate = ["Hourly rate is required."];
      }

      if (form.salary_type === "custom" && !form.salary_min && !form.salary_max) {
        errors.salary_min = ["Enter salary min or max."];
      }
    }

    setFieldErr(errors);
    return Object.keys(errors).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) return;
    if (currentStep === "about") setCurrentStep("details");
  };

  const goBack = () => {
    if (currentStep === "details") setCurrentStep("about");
  };

  const addLocation = (value) => {
    const v = value.trim();
    if (!v) return;
    if (form.hiring_locations.includes(v)) return;
    upd("hiring_locations", [...form.hiring_locations, v]);
    setLocationInput("");
  };

  const removeLocation = (value) => {
    upd(
      "hiring_locations",
      form.hiring_locations.filter((item) => item !== value)
    );
  };

  const addRequirement = () => {
    const v = requirementDraft.trim();
    if (!v) return;
    if (form.job_requirements.includes(v)) return;
    upd("job_requirements", [...form.job_requirements, v]);
    setRequirementDraft("");
    setShowRequirementInput(false);
  };

  const removeRequirement = (value) => {
    upd(
      "job_requirements",
      form.job_requirements.filter((item) => item !== value)
    );
  };

  const submit = async (status) => {
    setSaving(true);
    setErr("");
    setMsg("");
    setFieldErr({});

    try {
      const fd = new FormData();

      fd.append("title", form.title);
      fd.append("category", form.category);
      fd.append("description", form.description);
      fd.append("status", status);

      fd.append("hiring_locations", JSON.stringify(form.hiring_locations || []));
      fd.append("job_requirements", JSON.stringify(form.job_requirements || []));
      fd.append("employment_type", JSON.stringify(form.employment_type || []));
      fd.append("work_mode", JSON.stringify(form.work_mode || []));
      fd.append("working_schedule", form.working_schedule || "");
      fd.append("deadline_date", form.deadline_date || "");
      fd.append("salary_type", form.salary_type);
      fd.append("salary_negotiable", form.salary_negotiable ? "1" : "0");
      fd.append(
        "hiring_multiple_candidates",
        form.hiring_multiple_candidates ? "1" : "0"
      );

      if (form.hourly_rate !== "") fd.append("hourly_rate", form.hourly_rate);
      if (form.salary_min !== "") fd.append("salary_min", form.salary_min);
      if (form.salary_max !== "") fd.append("salary_max", form.salary_max);
      if (form.attachment) fd.append("attachment", form.attachment);

      // backward compatibility
      fd.append("city", form.hiring_locations?.[0] || "");
      fd.append("job_type", (form.work_mode?.[0] || "").toLowerCase());
      fd.append("required_skills", JSON.stringify(form.job_requirements || []));

      if (isEdit) {
        fd.append("_method", "PUT");
        await api.post(`/company/projects/${id}`, fd);
        setToast(isEdit ? "Job updated successfully" : "Job posted successfully");
      } else {
        await api.post("/company/projects", fd);
        setToast(isEdit ? "Job updated successfully" : "Job posted successfully");
      }

      setTimeout(() => {
        nav("/company/my-projects");
      }, 1200);
    } catch (e) {
      const res = e?.response?.data;
      if (res?.errors) setFieldErr(res.errors);
      setErr(res?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const renderAboutStep = () => (
    <div className="stepCard">
      <div className="stepSection">
        <div className="stepLabelBlock">
          <h4>Job title</h4>
          <p>It must describe one position only.</p>
        </div>
        <div className="stepFieldBlock">
          <input
            value={form.title}
            onChange={(e) => upd("title", e.target.value)}
            placeholder="Kitchen Staff"
          />
          {fieldErr.title && <span className="ferr">{fieldErr.title[0]}</span>}
        </div>
      </div>

      <div className="stepSection">
        <div className="stepLabelBlock">
          <h4>Category</h4>
          <p>Select the category or domain of this job.</p>
        </div>
        <div className="stepFieldBlock">
          <input
            value={form.category}
            onChange={(e) => upd("category", e.target.value)}
            placeholder="e.g. Web Development"
          />
          {fieldErr.category && <span className="ferr">{fieldErr.category[0]}</span>}
        </div>
      </div>

      <div className="stepSection">
        <div className="stepLabelBlock">
          <h4>Job description</h4>
          <p>Provide a short description about the job. Keep it short and to the point.</p>
        </div>
        <div className="stepFieldBlock">



          <textarea
            rows={8}
            value={form.description}
            onChange={(e) => upd("description", e.target.value)}
            placeholder="Description"
            className="jdTextarea"
          />

          {fieldErr.description && (
            <span className="ferr">{fieldErr.description[0]}</span>
          )}
        </div>
      </div>

      <div className="stepSection">
        <div className="stepLabelBlock">
          <h4>
            Hiring locations
          </h4>
          <p>Add one or multiple locations.</p>
        </div>
        <div className="stepFieldBlock">

          <input
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Search for location"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLocation(locationInput);
              }
            }}
          />


          {!!form.hiring_locations.length && (
            <div className="locationChips">
              {form.hiring_locations.map((loc) => (
                <span className="locationChip" key={loc}>
                  {loc}
                  <button type="button" onClick={() => removeLocation(loc)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="helperText">Press Enter to add</div>
        </div>
      </div>

      <div className="stepSection">
        <div className="stepLabelBlock">
          <h4>
            Job requirements
          </h4>
          <p>Are there any job requirements?</p>
        </div>
        <div className="stepFieldBlock">
          {!showRequirementInput ? (
            <button
              type="button"
              className="addRequirementBtn"
              onClick={() => setShowRequirementInput(true)}
            >
              + Add requirements
            </button>
          ) : (
            <div className="requirementInputWrap">
              <input
                value={requirementDraft}
                onChange={(e) => setRequirementDraft(e.target.value)}
                placeholder="Add requirements"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRequirement();
                  }
                }}
              />
              <div className="requirementActions">
                <button type="button" className="miniBtn" onClick={addRequirement}>
                  Add
                </button>
                <button
                  type="button"
                  className="miniBtn ghost"
                  onClick={() => {
                    setShowRequirementInput(false);
                    setRequirementDraft("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!!form.job_requirements.length && (
            <div className="locationChips">
              {form.job_requirements.map((item) => (
                <span className="locationChip" key={item}>
                  {item}
                  <button type="button" onClick={() => removeRequirement(item)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="stepCard">
      <div className="detailRow">
        <div className="detailLeft">
          <h4>Employment type</h4>
          <p>Pick one or multiple options</p>
        </div>
        <div className="detailRight optionGrid">
          {employmentOptions.map((item) => (
            <label
              key={item}
              className={`checkCard ${form.employment_type.includes(item) ? "active" : ""
                }`}
            >
              <input
                type="checkbox"
                checked={form.employment_type.includes(item)}
                onChange={() => toggleArrayValue("employment_type", item)}
              />
              <span>{item}</span>
            </label>
          ))}
          {fieldErr.employment_type && (
            <span className="ferr fullWidth">{fieldErr.employment_type[0]}</span>
          )}
        </div>
      </div>
      <div className="detailRow">
        <div className="detailLeft">
          <h4>Work mode</h4>
          <p>Pick one or multiple options</p>
        </div>

        <div className="detailRight optionGrid">
          {workModeOptions.map((item) => (
            <label
              key={item}
              className={`checkCard ${form.work_mode.includes(item) ? "active" : ""}`}
            >
              <input
                type="checkbox"
                checked={form.work_mode.includes(item)}
                onChange={() => toggleArrayValue("work_mode", item)}
              />
              <span>{item}</span>
            </label>
          ))}

          {fieldErr.work_mode && (
            <span className="ferr fullWidth">{fieldErr.work_mode[0]}</span>
          )}
        </div>
      </div>
      <div className="detailRow">
        <div className="detailLeft">
          <h4>Working schedule</h4>
          <p>Select one work schedule.</p>
        </div>
        <div className="detailRight">
          <div className="scheduleSelectWrap">
            <select
              value={form.working_schedule}
              onChange={(e) => upd("working_schedule", e.target.value)}
            >
              <option value="">Pick working schedule</option>
              {scheduleOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="scheduleRecommendations">
            {["Monday to Friday", "Weekend", "Day shift"].map((item) => (
              <button
                type="button"
                key={item}
                className={`scheduleRecommendChip ${form.working_schedule === item ? "active" : ""
                  }`}
                onClick={() => upd("working_schedule", item)}
              >
                {item}
              </button>
            ))}
          </div>

          {fieldErr.working_schedule && (
            <span className="ferr">{fieldErr.working_schedule[0]}</span>
          )}
        </div>
      </div>

      <div className="detailRow">
        <div className="detailLeft">
          <h4>Application deadline</h4>
          <p>Select the last date candidates can apply for this job.</p>
        </div>

        <div className="detailRight">
          <div className="scheduleSelectWrap">
            <input
              type="date"
              value={form.deadline_date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => upd("deadline_date", e.target.value)}
            />
          </div>

          {fieldErr.deadline_date && (
            <span className="ferr">{fieldErr.deadline_date[0]}</span>
          )}
        </div>
      </div>

      <div className="detailRow">
        <div className="detailLeft">
          <h4>Salary</h4>
          <p>Choose how you prefer to pay for this job.</p>
        </div>

        <div className="detailRight salaryRight">
          <div className="salaryTypeGrid compact">
            <label className={`salaryCard ${form.salary_type === "hourly" ? "active" : ""}`}>
              <input
                type="radio"
                name="salary_type"
                checked={form.salary_type === "hourly"}
                onChange={() => upd("salary_type", "hourly")}
              />

              <div className="salaryCardContent vertical">
                <div className="salaryIcon"><i class="fa-solid fa-clock"></i></div>
                <span className="salaryCardTitle">Hourly</span>
              </div>
            </label>

            <label className={`salaryCard ${form.salary_type === "custom" ? "active" : ""}`}>
              <input
                type="radio"
                name="salary_type"
                checked={form.salary_type === "custom"}
                onChange={() => upd("salary_type", "custom")}
              />

              <div className="salaryCardContent vertical">
                <div className="salaryIcon"><i class="fa-solid fa-money-bill-1"></i></div>
                <span className="salaryCardTitle muted">Custom</span>
              </div>
            </label>
          </div>

          {form.salary_type === "hourly" ? (
            <div className="salaryInputWrap compactInput">
              <label>Hourly rate</label>
              <input
                type="number"
                value={form.hourly_rate}
                onChange={(e) => upd("hourly_rate", e.target.value)}
                placeholder="$35"
              />
              {fieldErr.hourly_rate && (
                <span className="ferr">{fieldErr.hourly_rate[0]}</span>
              )}
            </div>
          ) : (
            <div className="salaryRangeGrid compactRange">
              <div>
                <label>Salary min</label>
                <input
                  type="number"
                  value={form.salary_min}
                  onChange={(e) => upd("salary_min", e.target.value)}
                  placeholder="50000"
                />
              </div>

              <div>
                <label>Salary max</label>
                <input
                  type="number"
                  value={form.salary_max}
                  onChange={(e) => upd("salary_max", e.target.value)}
                  placeholder="120000"
                />
              </div>

              {fieldErr.salary_min && (
                <span className="ferr fullWidth">{fieldErr.salary_min[0]}</span>
              )}
            </div>
          )}

          <label className="salaryCheckbox compactCheck">
            <input
              type="checkbox"
              checked={form.salary_negotiable}
              onChange={(e) => upd("salary_negotiable", e.target.checked)}
            />
            <span>Salary is negotiable</span>
          </label>
        </div>
      </div>
      <div className="detailRow">
        <div className="detailLeft">
          <h4>Hiring multiple candidates?</h4>
          <p>This will be displayed on job page for candidates to see.</p>
        </div>
        <div className="detailRight">
          <label className="checkCard wide">
            <input
              type="checkbox"
              checked={form.hiring_multiple_candidates}
              onChange={(e) =>
                upd("hiring_multiple_candidates", e.target.checked)
              }
            />
            <span>Yes, I am hiring multiple candidates</span>
          </label>
        </div>
      </div>

    </div>
  );



  return (
    <div className="ppPage">
      <div className="ppHeader">
        <div>
          <h2>{isEdit ? "Edit Job" : "Post a Job"}</h2>
          <p>
            {isEdit
              ? "Update your job details and publish when ready."
              : "Create a new job and publish or save as draft."}
          </p>
        </div>

        <div className="ppActions">
          <button
            type="button"
            className="btn secondary"
            disabled={saving || loading}
            onClick={() => submit("draft")}
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>

          {currentStep === "details" && (
            <button
              type="button"
              className="btn primary"
              disabled={saving || loading}
              onClick={() => submit("published")}
            >
              {saving ? "Publishing..." : "Publish"}
            </button>
          )}
        </div>
      </div>
      {toast && <div className="successToast">{toast}</div>}
      {(err || msg) && (
        <div className={`ppAlert ${err ? "danger" : "success"}`}>
          {err || msg}
        </div>
      )}

      {loading ? (
        <div className="wizardContent">Loading...</div>
      ) : (
        <>
          <div className="topStepper">
            {steps.map((step, idx) => {
              const activeIndex = steps.findIndex((s) => s.key === currentStep);
              const isDone = idx < activeIndex;
              const isActive = step.key === currentStep;

              return (
                <div
                  key={step.key}
                  className="stepperItem"
                  onClick={() => setCurrentStep(step.key)}
                >
                  <div className={`stepperCircle ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}>
                    {isDone ? "✓" : idx + 1}
                  </div>
                  <div className={`stepperLine ${idx < steps.length - 1 ? "show" : ""} ${idx < activeIndex ? "filled" : ""}`} />
                  <div className={`stepperLabel ${isActive ? "active" : ""}`}>
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="wizardContent">
            {currentStep === "about" && renderAboutStep()}
            {currentStep === "details" && renderDetailsStep()}

            <div className="wizardFooter">
              {currentStep !== "about" ? (
                <button type="button" className="btn ghost" onClick={goBack}>
                  Back
                </button>
              ) : (
                <div />
              )}

              {currentStep === "about" ? (
                <button type="button" className="btn primary" onClick={goNext}>
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  className="btn primary"
                  disabled={saving}
                  onClick={() => submit("published")}
                >
                  {saving ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}