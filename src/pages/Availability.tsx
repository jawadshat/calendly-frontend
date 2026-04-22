import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { getToken } from '../lib/auth';
import { formatApiError } from '../lib/formatError';
import { Button, Card, ErrorText, Input, Label } from '../components/ui';
import './AppPages.css';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

function hhmmToMinute(s: string) {
  const [hh, mm] = s.split(':').map((x) => Number(x));
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return 0;
  return Math.max(0, Math.min(24 * 60 - 1, hh * 60 + mm));
}
function minuteToHHMM(m: number) {
  const hh = String(Math.floor(m / 60)).padStart(2, '0');
  const mm = String(m % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

type Weekly = { dayOfWeek: number; startMinute: number; endMinute: number };

export function Availability() {
  const navigate = useNavigate();
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [selectedEventTypeId, setSelectedEventTypeId] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [bufferBeforeMinutes, setBufferBeforeMinutes] = useState(0);
  const [bufferAfterMinutes, setBufferAfterMinutes] = useState(0);
  const [minNoticeMinutes, setMinNoticeMinutes] = useState(60);
  const [maxDaysInFuture, setMaxDaysInFuture] = useState(60);

  const [weekly, setWeekly] = useState<Weekly[]>([
    { dayOfWeek: 1, startMinute: 9 * 60, endMinute: 17 * 60 },
    { dayOfWeek: 2, startMinute: 9 * 60, endMinute: 17 * 60 },
    { dayOfWeek: 3, startMinute: 9 * 60, endMinute: 17 * 60 },
    { dayOfWeek: 4, startMinute: 9 * 60, endMinute: 17 * 60 },
    { dayOfWeek: 5, startMinute: 9 * 60, endMinute: 15 * 60 },
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!getToken()) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [me, eventTypesRes] = await Promise.all([api.me(), api.listEventTypes()]);
        setEventTypes(eventTypesRes.items ?? []);
        const firstEventTypeId = eventTypesRes.items?.[0]?._id ? String(eventTypesRes.items[0]._id) : '';
        setSelectedEventTypeId(firstEventTypeId);
        const a = firstEventTypeId
          ? (await api.eventTypeAvailability(firstEventTypeId)).availability
          : me.availability;
        if (a) {
          setTimezone(a.timezone ?? 'UTC');
          setBufferBeforeMinutes(a.bufferBeforeMinutes ?? 0);
          setBufferAfterMinutes(a.bufferAfterMinutes ?? 0);
          setMinNoticeMinutes(a.minNoticeMinutes ?? 60);
          setMaxDaysInFuture(a.maxDaysInFuture ?? 60);
          setWeekly(Array.isArray(a.weekly) ? a.weekly : []);
        }
      } catch (e: any) {
        setError(e?.error ?? 'Failed to load availability');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const weeklyByDay = useMemo(() => {
    const map = new Map<number, Weekly[]>();
    for (const w of weekly) {
      const list = map.get(w.dayOfWeek) ?? [];
      list.push(w);
      map.set(w.dayOfWeek, list);
    }
    return map;
  }, [weekly]);

  const selectedEventType = useMemo(
    () => eventTypes.find((it) => String(it._id) === selectedEventTypeId),
    [eventTypes, selectedEventTypeId],
  );

  if (loading) return <div style={{ color: '#64748b', fontWeight: 700 }}>Loading…</div>;

  async function loadAvailabilityForEventType(eventTypeId: string) {
    const a = (await api.eventTypeAvailability(eventTypeId)).availability;
    if (!a) {
      setTimezone('UTC');
      setBufferBeforeMinutes(0);
      setBufferAfterMinutes(0);
      setMinNoticeMinutes(60);
      setMaxDaysInFuture(60);
      setWeekly([]);
      return;
    }
    setTimezone(a.timezone ?? 'UTC');
    setBufferBeforeMinutes(a.bufferBeforeMinutes ?? 0);
    setBufferAfterMinutes(a.bufferAfterMinutes ?? 0);
    setMinNoticeMinutes(a.minNoticeMinutes ?? 60);
    setMaxDaysInFuture(a.maxDaysInFuture ?? 60);
    setWeekly(Array.isArray(a.weekly) ? a.weekly : []);
  }

  return (
    <div className="availability-wrap">
      <div className="app-hero-card">
        <h1 className="app-hero-title">Availability</h1>
        <p className="app-hero-subtitle">Set your preferred hours so people only book when it works for you.</p>
      </div>

      <Card>
        <div className="availability-event-card">
          <div>
            <div className="availability-event-card-title">Event type schedule</div>
            <div className="availability-event-card-subtitle">Each event type can have a different weekly routine.</div>
          </div>
          <div className="availability-event-type-list">
            {eventTypes.length === 0 ? (
              <div className="availability-event-empty">Create an event type first to set availability.</div>
            ) : (
              eventTypes.map((it) => {
                const isActive = String(it._id) === selectedEventTypeId;
                return (
                  <button
                    key={it._id}
                    type="button"
                    className={`availability-event-chip${isActive ? ' is-active' : ''}`}
                    onClick={async () => {
                      const nextId = String(it._id);
                      if (nextId === selectedEventTypeId) return;
                      setSelectedEventTypeId(nextId);
                      setError(null);
                      setSavedAt(null);
                      try {
                        await loadAvailabilityForEventType(nextId);
                      } catch (err: any) {
                        setError(err?.error ?? 'Failed to load event type availability');
                      }
                    }}
                  >
                    <span className="availability-event-chip-title">{it.title}</span>
                    <span className="availability-event-chip-meta">
                      {it.durationMinutes}m • /{it.slug}
                    </span>
                  </button>
                );
              })
            )}
          </div>
          {selectedEventType ? (
            <div className="availability-event-selected">
              Editing: <strong>{selectedEventType.title}</strong> ({selectedEventType.durationMinutes} mins)
            </div>
          ) : null}
        </div>

        <div className="availability-config-grid">
          <div>
            <Label>Timezone (IANA)</Label>
            <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="Asia/Karachi" />
          </div>
          <div className="availability-config-grid">
            <div>
              <Label>Min notice (minutes)</Label>
              <Input
                type="number"
                min={0}
                value={String(minNoticeMinutes)}
                onChange={(e) => setMinNoticeMinutes(Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Max days in future</Label>
              <Input
                type="number"
                min={1}
                value={String(maxDaysInFuture)}
                onChange={(e) => setMaxDaysInFuture(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="availability-config-grid" style={{ marginTop: 12 }}>
          <div>
            <Label>Buffer before (minutes)</Label>
            <Input
              type="number"
              min={0}
              value={String(bufferBeforeMinutes)}
              onChange={(e) => setBufferBeforeMinutes(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Buffer after (minutes)</Label>
            <Input
              type="number"
              min={0}
              value={String(bufferAfterMinutes)}
              onChange={(e) => setBufferAfterMinutes(Number(e.target.value))}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="app-section-title">Weekly hours</div>
        <div className="app-section-subtitle">Enable the days you want to accept meetings.</div>
        <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
          {DOW.map((label, dayOfWeek) => {
            const windows = weeklyByDay.get(dayOfWeek) ?? [];
            const win = windows[0]; // MVP: one window per day
            const enabled = Boolean(win);
            const start = enabled ? minuteToHHMM(win.startMinute) : '09:00';
            const end = enabled ? minuteToHHMM(win.endMinute) : '17:00';

            return (
              <div key={dayOfWeek} className="availability-week-row">
                <div style={{ fontWeight: 900, color: '#334155' }}>{label}</div>
                <div>
                  <Input
                    type="time"
                    disabled={!enabled}
                    value={start}
                    onChange={(e) => {
                      const v = e.target.value;
                      setWeekly((prev) => {
                        const other = prev.filter((x) => x.dayOfWeek !== dayOfWeek);
                        if (!enabled) return prev;
                        return [...other, { dayOfWeek, startMinute: hhmmToMinute(v), endMinute: win.endMinute }];
                      });
                    }}
                  />
                </div>
                <div>
                  <Input
                    type="time"
                    disabled={!enabled}
                    value={end}
                    onChange={(e) => {
                      const v = e.target.value;
                      setWeekly((prev) => {
                        const other = prev.filter((x) => x.dayOfWeek !== dayOfWeek);
                        if (!enabled) return prev;
                        return [...other, { dayOfWeek, startMinute: win.startMinute, endMinute: Math.max(hhmmToMinute(v), win.startMinute + 30) }];
                      });
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'end', gap: 10 }}>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setWeekly((prev) => {
                        const other = prev.filter((x) => x.dayOfWeek !== dayOfWeek);
                        if (enabled) return other;
                        return [...other, { dayOfWeek, startMinute: hhmmToMinute(start), endMinute: hhmmToMinute(end) }];
                      });
                    }}
                  >
                    {enabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {error ? (
          <div style={{ marginTop: 12 }}>
            <ErrorText>{error}</ErrorText>
          </div>
        ) : null}
        {savedAt ? (
          <div style={{ marginTop: 12, fontWeight: 900, color: 'var(--primary)' }}>Saved</div>
        ) : null}

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'end' }}>
          <Button
            disabled={saving || !selectedEventTypeId}
            onClick={async () => {
              try {
                setSaving(true);
                setError(null);
                setSavedAt(null);
                if (!selectedEventTypeId) {
                  setError('Create an event type first');
                  return;
                }
                await api.updateEventTypeAvailability(selectedEventTypeId, {
                  timezone,
                  weekly,
                  bufferBeforeMinutes,
                  bufferAfterMinutes,
                  minNoticeMinutes,
                  maxDaysInFuture,
                });
                await loadAvailabilityForEventType(selectedEventTypeId);
                setSavedAt(Date.now());
              } catch (e: any) {
                setError(formatApiError(e));
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? 'Saving…' : 'Save availability'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

