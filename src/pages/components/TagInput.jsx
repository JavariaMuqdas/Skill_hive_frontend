import { useMemo, useState } from "react";
import "./tagInput.css";

export default function TagInput({
  value = [],
  onChange,
  placeholder = "Type skill and press Enter",
  maxTags = 30,
}) {
  const [txt, setTxt] = useState("");

  const norm = (s) =>
    s
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

  const tags = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  const addTag = (raw) => {
    const t = norm(raw);
    if (!t) return;

    if (tags.map(norm).includes(t)) return;
    if (tags.length >= maxTags) return;

    onChange?.([...tags, raw.trim()]);
  };

  const removeTag = (idx) => {
    const copy = [...tags];
    copy.splice(idx, 1);
    onChange?.(copy);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(txt);
      setTxt("");
    }
    if (e.key === "Backspace" && !txt && tags.length) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="tagWrap">
      <div className="tagList">
        {tags.map((t, idx) => (
          <span className="tag" key={`${t}-${idx}`}>
            {t}
            <button type="button" className="tagX" onClick={() => removeTag(idx)}>
              ×
            </button>
          </span>
        ))}
        <input
          className="tagInput"
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={tags.length ? "" : placeholder}
        />
      </div>
      <div className="tagHint">
        Press <b>Enter</b> to add. Backspace removes last.
      </div>
    </div>
  );
}
