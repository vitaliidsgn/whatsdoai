import { useState, useEffect } from "react";
import type { Partner } from "../types";
import { updateProfile } from "../api/client";

interface SetupProfileProps {
  partner: Partner;
  onStepComplete: () => void;
}

export function SetupProfile({ partner, onStepComplete }: SetupProfileProps) {
  const DRAFT_KEY = `whatsdo_draft_${partner.id}`;

  const [name, setName] = useState(partner.name || "");
  const [phone, setPhone] = useState(partner.phone || "");
  const [nameError, setNameError] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Restore draft on mount
  useEffect(() => {
    if (!partner.name && !partner.phone) {
      try {
        const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
        if (draft) {
          if (draft.name) setName(draft.name);
          if (draft.phone) setPhone(draft.phone);
        }
      } catch {
        // ignore
      }
    }
  }, [DRAFT_KEY, partner.name, partner.phone]);

  function saveDraft(n: string, p: string) {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ name: n, phone: p }));
    } catch {
      // ignore
    }
  }

  function handleNameChange(value: string) {
    setName(value);
    setNameError(value.length > 0 && value.length < 2);
    saveDraft(value, phone);
  }

  function handlePhoneChange(value: string) {
    setPhone(value);
    saveDraft(name, value);
  }

  const isValid = name.trim().length >= 2;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      await updateProfile(partner.id, {
        name: name.trim(),
        phone: phone.trim() || null,
      });
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
      onStepComplete();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        marginTop: 38,
      }}
    >
      {/* Business name */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label
          htmlFor="name"
          style={{
            fontWeight: 700,
            fontSize: 14,
            lineHeight: "20px",
            color: "#2e2f32",
            paddingBottom: 4,
            display: "flex",
            gap: 4,
          }}
        >
          Business name <span style={{ color: "#da1e28" }}>*</span>
        </label>
        <input
          type="text"
          id="name"
          required
          minLength={2}
          placeholder="Your business name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          style={{
            height: 56,
            width: "100%",
            border: "1px solid #909196",
            borderRadius: 4,
            background: "white",
            padding: "8px 16px",
            fontSize: 16,
            lineHeight: "24px",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "black")}
          onBlur={(e) => (e.target.style.borderColor = "#909196")}
        />
        {nameError && (
          <p style={{ marginTop: 4, fontSize: 13, color: "#da1e28" }}>
            Business name must be at least 2 characters.
          </p>
        )}
      </div>

      {/* Email (readonly) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label
          htmlFor="email"
          style={{
            fontWeight: 700,
            fontSize: 14,
            lineHeight: "20px",
            color: "#2e2f32",
            paddingBottom: 4,
            display: "flex",
            gap: 4,
          }}
        >
          Email <span style={{ color: "#da1e28" }}>*</span>
        </label>
        <input
          type="email"
          id="email"
          readOnly
          value={partner.email}
          style={{
            height: 56,
            width: "100%",
            border: "1px solid #909196",
            borderRadius: 4,
            background: "#f5f5f5",
            padding: "8px 16px",
            fontSize: 16,
            lineHeight: "24px",
            outline: "none",
            boxSizing: "border-box",
            opacity: 0.7,
            cursor: "not-allowed",
          }}
        />
      </div>

      {/* Phone */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label
          htmlFor="phone"
          style={{
            fontWeight: 700,
            fontSize: 14,
            lineHeight: "20px",
            color: "#2e2f32",
            paddingBottom: 4,
            display: "flex",
            gap: 4,
          }}
        >
          Phone <span style={{ color: "#da1e28" }}>*</span>
        </label>
        <input
          type="tel"
          id="phone"
          placeholder="+1 555-0123"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          style={{
            height: 56,
            width: "100%",
            border: "1px solid #909196",
            borderRadius: 4,
            background: "white",
            padding: "8px 16px",
            fontSize: 16,
            lineHeight: "24px",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "black")}
          onBlur={(e) => (e.target.style.borderColor = "#909196")}
        />
      </div>

      {/* Form error */}
      {formError && (
        <p style={{ fontSize: 14, color: "#da1e28" }}>{formError}</p>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!isValid || submitting}
        className="btn"
        style={{
          width: "100%",
          background: "black",
          color: "#ededed",
          borderRadius: 99,
          padding: "12px 24px",
          fontSize: 16,
          fontWeight: 500,
          lineHeight: "24px",
          border: "none",
          cursor: isValid && !submitting ? "pointer" : "not-allowed",
          marginTop: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: isValid && !submitting ? 1 : 0.4,
          transition: "opacity 0.15s",
        }}
      >
        <span>{submitting ? "Saving..." : "Continue"}</span>
        {submitting && (
          <svg
            className="animate-spinner"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              style={{ opacity: 0.25 }}
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              style={{ opacity: 0.75 }}
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
      </button>
    </form>
  );
}
