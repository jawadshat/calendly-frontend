/** Public booking flow: event selection, slot lookup, and booking submission. */
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { DateTime } from "luxon";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { api } from "../lib/api";
import { Button, Card, ErrorText, Input, Label } from "../components/ui";
import "./PublicBooking.css";

export function PublicBooking() {
  const { username, eventSlug } = useParams();
  const safeUsername = (username ?? "").trim();
  const safeEventSlug = (eventSlug ?? "").trim().replace(/\.+$/, "");
  const [data, setData] = useState<any>(null);
  const [slots, setSlots] = useState<
    { startUtcISO: string; endUtcISO: string }[]
  >([]);
  const [monthCursor, setMonthCursor] = useState<DateTime>(() =>
    DateTime.now().startOf("month"),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDay, setSelectedDay] = useState<string | null>(null); // yyyy-mm-dd in invitee tz
  const [selected, setSelected] = useState<{
    startUtcISO: string;
    endUtcISO: string;
  } | null>(null);
  const [inviteeName, setInviteeName] = useState("");
  const [inviteeEmail, setInviteeEmail] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const rangeStart = useMemo(
    () => monthCursor.startOf("month").toUTC(),
    [monthCursor],
  );
  const rangeEnd = useMemo(
    () => monthCursor.endOf("month").plus({ days: 1 }).toUTC(),
    [monthCursor],
  );
  const inviteeTz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    [],
  );

  useEffect(() => {
    (async () => {
      if (!safeUsername || !safeEventSlug) return;
      try {
        setLoading(true);
        setError(null);
        setSelected(null);
        setBooking(null);
        setSelectedDay(null);

        const resp = await api.publicSlots(
          safeUsername,
          safeEventSlug,
          rangeStart.toISO()!,
          rangeEnd.toISO()!,
        );
        setData(resp);
        setSlots(resp.slots ?? []);
      } catch (e: any) {
        setError(e?.error ?? "Failed to load slots");
      } finally {
        setLoading(false);
      }
    })();
  }, [safeUsername, safeEventSlug, monthCursor.toISODate()]);

  const slotsByDay = useMemo(() => {
    const map = new Map<string, { startUtcISO: string; endUtcISO: string }[]>();
    for (const s of slots) {
      const day = DateTime.fromISO(s.startUtcISO, { zone: "utc" })
        .setZone(inviteeTz)
        .toISODate()!;
      const list = map.get(day) ?? [];
      list.push(s);
      map.set(day, list);
    }
    const sortedDays = Array.from(map.keys()).sort();
    return { map, sortedDays };
  }, [slots, inviteeTz]);

  const selectedDaySlots = useMemo(() => {
    if (!selectedDay) return [];
    return slotsByDay.map.get(selectedDay) ?? [];
  }, [selectedDay, slotsByDay.map]);

  if (loading)
    return (
      <div style={{ color: "var(--muted)", fontWeight: 800 }}>
        Loading scheduling page…
      </div>
    );
  if (error)
    return (
      <div style={{ color: "#b91c1c", fontWeight: 900 }}>{String(error)}</div>
    );

  if (booking) {
    const startLocal = DateTime.fromISO(booking.startUtcISO, {
      zone: "utc",
    }).setZone(inviteeTz);
    return (
      <div className="pb-confirm">
        <Card>
          <div className="pb-confirm-title">Confirmed</div>
          <div className="pb-confirm-sub">
            {booking.inviteeName}, you’re scheduled with{" "}
            {booking.host.displayName}.
          </div>
          <div className="pb-confirm-time">
            {startLocal.toFormat("cccc, LLL d")} •{" "}
            {startLocal.toFormat("h:mm a")} ({inviteeTz})
          </div>
          <div className="pb-confirm-actions">
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              Book another time
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  async function submitBooking() {
    if (!safeUsername || !safeEventSlug || !selected) return;

    if (inviteeName.trim().length < 2) {
      setBookingError("Name must be at least 2 characters");
      return;
    }
    const normalizedEmail = inviteeEmail.trim();
    if (!normalizedEmail) {
      setBookingError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      setBookingError("Invalid email address");
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError(null);
      const resp = await api.publicBook(
        safeUsername,
        safeEventSlug,
        {
          inviteeName: inviteeName.trim(),
          inviteeEmail: normalizedEmail,
          startUtcISO: selected.startUtcISO,
          endUtcISO: selected.endUtcISO,
          inviteeTimezone: inviteeTz,
        },
      );
      setBooking(resp.booking);
    } catch (e: any) {
      setBookingError(e?.error ?? "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <div className="pb-wrap">
      <div className="pb-hero">
        <h1>Book your meeting</h1>
        <p>Pick your preferred date and time, then confirm with your details.</p>
      </div>
      <div className="pb-grid">
      <Card>
        <div className="pb-title">{data?.eventType?.title}</div>
        <div className="pb-sub">
          {data?.user?.displayName} • {data?.eventType?.durationMinutes} min
        </div>
        <div className="pb-sub pb-sub-spaced">
          {data?.eventType?.description}
        </div>

        <div className="pb-label">Timezone</div>
        <div className="pb-muted-line">
          {inviteeTz}
        </div>

        <div className="pb-label">Pick a date</div>
        <div className="pb-calendar-wrap">
          <Calendar
            value={
              selectedDay
                ? DateTime.fromISO(selectedDay, { zone: inviteeTz }).toJSDate()
                : undefined
            }
            activeStartDate={monthCursor.startOf("month").toJSDate()}
            onActiveStartDateChange={({ activeStartDate, action }) => {
              if (!activeStartDate) return;
              // Only update month window when user navigates calendar pages.
              if (action === "onChange") return;
              setMonthCursor(DateTime.fromJSDate(activeStartDate).startOf("month"));
            }}
            onChange={(value) => {
              const date = Array.isArray(value) ? value[0] : value;
              if (!date) return;
              const day = DateTime.fromJSDate(date, { zone: inviteeTz }).toISODate();
              if (!day) return;
              if ((slotsByDay.map.get(day)?.length ?? 0) === 0) return;
              setSelectedDay(day);
              setSelected(null);
              setBookingError(null);
            }}
            tileDisabled={({ date }) => {
              const day = DateTime.fromJSDate(date, { zone: inviteeTz }).toISODate();
              return !day || (slotsByDay.map.get(day)?.length ?? 0) === 0;
            }}
            tileClassName={({ date }) => {
              const day = DateTime.fromJSDate(date, { zone: inviteeTz }).toISODate();
              if (!day) return "";
              if (day === selectedDay) return "pb-google-day-selected";
              if ((slotsByDay.map.get(day)?.length ?? 0) > 0) return "pb-google-day-available";
              return "";
            }}
          />
        </div>
      </Card>

      <Card>
        {slotsByDay.sortedDays.length === 0 ? (
          <div className="pb-empty-state">
            No availability in this range.
          </div>
        ) : !selectedDay ? (
          <div className="pb-empty-state">
            Select a day from the calendar to see available times.
          </div>
        ) : selectedDaySlots.length === 0 ? (
          <div className="pb-empty-state">
            No available times for selected day.
          </div>
        ) : (
          <div>
            <div className="pb-times-title">
              Available times -{" "}
              {DateTime.fromISO(selectedDay, { zone: inviteeTz }).toFormat(
                "cccc, LLL d",
              )}
            </div>
            <div className="pb-times">
              {selectedDaySlots.map((s) => {
                const start = DateTime.fromISO(s.startUtcISO, {
                  zone: "utc",
                }).setZone(inviteeTz);
                const active = selected?.startUtcISO === s.startUtcISO;
                return (
                  <button
                    key={s.startUtcISO}
                    className={`pb-time-btn ${active ? "active" : ""}`}
                    onClick={() => {
                      setSelected(s);
                      setBookingError(null);
                    }}
                  >
                    {start.toFormat("h:mm a")}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selected ? (
          <form
            className="pb-form"
            onSubmit={async (e) => {
              e.preventDefault();
              await submitBooking();
            }}
          >
            <div className="pb-form-title">Enter your details</div>
            <div className="pb-form-grid">
              <div>
                <Label htmlFor="invitee-name">Name</Label>
                <Input
                  id="invitee-name"
                  value={inviteeName}
                  onChange={(e) => setInviteeName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="invitee-email">Email</Label>
                <Input
                  id="invitee-email"
                  value={inviteeEmail}
                  onChange={(e) => setInviteeEmail(e.target.value)}
                  placeholder="you@email.com"
                />
              </div>
            </div>

            {bookingError ? (
              <div className="pb-form-error">
                <ErrorText>{bookingError}</ErrorText>
              </div>
            ) : null}

            <div className="pb-form-actions">
              <Button disabled={bookingLoading} type="submit">
                {bookingLoading ? "Booking…" : "Schedule event"}
              </Button>
            </div>
          </form>
        ) : null}
      </Card>
      </div>
    </div>
  );
}
