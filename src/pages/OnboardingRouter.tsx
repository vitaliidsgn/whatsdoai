import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPartner } from "../api/client";
import type { Partner } from "../types";
import { OnboardingLayout } from "../components/OnboardingLayout";
import { SetupProfile } from "./SetupProfile";
import { ConnectProvider } from "./ConnectProvider";
import { Complete, getCompleteTitles } from "./Complete";

const STEP_INDEX: Record<string, number> = {
  setup_profile: 0,
  connect_provider: 1,
  complete: 2,
};

const STEP_DEFAULTS = {
  title: "Tell us about your business",
  subtitle: "We'll tailor What'sDo to your needs",
};

export function OnboardingRouter() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error")
  );

  const fetchPartner = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getPartner(id);
      setPartner(data);
      setFetchError("");
    } catch (err) {
      setFetchError(
        err instanceof Error ? err.message : "Failed to load partner"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPartner();
  }, [fetchPartner]);

  function handleDismissError() {
    setError(null);
    searchParams.delete("error");
    searchParams.delete("detail");
    setSearchParams(searchParams, { replace: true });
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          className="animate-spinner"
          width="32"
          height="32"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            style={{ opacity: 0.25 }}
            cx="12"
            cy="12"
            r="10"
            stroke="black"
            strokeWidth="4"
          />
          <path
            style={{ opacity: 0.75 }}
            fill="black"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }

  if (fetchError || !partner) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <p style={{ fontSize: 18, color: "#b91c1c" }}>
          {fetchError || "Partner not found"}
        </p>
        <a
          href="/"
          style={{ fontSize: 16, color: "black", textDecoration: "underline" }}
        >
          Back to registration
        </a>
      </div>
    );
  }

  const stepIdx = STEP_INDEX[partner.onboarding_step] ?? 0;
  const isComplete = partner.onboarding_step === "complete";

  const titles = isComplete ? getCompleteTitles() : STEP_DEFAULTS;

  return (
    <OnboardingLayout
      title={titles.title}
      subtitle={titles.subtitle}
      currentStepIdx={stepIdx}
      showTabs={!isComplete}
      error={error}
      onDismissError={handleDismissError}
    >
      {partner.onboarding_step === "setup_profile" && (
        <SetupProfile partner={partner} onStepComplete={fetchPartner} />
      )}
      {partner.onboarding_step === "connect_provider" && (
        <ConnectProvider partner={partner} onStepComplete={fetchPartner} />
      )}
      {partner.onboarding_step === "complete" && (
        <Complete partner={partner} />
      )}
    </OnboardingLayout>
  );
}
