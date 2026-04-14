import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { OnboardingSignup } from "./pages/OnboardingSignup";
import { OnboardingRouter } from "./pages/OnboardingRouter";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<OnboardingSignup />} />
        <Route path="/:id" element={<OnboardingRouter />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
