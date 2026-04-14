import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { registerPartner, updateProfile } from "../api/client";
import { OnboardingLayout } from "../components/OnboardingLayout";

export function OnboardingSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const DRAFT_KEY = "whatsdo_signup_draft";

  const [name, setName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  // Restore draft on mount
  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (draft) {
        if (draft.name) setName(draft.name);
        if (draft.phone) setPhone(draft.phone);
        if (!searchParams.get("email") && draft.email) setEmail(draft.email);
      }
    } catch {
      // ignore
    }
    nameRef.current?.focus();
  }, [searchParams]);

  function saveDraft(n: string, e: string, p: string) {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ name: n, email: e, phone: p }));
    } catch {
      // ignore
    }
  }

  function handleNameChange(value: string) {
    setName(value);
    saveDraft(value, email, phone);
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    saveDraft(name, value, phone);
  }

  function handlePhoneChange(value: string) {
    setPhone(value);
    saveDraft(name, email, value);
  }

  const isValid = name.trim().length >= 2 && email.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const data = await registerPartner(email.trim());
      await updateProfile(data.partner.id, {
        name: name.trim(),
        phone: phone.trim() || null,
      });
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
      navigate(`/${data.partner.id}`);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setSubmitting(false);
    }
  }

  return (
    <OnboardingLayout
      title="Tell us about your business"
      subtitle="We'll tailor What'sDo to your needs"
      currentStepIdx={0}
      showTabs={true}
    >
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
            ref={nameRef}
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
        </div>

        {/* Email */}
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
            required
            placeholder="you@yourbusiness.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
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
            Phone
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
    </OnboardingLayout>
  );
}
