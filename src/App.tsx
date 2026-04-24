import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { EventTypeEditor } from "./pages/EventTypeEditor";
import { Availability } from "./pages/Availability";
import { Bookings } from "./pages/Bookings";
import { PublicBooking } from "./pages/PublicBooking";
import { Analytics } from "./pages/Analytics";
import { ProfileSettings } from "./pages/ProfileSettings";

function NormalizePath() {
  const location = useLocation();
  const collapsed = `/${location.pathname.split("/").filter(Boolean).join("/")}`;
  const normalizedPath = collapsed === "/" ? "/" : collapsed;
  if (location.pathname !== normalizedPath) {
    return (
      <Navigate
        to={`${normalizedPath}${location.search}${location.hash}`}
        replace
      />
    );
  }
  return null;
}

export default function App() {
  return (
    <>
      <NormalizePath />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="/dashboard/bookings" element={<Bookings />} />
          <Route
            path="/dashboard/event-types/new"
            element={<EventTypeEditor mode="new" />}
          />
          <Route
            path="/dashboard/event-types/:id"
            element={<EventTypeEditor mode="edit" />}
          />
          <Route path="/dashboard/availability" element={<Availability />} />
          <Route path="/dashboard/profile" element={<ProfileSettings />} />
        </Route>

        {/* public booking url like calendly.com/username/event */}
        <Route path="/:username/:eventSlug" element={<PublicBooking />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
