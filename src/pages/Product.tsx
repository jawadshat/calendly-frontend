import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Product.css";
import "./Landing.css";

const services = [
  {
    title: "Smart Scheduling",
    description:
      "Create polished booking flows with availability rules that prevent conflicts automatically.",
  },
  {
    title: "Team Routing",
    description:
      "Distribute meetings to the right person based on ownership, region, or workload.",
  },
  {
    title: "Branded Experience",
    description:
      "Deliver premium booking pages that match your product and build client trust instantly.",
  },
];

const integrations = [
  "Google Calendar",
  "Outlook Calendar",
  "Zoom",
  "Google Meet",
  "Slack Alerts",
  "Webhook/API",
];

const productSlider = [
  {
    title: "Scheduling Automation",
    subtitle: "Automation",
    logo: "A",
    description:
      "Automate meeting availability and reduce the manual back-and-forth.",
    bullets: [
      "Live sync with connected calendars",
      "Reduce no-shows with reminders",
      "Auto buffers and notice rules",
    ],
    accentClass: "a1",
  },
  {
    title: "Team Scheduling",
    subtitle: "Team-first",
    logo: "T",
    description: "Coordinate team calendars without overlap and route faster.",
    bullets: [
      "Round-robin routing options",
      "Group and collective scheduling",
      "Role-based ownership controls",
    ],
    accentClass: "a2",
  },
  {
    title: "Client Experience",
    subtitle: "Experience",
    logo: "C",
    description: "Give clients a clean, branded, and frictionless booking journey.",
    bullets: [
      "Branded booking interfaces",
      "Shareable links for every flow",
      "Consistent premium UX",
    ],
    accentClass: "a3",
  },
  {
    title: "Availability Controls",
    subtitle: "Rules",
    logo: "R",
    description: "Define flexible availability windows that fit real team operations.",
    bullets: [
      "Work-hour and break constraints",
      "Minimum notice and max range",
      "Adaptive slot generation",
    ],
    accentClass: "a4",
  },
  {
    title: "Booking Communications",
    subtitle: "Comms",
    logo: "M",
    description: "Keep hosts and invitees informed with automated, professional messaging.",
    bullets: [
      "Instant confirmations",
      "Reminder and follow-up flow",
      "Professional templates",
    ],
    accentClass: "a5",
  },
];

export function Product() {
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);
  const slideMs = 7600;
  const activeFeature = productSlider[activeFeatureIdx];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveFeatureIdx((prev) => (prev + 1) % productSlider.length);
    }, slideMs);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="pp">
      <section className="pp-hero">
        <div className="pp-wrap">
          <span className="pp-pill">Product</span>
          <h1>One scheduling product for teams that move fast</h1>
          <p>
            Build professional booking experiences, automate meeting operations,
            and keep every calendar in sync across your workflow.
          </p>
          <div className="pp-actions">
            <Link to="/register" className="pp-btn pp-btn-primary">
              Start free
            </Link>
            <Link to="/we-solve" className="pp-btn pp-btn-secondary">
              Explore solutions
            </Link>
          </div>
        </div>
      </section>

      <section className="pp-section">
        <div className="pp-wrap">
          <div className="pp-head">
            <h2>Our Product Services</h2>
            <p>Everything needed to run scheduling like a modern SaaS team.</p>
          </div>
          <div className="pp-service-grid">
            {services.map((item) => (
              <article key={item.title} className="pp-service-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pp-section pp-section-soft">
        <div className="pp-wrap">
          <div className="pp-head">
            <h2>Integrations</h2>
            <p>Plug into your existing stack without changing how your team works.</p>
          </div>
          <div className="pp-integration-grid">
            {integrations.map((item) => (
              <div key={item} className="pp-integration-card">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pp-section">
        <div className="pp-wrap">
          <div className="pp-head">
            <h2>Product In Action</h2>
            <p>Everything your teams need in one polished scheduling engine.</p>
          </div>
          <div className="lp-feature-accordion">
            <div className="lp-feature-rail">
              {productSlider.map((item, idx) => {
                const active = idx === activeFeatureIdx;
                return (
                  <div key={item.title} className="lp-feature-item-wrap">
                    <button
                      type="button"
                      className={`lp-feature-item lp-theme-${item.accentClass}${active ? " is-active" : ""}`}
                      onClick={() => setActiveFeatureIdx(idx)}
                    >
                      <span className="lp-feature-item-top">
                        <span className="lp-feature-item-logo">{item.logo}</span>
                        {active ? (
                          <span className="lp-feature-item-sub">{item.subtitle}</span>
                        ) : null}
                      </span>
                      <span className="lp-feature-item-title">{item.title}</span>
                      {active ? (
                        <span className="lp-feature-item-desc">{item.description}</span>
                      ) : null}
                      {active ? (
                        <span
                          className="lp-feature-progress"
                          style={{ animationDuration: `${slideMs}ms` }}
                        />
                      ) : null}
                    </button>
                    {active ? (
                      <div className="lp-mobile-stage" aria-hidden="true">
                        <div className={`lp-media-browser lp-media-${item.accentClass}`}>
                          <div className="lp-media-browser-head">
                            <span />
                            <span />
                            <span />
                            <small>calendlyclone.app/product/{item.accentClass}</small>
                          </div>
                          <div className="lp-media-browser-body">
                            <div className="lp-media-hero">
                              <div className="lp-media-hero-top">
                                <span>{item.logo}</span>
                                <strong>{item.title}</strong>
                              </div>
                              <div className="lp-media-hero-grid">
                                <div>
                                  <small>Mode</small>
                                  <strong>{item.subtitle}</strong>
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
                            <div className="lp-media-card">
                              <strong>{item.bullets[0]}</strong>
                            </div>
                            <div className="lp-media-card">
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

            <div className={`lp-feature-stage ${activeFeature.accentClass}`}>
              <div className="lp-feature-bg-motion" aria-hidden="true">
                <span className="blob b1" />
                <span className="blob b2" />
                <span className="blob b3" />
                <span className="sq sq1" />
                <span className="sq sq2" />
              </div>
              <div className="lp-feature-stage-media" aria-hidden="true">
                <div className={`lp-media-browser lp-media-${activeFeature.accentClass}`}>
                  <div className="lp-media-browser-head">
                    <span />
                    <span />
                    <span />
                    <small>calendlyclone.app/product/{activeFeature.accentClass}</small>
                  </div>
                  <div className="lp-media-browser-body">
                    <div className="lp-media-hero">
                      <div className="lp-media-hero-top">
                        <span>{activeFeature.logo}</span>
                        <strong>{activeFeature.title}</strong>
                      </div>
                      <div className="lp-media-hero-grid">
                        <div>
                          <small>Mode</small>
                          <strong>{activeFeature.subtitle}</strong>
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
                    <div className="lp-media-card">
                      <strong>{activeFeature.bullets[0]}</strong>
                    </div>
                    <div className="lp-media-card">
                      <strong>{activeFeature.bullets[1]}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pp-cta">
        <div className="pp-wrap">
          <div className="pp-cta-box">
            <h2>Get started for free</h2>
            <p>Launch your scheduling workspace and start booking in minutes.</p>
            <Link to="/register" className="pp-btn pp-btn-primary">
              Get started for free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
