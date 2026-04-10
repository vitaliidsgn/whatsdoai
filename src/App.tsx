import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function Placeholder({ name }: { name: string }) {
  return <div>Page: {name}</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Placeholder name="Landing" />} />
        <Route path="/onboarding/:id" element={<Placeholder name="Onboarding" />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
