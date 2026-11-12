import { useEffect, useState, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ArrowRight, Menu, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { ErrorBoundary } from '@/components/error-boundary';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();
const asset = (name: string) => `/images/${name}`;
const routes = [
  ['Home', '/'], ['About Us', '/about'], ['Our Services', '/services'],
  ['Our Cause', '/cause'], ['Partners and Investors', '/partners-investors'], ['Contact', '/contact'],
] as const;

function Logo() {
  return <Link href="/" className="brand" aria-label="One Liberia Connect home" data-testid="link-home-logo">
    <img src={asset('logo-one-liberia-connect.png')} alt="One Liberia Connect" style={{ width: 174, height: 'auto', maxHeight: 44, objectFit: 'contain' }} />
  </Link>;
}

function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [location]);
  return <header className="site-header">
    <div className="nav-wrap">
      <Logo />
      <nav className="nav-links" aria-label="Main navigation">
        {routes.map(([name, href]) => <Link key={href} href={href} className={location === href ? 'active' : ''} data-testid={`link-nav-${href.slice(1) || 'home'}`}>{name}</Link>)}
        <Link href="/connect-your-community" className="button-link" data-testid="link-connect-community">Connect Your Community <ArrowRight size={14}/></Link>
      </nav>
      <button className="menu-toggle" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} onClick={() => setOpen(!open)} data-testid="button-mobile-menu">
        {open ? <X/> : <Menu/>}
      </button>
      <nav className={`mobile-nav ${open ? 'open' : ''}`} aria-label="Mobile navigation">
        {routes.map(([name, href]) => <Link key={href} href={href} data-testid={`mobile-nav-${href.slice(1) || 'home'}`}>{name}</Link>)}
        <Link href="/connect-your-community" className="button-link">Connect Your Community <ArrowRight size={14}/></Link>
      </nav>
    </div>
  </header>;
}

function Footer() {
  return <footer className="footer">
    <div className="container">
      <div className="footer-main">
        <div><Logo/><p>A division of One Liberia Enterprise Corporation.</p><p className="footer-tagline">In the Community, Built by the Diaspora.</p></div>
        <div><div className="footer-label">Explore</div><div className="footer-links">{routes.map(([name, href]) => <Link key={href} href={href}>{name}</Link>)}<Link href="/connect-your-community">Connect your community</Link></div></div>
        <div><div className="footer-label">A shared commitment</div><p>Affordable internet access, planned school technology hubs, and community-led partnerships across Liberia.</p><Link className="text-link" href="/partners-investors">Explore ways to partner <ArrowRight size={15}/></Link></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} One Liberia Enterprise Corporation</span><span>Plans are subject to review, partnerships and local feasibility.</span></div>
    </div>
  </footer>;
}

function PageHero({ title, intro }: { title: string; intro?: string }) {
  return <section className="page-hero"><div className="container"><div className="crumb"><Link href="/">Home</Link>　/　{title}</div><h1>{title}</h1>{intro && <p>{intro}</p>}</div></section>;
}

function SiteLayout({ children }: { children: ReactNode }) {
  return <><Header/><main>{children}</main><Footer/></>;
}

function SEO({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    const pageTitles: Record<string, string> = {
      Home: 'Community Internet Access in Liberia | One Liberia Connect',
      'About Us': 'About One Liberia Connect | Community Internet in Liberia',
      'Our Services': 'Community Broadband & School Hubs | One Liberia Connect',
      'Our Cause': 'Why Community Connectivity Matters | One Liberia Connect',
      'Partners and Investors': 'Partner for Community Connectivity | One Liberia Connect',
      Contact: 'Contact One Liberia Connect | Community Internet',
      'Connect Your Community': 'Request Community Connectivity | One Liberia Connect',
    };
    const fullTitle = pageTitles[title] ?? `${title} | One Liberia Connect`;
    const socialImage = new URL(asset('monrovia-community.jpg'), window.location.origin).href;
    const pageUrl = `${window.location.origin}${window.location.pathname}`;

    document.title = fullTitle;
    const setMeta = (
      selector: string,
      attribute: 'name' | 'property',
      key: string,
      content: string,
    ) => {
      let meta = document.head.querySelector<HTMLMetaElement>(selector);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:image"]', 'property', 'og:image', socialImage);
    setMeta('meta[property="og:url"]', 'property', 'og:url', pageUrl);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', socialImage);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = pageUrl;
  }, [title, description]);
  return null;
}

function Eyebrow({ children }: { children: ReactNode }) { return <div className="eyebrow">{children}</div>; }
function Image({ file, alt, className = '' }: { file: string; alt: string; className?: string }) {
  return <div className={`visual-slot ${className}`} style={{ background: 'none', minHeight: undefined }}>
    <img src={asset(file)} alt={alt} loading="lazy" style={{ width: '100%', height: '100%', minHeight: 'inherit', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }} />
  </div>;
}
function CTA({ href, children, outline = false }: { href: string; children: ReactNode; outline?: boolean }) {
  return <Link href={href} className={`btn ${outline ? 'outline' : ''}`} data-testid={`link-cta-${href.replaceAll('/', '-') || 'home'}`}>{children}<ArrowRight size={16}/></Link>;
}
function SectionTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="section-head"><div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2></div>{copy && <p>{copy}</p>}</div>;
}

function Home() {
  return <SiteLayout>
    <SEO title="Home" description="Community-led broadband, planned school technology hubs, and local partnerships for a more connected Liberia."/>
    <section className="hero"><div className="hero-inner">
      <div className="reveal"><Eyebrow>Connectivity, shaped together</Eyebrow><h1>Where connection opens <em>possibility.</em></h1><p>Affordable internet can bring learning, livelihoods and essential services closer. We work with Liberian communities to understand where connectivity is needed next.</p><div className="hero-actions"><CTA href="/connect-your-community">Connect your community</CTA><CTA href="/about" outline>Meet One Liberia Connect</CTA></div><div style={{ marginTop: 24, color:'#d7e0e8', font:'10px "Space Mono"' }}>A DIVISION OF ONE LIBERIA ENTERPRISE CORPORATION</div></div>
      <div className="hero-art reveal delay-1"><div className="orbit"><div className="orbit-core"><div><strong>One Liberia</strong><span>CONNECTED</span></div></div><div className="node one">COMMUNITY<br/>BROADBAND</div><div className="node two">LOCAL<br/>PARTNERS</div><div className="node three">SCHOOL<br/>HUBS</div><div className="node four">DIGITAL<br/>ACCESS</div></div><div className="hero-note">A shared direction<strong>Built with communities</strong></div></div>
    </div></section>
    <section className="section"><div className="container"><SectionTitle eyebrow="What connection makes possible" title="Start with what communities say they need." copy="Every place is different. Our approach begins with listening, then builds a practical path with the people and partners who know the community best."/>
      <div className="pathways">
        <article className="path-card feature"><span className="path-number">01 / ACCESS</span><h3>Community broadband</h3><p>Explore affordable internet access where connection can support everyday life, learning and local enterprise.</p><Link className="text-link" href="/services">Explore services <ArrowRight size={15}/></Link></article>
        <article className="path-card"><span className="path-number">02 / LEARNING</span><h3>Planned school technology hubs</h3><p>Partner schools may become places to connect, learn and build practical digital skills.</p><Link className="text-link" href="/services">How hubs may work <ArrowRight size={15}/></Link></article>
        <article className="path-card"><span className="path-number">03 / PARTNERSHIP</span><h3>Local relationships</h3><p>Community champions, schools, diaspora groups and delivery partners all have a role in shaping next steps.</p><Link className="text-link" href="/partners-investors">Find your role <ArrowRight size={15}/></Link></article>
      </div>
    </div></section>
    <section className="mission-band"><div className="container mission-grid"><Image file="community-connectivity.jpg" alt="Community members gathered at a local connectivity point in Liberia"/><div className="mission-copy"><Eyebrow>Our mission</Eyebrow><h2>Location should not limit a person's access to opportunity.</h2><p>One Liberia Connect is working to bridge the connectivity gap with an approach rooted in local priorities. We listen to residents, schools and community organizations to understand demand and the conditions needed for sustainable service.</p><div className="pull-quote">In the Community, Built by the Diaspora.</div><div style={{ marginTop:25 }}><CTA href="/about">Learn about our approach</CTA></div></div></div></section>
    <section className="section"><div className="container"><SectionTitle eyebrow="Grounded in place" title="A better-connected Liberia is built locally."/><div className="split-section"><div className="copy-block"><h3>Start with a conversation.</h3><p>Community requests help guide where we look next. A request is a starting point for a conversation—not a promise of immediate service. We consider community interest alongside coverage, suitable sites, power, local partnerships and the resources needed to establish and sustain service.</p><CTA href="/connect-your-community">Tell us where connection is needed</CTA></div><Image file="monrovia-community.jpg" alt="View across Monrovia showing homes, streets and community infrastructure"/></div></div></section>
    <section className="callout"><div className="container callout-inner"><div><h2>Bring your community into the conversation.</h2><p>Share a location, introduce a school or local organization, or help gather neighbors around a shared need.</p></div><CTA href="/connect-your-community" outline>Start a community request</CTA></div></section>
  </SiteLayout>;
}

function About() {
  return <SiteLayout><SEO title="About Us" description="Learn about One Liberia Connect's community-led approach to expanding affordable internet access across Liberia."/><PageHero title="About Us" intro="A practical, partnership-led approach to connecting Liberian communities."/>
    <section className="section"><div className="container split-section"><Image file="community-wireless-site.jpg" alt="Wireless connectivity equipment installed above a neighborhood in Liberia"/><div className="copy-block"><Eyebrow>About us</Eyebrow><h2>Connecting Liberia with communities at the center.</h2><p>One Liberia Connect, a division of One Liberia Enterprise Corporation, is focused on helping bridge the connectivity gap and bring affordable internet to communities across Liberia.</p><p>Our work begins with a practical question: where can reliable access make a difference in everyday life? We listen to residents, schools and community associations to understand local priorities and the conditions needed for sustainable service.</p><p>Requests help guide where we look next. They are part of an ongoing review, not a guarantee of coverage or a launch schedule.</p></div></div></section>
    <section className="mission-band"><div className="container mission-grid"><div className="mission-copy"><Eyebrow>Our vision</Eyebrow><h2>A Liberia where a person's location does not limit access to learning, livelihoods, or the people and services they need.</h2><p>Meaningful connectivity depends on more than infrastructure. It calls for local knowledge, relevant opportunities and strong relationships.</p></div><Image file="learning-together.jpg" alt="Two learners sitting together and using a laptop"/></div></section>
    <section className="section"><div className="container"><SectionTitle eyebrow="Our approach" title="In the Community, Built by the Diaspora." copy="The diaspora can help bring experience, relationships and support. Communities guide the priorities and help shape what is useful and sustainable."/><div className="cards-grid">{[['Listen first','Learn from residents, community champions and schools about local needs and existing conditions.'],['Build together','Explore opportunities with local organizations, schools, diaspora networks and delivery partners.'],['Plan responsibly','Review demand, coverage, power, suitable sites and operating needs before commitments are made.']].map(([title,copy],i)=><article className="info-card" key={title}><span className="index">0{i+1} / PRINCIPLE</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className="callout"><div className="container callout-inner"><div><h2>Start with your place and your priorities.</h2><p>Tell us about your community, and help inform where we explore next.</p></div><CTA href="/connect-your-community" outline>Connect your community</CTA></div></section>
  </SiteLayout>;
}

function Services() {
  const services = [
    ['01','Community broadband','We develop internet access for communities where better connectivity can support daily life, learning and local enterprise. Expansion starts with community requests, local engagement and a review of what is needed to establish and sustain service.','community-wireless-site.jpg','Wireless equipment serving a Liberian neighborhood'],
    ['02','Connectivity partnerships','We welcome schools, community organizations and local businesses interested in working together to improve internet access in the places they serve.','connectivity-tower.jpg','Telecommunications tower supporting connectivity'],
    ['03','Technology hubs in partner schools','We are planning technology hubs in partner schools to bring internet access and practical digital learning closer to communities. Each proposed hub would be developed with its host school and local partners.','learning-together.jpg','Two learners sharing a laptop outdoors'],
  ];
  return <SiteLayout><SEO title="Our Services" description="Explore community broadband, planned school technology hubs and connectivity partnerships with One Liberia Connect."/><PageHero title="Our Services" intro="Three connected pathways—shaped by local needs and developed with community partners."/>
    <section className="section"><div className="container"><div className="cards-grid">{services.map(([n,title,copy,file,alt])=><article className="info-card" key={n}><span className="index">{n} / SERVICE</span><h3>{title}</h3><p>{copy}</p><Link className="text-link" href="/connect-your-community">Start a conversation <ArrowRight size={15}/></Link></article>)}</div></div></section>
    <section className="mission-band"><div className="container split-section"><Image file="diaspora-community-meeting.jpg" alt="Liberian community members in conversation with diaspora partners on a video call"/><div className="copy-block"><Eyebrow>School technology hubs</Eyebrow><h2>A place to connect and learn.</h2><p>School hubs are a planned initiative. Each proposed location will depend on a host school agreement and local partners. Connectivity, access, equipment, staffing, power and operating hours would be considered with each location.</p><p>Where school arrangements allow, community access could extend benefits beyond the classroom. Locations and opening dates will be shared only when agreements and implementation plans are confirmed.</p><CTA href="/partners-investors">Explore school partnerships</CTA></div></div></section>
    <section className="section"><div className="container"><SectionTitle eyebrow="How we work" title="No two places have the same starting point."/><div className="two-up"><div className="gold-panel"><h3>Community participation</h3><p>Community champions can help identify local priorities, introduce school and association leaders, and keep residents informed as requests move through review.</p><Link className="text-link" href="/connect-your-community">Become a community champion <ArrowRight size={15}/></Link></div><div className="dark-panel"><h3>School partnerships</h3><p>Schools can explore hosting a planned hub. We will discuss available space, electricity, existing connectivity and the learners and community served.</p><Link className="text-link" href="/partners-investors" style={{color:'#f0c766'}}>Propose a partner school <ArrowRight size={15}/></Link></div></div></div></section>
    <section className="callout"><div className="container callout-inner"><div><h2>Have a location or partnership in mind?</h2><p>Tell us what you know and what your community needs.</p></div><CTA href="/connect-your-community" outline>Make a request</CTA></div></section>
  </SiteLayout>;
}

function Cause() {
  return <SiteLayout><SEO title="Our Cause" description="Why affordable internet matters for learning, livelihoods and participation in Liberia's growing digital economy."/><PageHero title="Our Cause" intro="Opportunity should not stop at the edge of a coverage map."/>
    <section className="section"><div className="container split-section"><Image file="monrovia-community.jpg" alt="View across Monrovia with homes, roads and community infrastructure"/><div className="copy-block"><Eyebrow>Our cause</Eyebrow><h2>Opportunity should reach every community.</h2><p>When internet access is limited or difficult to afford, finding learning materials, running a business or staying in touch can become harder. These everyday needs guide our focus.</p><p>Through community broadband and planned school technology hubs, we aim to help people learn, use digital tools, explore work opportunities and take part in Liberia's growing digital economy.</p><p>Our ambition is to connect 250,000 Liberians through a sustainable network shaped by local needs and partnerships. This is a goal—not a count of people currently connected.</p><div className="hero-actions"><CTA href="/services">Explore our services</CTA><CTA href="/connect-your-community" outline>Become a community champion</CTA></div></div></div></section>
    <section className="mission-band"><div className="container"><SectionTitle eyebrow="Why access matters" title="Connection can make everyday possibilities closer."/><div className="cards-grid">{[['Learning','Access to online resources can support students, educators and lifelong learners.'],['Livelihoods','Connectivity can help local businesses discover tools, customers and new ways to work.'],['Participation','Being connected can make it easier to stay informed and reach services and people.']].map(([title,copy],i)=><article className="info-card" key={title}><span className="index">0{i+1} / POSSIBILITY</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className="campaign"><div className="container"><Eyebrow>Planned commitment</Eyebrow><h2>Community requests will inform feasibility reviews.</h2><p>Our planned campaign aims to complete feasibility reviews by December 2026 for communities with the most requests. A feasibility review assesses whether and how a project could proceed. Any launch schedule will follow that assessment and the partnerships and resources needed for delivery.</p><p className="campaign-note">A PLANNED REVIEW MILESTONE — NOT A SERVICE LAUNCH DATE</p></div></section>
    <section className="section"><div className="container split-section"><div className="copy-block"><Eyebrow>Progress, clearly shared</Eyebrow><h2>Plans and progress should never be confused.</h2><p>We plan to report on communities under review, active service locations and school hubs as they open. Updates will distinguish plans from completed work and identify the reporting period.</p><CTA href="/partners-investors">Partner in this work</CTA></div><Image file="diaspora-community-meeting.jpg" alt="Liberian community members meeting while a diaspora partner joins by video call"/></div></section>
  </SiteLayout>;
}

function Partners() {
  return <SiteLayout><SEO title="Partners and Investors" description="Partner with One Liberia Connect to explore sustainable community connectivity and planned school technology hubs."/><PageHero title="Partners and Investors" intro="Help explore sustainable connectivity, guided by community demand and local partnership."/>
    <section className="section"><div className="container split-section"><Image file="connectivity-tower.jpg" alt="Communications tower with antennas against the sky"/><div className="copy-block"><Eyebrow>Partners and investors</Eyebrow><h2>Help build sustainable connectivity in Liberia.</h2><p>One Liberia Connect welcomes investors, schools, community organizations and delivery partners interested in expanding affordable internet access across Liberia.</p><p>Community demand guides our expansion planning. We are exploring partnerships that can help establish reliable infrastructure and sustain access, including local knowledge, suitable sites, power and implementation capacity.</p><div className="partner-list"><span>Investors</span><span>Schools</span><span>Delivery partners</span><span>Diaspora organizations</span></div><CTA href="#partnership-inquiry">Start a conversation</CTA></div></div></section>
    <section className="mission-band"><div className="container"><SectionTitle eyebrow="Ways to take part" title="Bring the strengths your organization can offer."/><div className="cards-grid">{[['For investors','Discuss the business model, operations, expansion priorities and growth requirements directly with One Liberia Enterprise Corporation.'],['For schools and implementation partners','Explore hosting a planned hub. Delivery partners can discuss equipment, connectivity, power, training and ongoing support.'],['For diaspora and community organizations','Help identify community leaders, organize local conversations and understand the area before planning.']].map(([title,copy],i)=><article className="info-card" key={title}><span className="index">0{i+1} / PARTNER</span><h3>{title}</h3><p>{copy}</p><Link className="text-link" href="/contact">Get in touch <ArrowRight size={15}/></Link></article>)}</div></div></section>
    <section className="section" id="partnership-inquiry"><div className="container"><SectionTitle eyebrow="Start a conversation" title="Tell us how you would like to contribute."/><InquiryForm type="partnership"/></div></section>
  </SiteLayout>;
}

const communitySchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.'),
  email: z.string().trim().email('Please provide a valid email address.'),
  contactMethod: z.string().min(1, 'Choose a preferred contact method.'),
  phone: z.string().optional(),
  community: z.string().trim().min(1, 'Tell us the community and county.'),
  connection: z.string().min(1, 'Choose your connection to the area.'),
  group: z.string().optional(),
  school: z.string().optional(),
  needs: z.string().trim().min(1, 'Please describe the connectivity need.'),
  interests: z.array(z.string()).optional(),
  permission: z.boolean().refine(Boolean, 'Permission is required before follow-up.'),
});
const inquirySchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.'),
  organization: z.string().optional(),
  role: z.string().optional(),
  email: z.string().trim().email('Please provide a valid email address.'),
  country: z.string().optional(),
  interest: z.string().min(1, 'Choose an inquiry topic.'),
  location: z.string().optional(),
  focus: z.string().optional(),
  message: z.string().trim().min(1, 'Please add a short message.'),
});
type FieldProps = { label: string; name: string; required?: boolean; type?: string; options?: string[]; placeholder?: string; textarea?: boolean };
function Field({ label, name, required = false, type = 'text', options, placeholder, textarea = false }: FieldProps) {
  return <FormField name={name} render={({ field }) => <FormItem className="field">
    <FormLabel>{label}{required && ' *'}</FormLabel>
    <FormControl>
      {textarea ? <textarea {...field} value={field.value ?? ''} placeholder={placeholder} data-testid={`textarea-${name}`}/> :
      options ? <select {...field} value={field.value ?? ''} data-testid={`select-${name}`}><option value="" disabled>Select an option</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select> :
      <input {...field} value={field.value ?? ''} type={type} placeholder={placeholder} data-testid={`input-${name}`}/>}
    </FormControl>
    <FormMessage className="error-text"/>
  </FormItem>}/>;
}
function InquiryForm({ type = 'community' }: { type?: 'community' | 'contact' | 'partnership' }) {
  const [feedback, setFeedback] = useState('');
  const partnership = type === 'partnership';
  const community = type === 'community';
  const defaultValues: Record<string, any> = community
    ? { name: '', email: '', contactMethod: '', phone: '', community: '', connection: '', group: '', school: '', needs: '', interests: [] as string[], permission: false }
    : { name: '', organization: '', role: '', email: '', country: '', interest: '', location: '', focus: '', message: '' };
  const activeSchema = community ? communitySchema : inquirySchema;
  const form = useForm<Record<string, any>>({
    resolver: zodResolver(activeSchema) as Resolver<Record<string, any>>,
    defaultValues,
  });
  const submit = form.handleSubmit(() => {
    setFeedback('The details look complete. They remain on this page only; nothing has been sent or stored.');
  }, () => {
    setFeedback('Please review the highlighted fields. Your entries remain on this page only.');
  });
  const communityInterests = ['Community champion','School hub partnership','Community updates','Partnership or investor conversation'];
  return <Form {...form}><form className="form-card" onSubmit={submit} noValidate>
    {community ? <div className="form-grid">
      <Field label="Your name" name="name" required/>
      <Field label="Email address" name="email" type="email" required/>
      <Field label="Preferred contact method" name="contactMethod" options={['Email','Phone','Either']} required/>
      <Field label="Phone number (optional)" name="phone" type="tel" placeholder="+231"/>
      <Field label="Community and county" name="community" required/>
      <Field label="Connection to the area" name="connection" options={['Resident','Community leader','School representative','Diaspora member','Organization representative','Other']} required/>
      <Field label="Association or group (optional)" name="group"/>
      <Field label="Proposed school (optional)" name="school"/>
      <Field label="Connectivity needs" name="needs" textarea required placeholder="What would better internet access make possible here?"/>
      <FormField name="interests" render={({ field }) => <FormItem className="field full"><FormLabel>Ways you may want to take part</FormLabel><div className="checks">{communityInterests.map((interest, i) => {
        const selected = (field.value as string[] | undefined) ?? [];
        return <label className="check" key={interest}><input type="checkbox" checked={selected.includes(interest)} onChange={event => field.onChange(event.target.checked ? [...selected, interest] : selected.filter(value => value !== interest))} data-testid={`checkbox-interest-${i}`}/>{interest}</label>;
      })}</div></FormItem>}/>
      <FormField name="permission" render={({ field }) => <FormItem className="field full"><label className="check"><input type="checkbox" checked={Boolean(field.value)} onChange={event => field.onChange(event.target.checked)} data-testid="checkbox-permission"/> I give permission for One Liberia Connect to follow up about this inquiry. *</label><FormMessage className="error-text"/></FormItem>}/>
    </div> : <div className="form-grid">
      <Field label="Name" name="name" required/>
      <Field label="Organization" name="organization"/>
      <Field label="Role" name="role"/>
      <Field label="Email" name="email" type="email" required/>
      <Field label="Country" name="country"/>
      <Field label={partnership ? 'Partnership interest' : 'Subject'} name="interest" options={partnership ? ['Investment discussion','School partnership','Delivery partnership','Community organization','Diaspora engagement','Other'] : ['Community request','School partnership','Investor inquiry','General inquiry']} required/>
      <Field label="Relevant location (optional)" name="location"/>
      <Field label="Investment focus (optional)" name="focus"/>
      <Field label="Message" name="message" textarea required placeholder="Tell us a little about the opportunity."/>
    </div>}
    <p className="form-foot">{community ? 'Please do not include sensitive personal information. This frontend-only form does not transmit or store your entries.' : 'Your entries remain on this page only. This frontend-only form does not transmit or store them.'}</p>
    {feedback && <div className={feedback.startsWith('Please') ? 'form-error' : 'form-success'} role="status" data-testid={community ? 'status-community-form' : 'status-inquiry-form'}>{feedback}</div>}
    <button className="btn" type="submit" data-testid={community ? 'button-submit-community' : 'button-submit-inquiry'}>Check details <ArrowRight size={16}/></button>
  </form></Form>;
}

function Contact() {
  return <SiteLayout><SEO title="Contact" description="Contact One Liberia Connect about a community request, school partnership, investment or general inquiry."/><PageHero title="Contact" intro="Let's discuss your community or partnership."/>
    <section className="section"><div className="container form-layout"><div className="form-intro"><Eyebrow>Get in touch</Eyebrow><h2>What would you like to explore?</h2><p>Choose the topic closest to your inquiry and share a way for us to follow up. This form is an interface preview and is not connected to a delivery or storage service.</p><div className="pull-quote">In the Community, Built by the Diaspora.</div></div><InquiryForm type="contact"/></div></section>
  </SiteLayout>;
}

function ConnectCommunity() {
  return <SiteLayout><SEO title="Connect Your Community" description="Share where connectivity is needed and learn how community requests inform review and planning."/><PageHero title="Connect Your Community" intro="A community request is the beginning of a conversation—not a promise of immediate service."/>
    <section className="section"><div className="container split-section"><div className="copy-block"><Eyebrow>Community request</Eyebrow><h2>Tell us where connectivity is needed next.</h2><p>Help us understand where better internet access and a school technology hub could make a difference. Name your hometown, introduce a school or involve your community association.</p><p>Community requests help guide where we look next. We consider interest alongside coverage needs, suitable sites, power, local partnerships and the resources required to establish sustainable service.</p><a className="text-link" href="#community-request">Go to the request form <ArrowRight size={15}/></a></div><Image file="community-connectivity.jpg" alt="Residents gathered at a community connectivity point in Liberia"/></div></section>
    <section className="mission-band"><div className="container"><SectionTitle eyebrow="How it works" title="A clear, community-informed process."/><div className="steps">{[['Tell us about your community','Share your community and county, your connection to the area, and what better access could make possible.'],['Bring people into the conversation','Invite hometown associations, school leaders, churches, alumni groups or community champions to help shape local priorities.'],['We review demand and feasibility','We consider community interest alongside coverage needs, sites, power, partnerships and resources needed for sustainable service.']].map(([title,copy],i)=><article className="step" key={title}><div className="step-num">{i+1}</div><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className="campaign"><div className="container"><h2>A planned feasibility-review campaign through December 2026.</h2><p>Communities with the most requests are planned to receive feasibility reviews by December 2026. A review assesses whether and how a project could proceed; it does not guarantee a rollout or service launch.</p></div></section>
    <section className="section" id="community-request"><div className="container form-layout"><div className="form-intro"><Eyebrow>Tell us what you know</Eyebrow><h2>Community request form</h2><p>Share only what you are comfortable providing. Include a school or local group if it is relevant to your community's request.</p><p>Form submissions are not delivered or stored in this frontend-only build.</p></div><InquiryForm/></div></section>
  </SiteLayout>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch>
    <Route path="/" component={Home}/>
    <Route path="/about" component={About}/>
    <Route path="/services" component={Services}/>
    <Route path="/cause" component={Cause}/>
    <Route path="/partners-investors" component={Partners}/>
    <Route path="/contact" component={Contact}/>
    <Route path="/connect-your-community" component={ConnectCommunity}/>
    <Route component={NotFound}/>
  </Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router/></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>;
}

export default App;
