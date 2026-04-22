import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getToken, logout } from '../lib/auth';
import '../pages/AppChrome.css';

export function Layout() {
  const navigate = useNavigate();
  const authed = Boolean(getToken());
  const year = new Date().getFullYear();

  return (
    <div className="app-shell-root">
      <header className="app-top">
        <div className="app-top-inner">
          <Link to="/" className="app-brand">
            <span>C</span>alendlyClone
          </Link>

          <nav className="app-nav">
            {authed ? (
              <>
                <NavLink
                  to="/dashboard"
                  style={{ textDecoration: 'none' }}
                  className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/dashboard/bookings"
                  style={{ textDecoration: 'none' }}
                  className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}
                >
                  Scheduled events
                </NavLink>
                <NavLink
                  to="/dashboard/availability"
                  style={{ textDecoration: 'none' }}
                  className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}
                >
                  Availability
                </NavLink>
                <button
                  className="app-logout-btn"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="app-nav-link">
                  Log in
                </Link>
                <Link
                  to="/register"
                  style={{
                    textDecoration: 'none',
                    color: 'white',
                    background: 'var(--primary)',
                    padding: '8px 12px',
                    borderRadius: 10,
                    fontWeight: 800,
                    boxShadow: '0 10px 18px rgba(0, 107, 255, 0.22)',
                  }}
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="app-footer-inner">
          <div className="app-footer-left">
            <div className="app-footer-brand">
              <span>C</span>alendlyClone
            </div>
            <div className="app-footer-copy">Smarter scheduling for modern teams.</div>
          </div>
          <div className="app-footer-meta">© {year} CalendlyClone. Crafted with care.</div>
        </div>
      </footer>
    </div>
  );
}

