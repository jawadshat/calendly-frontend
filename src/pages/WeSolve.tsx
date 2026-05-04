/** Solutions page targeting team use-cases and business outcomes. */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./WeSolve.css";
import "./MarketingEnhancements.css";

const roleSolutions = [
  {
    title: "Sales Teams",
    badge: "Pipeline",
    logo: "↗",
    description:
      "Book discovery calls faster, reduce lead drop-off, and keep reps focused on selling instead of chasing availability.",
    bullets: ["Instant lead routing", "Rep-specific links", "Fewer no-shows"],
    accentClass: "s1",
  },
  {
    title: "Customer Success",
    badge: "Retention",
    logo: "❤",
    description:
      "Run smooth onboarding and check-ins with shared links, reminder flows, and conflict-free meeting windows.",
    bullets: [
      "Onboarding calendars",
      "Automated reminders",
      "Health-check workflows",
    ],
    accentClass: "s2",
  },
  {
    title: "Recruiters",
    badge: "Hiring",
    logo: "◉",
    description:
      "Coordinate candidate interviews across calendars while giving every applicant a simple, professional booking experience.",
    bullets: [
      "Panel interview flow",
      "Timezone-safe booking",
      "Role-based templates",
    ],
    accentClass: "s3",
  },
  {
    title: "Consultants",
    badge: "Services",
    logo: "◆",
    description:
      "Offer clear call types, manage paid sessions, and let clients schedule the right conversation without back-and-forth.",
    bullets: ["Session packages", "Priority slots", "Meeting prep forms"],
    accentClass: "s4",
  },
  {
    title: "Founders",
    badge: "Scale",
    logo: "✦",
    description:
      "Handle investor calls, hiring interviews, and customer meetings from one place with role-based event types.",
    bullets: [
      "Investor links",
      "Ops-friendly routing",
      "Team scheduling control",
    ],
    accentClass: "s5",
  },
];

const industrySolutions = [
  {
    title: "SaaS",
    badge: "Growth",
    logo: "S",
    description:
      "Route product demos, onboarding calls, and support escalations with a booking flow tailored for recurring growth.",
    bullets: ["Demo funnels", "CS handoff rules", "Trial-to-paid call routing"],
    accentClass: "s1",
  },
  {
    title: "Healthcare",
    badge: "Care",
    logo: "H",
    description:
      "Streamline patient intake and follow-ups with clear availability, timezone-aware booking, and trusted confirmations.",
    bullets: ["Intake sessions", "Follow-up booking", "Trusted reminders"],
    accentClass: "s2",
  },
  {
    title: "Education",
    badge: "Learning",
    logo: "E",
    description:
      "Manage parent meetings, admissions interviews, and student sessions with structured scheduling rules.",
    bullets: [
      "Admissions slots",
      "Parent-teacher booking",
      "Advisor office hours",
    ],
    accentClass: "s3",
  },
  {
    title: "Agencies",
    badge: "Delivery",
    logo: "A",
    description:
      "Coordinate client reviews, strategy sessions, and handoff calls while maintaining a polished, branded experience.",
    bullets: [
      "Client review cycles",
      "Campaign planning calls",
      "Account team sync",
    ],
    accentClass: "s4",
  },
  {
    title: "Professional Services",
    badge: "Trust",
    logo: "P",
    description:
      "Support legal, finance, and advisory consultations with clean booking pages and dependable calendar sync.",
    bullets: [
      "Consultation types",
      "Compliance-friendly flow",
      "Reliable confirmations",
    ],
    accentClass: "s5",
  },
];

const premiumStats = [
  { value: "35%", label: "faster meeting booking flow" },
  { value: "4.9/5", label: "guest scheduling satisfaction" },
  { value: "< 1 min", label: "average time to confirm a slot" },
];

const premiumQuotes = [
  {
    quote:
      "The booking page feels enterprise-grade. Clients trust it instantly and book without confusion.",
    name: "Areeba Noor",
    role: "Operations Consultant",
  },
  {
    quote:
      "The role-based setup finally matched how our team works. Sales and CS now run scheduling with zero overlap.",
    name: "Hassan Malik",
    role: "Head of Revenue",
  },
];

const brandLogos = [
  "Notion",
  "Stripe",
  "Slack",
  "HubSpot",
  "Intercom",
  "Shopify",
];

type SolutionItem = {
  title: string;
  badge: string;
  logo: string;
  description: string;
  bullets: string[];
  accentClass: string;
};

function AdvancedSliderSection(props: {
  title: string;
  subtitle: string;
  items: SolutionItem[];
  autoMs?: number;
}) {
  const { title, subtitle, items, autoMs = 7600 } = props;
  const [activeIdx, setActiveIdx] = useState(0);
  const active = items[activeIdx];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % items.length);
    }, autoMs);
    return () => window.clearInterval(timer);
  }, [autoMs, items.length]);

  return (
    <div className="ws-advanced">
      <div className="ws-head">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="ws-advanced-grid">
        <div className="ws-rail">
          {items.map((item, idx) => {
            const isActive = idx === activeIdx;
            return (
              <div key={item.title} className="ws-rail-item-wrap">
                <button
                  type="button"
                  className={`ws-rail-item ws-theme-${item.accentClass}${isActive ? " is-active" : ""}`}
                  onClick={() => setActiveIdx(idx)}
                >
                  <span className="ws-rail-item-top">
                    <span className="ws-rail-logo" aria-hidden="true">
                      {item.logo}
                    </span>
                    {isActive ? (
                      <span className="ws-rail-item-sub">{item.badge}</span>
                    ) : null}
                  </span>
                  <span className="ws-rail-item-title">{item.title}</span>
                  {isActive ? (
                    <span className="ws-rail-item-desc">{item.description}</span>
                  ) : null}
                  {isActive ? (
                    <span
                      className="ws-rail-item-progress"
                      style={{ animationDuration: `${autoMs}ms` }}
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
                {isActive ? (
                  <div className="ws-mobile-stage" aria-hidden="true">
                    <div className={`ws-media-browser ws-media-${item.accentClass}`}>
                      <div className="ws-media-browser-head">
                        <span />
                        <span />
                        <span />
                        <small>calendlyclone.app/{item.accentClass}</small>
                      </div>
                      <div className="ws-media-browser-body">
                        <div className="ws-media-hero">
                          <div className="ws-media-hero-top">
                            <span>{item.logo}</span>
                            <strong>{item.title}</strong>
                          </div>
                          <div className="ws-media-hero-grid">
                            <div>
                              <small>Focus</small>
                              <strong>{item.badge}</strong>
                            </div>
                            <div>
                              <small>Status</small>
                              <strong>Live</strong>
                            </div>
                            <div>
                              <small>Flow</small>
                              <strong>Smart booking</strong>
                            </div>
                            <div>
                              <small>Result</small>
                              <strong>Less friction</strong>
                            </div>
                          </div>
                        </div>
                        <div className="ws-media-card">
                          <strong>{item.bullets[0]}</strong>
                        </div>
                        <div className="ws-media-card">
                          <strong>{item.bullets[1]}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <article
          className={`ws-stage ${active.accentClass}`}
          key={active.title}
        >
          <div className="ws-stage-motion" aria-hidden="true">
            <span className="blob b1" />
            <span className="blob b2" />
            <span className="blob b3" />
            <span className="sq sq1" />
            <span className="sq sq2" />
            <span className="grid" />
          </div>
          <div className="ws-stage-media" aria-hidden="true">
            <div className={`ws-media-browser ws-media-${active.accentClass}`}>
              <div className="ws-media-browser-head">
                <span />
                <span />
                <span />
                <small>calendlyclone.app/{active.accentClass}</small>
              </div>
              <div className="ws-media-browser-body">
                <div className="ws-media-hero">
                  <div className="ws-media-hero-top">
                    <span>{active.logo}</span>
                    <strong>{active.title}</strong>
                  </div>
                  <div className="ws-media-hero-grid">
                    <div>
                      <small>Focus</small>
                      <strong>{active.badge}</strong>
                    </div>
                    <div>
                      <small>Status</small>
                      <strong>Live</strong>
                    </div>
                    <div>
                      <small>Flow</small>
                      <strong>Smart booking</strong>
                    </div>
                    <div>
                      <small>Result</small>
                      <strong>Less friction</strong>
                    </div>
                  </div>
                </div>
                <div className="ws-media-card">
                  <strong>{active.bullets[0]}</strong>
                </div>
                <div className="ws-media-card">
                  <strong>{active.bullets[1]}</strong>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export function WeSolve() {
  return (
    <div className="ws-page">
      <section className="ws-hero">
        <div className="ws-hero-orb ws-hero-orb-a" aria-hidden="true" />
        <div className="ws-hero-orb ws-hero-orb-b" aria-hidden="true" />
        <div className="ws-wrap">
          <span className="ws-pill">Explore solutions</span>
          <h1>We solve the scheduling challenges teams face</h1>
          <p>
            From first-touch demos to long-term client success, our booking
            experiences are built to convert faster, look premium, and keep your
            entire calendar system conflict-free.
          </p>
          <div className="ws-actions">
            <Link to="/register" className="ws-btn ws-btn-primary">
              Get started free
            </Link>
            <Link to="/login" className="ws-btn ws-btn-secondary">
              Log in
            </Link>
          </div>
          <div className="ws-hero-meta">
            <div>
              <strong>120K+</strong>
              <span>meetings booked</span>
            </div>
            <div>
              <strong>35%</strong>
              <span>faster booking cycles</span>
            </div>
            <div>
              <strong>4.9/5</strong>
              <span>guest experience rating</span>
            </div>
          </div>
        </div>
      </section>

      <section className="ws-logos">
        <div className="ws-wrap">
          <p>Trusted by teams at</p>
          <div className="ws-logo-row">
            {brandLogos.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="ws-section">
        <div className="ws-wrap">
          <AdvancedSliderSection
            title="Solutions for Different Roles"
            subtitle="Built for the way each team works day to day."
            items={roleSolutions}
          />
        </div>
      </section>

      <section className="ws-premium">
        <div className="ws-wrap ws-premium-grid">
          {premiumStats.map((item) => (
            <article key={item.label} className="ws-premium-card">
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ws-section ws-section-alt">
        <div className="ws-wrap">
          <AdvancedSliderSection
            title="Solutions for Industries"
            subtitle="Adaptable scheduling experiences across business types."
            items={industrySolutions}
          />
        </div>
      </section>

      <section className="ws-proof">
        <div className="ws-wrap">
          <div className="ws-head">
            <h2>Trusted by modern teams</h2>
            <p>Real outcomes from teams using premium scheduling journeys.</p>
          </div>
          <div className="ws-proof-grid">
            {premiumQuotes.map((item) => (
              <article key={item.name} className="ws-proof-card">
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

      <section className="ws-cta">
        <div className="ws-wrap">
          <div className="ws-cta-box">
            <h2>Turn every booking into a premium experience</h2>
            <p>Launch beautiful scheduling pages and let clients self-serve.</p>
            <Link to="/register" className="ws-btn ws-btn-primary">
              Create your account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
