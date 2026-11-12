import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  MapPin,
  Menu,
  Radio,
  School,
  Users,
  X,
} from "lucide-react";
import "./_group.css";
import "./Professional.css";

const routes = [
  ["About Us", "/about"],
  ["Our Services", "/services"],
  ["Our Cause", "/cause"],
  ["Partners and Investors", "/partners-investors"],
  ["Contact", "/contact"],
] as const;

const asset = (name: string) => `/__mockup/images/${name}`;
const counties = [
  "Bomi", "Bong", "Gbarpolu", "Grand Bassa", "Grand Cape Mount",
  "Grand Gedeh", "Grand Kru", "Lofa", "Margibi", "Maryland",
  "Montserrado", "Nimba", "River Cess", "River Gee", "Sinoe",
];

type PrepNotes = {
  locality: string;
  county: string;
  group: string;
  groupType: string;
  needs: string[];
  detail: string;
};

const emptyNotes: PrepNotes = {
  locality: "",
  county: "",
  group: "",
  groupType: "",
  needs: [],
  detail: "",
};

const needOptions = [
  "Learning and school access",
  "Small business and livelihoods",
  "Community services",
  "Staying connected",
  "Other local priorities",
];

function Brand() {
  return (
    <Link href="/" className="olp-brand" aria-label="One Liberia Connect home">
      <img src={asset("logo-one-liberia-connect.png")} alt="One Liberia Connect" />
    </Link>
  );
}

function Header() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header className="olp-header">
      <div className="olp-nav-wrap">
        <Brand />
        <nav className="olp-desktop-nav" aria-label="Main navigation">
          {routes.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
          <Link className="olp-nav-cta" href="/connect-your-community">
            Connect your community <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </nav>
        <button
          className="olp-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="olp-mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
        <nav
          id="olp-mobile-nav"
          className={`olp-mobile-nav${menuOpen ? " is-open" : ""}`}
          aria-label="Mobile navigation"
        >
          {routes.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
          <Link className="olp-nav-cta" href="/connect-your-community">
            Connect your community <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="olp-eyebrow">{children}</div>;
}

function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="olp-section-heading">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
      </div>
      {copy && <p>{copy}</p>}
    </div>
  );
}

function ActionLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={`olp-button${secondary ? " is-secondary" : ""}`} href={href}>
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}

function CommunityPrep() {
  const [step, setStep] = useState(1);
  const [notes, setNotes] = useState<PrepNotes>(emptyNotes);
  const [notice, setNotice] = useState("");
  const isReview = step === 4;

  const update = <K extends keyof PrepNotes>(key: K, value: PrepNotes[K]) => {
    setNotes((current) => ({ ...current, [key]: value }));
    setNotice("");
  };

  const next = () => {
    if (step === 1 && (!notes.locality.trim() || !notes.county)) {
      setNotice("Add a community or locality and choose its county to continue.");
      return;
    }
    if (step === 2 && (!notes.group.trim() || !notes.groupType)) {
      setNotice("Add a school or community group and choose what kind it is.");
      return;
    }
    if (step === 3 && notes.needs.length === 0) {
      setNotice("Choose at least one connectivity priority to continue.");
      return;
    }
    setStep((current) => Math.min(current + 1, 4));
    setNotice("");
  };

  const back = () => {
    setStep((current) => Math.max(current - 1, 1));
    setNotice("");
  };

  const toggleNeed = (value: string) => {
    const selected = notes.needs.includes(value)
      ? notes.needs.filter((need) => need !== value)
      : [...notes.needs, value];
    update("needs", selected);
  };

  const reset = () => {
    setNotes(emptyNotes);
    setStep(1);
    setNotice("");
  };

  return (
    <section className="olp-prep-section" id="prepare">
      <div className="olp-prep-shell">
        <div className="olp-prep-intro">
          <Eyebrow>A useful first step</Eyebrow>
          <h2>Gather the details your community already knows.</h2>
          <p>
            Use this private, on-page guide to organize a locality, a school or
            community group, and the need for connectivity before opening the
            existing request page.
          </p>
          <div className="olp-privacy-note">
            <span className="olp-privacy-mark"><Check size={15} /></span>
            <span>
              No names or contact details here. These preparation notes are not
              sent or saved; they clear when you leave or reset this page.
            </span>
          </div>
          <div className="olp-prep-side-note">
            <span className="olp-prep-index">01—04</span>
            <p>Locality. Community. Priorities. A clearer conversation.</p>
          </div>
        </div>

        <div className="olp-prep-card" aria-labelledby="prep-title">
          <div className="olp-prep-topline">
            <div>
              <span className="olp-kicker">COMMUNITY REQUEST PREPARATION</span>
              <h3 id="prep-title">{isReview ? "Your notes, at a glance" : "Start with your place"}</h3>
            </div>
            <span className="olp-step-count" aria-live="polite">
              {isReview ? "READY" : `0${step} / 03`}
            </span>
          </div>
          {!isReview && (
            <div className="olp-progress" aria-label={`Step ${step} of 3`}>
              {[1, 2, 3].map((item) => (
                <span key={item} className={item <= step ? "is-current" : ""} />
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="olp-prep-fields">
              <p className="olp-step-prompt">
                <MapPin size={17} aria-hidden="true" /> Where should we start looking?
              </p>
              <label className="olp-field">
                <span>Community or locality</span>
                <input
                  value={notes.locality}
                  onChange={(event) => update("locality", event.target.value)}
                  placeholder="For example, a town or neighborhood"
                  autoComplete="off"
                />
              </label>
              <label className="olp-field">
                <span>County</span>
                <select value={notes.county} onChange={(event) => update("county", event.target.value)}>
                  <option value="">Choose a county</option>
                  {counties.map((county) => <option key={county} value={county}>{county}</option>)}
                </select>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="olp-prep-fields">
              <p className="olp-step-prompt">
                <Users size={17} aria-hidden="true" /> Who is connected to this request?
              </p>
              <label className="olp-field">
                <span>School or community group</span>
                <input
                  value={notes.group}
                  onChange={(event) => update("group", event.target.value)}
                  placeholder="A school, association, or local group"
                  autoComplete="off"
                />
              </label>
              <label className="olp-field">
                <span>Group type</span>
                <select value={notes.groupType} onChange={(event) => update("groupType", event.target.value)}>
                  <option value="">Choose a type</option>
                  <option value="School">School</option>
                  <option value="Community association">Community association</option>
                  <option value="Local organization">Local organization</option>
                  <option value="Informal community group">Informal community group</option>
                  <option value="Still being organized">Still being organized</option>
                </select>
              </label>
              <p className="olp-field-help">A group name is enough; do not enter a person's name.</p>
            </div>
          )}

          {step === 3 && (
            <div className="olp-prep-fields">
              <p className="olp-step-prompt">
                <Radio size={17} aria-hidden="true" /> What could better access support?
              </p>
              <fieldset className="olp-need-list">
                <legend>Choose any that reflect local priorities</legend>
                {needOptions.map((option) => (
                  <label className="olp-need-option" key={option}>
                    <input
                      type="checkbox"
                      checked={notes.needs.includes(option)}
                      onChange={() => toggleNeed(option)}
                    />
                    <span className="olp-checkbox"><Check size={13} aria-hidden="true" /></span>
                    <span>{option}</span>
                  </label>
                ))}
              </fieldset>
              <label className="olp-field">
                <span>Anything else to remember? <small>Optional</small></span>
                <textarea
                  rows={2}
                  value={notes.detail}
                  onChange={(event) => update("detail", event.target.value)}
                  placeholder="A practical need, a question, or something to discuss"
                />
              </label>
            </div>
          )}

          {isReview && (
            <div className="olp-review">
              <div className="olp-review-row">
                <span>LOCALITY</span>
                <strong>{notes.locality}, {notes.county}</strong>
              </div>
              <div className="olp-review-row">
                <span>SCHOOL OR GROUP</span>
                <strong>{notes.group} <small>· {notes.groupType}</small></strong>
              </div>
              <div className="olp-review-row olp-review-needs">
                <span>CONNECTIVITY PRIORITIES</span>
                <div className="olp-tags">
                  {notes.needs.map((need) => <span key={need}>{need}</span>)}
                </div>
              </div>
              {notes.detail.trim() && (
                <div className="olp-review-row">
                  <span>ADDITIONAL NOTE</span>
                  <strong>{notes.detail}</strong>
                </div>
              )}
              <p className="olp-review-disclaimer">
                This is a reminder for your conversation, not a submitted request
                or an indication of coverage or service availability.
              </p>
            </div>
          )}

          {notice && <p className="olp-prep-error" role="alert">{notice}</p>}
          <div className="olp-prep-actions">
            {step > 1 && (
              <button className="olp-back-button" type="button" onClick={back}>
                <ChevronLeft size={16} aria-hidden="true" /> Back
              </button>
            )}
            {isReview ? (
              <>
                <button className="olp-back-button" type="button" onClick={reset}>Start over</button>
                <ActionLink href="/connect-your-community">Open the request page</ActionLink>
              </>
            ) : (
              <button className="olp-button" type="button" onClick={next}>
                {step === 3 ? "Review your notes" : "Continue"}
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            )}
          </div>
          {isReview && (
            <button className="olp-edit-notes" type="button" onClick={() => setStep(1)}>
              Edit these notes
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="olp-footer">
      <div className="olp-footer-main">
        <div className="olp-footer-brand">
          <Brand />
          <p>A division of One Liberia Enterprise Corporation.</p>
          <p className="olp-footer-motto">In the Community, Built by the Diaspora.</p>
        </div>
        <div className="olp-footer-links">
          <span className="olp-footer-label">Explore</span>
          {routes.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <Link href="/connect-your-community">Connect your community</Link>
        </div>
        <div className="olp-footer-direction">
          <span className="olp-footer-label">A shared direction</span>
          <p>Affordable internet access and planned school technology hubs, shaped with Liberian communities.</p>
          <Link href="/partners-investors">Explore partnership paths <ArrowRight size={15} /></Link>
        </div>
      </div>
      <div className="olp-footer-bottom">
        <span>© {new Date().getFullYear()} One Liberia Enterprise Corporation</span>
        <span>Plans are subject to review, partnerships, and local feasibility.</span>
      </div>
    </footer>
  );
}

export function Professional() {
  return (
    <div className="olp">
      <Header />
      <main>
        <section className="olp-hero">
          <div className="olp-hero-copy">
            <Eyebrow>Connectivity, shaped together</Eyebrow>
            <h1>Every community deserves a way <em>forward.</em></h1>
            <p className="olp-hero-lede">
              One Liberia Connect is exploring affordable internet access and
              planned school technology hubs with communities across Liberia.
            </p>
            <div className="olp-hero-actions">
              <ActionLink href="#prepare">Prepare a community request</ActionLink>
              <Link className="olp-text-link" href="/about">
                Get to know us <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <div className="olp-hero-signoff">
              <span className="olp-signoff-line" />
              <span>A division of One Liberia Enterprise Corporation</span>
            </div>
          </div>
          <div className="olp-hero-visual">
            <div className="olp-hero-photo">
              <img
                src={asset("community-connectivity.jpg")}
                alt="Community members gathered around mobile devices in Liberia"
                fetchPriority="high"
              />
              <div className="olp-photo-caption">
                <span>THE WORK STARTS LOCALLY</span>
                <strong>Listen. Learn. Plan together.</strong>
              </div>
            </div>
            <div className="olp-hero-note">
              <span className="olp-note-icon"><Compass size={19} /></span>
              <span>Community-led<br /><strong>by design</strong></span>
            </div>
            <div className="olp-hero-index">MONROVIA · LIBERIA</div>
          </div>
          <div className="olp-hero-scroll" aria-hidden="true">
            <span>SCROLL TO EXPLORE</span><ArrowDownRight size={17} />
          </div>
        </section>

        <section className="olp-ambition-band" aria-label="Long-term ambition">
          <div className="olp-ambition-inner">
            <div className="olp-ambition-lead">
              <span className="olp-ambition-number">250,000</span>
              <span className="olp-ambition-caption">A long-term ambition<br />for people to connect</span>
            </div>
            <p>
              A goal for the future—not a current connection count. Progress
              depends on community priorities, feasibility, and partnerships.
            </p>
            <Link href="/cause" className="olp-ambition-link">
              Why connection matters <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="olp-programs olp-section">
          <div className="olp-container">
            <SectionHeading
              eyebrow="A practical path"
              title="Three ways to bring connection closer."
              copy="Each community has its own needs and starting point. We explore possible next steps with the people and local partners who know the place best."
            />
            <div className="olp-program-grid">
              <article className="olp-program olp-program-feature">
                <span className="olp-program-number">01 <i>/ ACCESS</i></span>
                <div className="olp-program-icon"><Radio size={21} /></div>
                <h3>Community broadband</h3>
                <p>Explore affordable internet access that can support daily life, learning, and local enterprise.</p>
                <Link href="/services" className="olp-inline-link">Explore services <ArrowRight size={15} /></Link>
              </article>
              <article className="olp-program">
                <span className="olp-program-number">02 <i>/ LEARNING</i></span>
                <div className="olp-program-icon"><School size={21} /></div>
                <h3>Planned school hubs</h3>
                <p>Technology hubs are a planned initiative, to be explored with potential host schools and local partners.</p>
                <Link href="/services" className="olp-inline-link">How hubs may work <ArrowRight size={15} /></Link>
              </article>
              <article className="olp-program">
                <span className="olp-program-number">03 <i>/ PARTNERSHIP</i></span>
                <div className="olp-program-icon"><Users size={21} /></div>
                <h3>Local relationships</h3>
                <p>Residents, schools, community groups, and diaspora networks all have a role in shaping what comes next.</p>
                <Link href="/partners-investors" className="olp-inline-link">Find your role <ArrowRight size={15} /></Link>
              </article>
            </div>
          </div>
        </section>

        <section className="olp-community">
          <div className="olp-community-photo">
            <img src={asset("monrovia-community.jpg")} alt="A view across Monrovia, with homes, roads, and community infrastructure" loading="lazy" />
            <div className="olp-image-marker"><MapPin size={15} /> LIBERIA</div>
          </div>
          <div className="olp-community-copy">
            <Eyebrow>Grounded in place</Eyebrow>
            <h2>Local realities shape the right next step.</h2>
            <p>
              A request is a starting point for a conversation—not a promise
              of immediate service. Community interest is considered alongside
              coverage, suitable sites, power, partnerships, and the resources
              needed to sustain access.
            </p>
            <div className="olp-community-pull">
              <span>“</span>
              <p>In the Community,<br />Built by the Diaspora.</p>
            </div>
            <Link href="/about" className="olp-inline-link">
              Our community-led approach <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <section className="olp-process olp-section">
          <div className="olp-container">
            <SectionHeading
              eyebrow="A responsible approach"
              title="A request opens a conversation."
              copy="The path from local interest to a possible project needs careful listening and assessment. It is not an instant service sign-up."
            />
            <div className="olp-process-layout">
              <div className="olp-process-list">
                {[
                  ["01", "Listen locally", "Understand where connection is needed and what residents hope it could support."],
                  ["02", "Review feasibility", "Consider existing coverage, a suitable site, power, local partners, and operating needs."],
                  ["03", "Plan together", "Explore whether a sustainable next step is possible with the people and resources involved."],
                ].map(([number, title, body]) => (
                  <article className="olp-process-item" key={number}>
                    <span>{number}</span>
                    <div><h3>{title}</h3><p>{body}</p></div>
                    <ArrowRight size={17} aria-hidden="true" />
                  </article>
                ))}
              </div>
              <aside className="olp-plans-note">
                <span className="olp-plans-label">PLANNED REVIEW MILESTONE</span>
                <div className="olp-plans-date">Dec<br /><strong>2026</strong></div>
                <h3>Feasibility reviews are planned through December 2026.</h3>
                <p>This is a planned review milestone, not a guarantee or service launch date. Timing and outcomes depend on review and the partnerships and resources needed.</p>
                <Link href="/cause" className="olp-inline-link">Read about our cause <ArrowRight size={15} /></Link>
              </aside>
            </div>
          </div>
        </section>

        <CommunityPrep />

        <section className="olp-hub-band">
          <div className="olp-hub-image">
            <img src={asset("community-connectivity.jpg")} alt="A local community gathering around mobile devices" loading="lazy" />
          </div>
          <div className="olp-hub-copy">
            <Eyebrow>Learning, with local partners</Eyebrow>
            <h2>School technology hubs are planned—not open sites.</h2>
            <p>
              One Liberia Connect is exploring hubs in partner schools. No
              launch locations or opening dates are confirmed. Any proposed
              hub would depend on a host school agreement and local planning.
            </p>
            <ActionLink href="/services" secondary>Learn about planned hubs</ActionLink>
          </div>
        </section>

        <section className="olp-partners">
          <div className="olp-partners-copy">
            <Eyebrow>Build the next step together</Eyebrow>
            <h2>Bring your knowledge, your place, or your partnership.</h2>
            <p>
              Schools, community organizations, delivery partners, investors,
              and diaspora groups can help explore sustainable access—guided
              by local priorities.
            </p>
            <ActionLink href="/partners-investors">Explore partnership paths</ActionLink>
          </div>
          <div className="olp-partners-aside">
            <span className="olp-aside-rule" />
            <p>Tell us what your organization could contribute to a community-led approach.</p>
            <Link href="/contact" className="olp-text-link">Contact One Liberia Connect <ArrowRight size={15} /></Link>
          </div>
        </section>

        <section className="olp-final-call">
          <div>
            <span className="olp-final-eyebrow">Your community belongs in the conversation.</span>
            <h2>Start with the place you know.</h2>
          </div>
          <ActionLink href="#prepare" secondary>Prepare a community request</ActionLink>
          <span className="olp-final-decoration" aria-hidden="true">OLC</span>
        </section>
      </main>
      <Footer />
    </div>
  );
}
