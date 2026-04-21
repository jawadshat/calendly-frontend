import { Link } from 'react-router-dom';
import './Landing.css';

const logos = ['Notion', 'Stripe', 'Intercom', 'Slack', 'Shopify'];
const stats = [
  { value: '120K+', label: 'Meetings scheduled' },
  { value: '32%', label: 'Fewer no-shows' },
  { value: '8.5 hrs', label: 'Saved per week' },
];
const testimonials = [
  {
    quote:
      'Our sales team moved from endless email threads to one clean booking link. The calendar sync is smooth and reliable.',
    name: 'Sarah Khan',
    role: 'Revenue Ops Lead',
  },
  {
    quote:
      'Availability controls are exactly what we needed. Buffers and notice windows instantly reduced scheduling chaos.',
    name: 'Usman Ali',
    role: 'Founder, Studio Nova',
  },
  {
    quote:
      'The page looks modern and professional. Clients trust the process and book without needing back-and-forth messages.',
    name: 'Areeba Noor',
    role: 'Consultant',
  },
];
const faqs = [
  {
    q: 'Can guests book without an account?',
    a: 'Yes. Anyone can open your event link and book a slot. No sign-up is required for invitees.',
  },
  {
    q: 'Does it sync with Google Calendar?',
    a: 'Yes. Host busy times are considered, and invited guests can receive a Google Calendar invite automatically.',
  },
  {
    q: 'Can I create multiple event types?',
    a: 'Absolutely. You can create different durations and meeting types and share each with its own link.',
  },
];

export function Landing() {
  return (
    <div className="lp">
      <section className="lp-hero">
        <div className="lp-orb lp-orb-a" aria-hidden="true" />
        <div className="lp-orb lp-orb-b" aria-hidden="true" />
        <div className="lp-wrap">
          <div className="lp-copy lp-enter-up">
            <span className="lp-pill">Calendly style scheduling</span>
            <h1>Easy scheduling ahead</h1>
            <p>
              Connect with prospects, clients, and teammates in fewer emails. Share one booking link and let people pick the
              best time instantly.
            </p>
            <div className="lp-actions">
              <Link to="/register" className="lp-btn lp-btn-primary">
                Start for free
              </Link>
              <Link to="/login" className="lp-btn lp-btn-secondary">
                Log in
              </Link>
            </div>
            <div className="lp-meta">
              <strong>14-day productivity jump</strong>
              <span>Thousands of meetings booked with this flow every month.</span>
            </div>
          </div>

          <div className="lp-visual lp-enter-right">
            <div className="lp-panel lp-float">
              <div className="lp-panel-head">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <div className="lp-url">calendlyclone.app/jawad/intro-call</div>
              </div>
              <div className="lp-panel-body">
                <div className="lp-event">
                  <div>
                    <h4>30 min Intro Call</h4>
                    <p>Zoom Meeting</p>
                  </div>
                  <span>Live</span>
                </div>
                <div className="lp-calendar">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d) => (
                    <small key={d}>{d}</small>
                  ))}
                  {Array.from({ length: 35 }).map((_, idx) => {
                    const on = [5, 8, 11, 16, 17, 22, 27, 30].includes(idx);
                    return (
                      <button key={idx} className={on ? 'on' : ''} type="button">
                        {(idx % 30) + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="lp-slots">
                  <button type="button">9:00 AM</button>
                  <button type="button">10:30 AM</button>
                  <button type="button">1:00 PM</button>
                  <button type="button">3:30 PM</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-logos">
        <div className="lp-wrap">
          <p>Trusted by teams at</p>
          <div className="lp-logo-row">
            {logos.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-stats">
        <div className="lp-wrap lp-stats-row">
          {stats.map((s) => (
            <article key={s.label} className="lp-stat-card">
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lp-features">
        <div className="lp-wrap">
          <div className="lp-title">
            <h2>All your scheduling. One place.</h2>
            <p>Clean UX, faster bookings, and fewer no-shows.</p>
          </div>
          <div className="lp-features-layout">
            <article className="lp-feature-highlight lp-enter-up">
              <span className="lp-feature-chip">Most loved</span>
              <h3>Professional scheduling experience</h3>
              <p>
                Turn your availability into a beautiful booking flow that feels modern, branded, and effortless for every
                invitee.
              </p>
              <ul>
                <li>Personalized links for each event type</li>
                <li>Automatic timezone detection for guests</li>
                <li>Smooth calendar + booking confirmation flow</li>
              </ul>
            </article>
            <div className="lp-grid">
              <article className="lp-card lp-enter-up">
                <h3>Shareable booking links</h3>
                <p>One personalized URL for every event type and workflow.</p>
              </article>
              <article className="lp-card lp-enter-up d1">
                <h3>Google Calendar sync</h3>
                <p>Read busy slots, avoid conflicts, and send guest invites automatically.</p>
              </article>
              <article className="lp-card lp-enter-up d2">
                <h3>Smart availability</h3>
                <p>Define weekly windows, notice time, buffers, and booking limits.</p>
              </article>
              <article className="lp-card lp-enter-up d3">
                <h3>Automatic confirmations</h3>
                <p>Guests get confirmation details and calendar invites instantly.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-showcase">
        <div className="lp-wrap lp-showcase-wrap">
          <div className="lp-showcase-left">
            <h2>Designed to impress every invitee</h2>
            <p>
              Deliver a premium booking experience with elegant pages, clear time selection, and real-time availability that
              updates instantly.
            </p>
            <ul>
              <li>Beautiful scheduling pages with clean typography</li>
              <li>Conflict-safe slots powered by calendar sync</li>
              <li>Automatic invite delivery to guest email</li>
            </ul>
          </div>
          <div className="lp-showcase-right">
            <div className="lp-glass-card">
              <div className="badge">Live preview</div>
              <h4>Product Demo Call</h4>
              <p>Choose a time to meet with our team.</p>
              <div className="time-row">
                <button type="button">11:00 AM</button>
                <button type="button">12:30 PM</button>
                <button type="button">3:00 PM</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-steps">
        <div className="lp-wrap">
          <div className="lp-title">
            <h2>How it works</h2>
          </div>
          <div className="lp-steps-row">
            <div className="lp-step">
              <span>1</span>
              <h4>Set availability</h4>
              <p>Configure your timezone, work hours, and booking rules.</p>
            </div>
            <div className="lp-step">
              <span>2</span>
              <h4>Create event type</h4>
              <p>Add meeting durations and details for each use case.</p>
            </div>
            <div className="lp-step">
              <span>3</span>
              <h4>Get booked</h4>
              <p>Share link, receive booking, and sync everything to calendar.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-testimonials">
        <div className="lp-wrap">
          <div className="lp-title">
            <h2>Loved by growing teams</h2>
            <p>What users say after switching to smart scheduling.</p>
          </div>
          <div className="lp-test-grid">
            {testimonials.map((item) => (
              <article key={item.name} className="lp-test-card">
                <p>"{item.quote}"</p>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-faq">
        <div className="lp-wrap">
          <div className="lp-title">
            <h2>Frequently asked questions</h2>
          </div>
          <div className="lp-faq-list">
            {faqs.map((item) => (
              <details key={item.q} className="lp-faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-cta">
        <div className="lp-wrap">
          <div className="lp-cta-box">
            <h2>Ready to look professional in every booking?</h2>
            <p>Launch your scheduling page in minutes.</p>
            <Link to="/register" className="lp-btn lp-btn-primary">
              Create free account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
