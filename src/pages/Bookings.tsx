import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import { api } from '../lib/api';
import { getToken } from '../lib/auth';
import { formatApiError } from '../lib/formatError';
import { Card, ErrorText } from '../components/ui';

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
    <div style={{ display: 'grid', gap: 12 }}>
      <Card>
        <div style={{ fontWeight: 950, fontSize: 18 }}>Scheduled events</div>
        <div className="cc-muted" style={{ marginTop: 6, fontSize: 13 }}>
          Upcoming bookings created from your public scheduling links.
        </div>
      </Card>

      {items.length === 0 ? (
        <Card>
          <div className="cc-muted" style={{ fontWeight: 800 }}>
            No bookings yet.
          </div>
        </Card>
      ) : (
        items.map((b) => {
          const start = DateTime.fromISO(new Date(b.startUtc).toISOString(), { zone: 'utc' }).toLocal();
          return (
            <Card key={b._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start' }}>
                <div>
                  <div style={{ fontWeight: 950 }}>{start.toFormat('cccc, LLL d • h:mm a')}</div>
                  <div className="cc-muted" style={{ fontSize: 13, marginTop: 6 }}>
                    Invitee: {b.inviteeName} ({b.inviteeEmail})
                  </div>
                </div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}

