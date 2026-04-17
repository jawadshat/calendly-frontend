import { Link } from 'react-router-dom';
import { Card, Button } from '../components/ui';

export function Landing() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20, alignItems: 'start' }}>
      <div>
        <h1 style={{ fontSize: 44, lineHeight: 1.05, margin: 0, letterSpacing: -1 }}>
          Scheduling made simple.
        </h1>
        <p style={{ marginTop: 12, fontSize: 16, color: '#475569', maxWidth: 560 }}>
          This is a MERN Calendly-style clone: hosts set weekly availability and event types, invitees pick a time, and a
          booking is created.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <Link to="/register">
            <Button>Get started</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary">Log in</Button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 28 }}>
          <Card>
            <div style={{ fontWeight: 900 }}>Availability</div>
            <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>Set weekly hours + booking rules.</div>
          </Card>
          <Card>
            <div style={{ fontWeight: 900 }}>Event types</div>
            <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>Create shareable scheduling links.</div>
          </Card>
          <Card>
            <div style={{ fontWeight: 900 }}>Bookings</div>
            <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>Invitees book open slots.</div>
          </Card>
        </div>
      </div>

      <Card style={{ padding: 18 }}>
        <div style={{ fontWeight: 900, fontSize: 16 }}>Try a booking link</div>
        <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>
          After you create an event type, you’ll get a link like:
        </div>
        <div style={{ marginTop: 10, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
          /yourUsername/intro-call
        </div>
        <div style={{ color: '#64748b', fontSize: 12, marginTop: 10 }}>
          This is inspired by Calendly’s workflow ([Calendly](https://calendly.com/)).
        </div>
      </Card>
    </div>
  );
}

