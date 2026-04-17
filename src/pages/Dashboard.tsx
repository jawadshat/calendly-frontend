import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { getToken } from '../lib/auth';
import { Button, Card } from '../components/ui';

export function Dashboard() {
  const navigate = useNavigate();
  const [me, setMe] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) navigate('/login');
  }, [navigate]);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const m = await api.me();
      const et = await api.listEventTypes();
      setMe(m);
      setItems(et.items);
    } catch (e: any) {
      setError(e?.error ?? 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div style={{ color: '#64748b', fontWeight: 700 }}>Loading…</div>;
  if (error) return <div style={{ color: '#b91c1c', fontWeight: 800 }}>{String(error)}</div>;

  const username = me?.user?.username;
  const availability = me?.availability;
  const hasAvailability =
    Boolean(availability?.timezone) &&
    Array.isArray(availability?.weekly) &&
    availability.weekly.length > 0 &&
    Number(availability?.maxDaysInFuture ?? 0) > 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
      {!hasAvailability ? (
        <Card>
          <div style={{ fontWeight: 900, fontSize: 16 }}>Set availability first</div>
          <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>
            Your scheduling links are generated only after you define your availability timings and date window.
          </div>
          <div style={{ marginTop: 12 }}>
            <Link to="/dashboard/availability">
              <Button>Go to Availability</Button>
            </Link>
          </div>
        </Card>
      ) : null}

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Event Types</div>
            <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
              Share a link so others can book time on your calendar.
            </div>
          </div>
          {hasAvailability ? (
            <Link to="/dashboard/event-types/new">
              <Button>Create event type</Button>
            </Link>
          ) : (
            <Button variant="secondary" disabled>
              Create event type
            </Button>
          )}
        </div>
      </Card>

      {items.length === 0 ? (
        <Card>
          <div style={{ color: '#64748b', fontWeight: 700 }}>
            No event types yet. Create one to get a scheduling link.
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {items.map((it) => (
            <Card key={it._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'start' }}>
                <div>
                  <div style={{ fontWeight: 900 }}>{it.title}</div>
                  <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
                    {it.durationMinutes} min • slug: <span style={{ fontFamily: 'monospace' }}>{it.slug}</span>
                  </div>
                  {username && hasAvailability ? (
                    <div style={{ marginTop: 10, fontSize: 13 }}>
                      Generated link:{' '}
                      <a
                        href={`/${encodeURIComponent(String(username).trim().toLowerCase())}/${encodeURIComponent(
                          String(it.slug).trim().toLowerCase(),
                        )}`}
                        style={{ fontWeight: 800 }}
                      >
                        /{String(username).trim().toLowerCase()}/{String(it.slug).trim().toLowerCase()}
                      </a>
                    </div>
                  ) : (
                    <div style={{ marginTop: 10, fontSize: 13, color: '#64748b' }}>
                      Configure availability first to generate shareable link.
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link to={`/dashboard/event-types/${it._id}`}>
                    <Button variant="secondary">Edit</Button>
                  </Link>
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      if (!confirm('Delete this event type?')) return;
                      await api.deleteEventType(it._id);
                      await load();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

