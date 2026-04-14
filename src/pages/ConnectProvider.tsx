import { useState, useEffect } from "react";
import type { Partner } from "../types";

interface ConnectProviderProps {
  partner: Partner;
  onStepComplete: () => void;
}

export function ConnectProvider({
  partner,
  onStepComplete,
}: ConnectProviderProps) {
  const [connecting, setConnecting] = useState(false);
  const connected = partner.provider_id !== null;

  // Auto-advance when connected
  useEffect(() => {
    if (connected) {
      const timer = setTimeout(() => onStepComplete(), 2000);
      return () => clearTimeout(timer);
    }
  }, [connected, onStepComplete]);

  const returnUrl = `${__BACKEND_URL__}/onboarding/${partner.id}`;
  const oauthUrl = `/api/square/authorize?partner_id=${partner.id}&return_url=${encodeURIComponent(returnUrl)}`;

  function handleConnect() {
    setConnecting(true);
    window.location.href = oauthUrl;
  }

  return (
    <div style={{ marginTop: 38 }}>
      {/* Description */}
      <p style={{ fontSize: 14, lineHeight: "20px", color: "#2e2f32" }}>
        Connect your payment provider to start accepting bookings
      </p>

      {/* Provider cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginTop: 44,
        }}
      >
        {/* Square row */}
        <div
          style={{
            border: "1px solid #bbb",
            borderRadius: 4,
            padding: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img
            src="/onboarding/square-logo.svg"
            alt="Square"
            style={{ width: 96, height: 24, display: "block" }}
          />
          {connected ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                fontWeight: 600,
                color: "#1ab942",
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Connected
            </span>
          ) : (
            <button
              onClick={handleConnect}
              className="btn btn-outline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                border: "1px solid black",
                borderRadius: 99,
                padding: "8px 16px",
                fontSize: 14,
                fontWeight: 600,
                color: "black",
                background: "white",
                cursor: "pointer",
              }}
            >
              <span>{connecting ? "Connecting..." : "Connect"}</span>
              {connecting && (
                <span
                  className="animate-spinner"
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(0,0,0,0.3)",
                    borderTopColor: "black",
                    borderRadius: "50%",
                  }}
                />
              )}
            </button>
          )}
        </div>

        {/* 10+ providers row (dashed) */}
        <div
          style={{
            border: "1px dashed #909196",
            borderRadius: 4,
            padding: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", paddingRight: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#6366f1", border: "2px solid white", flexShrink: 0 }} />
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f59e0b", border: "2px solid white", flexShrink: 0, marginLeft: -8 }} />
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#10b981", border: "2px solid white", flexShrink: 0, marginLeft: -8 }} />
            </div>
            <span style={{ fontSize: 14, lineHeight: "20px", color: "#2e2f32" }}>10+ providers</span>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid black", borderRadius: 99, padding: "8px 16px", fontSize: 14, fontWeight: 600, opacity: 0.2, cursor: "default" }}>
            Coming soon
          </span>
        </div>
      </div>

      {/* Bottom buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => window.history.back()}
          style={{ border: "1px solid black", borderRadius: 99, padding: "12px 24px", fontSize: 16, fontWeight: 600, color: "black", background: "white", cursor: "pointer" }}
        >
          Back
        </button>
        <button
          type="button"
          className="btn"
          disabled
          style={{ background: "black", color: "#ededed", borderRadius: 99, padding: "12px 24px", fontSize: 16, fontWeight: 500, border: "none", opacity: 0.23, cursor: "not-allowed" }}
        >
          Submit
        </button>
      </div>

      {connected && (
        <p style={{ marginTop: 16, fontSize: 14, color: "rgba(0,0,0,0.6)" }}>
          Your Square account is connected. Finishing setup...
        </p>
      )}
    </div>
  );
}
