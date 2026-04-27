import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { getToken } from "./lib/auth";
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

function GuestOnly(props: { children: JSX.Element }) {
  if (getToken()) return <Navigate to="/dashboard" replace />;
  return props.children;
}

function ProtectedOnly(props: { children: JSX.Element }) {
  if (!getToken()) return <Navigate to="/login" replace />;
  return props.children;
}

export default function App() {
  return (
    <>
      <NormalizePath />
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <GuestOnly>
                <Landing />
              </GuestOnly>
            }
          />
          <Route
            path="/login"
            element={
              <GuestOnly>
                <Login />
              </GuestOnly>
            }
          />
          <Route
            path="/register"
            element={
              <GuestOnly>
                <Register />
              </GuestOnly>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedOnly>
                <Dashboard />
              </ProtectedOnly>
            }
          />
          <Route
            path="/dashboard/analytics"
            element={
              <ProtectedOnly>
                <Analytics />
              </ProtectedOnly>
            }
          />
          <Route
            path="/dashboard/bookings"
            element={
              <ProtectedOnly>
                <Bookings />
              </ProtectedOnly>
            }
          />
          <Route
            path="/dashboard/event-types/new"
            element={
              <ProtectedOnly>
                <EventTypeEditor mode="new" />
              </ProtectedOnly>
            }
          />
          <Route
            path="/dashboard/event-types/:id"
            element={
              <ProtectedOnly>
                <EventTypeEditor mode="edit" />
              </ProtectedOnly>
            }
          />
          <Route
            path="/dashboard/availability"
            element={
              <ProtectedOnly>
                <Availability />
              </ProtectedOnly>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedOnly>
                <ProfileSettings />
              </ProtectedOnly>
            }
          />
        </Route>

        {/* public booking url like calendly.com/username/event */}
        <Route path="/:username/:eventSlug" element={<PublicBooking />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
