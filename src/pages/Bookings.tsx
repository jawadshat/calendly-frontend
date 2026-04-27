import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import { api } from '../lib/api';
import { getToken } from '../lib/auth';
import { formatApiError } from '../lib/formatError';
import { Card, ErrorText } from '../components/ui';
import './AppPages.css';

export function Bookings() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await api.myBookings();
        setItems(resp.items ?? []);
      } catch (e: any) {
        setError(formatApiError(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="cc-muted" style={{ fontWeight: 800 }}>Loading…</div>;
  if (error) return <ErrorText>{error}</ErrorText>;

  return (
    <div className="app-shell">
      <div className="app-hero-card">
        <h1 className="app-hero-title">Scheduled Events</h1>
        <p className="app-hero-subtitle">Track upcoming meetings booked through your event links.</p>
      </div>

      <div className="app-grid-4">
        <div className="app-stat">
          <div className="app-stat-label">Total Bookings</div>
          <div className="app-stat-value">{items.length}</div>
        </div>
        <div className="app-stat">
          <div className="app-stat-label">Upcoming</div>
          <div className="app-stat-value">{items.filter((b) => new Date(b.startUtc).getTime() > Date.now()).length}</div>
        </div>
        <div className="app-stat">
          <div className="app-stat-label">This Week</div>
          <div className="app-stat-value">
            {
              items.filter((b) => {
                const now = Date.now();
                const end = now + 7 * 24 * 60 * 60 * 1000;
                const t = new Date(b.startUtc).getTime();
                return t >= now && t <= end;
              }).length
            }
          </div>
        </div>
        <div className="app-stat">
          <div className="app-stat-label">Status</div>
          <div className="app-stat-value" style={{ fontSize: 18 }}>
            Active
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <Card>
          <div className="cc-muted" style={{ fontWeight: 800 }}>
            No bookings yet.
          </div>
        </Card>
      ) : (
        <div className="bookings-list">
          {items.map((b) => {
          const start = DateTime.fromISO(String(b.startUtc), { zone: 'utc' });
          if (!start.isValid) {
            return (
              <Card key={b._id}>
                <div className="booking-row">
                  <div style={{ fontWeight: 800, color: '#b91c1c' }}>Invalid booking date</div>
                  <span className="booking-pill">Confirmed</span>
                </div>
              </Card>
            );
          }
          const localStart = start.toLocal();
          return (
            <Card key={b._id}>
              <div className="booking-row">
                <div>
                  <div style={{ fontWeight: 950, fontSize: 16 }}>{localStart.toFormat('cccc, LLL d • h:mm a')}</div>
                  <div className="cc-muted" style={{ fontSize: 13, marginTop: 6 }}>
                    Invitee: {b.inviteeName} ({b.inviteeEmail})
                  </div>
                </div>
                <span className="booking-pill">Confirmed</span>
              </div>
            </Card>
          );
          })}
        </div>
      )}
    </div>
  );
}

