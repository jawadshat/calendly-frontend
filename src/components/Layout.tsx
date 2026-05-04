/** Shared app shell: header, optional dashboard sidebar, and footer. */
import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { getToken, logout } from "../lib/auth";
import { api } from "../lib/api";
import "../pages/AppChrome.css";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const authed = Boolean(getToken());
  const isDashboardRoute =
    location.pathname === "/dashboard" ||
    location.pathname.startsWith("/dashboard/");
  const year = new Date().getFullYear();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<{
    username?: string;
    email?: string;
    displayName?: string;
  } | null>(null);
  const sidebarItems = [
    { to: "/dashboard", label: "Dashboard", icon: "grid", exact: true },
    { to: "/dashboard/bookings", label: "Scheduled events", icon: "calendar" },
    { to: "/dashboard/availability", label: "Availability", icon: "clock" },
    { to: "/dashboard/analytics", label: "Analytics", icon: "chart" },
    { to: "/dashboard/profile", label: "Profile settings", icon: "profile" },
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let mounted = true;
    if (!authed) {
      setProfile(null);
      return;
    }
    void (async () => {
      try {
        const me = await api.me();
        if (!mounted) return;
        setProfile({
          username: me?.user?.username ?? "",
          email: me?.user?.email ?? "",
          displayName: me?.user?.displayName ?? "",
        });
      } catch {
        if (!mounted) return;
        setProfile(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [authed]);

  const profileLabel =
    profile?.displayName || profile?.username || "My account";
  const profileSubLabel =
    profile?.email || (profile?.username ? `@${profile.username}` : "");
  const brandTo = authed && isDashboardRoute ? "/dashboard" : "/";
  const brandTitle = authed && isDashboardRoute ? "Back to dashboard" : "Home";

  return (
    <div className="app-shell-root">
      <header
        className={`app-top${authed && isDashboardRoute ? " app-top-dashboard" : ""}`}
      >
        <div className="app-top-inner">
          <Link to={brandTo} className="app-brand" title={brandTitle}>
            <span className="app-brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="17"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.75"
                />
                <path d="M3 9.5h18" stroke="currentColor" strokeWidth="1.75" />
                <path
                  d="M8 2.5v4M16 2.5v4"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="15" r="1.5" fill="currentColor" />
              </svg>
            </span>
            <span className="app-brand-text">
              <span className="app-brand-name">
                <span className="app-brand-accent">C</span>alendlyClone
              </span>
              <span className="app-brand-tagline">
                {authed && isDashboardRoute
                  ? "Your scheduling workspace"
                  : "Scheduling that stays simple"}
              </span>
            </span>
          </Link>

          <div className="app-top-actions">
            {!authed ? (
              <nav className="app-nav" aria-label="Primary">
                <div className="app-nav-shell">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `app-nav-link${isActive ? " active" : ""}`
                    }
                    end
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/product"
                    className={({ isActive }) =>
                      `app-nav-link${isActive ? " active" : ""}`
                    }
                  >
                    Product
                  </NavLink>
                  <NavLink
                    to="/we-solve"
                    className={({ isActive }) =>
                      `app-nav-link${isActive ? " active" : ""}`
                    }
                  >
                    We solve
                  </NavLink>
                </div>
                <div className="app-nav-auth">
                  <Link to="/login" className="app-nav-link">
                    Log in
                  </Link>
                  <Link to="/register" className="app-nav-link app-nav-cta">
                    Get started
                  </Link>
                </div>
              </nav>
            ) : isDashboardRoute ? (
              <nav className="app-nav app-nav-dashboard" aria-label="Account">
                <span className="app-dashboard-top-label">Workspace</span>
                <Link
                  to="/dashboard/profile"
                  className="app-profile-quick-link"
                >
                  <span className="app-profile-quick-avatar">
                    {(profileLabel?.[0] ?? "U").toUpperCase()}
                  </span>
                  <span className="app-profile-quick-text">
                    <strong>{profileLabel}</strong>
                    <small>Profile & account</small>
                  </span>
                </Link>
              </nav>
            ) : (
              <nav className="app-nav app-nav-authed" aria-label="Primary">
                <div className="app-nav-shell">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `app-nav-link${isActive ? " active" : ""}`
                    }
                    end
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/product"
                    className={({ isActive }) =>
                      `app-nav-link${isActive ? " active" : ""}`
                    }
                  >
                    Product
                  </NavLink>
                  <NavLink
                    to="/we-solve"
                    className={({ isActive }) =>
                      `app-nav-link${isActive ? " active" : ""}`
                    }
                  >
                    We solve
                  </NavLink>
                </div>
                <Link
                  to="/dashboard/profile"
                  className="app-profile-quick-link"
                >
                  <span className="app-profile-quick-avatar">
                    {(profileLabel?.[0] ?? "U").toUpperCase()}
                  </span>
                  <span className="app-profile-quick-text">
                    <strong>{profileLabel}</strong>
                    <small>Profile settings</small>
                  </span>
                </Link>
              </nav>
            )}
            <button
              type="button"
              className="app-mobile-menu-btn"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
        {!authed ? (
          <div
            className={`app-mobile-nav${mobileMenuOpen ? " is-open" : ""}`}
            role="navigation"
            aria-label="Mobile"
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                `app-nav-link${isActive ? " active" : ""}`
              }
              end
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/product"
              className={({ isActive }) =>
                `app-nav-link${isActive ? " active" : ""}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Product
            </NavLink>
            <NavLink
              to="/we-solve"
              className={({ isActive }) =>
                `app-nav-link${isActive ? " active" : ""}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              We solve
            </NavLink>
            <Link
              to="/login"
              className="app-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="app-nav-link app-nav-cta"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get started
            </Link>
          </div>
        ) : authed && !isDashboardRoute ? (
          <div
            className={`app-mobile-nav app-mobile-nav-authed${mobileMenuOpen ? " is-open" : ""}`}
            role="navigation"
            aria-label="Mobile"
          >
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `app-nav-link${isActive ? " active" : ""}`
              }
              end
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/product"
              className={({ isActive }) =>
                `app-nav-link${isActive ? " active" : ""}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Product
            </NavLink>
            <NavLink
              to="/we-solve"
              className={({ isActive }) =>
                `app-nav-link${isActive ? " active" : ""}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              We solve
            </NavLink>
            <Link
              to="/dashboard/profile"
              className="app-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
          </div>
        ) : null}
      </header>

      {authed && isDashboardRoute ? (
        <main
          className={`app-main app-main-dashboard${sidebarCollapsed ? " sidebar-collapsed" : ""}`}
        >
          <aside
            className={`app-sidebar${sidebarCollapsed ? " is-collapsed" : ""}${mobileMenuOpen ? " is-mobile-open" : ""}`}
          >
            <div className="app-sidebar-head">
              <div>
                <div className="app-sidebar-title">Workspace</div>
                <div className="app-sidebar-subtitle">
                  {profileSubLabel || "Event types, availability, and bookings"}
                </div>
              </div>
              <button
                type="button"
                className="app-sidebar-toggle"
                onClick={() => setSidebarCollapsed((v) => !v)}
                aria-label={
                  sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                }
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? ">" : "<"}
              </button>
            </div>
            <nav className="app-sidebar-nav">
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={Boolean(item.exact)}
                  style={{ textDecoration: "none" }}
                  className={({ isActive }) =>
                    `app-sidebar-link${isActive ? " active" : ""}`
                  }
                  title={sidebarCollapsed ? item.label : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="app-sidebar-link-icon" aria-hidden="true">
                    {item.icon === "grid" ? (
                      <svg viewBox="0 0 24 24" fill="none">
                        <rect x="4" y="4" width="6" height="6" rx="1.5" />
                        <rect x="14" y="4" width="6" height="6" rx="1.5" />
                        <rect x="4" y="14" width="6" height="6" rx="1.5" />
                        <rect x="14" y="14" width="6" height="6" rx="1.5" />
                      </svg>
                    ) : null}
                    {item.icon === "calendar" ? (
                      <svg viewBox="0 0 24 24" fill="none">
                        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
                        <path d="M3.5 9.5h17" />
                        <path d="M8 3.5v3" />
                        <path d="M16 3.5v3" />
                      </svg>
                    ) : null}
                    {item.icon === "clock" ? (
                      <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="8.5" />
                        <path d="M12 7.8v4.8l3.2 1.9" />
                      </svg>
                    ) : null}
                    {item.icon === "chart" ? (
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M4 19.5h16" />
                        <rect x="6.5" y="11" width="2.8" height="6.5" rx="1" />
                        <rect x="10.7" y="8" width="2.8" height="9.5" rx="1" />
                        <rect x="14.9" y="5.5" width="2.8" height="12" rx="1" />
                      </svg>
                    ) : null}
                    {item.icon === "profile" ? (
                      <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="3.5" />
                        <path d="M4.5 19.5c1.4-3.2 4.1-4.8 7.5-4.8s6.1 1.6 7.5 4.8" />
                      </svg>
                    ) : null}
                  </span>
                  <span className="app-sidebar-link-label">{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="app-sidebar-foot">
              <button
                className="app-logout-btn app-sidebar-logout"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate("/");
                }}
              >
                {sidebarCollapsed ? "Out" : "Log out"}
              </button>
            </div>
          </aside>
          <section className="app-dashboard-content">
            <Outlet />
          </section>
        </main>
      ) : (
        <main className="app-main">
          <Outlet />
        </main>
      )}

      <footer className="app-footer">
        <div className="app-footer-inner">
          <div className="app-footer-grid">
            <div className="app-footer-brand-col">
              <div className="app-footer-brand">
                <span className="app-brand-accent">C</span>alendlyClone
              </div>
              <p className="app-footer-lead">
                Smarter scheduling for modern teams. Share links, protect your
                time, and keep everyone aligned.
              </p>
              <div className="app-footer-badges" aria-hidden="true">
                <span className="app-footer-badge">Secure links</span>
                <span className="app-footer-badge">Timezone aware</span>
                <span className="app-footer-badge">Google Calendar</span>
              </div>
            </div>
            <div className="app-footer-col">
              <h3 className="app-footer-heading">
                {authed && isDashboardRoute ? "Shortcuts" : "Product"}
              </h3>
              <ul className="app-footer-links">
                {authed && isDashboardRoute ? (
                  <>
                    <li>
                      <Link to="/dashboard/event-types/new">
                        New event type
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard/availability">
                        Availability rules
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard/bookings">Scheduled events</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/product">Features &amp; overview</Link>
                    </li>
                    <li>
                      <Link to="/we-solve">Who it&apos;s for</Link>
                    </li>
                    <li>
                      <Link to="/register">Create an account</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="app-footer-col">
              <h3 className="app-footer-heading">Workspace</h3>
              <ul className="app-footer-links">
                {authed ? (
                  <>
                    <li>
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/dashboard/bookings">Scheduled events</Link>
                    </li>
                    <li>
                      <Link to="/dashboard/availability">Availability</Link>
                    </li>
                    <li>
                      <Link to="/dashboard/analytics">Analytics</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login">Log in</Link>
                    </li>
                    <li>
                      <Link to="/register">Get started</Link>
                    </li>
                    <li>
                      <span className="app-footer-muted">
                        Sign in to open your workspace.
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="app-footer-col">
              <h3 className="app-footer-heading">Support</h3>
              <ul className="app-footer-links">
                <li>
                  {authed && isDashboardRoute ? (
                    <Link to="/dashboard/analytics">
                      Insights &amp; analytics
                    </Link>
                  ) : (
                    <Link to="/product">Product tour</Link>
                  )}
                </li>
                <li>
                  <span className="app-footer-muted">Status: operational</span>
                </li>
                <li>
                  <span className="app-footer-muted">
                    Help: use in-app flows for now
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="app-footer-bottom">
            <span className="app-footer-meta">
              © {year} CalendlyClone. Crafted with care.
            </span>
            <span className="app-footer-legal">
              Privacy · Terms · Demo project
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
