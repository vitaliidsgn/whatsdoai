import { useState, useEffect } from "react";

const COOKIE_CONSENT_KEY = "cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "#000",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        flexWrap: "wrap",
      }}
    >
      <p style={{ fontSize: 14, color: "#fff7e8", margin: 0 }}>
        We use cookies to improve your experience.{" "}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#fff7e8", textDecoration: "underline" }}
        >
          Cookie Policy
        </a>
      </p>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          onClick={handleAccept}
          className="btn btn-light"
          style={{
            background: "#fff7e8",
            color: "#000",
            padding: "8px 24px",
            fontSize: 14,
            fontWeight: 500,
            border: "none",
            borderRadius: 0,
            cursor: "pointer",
          }}
        >
          Accept
        </button>
        <button
          onClick={handleDecline}
          style={{
            background: "none",
            border: "none",
            color: "#fff7e8",
            opacity: 0.6,
            fontSize: 14,
            cursor: "pointer",
            padding: "8px 12px",
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
