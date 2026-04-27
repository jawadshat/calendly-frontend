import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

const logos = ["Notion", "Stripe", "Intercom", "Slack", "Shopify"];
const stats = [
  {
    target: 120,
    decimals: 0,
    prefix: "",
    suffix: "K+",
    label: "Meetings scheduled",
  },
  { target: 32, decimals: 0, prefix: "", suffix: "%", label: "Fewer no-shows" },
  {
    target: 8.5,
    decimals: 1,
    prefix: "",
    suffix: " hrs",
    label: "Saved per week",
  },
];
const testimonials = [
  {
    quote:
      "Our sales team moved from endless email threads to one clean booking link. The calendar sync is smooth and reliable.",
    name: "Sarah Khan",
    role: "Revenue Ops Lead",
    initials: "SK",
    company: "Nexa Growth",
  },
  {
    quote:
      "Availability controls are exactly what we needed. Buffers and notice windows instantly reduced scheduling chaos.",
    name: "Usman Ali",
    role: "Founder, Studio Nova",
    initials: "UA",
    company: "Studio Nova",
  },
  {
    quote:
      "The page looks modern and professional. Clients trust the process and book without needing back-and-forth messages.",
    name: "Areeba Noor",
    role: "Consultant",
    initials: "AN",
    company: "Independent",
  },
];
const faqs = [
  {
    q: "Can guests book without an account?",
    a: "Yes. Anyone can open your event link and book a slot. No sign-up is required for invitees.",
  },
  {
    q: "Does it sync with Google Calendar?",
    a: "Yes. Host busy times are considered, and invited guests can receive a Google Calendar invite automatically.",
  },
  {
    q: "Can I create multiple event types?",
    a: "Absolutely. You can create different durations and meeting types and share each with its own link.",
  },
];

const featureAccordion = [
  {
    title: "Professional scheduling experience",
    subtitle: "Most loved",
    description:
      "Turn your availability into a beautiful booking flow that feels modern, branded, and effortless for every invitee.",
    bullets: [
      "Personalized links for each event type",
      "Automatic timezone detection for guests",
      "Smooth calendar + booking confirmation flow",
    ],
    accentClass: "a1",
  },
  {
    title: "Shareable booking links",
    subtitle: "Link-first workflow",
    description: "One personalized URL for every event type and workflow.",
    bullets: [
      "Custom slugs for each meeting type",
      "Ready to share on email, bio, or website",
      "Branded booking experience",
    ],
    accentClass: "a2",
  },
  {
    title: "Google Calendar sync",
    subtitle: "Calendar-safe",
    description:
      "Read busy slots, avoid conflicts, and send guest invites automatically.",
    bullets: [
      "Conflict prevention before booking",
      "Auto invite creation",
      "Reliable schedule consistency",
    ],
    accentClass: "a3",
  },
  {
    title: "Smart availability",
    subtitle: "Rule engine",
    description:
      "Define weekly windows, notice time, buffers, and booking limits.",
    bullets: [
      "Per-event working windows",
      "Min notice and future limits",
      "Buffer-aware slot generation",
    ],
    accentClass: "a4",
  },
  {
    title: "Automatic confirmations",
    subtitle: "Zero follow-up",
    description:
      "Guests get confirmation details and calendar invites instantly.",
    bullets: [
      "Instant host + invitee notifications",
      "Reduced no-shows with reminders",
      "Professional booking communication",
    ],
    accentClass: "a5",
  },
];

function AnimatedStat(props: {
  target: number;
  decimals: number;
  prefix: string;
  suffix: string;
  durationMs?: number;
}) {
  const { target, decimals, prefix, suffix, durationMs = 1400 } = props;
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const elRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const node = elRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        setStarted(true);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, started, target]);

  const display = `${prefix}${value.toFixed(decimals)}${suffix}`;

  return <h3 ref={elRef}>{display}</h3>;
}

export function Landing() {
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);
  const activeFeature = featureAccordion[activeFeatureIdx];

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(".lp-reveal"),
    );
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

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
              Connect with prospects, clients, and teammates in fewer emails.
              Share one booking link and let people pick the best time
              instantly.
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
              <span>
                Thousands of meetings booked with this flow every month.
              </span>
            </div>
          </div>

          <div className="lp-visual lp-enter-right" aria-hidden="true">
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
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, idx) => (
                    <small key={`${d}-${idx}`}>{d}</small>
                  ))}
                  {Array.from({ length: 35 }).map((_, idx) => {
                    const on = [5, 8, 11, 16, 17, 22, 27, 30].includes(idx);
                    return (
                      <button
                        key={idx}
                        className={on ? "on" : ""}
                        type="button"
                        tabIndex={-1}
                      >
                        {(idx % 30) + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="lp-slots">
                  <button type="button" tabIndex={-1}>
                    9:00 AM
                  </button>
                  <button type="button" tabIndex={-1}>
                    10:30 AM
                  </button>
                  <button type="button" tabIndex={-1}>
                    1:00 PM
                  </button>
                  <button type="button" tabIndex={-1}>
                    3:30 PM
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-logos lp-reveal">
        <div className="lp-wrap">
          <p>Trusted by teams at</p>
          <div className="lp-logo-row">
            {logos.map((name, idx) => (
              <span key={name} style={{ animationDelay: `${idx * 120}ms` }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-stats lp-reveal">
        <div className="lp-wrap lp-stats-row">
          {stats.map((s, idx) => (
            <article
              key={s.label}
              className="lp-stat-card"
              style={{ animationDelay: `${120 + idx * 90}ms` }}
            >
              <AnimatedStat
                target={s.target}
                decimals={s.decimals}
                prefix={s.prefix}
                suffix={s.suffix}
              />
              <p>{s.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lp-features lp-reveal">
        <div className="lp-wrap">
          <div className="lp-title">
            <h2>All your scheduling. One place.</h2>
            <p>Clean UX, faster bookings, and fewer no-shows.</p>
          </div>
          <div className="lp-feature-accordion">
            <div className="lp-feature-rail">
              {featureAccordion.map((item, idx) => {
                const active = idx === activeFeatureIdx;
                return (
                  <button
                    type="button"
                    key={item.title}
                    className={`lp-feature-item${active ? " is-active" : ""}`}
                    onClick={() => setActiveFeatureIdx(idx)}
                  >
                    <span className="lp-feature-item-title">{item.title}</span>
                    <span className="lp-feature-item-sub">{item.subtitle}</span>
                  </button>
                );
              })}
            </div>

            <div
              className={`lp-feature-stage ${activeFeature.accentClass}`}
              key={activeFeature.title}
            >
              <div className="lp-feature-bg-motion" aria-hidden="true">
                <span className="blob b1" />
                <span className="blob b2" />
                <span className="blob b3" />
                <span className="grid" />
              </div>
              <div className="lp-feature-stage-glow" aria-hidden="true" />
              <article className="lp-feature-stage-content">
                <span className="lp-feature-chip">
                  {activeFeature.subtitle}
                </span>
                <h3>{activeFeature.title}</h3>
                <p>{activeFeature.description}</p>
                <ul>
                  {activeFeature.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>

              <div className="lp-feature-stage-visual" aria-hidden="true">
                <div className="lp-feature-pulse" />
                <div className="lp-feature-bars">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="lp-feature-badges">
                  <span>Auto</span>
                  <span>Live</span>
                  <span>Smart</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-showcase lp-reveal">
        <div className="lp-wrap lp-showcase-wrap">
          <div className="lp-showcase-left">
            <span className="lp-showcase-kicker">Guest-first design</span>
            <h2>Designed to impress every invitee</h2>
            <p>
              Deliver a premium booking experience with elegant pages, clear
              time selection, and real-time availability that updates instantly.
            </p>
            <ul>
              <li>Beautiful scheduling pages with clean typography</li>
              <li>Conflict-safe slots powered by calendar sync</li>
              <li>Automatic invite delivery to guest email</li>
            </ul>
            <div className="lp-showcase-proof">
              <div>
                <strong>4.9/5</strong>
                <span>Guest booking satisfaction</span>
              </div>
              <div>
                <strong>&lt; 45s</strong>
                <span>Average time to book</span>
              </div>
            </div>
          </div>
          <div className="lp-showcase-right">
            <div className="lp-showcase-stack" aria-hidden="true">
              <div className="lp-glass-card lp-layer-main">
                <div className="badge">Live preview</div>
                <h4>Product Demo Call</h4>
                <p>Choose a time to meet with our team.</p>
                <div className="time-row">
                  <button type="button" tabIndex={-1}>
                    11:00 AM
                  </button>
                  <button type="button" tabIndex={-1}>
                    12:30 PM
                  </button>
                  <button type="button" tabIndex={-1}>
                    3:00 PM
                  </button>
                </div>
              </div>
              <div className="lp-layer-card lp-layer-top">
                <span className="tag">Timezone smart</span>
                <strong>Pakistan (PKT)</strong>
                <small>Auto-adjusted from your browser</small>
              </div>
              <div className="lp-layer-card lp-layer-bottom">
                <span className="tag">Booking confirmed</span>
                <strong>Invite sent instantly</strong>
                <small>Email + calendar event created</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-steps lp-reveal">
        <div className="lp-wrap">
          <div className="lp-title">
            <h2>How it works</h2>
            <p>Three smooth steps from setup to confirmed meetings.</p>
          </div>
          <div className="lp-steps-track" aria-hidden="true" />
          <div className="lp-steps-row lp-steps-modern">
            <div className="lp-step lp-step-modern">
              <span className="lp-step-number">1</span>
              <div className="lp-step-icon">⚙</div>
              <h4>Set availability</h4>
              <p>Configure your timezone, work hours, and booking rules.</p>
            </div>
            <div className="lp-step lp-step-modern">
              <span className="lp-step-number">2</span>
              <div className="lp-step-icon">🔗</div>
              <h4>Create event type</h4>
              <p>Add meeting durations and details for each use case.</p>
            </div>
            <div className="lp-step lp-step-modern">
              <span className="lp-step-number">3</span>
              <div className="lp-step-icon">✅</div>
              <h4>Get booked</h4>
              <p>
                Share link, receive booking, and sync everything to calendar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-testimonials lp-reveal">
        <div className="lp-wrap">
          <div className="lp-title">
            <h2>Loved by growing teams</h2>
            <p>What users say after switching to smart scheduling.</p>
          </div>
          <div className="lp-test-grid">
            {testimonials.map((item) => (
              <article key={item.name} className="lp-test-card">
                <div className="lp-test-top">
                  <div className="lp-test-avatar">{item.initials}</div>
                  <div className="lp-test-id">
                    <strong>{item.name}</strong>
                    <span>
                      {item.role} • {item.company}
                    </span>
                  </div>
                </div>
                <div className="lp-test-stars" aria-hidden="true">
                  ★★★★★
                </div>
                <p>"{item.quote}"</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-faq lp-reveal">
        <div className="lp-wrap">
          <div className="lp-title">
            <h2>Frequently asked questions</h2>
          </div>
          <div className="lp-faq-list">
            {faqs.map((item, idx) => (
              <details key={item.q} className="lp-faq-item">
                <summary>
                  <span className="lp-faq-qwrap">
                    <span className="lp-faq-index">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span>{item.q}</span>
                  </span>
                  <span className="lp-faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-cta lp-reveal">
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
