import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getToken, logout } from '../lib/auth';
import '../pages/AppChrome.css';

export function Layout() {
  const navigate = useNavigate();
  const authed = Boolean(getToken());

  return (
    <div style={{ minHeight: '100vh' }}>
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
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  style={{
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    padding: '8px 12px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontWeight: 700,
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
    </div>
  );
}

