import { useState, useEffect, useRef } from "react";
import type { Partner } from "../types";
import { getPartner, syncLocations } from "../api/client";

interface CompleteProps {
  partner: Partner;
}

type SyncStatus = "syncing" | "success" | "empty" | "error";

export function Complete({ partner: initialPartner }: CompleteProps) {
  const [syncStatus] = useState<SyncStatus>("success");
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll for sync status when syncing
  useEffect(() => {
    if (syncStatus !== "syncing") return;

    let elapsed = 0;
    intervalRef.current = setInterval(async () => {
      elapsed += 3000;
      if (elapsed > 60000) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      try {
        await getPartner(initialPartner.id);
        window.location.reload();
      } catch {
        // ignore polling errors
      }
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [syncStatus, initialPartner.id]);

  async function handleRetry() {
    setRetrying(true);
    setRetryError("");
    try {
      await syncLocations(initialPartner.id);
      window.location.reload();
    } catch (err) {
      setRetryError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setRetrying(false);
    }
  }

  return (
    <div style={{ marginTop: 126 }}>
      {syncStatus === "syncing" && (
        <>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <svg
              className="animate-spinner"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                style={{ opacity: 0.25 }}
                cx="12"
                cy="12"
                r="10"
                stroke="#6b7280"
                strokeWidth="4"
              />
              <path
                style={{ opacity: 0.75 }}
                fill="#6b7280"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <p
            style={{
              fontSize: 14,
              lineHeight: "20px",
              color: "black",
              opacity: 0.4,
            }}
          >
            This usually takes a few seconds.
          </p>
        </>
      )}

      {syncStatus === "success" && (
        <a
          href="/"
          className="btn"
          style={{
            display: "inline-block",
            background: "black",
            color: "#ededed",
            borderRadius: 99,
            padding: "12px 24px",
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "24px",
            textDecoration: "none",
          }}
        >
          Back home
        </a>
      )}

      {(syncStatus === "empty" || syncStatus === "error") && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "black",
                color: "#ededed",
                borderRadius: 99,
                padding: "12px 24px",
                fontSize: 16,
                fontWeight: 500,
                border: "none",
                cursor: retrying ? "not-allowed" : "pointer",
              }}
            >
              <span>{retrying ? "Syncing..." : "Retry sync"}</span>
              {retrying && (
                <svg
                  className="animate-spinner"
                  width="16"
                  height="16"
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
            <a
              href="mailto:support@whatsdo.com"
              className="btn btn-outline"
              style={{
                border: "1px solid rgba(0,0,0,0.2)",
                borderRadius: 99,
                padding: "12px 24px",
                fontSize: 16,
                fontWeight: 500,
                color: "black",
                textDecoration: "none",
              }}
            >
              Contact support
            </a>
          </div>
          {retryError && (
            <p style={{ marginTop: 12, fontSize: 14, color: "#da1e28" }}>
              {retryError}
            </p>
          )}
        </>
      )}
    </div>
  );
}

/** Helper: returns title and subtitle for the OnboardingLayout based on sync status */
export function getCompleteTitles(syncStatus: SyncStatus = "success") {
  switch (syncStatus) {
    case "syncing":
      return {
        title: "Syncing your services...",
        subtitle: "We're importing your data from Square.",
      };
    case "success":
      return {
        title: "Thank you for your interest in What'sDo.",
        subtitle: "A member of our team will contact you soon.",
      };
    case "empty":
      return {
        title: "Connected, but no services found",
        subtitle:
          "Make sure your Square account has active locations with services or items configured.",
      };
    case "error":
      return {
        title: "Something went wrong during sync",
        subtitle:
          "An unexpected error occurred. Please try again or contact support.",
      };
  }
}
