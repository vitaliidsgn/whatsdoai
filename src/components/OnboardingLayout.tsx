import { ProgressTabs } from "./ProgressTabs";
import { ErrorBanner } from "./ErrorBanner";

interface OnboardingLayoutProps {
  title: string;
  subtitle: string;
  currentStepIdx: number;
  showTabs?: boolean;
  error?: string | null;
  onDismissError?: () => void;
  children: React.ReactNode;
}

export function OnboardingLayout({
  title,
  subtitle,
  currentStepIdx,
  showTabs = true,
  error,
  onDismissError,
  children,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fff7e8" }}>
      <div className="flex min-h-screen relative">
        {/* Left panel */}
        <div
          className="w-full md:w-1/2 flex flex-col"
          style={{ backgroundColor: "#fff7e8", padding: "120px 80px 80px 80px" }}
        >
          {/* Barcode logo */}
          <div style={{ width: 83, height: 21, flexShrink: 0 }}>
            <svg
              width="83"
              height="21"
              viewBox="0 0 83.0103 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "block", transform: "scaleX(-1)" }}
            >
              <path d="M1.44615 21H0V0H1.44615V21Z" fill="black" />
              <path d="M12.7594 21H11.0298V0H12.7594V21Z" fill="black" />
              <path d="M21.6817 21H19.6214V0H21.6817V21Z" fill="black" />
              <path d="M28.5014 21H25.9494V0H28.5014V21Z" fill="black" />
              <path d="M52.0052 21H31.0052V0H52.0052V21Z" fill="black" />
              <path d="M57.0609 21H54.5089V0H57.0609V21Z" fill="black" />
              <path d="M63.3891 21H61.3286V0H63.3891V21Z" fill="black" />
              <path d="M71.9798 21H70.2503V0H71.9798V21Z" fill="black" />
              <path d="M83.0103 21H81.5641V0H83.0103V21Z" fill="black" />
            </svg>
          </div>

          {/* Title + subtitle */}
          <div style={{ marginTop: 32, width: 480, maxWidth: "100%" }}>
            <h1
              style={{
                fontWeight: 700,
                fontSize: 36,
                lineHeight: "48px",
                color: "black",
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "black",
                opacity: 0.6,
                margin: "16px 0 0 0",
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Progress tabs */}
          {showTabs && currentStepIdx < 2 && (
            <ProgressTabs currentStepIdx={currentStepIdx} />
          )}

          {/* Error banner */}
          {error && (
            <ErrorBanner message={error} onDismiss={onDismissError} />
          )}

          {/* Step content */}
          <div style={{ width: 480, maxWidth: "100%" }}>{children}</div>
        </div>

        {/* Right panel: hero image */}
        <div
          className="hidden md:block"
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            bottom: 20,
            width: "calc(50% - 36px)",
            overflow: "hidden",
            borderRadius: 20,
          }}
        >
          <img
            src="/onboarding/hero-restaurant.jpg"
            alt="Restaurant interior"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.2)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
