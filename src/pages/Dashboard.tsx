import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { getToken } from "../lib/auth";
import { Button, Card } from "../components/ui";
import "./AppPages.css";

export function Dashboard() {
  const navigate = useNavigate();
  const [me, setMe] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) navigate("/login");
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
      setError(e?.error ?? "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return <div style={{ color: "#64748b", fontWeight: 700 }}>Loading…</div>;
  if (error)
    return (
      <div style={{ color: "#b91c1c", fontWeight: 800 }}>{String(error)}</div>
    );

  const username = me?.user?.username;
  const availability = me?.availability;
  const availabilityByEventType = me?.availabilityByEventType ?? {};
  const hasAvailability = Object.values<any>(availabilityByEventType).some(
    (a) =>
      Boolean(a?.timezone) &&
      Array.isArray(a?.weekly) &&
      a.weekly.length > 0 &&
      Number(a?.maxDaysInFuture ?? 0) > 0,
  );

  return (
    <div className="app-shell">
      <div className="app-hero-card">
        <h1 className="app-hero-title">Dashboard</h1>
        <p className="app-hero-subtitle">
          Manage your event types, booking links, and scheduling setup.
        </p>
      </div>

      <div className="app-grid-4">
        <div className="app-stat">
          <div className="app-stat-label">Event Types</div>
          <div className="app-stat-value">{items.length}</div>
        </div>
        <div className="app-stat">
          <div className="app-stat-label">Availability</div>
          <div className="app-stat-value">
            {hasAvailability ? "Ready" : "Pending"}
          </div>
        </div>
        <div className="app-stat">
          <div className="app-stat-label">Timezone</div>
          <div className="app-stat-value" style={{ fontSize: 18 }}>
            {availability?.timezone ?? "UTC"}
          </div>
        </div>
        <div className="app-stat">
          <div className="app-stat-label">Max Days Ahead</div>
          <div className="app-stat-value">
            {availability?.maxDaysInFuture ?? 0}
          </div>
        </div>
      </div>

      {/* {!hasAvailability ? (
        <Card>
          <div className="app-section-title">Generate Event first</div>
          <div className="app-section-subtitle">
            Your Availabilities are set after creating an event type.
          </div>
          <div style={{ marginTop: 12 }}>
            <Link to="/dashboard/availability">
              <Button>Go to Availability</Button>
            </Link>
          </div>
        </Card>
      ) : null} */}

      <Card>
        <div className="app-section-head">
          <div>
            <h2 className="app-section-title">Event Types</h2>
            <p className="app-section-subtitle">
              Share a link so others can book time on your calendar.
            </p>
          </div>
          <Link to="/dashboard/event-types/new">
            <Button>Create event type</Button>
          </Link>
        </div>
      </Card>

      {items.length === 0 ? (
        <Card>
          <div className="app-muted" style={{ fontWeight: 700 }}>
            No event types yet. Create one to get a scheduling link.
          </div>
        </Card>
      ) : (
        <div className="app-grid-2">
          {items.map((it) => (
            <Card key={it._id} style={{ padding: 18 }}>
              <div
                className="app-event-card"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  alignItems: "start",
                }}
              >
                <div>
                  <h3 className="app-event-title">{it.title}</h3>
                  <div className="app-muted" style={{ marginTop: 4 }}>
                    {it.durationMinutes} min • slug:{" "}
                    <span style={{ fontFamily: "monospace" }}>{it.slug}</span>
                  </div>
                  {username ? (
                    <div className="app-link" style={{ marginTop: 10 }}>
                      Generated link:{" "}
                      <a
                        href={`/${encodeURIComponent(String(username).trim().toLowerCase())}/${encodeURIComponent(
                          String(it.slug).trim().toLowerCase(),
                        )}`}
                        style={{ fontWeight: 800, color: "inherit" }}
                      >
                        /{String(username).trim().toLowerCase()}/
                        {String(it.slug).trim().toLowerCase()}
                      </a>
                    </div>
                  ) : hasAvailability ? null : (
                    <div className="app-muted" style={{ marginTop: 10 }}>
                      Configure this event type availability in Availability
                      settings.
                    </div>
                  )}
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <Link to={`/dashboard/event-types/${it._id}`}>
                    <Button variant="secondary">Edit</Button>
                  </Link>
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      if (!confirm("Delete this event type?")) return;
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
