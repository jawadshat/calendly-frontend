import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import { api } from '../lib/api';
import { Button, Card, ErrorText, Input, Label } from '../components/ui';

function startOfMonthUtc() {
  return DateTime.utc().startOf('month');
}

export function PublicBooking() {
  const { username, eventSlug } = useParams();
  const safeUsername = (username ?? '').trim();
  const safeEventSlug = (eventSlug ?? '').trim().replace(/\.+$/, '');
  const [data, setData] = useState<any>(null);
  const [slots, setSlots] = useState<{ startUtcISO: string; endUtcISO: string }[]>([]);
  const [monthCursor, setMonthCursor] = useState<DateTime>(() => startOfMonthUtc());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDay, setSelectedDay] = useState<string | null>(null); // yyyy-mm-dd in invitee tz
  const [selected, setSelected] = useState<{ startUtcISO: string; endUtcISO: string } | null>(null);
  const [inviteeName, setInviteeName] = useState('');
  const [inviteeEmail, setInviteeEmail] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const rangeStart = useMemo(() => monthCursor.startOf('month'), [monthCursor]);
  const rangeEnd = useMemo(() => monthCursor.endOf('month').plus({ days: 1 }), [monthCursor]);
  const inviteeTz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', []);

  useEffect(() => {
    (async () => {
      if (!safeUsername || !safeEventSlug) return;
      try {
        setLoading(true);
        setError(null);
        setSelected(null);
        setBooking(null);
        setSelectedDay(null);

        const resp = await api.publicSlots(safeUsername, safeEventSlug, rangeStart.toISO()!, rangeEnd.toISO()!);
        setData(resp);
        setSlots(resp.slots ?? []);
      } catch (e: any) {
        setError(e?.error ?? 'Failed to load slots');
      } finally {
        setLoading(false);
      }
    })();
  }, [safeUsername, safeEventSlug, rangeStart.toISO(), rangeEnd.toISO()]);

  const slotsByDay = useMemo(() => {
    const map = new Map<string, { startUtcISO: string; endUtcISO: string }[]>();
    for (const s of slots) {
      const day = DateTime.fromISO(s.startUtcISO, { zone: 'utc' }).setZone(inviteeTz).toISODate()!;
      const list = map.get(day) ?? [];
      list.push(s);
      map.set(day, list);
    }
    const sortedDays = Array.from(map.keys()).sort();
    return { map, sortedDays };
  }, [slots, inviteeTz]);

  const monthDays = useMemo(() => {
    const start = monthCursor.startOf('month').setZone(inviteeTz);
    const firstGrid = start.startOf('week');
    const days: string[] = [];
    for (let i = 0; i < 42; i += 1) {
      days.push(firstGrid.plus({ days: i }).toISODate()!);
    }
    return days;
  }, [monthCursor, inviteeTz]);

  const selectedDaySlots = useMemo(() => {
    if (!selectedDay) return [];
    return slotsByDay.map.get(selectedDay) ?? [];
  }, [selectedDay, slotsByDay.map]);

  if (loading) return <div style={{ color: '#64748b', fontWeight: 800 }}>Loading scheduling page…</div>;
  if (error) return <div style={{ color: '#b91c1c', fontWeight: 900 }}>{String(error)}</div>;

  if (booking) {
    const startLocal = DateTime.fromISO(booking.startUtcISO, { zone: 'utc' }).setZone(inviteeTz);
    return (
      <div style={{ maxWidth: 720, margin: '30px auto' }}>
        <Card>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Confirmed</div>
          <div style={{ color: '#64748b', marginTop: 6 }}>
            {booking.inviteeName}, you’re scheduled with {booking.host.displayName}.
          </div>
          <div style={{ marginTop: 12, fontWeight: 900 }}>
            {startLocal.toFormat('cccc, LLL d')} • {startLocal.toFormat('h:mm a')} ({inviteeTz})
          </div>
          <div style={{ marginTop: 18 }}>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Book another time
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 14 }}>
      <Card>
        <div style={{ fontWeight: 900, fontSize: 18 }}>{data?.eventType?.title}</div>
        <div style={{ color: '#64748b', marginTop: 6 }}>
          {data?.user?.displayName} • {data?.eventType?.durationMinutes} min
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: '#475569' }}>{data?.eventType?.description}</div>

        <div style={{ marginTop: 18, fontWeight: 900 }}>Timezone</div>
        <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>{inviteeTz}</div>

        <div style={{ marginTop: 18, fontWeight: 900 }}>Pick a date</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <Button variant="secondary" onClick={() => setMonthCursor((d: DateTime) => d.minus({ months: 1 }))}>
            Prev month
          </Button>
          <Button variant="secondary" onClick={() => setMonthCursor(DateTime.utc().startOf('month'))}>
            Today
          </Button>
          <Button variant="secondary" onClick={() => setMonthCursor((d: DateTime) => d.plus({ months: 1 }))}>
            Next month
          </Button>
        </div>

        <div style={{ marginTop: 14, fontWeight: 900 }}>{monthCursor.setZone(inviteeTz).toFormat('LLLL yyyy')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginTop: 10 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="cc-muted" style={{ fontWeight: 900, fontSize: 12 }}>
              {d}
            </div>
          ))}
          {monthDays.map((day) => {
            const dt = DateTime.fromISO(day, { zone: inviteeTz });
            const inCurrentMonth = dt.month === monthCursor.setZone(inviteeTz).month;
            const hasSlots = (slotsByDay.map.get(day)?.length ?? 0) > 0;
            const active = selectedDay === day;
            return (
              <button
                key={day}
                disabled={!hasSlots}
                onClick={() => {
                  setSelectedDay(day);
                  setSelected(null);
                  setBookingError(null);
                }}
                style={{
                  borderRadius: 10,
                  border: active ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                  background: active ? 'rgba(0,107,255,0.12)' : 'white',
                  color: inCurrentMonth ? '#0f172a' : '#94a3b8',
                  padding: '8px 0',
                  cursor: hasSlots ? 'pointer' : 'not-allowed',
                  fontWeight: hasSlots ? 900 : 600,
                  opacity: hasSlots ? 1 : 0.5,
                }}
              >
                {dt.day}
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        {slotsByDay.sortedDays.length === 0 ? (
          <div style={{ color: '#64748b', fontWeight: 800 }}>No availability in this range.</div>
        ) : !selectedDay ? (
          <div style={{ color: '#64748b', fontWeight: 800 }}>Select a day from the calendar to see available times.</div>
        ) : selectedDaySlots.length === 0 ? (
          <div style={{ color: '#64748b', fontWeight: 800 }}>No available times for selected day.</div>
        ) : (
          <div>
            <div style={{ fontWeight: 900 }}>
              Available times - {DateTime.fromISO(selectedDay, { zone: inviteeTz }).toFormat('cccc, LLL d')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {selectedDaySlots.map((s) => {
                const start = DateTime.fromISO(s.startUtcISO, { zone: 'utc' }).setZone(inviteeTz);
                const active = selected?.startUtcISO === s.startUtcISO;
                return (
                  <button
                    key={s.startUtcISO}
                    onClick={() => {
                      setSelected(s);
                      setBookingError(null);
                    }}
                    style={{
                      padding: '9px 12px',
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      background: active ? '#0f172a' : 'white',
                      color: active ? 'white' : '#0f172a',
                      fontWeight: 900,
                      cursor: 'pointer',
                    }}
                  >
                    {start.toFormat('h:mm a')}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selected ? (
          <div style={{ marginTop: 18, borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>Enter your details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <div>
                <Label>Name</Label>
                <Input value={inviteeName} onChange={(e) => setInviteeName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={inviteeEmail}
                  onChange={(e) => setInviteeEmail(e.target.value)}
                  placeholder="you@email.com"
                />
              </div>
            </div>

            {bookingError ? (
              <div style={{ marginTop: 12 }}>
                <ErrorText>{bookingError}</ErrorText>
              </div>
            ) : null}

            <div style={{ display: 'flex', justifyContent: 'end', marginTop: 14 }}>
              <Button
                disabled={bookingLoading}
                onClick={async () => {
                  if (!safeUsername || !safeEventSlug || !selected) return;
                  try {
                    setBookingLoading(true);
                    setBookingError(null);
                    const resp = await api.publicBook(safeUsername, safeEventSlug, {
                      inviteeName,
                      inviteeEmail,
                      startUtcISO: selected.startUtcISO,
                      endUtcISO: selected.endUtcISO,
                      inviteeTimezone: inviteeTz,
                    });
                    setBooking(resp.booking);
                  } catch (e: any) {
                    setBookingError(e?.error ?? 'Booking failed');
                  } finally {
                    setBookingLoading(false);
                  }
                }}
              >
                {bookingLoading ? 'Booking…' : 'Schedule event'}
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

