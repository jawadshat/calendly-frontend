import { useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { getToken } from '../lib/auth';
import { formatApiError } from '../lib/formatError';
import { Card, ErrorText } from '../components/ui';
import './AppPages.css';

type BookingItem = {
  _id: string;
  eventTypeId?: string;
  startUtc: string;
};

type EventTypeItem = {
  _id: string;
  title: string;
};

const REFRESH_MS = 30000;
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SLOT_LABELS = ['Early', 'Morning', 'Afternoon', 'Evening'];

export function Analytics() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [eventTypes, setEventTypes] = useState<EventTypeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    if (!getToken()) navigate('/login');
  }, [navigate]);

  async function load(isRefresh = false) {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const [bookingsRes, eventsRes] = await Promise.all([api.myBookings(), api.listEventTypes()]);
      setBookings((bookingsRes.items ?? []) as BookingItem[]);
      setEventTypes((eventsRes.items ?? []) as EventTypeItem[]);
      setLastUpdated(Date.now());
    } catch (e: any) {
      setError(formatApiError(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load();
    const id = window.setInterval(() => {
      void load(true);
    }, REFRESH_MS);
    return () => window.clearInterval(id);
  }, []);

  const now = Date.now();
  const monthStart = DateTime.now().startOf('month');
  const nextMonthStart = monthStart.plus({ month: 1 });
  const totalBookings = bookings.length;
  const upcomingCount = bookings.filter((b) => new Date(b.startUtc).getTime() >= now).length;
  const monthBookings = bookings.filter((b) => {
    const t = DateTime.fromISO(b.startUtc, { zone: 'utc' }).toLocal();
    return t >= monthStart && t < nextMonthStart;
  }).length;
  const conversionRate = totalBookings === 0 ? 0 : Math.min(99, Math.round((upcomingCount / totalBookings) * 100));

  const trendData = useMemo(() => {
    const today = DateTime.now().startOf('day');
    const latestBookingDay = bookings.reduce<DateTime | null>((latest, booking) => {
      const bookingDay = DateTime.fromISO(booking.startUtc, { zone: 'utc' }).toLocal().startOf('day');
      if (!latest || bookingDay > latest) return bookingDay;
      return latest;
    }, null);
    const windowEnd = latestBookingDay && latestBookingDay > today ? latestBookingDay : today;
    const days = Array.from({ length: 14 }).map((_, idx) => windowEnd.minus({ days: 13 - idx }));

    return days.map((day) => {
      const count = bookings.filter((b) => {
        const t = DateTime.fromISO(b.startUtc, { zone: 'utc' }).toLocal();
        return t >= day && t < day.plus({ day: 1 });
      }).length;
      return { label: day.toFormat('LLL d'), count };
    });
  }, [bookings]);

  const weekdayData = useMemo(() => {
    const counts = Array.from({ length: 7 }).map(() => 0);
    bookings.forEach((b) => {
      const day = DateTime.fromISO(b.startUtc, { zone: 'utc' }).toLocal().weekday % 7;
      counts[day] += 1;
    });
    return WEEKDAY_LABELS.map((label, idx) => ({ label, value: counts[idx] }));
  }, [bookings]);

  const eventTypeMap = useMemo(() => new Map(eventTypes.map((et) => [String(et._id), et.title])), [eventTypes]);
  const eventTypeData = useMemo(() => {
    const counts = new Map<string, number>();
    bookings.forEach((b) => {
      const key = b.eventTypeId ? eventTypeMap.get(String(b.eventTypeId)) ?? 'Other' : 'Other';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [bookings, eventTypeMap]);

  const trendMax = Math.max(1, ...trendData.map((d) => d.count));
  const weekdayMax = Math.max(1, ...weekdayData.map((d) => d.value));
  const donutTotal = Math.max(1, eventTypeData.reduce((sum, d) => sum + d.value, 0));
  const prev14Total = trendData.slice(0, 7).reduce((sum, d) => sum + d.count, 0);
  const latest14Total = trendData.slice(7).reduce((sum, d) => sum + d.count, 0);
  const growthPct = prev14Total === 0 ? (latest14Total > 0 ? 100 : 0) : Math.round(((latest14Total - prev14Total) / prev14Total) * 100);

  const slotData = useMemo(() => {
    const buckets = [0, 0, 0, 0];
    bookings.forEach((b) => {
      const hour = DateTime.fromISO(b.startUtc, { zone: 'utc' }).toLocal().hour;
      if (hour < 9) buckets[0] += 1;
      else if (hour < 13) buckets[1] += 1;
      else if (hour < 18) buckets[2] += 1;
      else buckets[3] += 1;
    });
    return SLOT_LABELS.map((label, idx) => ({ label, value: buckets[idx] }));
  }, [bookings]);
  const slotMax = Math.max(1, ...slotData.map((s) => s.value));

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 6 }).map((_, idx) => DateTime.now().minus({ months: 5 - idx }).startOf('month'));
    return months.map((m) => {
      const count = bookings.filter((b) => {
        const t = DateTime.fromISO(b.startUtc, { zone: 'utc' }).toLocal();
        return t >= m && t < m.plus({ month: 1 });
      }).length;
      return { label: m.toFormat('LLL'), value: count };
    });
  }, [bookings]);
  const monthlyMax = Math.max(1, ...monthlyData.map((m) => m.value));
  const monthlyPoints = monthlyData
    .map((m, idx) => {
      const x = (idx / Math.max(1, monthlyData.length - 1)) * 100;
      const y = 100 - (m.value / monthlyMax) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  if (loading) return <div className="cc-muted" style={{ fontWeight: 800 }}>Loading analytics…</div>;
  if (error) return <ErrorText>{error}</ErrorText>;

  return (
    <div className="analytics-wrap">
      <div className="analytics-hero">
        <div>
          <h1 className="analytics-hero-title">Analytics</h1>
          <p className="analytics-hero-subtitle">
            Live performance insights from your bookings and event activity.
          </p>
        </div>
        <div className="analytics-live-pill">
          <span className="dot" />
          {refreshing ? 'Refreshing…' : 'Live'}
          {lastUpdated ? ` • ${DateTime.fromMillis(lastUpdated).toRelative() ?? 'just now'}` : ''}
        </div>
      </div>

      <div className="app-grid-4">
        <div className="app-stat analytics-stat">
          <div className="app-stat-label">Total bookings</div>
          <div className="app-stat-value">{totalBookings}</div>
        </div>
        <div className="app-stat analytics-stat">
          <div className="app-stat-label">Upcoming</div>
          <div className="app-stat-value">{upcomingCount}</div>
        </div>
        <div className="app-stat analytics-stat">
          <div className="app-stat-label">This month</div>
          <div className="app-stat-value">{monthBookings}</div>
        </div>
        <div className="app-stat analytics-stat">
          <div className="app-stat-label">Active ratio</div>
          <div className="app-stat-value">{conversionRate}%</div>
        </div>
      </div>

      <div className="analytics-kpi-strip">
        <article className="analytics-kpi-card">
          <span>Momentum (last 14d)</span>
          <strong className={growthPct >= 0 ? 'up' : 'down'}>{growthPct >= 0 ? '+' : ''}{growthPct}%</strong>
          <small>Recent week vs previous week bookings</small>
        </article>
        <article className="analytics-kpi-card">
          <span>Top meeting slot</span>
          <strong>{slotData.slice().sort((a, b) => b.value - a.value)[0]?.label ?? 'N/A'}</strong>
          <small>Most requested time period</small>
        </article>
        <article className="analytics-kpi-card">
          <span>Top event type</span>
          <strong>{eventTypeData[0]?.label ?? 'N/A'}</strong>
          <small>Highest volume event category</small>
        </article>
      </div>

      <div className="analytics-grid">
        <Card className="analytics-card analytics-distribution">
          <div className="analytics-card-head">
            <h2>Booking trend (14 days)</h2>
          </div>
          <div className="analytics-trend">
            {trendData.map((d) => (
              <div key={d.label} className="analytics-trend-col">
                <div className="analytics-trend-bar-wrap">
                  <div className="analytics-trend-bar" style={{ height: `${Math.max(8, (d.count / trendMax) * 100)}%` }} />
                </div>
                <div className="analytics-trend-value">{d.count}</div>
                <div className="analytics-trend-label">{d.label}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="analytics-card">
          <div className="analytics-card-head">
            <h2>Most active weekdays</h2>
          </div>
          <div className="analytics-weekdays">
            {weekdayData.map((d) => (
              <div key={d.label} className="analytics-weekday-row">
                <div className="analytics-weekday-label">{d.label}</div>
                <div className="analytics-weekday-track">
                  <div className="analytics-weekday-fill" style={{ width: `${(d.value / weekdayMax) * 100}%` }} />
                </div>
                <div className="analytics-weekday-value">{d.value}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="analytics-grid">
        <Card className="analytics-card">
          <div className="analytics-card-head">
            <h2>Monthly trajectory (6 months)</h2>
          </div>
          <div className="analytics-line-wrap">
            <svg viewBox="0 0 100 100" className="analytics-line-chart" preserveAspectRatio="none" aria-hidden="true">
              <polyline className="analytics-line-path" fill="none" points={monthlyPoints} />
              {monthlyData.map((m, idx) => {
                const x = (idx / Math.max(1, monthlyData.length - 1)) * 100;
                const y = 100 - (m.value / monthlyMax) * 100;
                return <circle key={m.label} cx={x} cy={y} r="2.4" className="analytics-line-dot" />;
              })}
            </svg>
            <div className="analytics-line-labels">
              {monthlyData.map((m) => (
                <div key={m.label}>
                  <span>{m.label}</span>
                  <strong>{m.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="analytics-card">
          <div className="analytics-card-head">
            <h2>Demand by time slots</h2>
          </div>
          <div className="analytics-slot-grid">
            {slotData.map((slot, idx) => (
              <div key={slot.label} className="analytics-slot-card" style={{ animationDelay: `${idx * 90}ms` }}>
                <span>{slot.label}</span>
                <div className="analytics-slot-track">
                  <div className="analytics-slot-fill" style={{ width: `${(slot.value / slotMax) * 100}%` }} />
                </div>
                <strong>{slot.value}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="analytics-grid">
        <Card className="analytics-card">
          <div className="analytics-card-head">
            <h2>Event type distribution</h2>
          </div>
          {eventTypeData.length === 0 ? (
            <div className="cc-muted" style={{ fontWeight: 700 }}>No booking data yet.</div>
          ) : (
            <div className="analytics-donut-layout">
              <svg viewBox="0 0 42 42" className="analytics-donut" aria-hidden="true">
                {(() => {
                  let offset = 0;
                  const palette = ['#2563eb', '#06b6d4', '#0ea5e9', '#22c55e', '#8b5cf6', '#f59e0b'];
                  return eventTypeData.map((slice, idx) => {
                    const pct = (slice.value / donutTotal) * 100;
                    const segment = (
                      <circle
                        key={slice.label}
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="none"
                        stroke={palette[idx % palette.length]}
                        strokeWidth="4"
                        strokeDasharray={`${pct} ${100 - pct}`}
                        strokeDashoffset={-offset}
                      />
                    );
                    offset += pct;
                    return segment;
                  });
                })()}
                <circle cx="21" cy="21" r="11" fill="#fff" />
                <text x="21" y="20" textAnchor="middle" className="analytics-donut-total">
                  {donutTotal}
                </text>
                <text x="21" y="24" textAnchor="middle" className="analytics-donut-caption">
                  bookings
                </text>
              </svg>
              <div className="analytics-legend">
                {eventTypeData.map((slice, idx) => (
                  <div key={slice.label} className="analytics-legend-item">
                    <span className={`analytics-legend-dot c${idx + 1}`} />
                    <span>{slice.label}</span>
                    <strong>{slice.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="analytics-card analytics-insights">
          <div className="analytics-card-head">
            <h2>Smart insights</h2>
          </div>
          <ul>
            <li>Bookings auto-refresh every 30 seconds for live monitoring.</li>
            <li>Weekly pattern shows your strongest scheduling days.</li>
            <li>Event type mix helps you optimize high-demand meeting formats.</li>
            <li>Use these metrics to fine-tune your availability and link strategy.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

