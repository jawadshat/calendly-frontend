import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getToken, logout } from '../lib/auth';

export function Layout() {
  const navigate = useNavigate();
  const authed = Boolean(getToken());

  return (
    <div style={{ minHeight: '100vh' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <Link to="/" style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 800, letterSpacing: -0.3 }}>
            <span style={{ color: 'var(--primary)' }}>C</span>alendlyClone
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {authed ? (
              <>
                <NavLink
                  to="/dashboard"
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    color: isActive ? '#0f172a' : '#334155',
                    fontWeight: 600,
                  })}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/dashboard/bookings"
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    color: isActive ? '#0f172a' : '#334155',
                    fontWeight: 600,
                  })}
                >
                  Scheduled events
                </NavLink>
                <NavLink
                  to="/dashboard/availability"
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    color: isActive ? '#0f172a' : '#334155',
                    fontWeight: 600,
                  })}
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
                <Link to="/login" style={{ textDecoration: 'none', color: '#334155', fontWeight: 700 }}>
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

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        <Outlet />
      </main>
    </div>
  );
}

