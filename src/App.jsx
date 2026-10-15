import { useMemo, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays,
  CheckCircle2, ChevronDown, Clock3, Heart, HeartPulse, Menu,
  MessageCircle, Search, ShieldCheck, Stethoscope, Video, X,
  Brain, Baby, Bone, Eye, Sparkles, Phone, MapPin, Mail,
  Facebook, Instagram, Linkedin
} from 'lucide-react';

const doctors = [
  {
    id: 1, name: 'Dr. Ananya Sharma', specialty: 'Cardiologist',
    qualification: 'MBBS, MD, DM Cardiology', experience: '12 years',
    rating: '4.9', reviews: 128, fee: 700, initials: 'AS', color: 'rose',
    availability: 'Today, 10:30 AM'
  },
  {
    id: 2, name: 'Dr. Rohan Mehta', specialty: 'Dermatologist',
    qualification: 'MBBS, MD Dermatology', experience: '9 years',
    rating: '4.8', reviews: 96, fee: 500, initials: 'RM', color: 'blue',
    availability: 'Today, 12:00 PM'
  },
  {
    id: 3, name: 'Dr. Priya Kapoor', specialty: 'General Physician',
    qualification: 'MBBS, MD Medicine', experience: '11 years',
    rating: '4.9', reviews: 154, fee: 400, initials: 'PK', color: 'green',
    availability: 'Today, 2:30 PM'
  }
];

const services = [
  { icon: HeartPulse, name: 'Heart Care', desc: 'Expert support for your heart health.', color: 'red' },
  { icon: Brain, name: 'Mental Wellness', desc: 'Care for your mind and emotional health.', color: 'purple' },
  { icon: Baby, name: 'Child Health', desc: 'Thoughtful healthcare for little ones.', color: 'orange' },
  { icon: Bone, name: 'Bone & Joint Care', desc: 'Support for movement and recovery.', color: 'blue' },
  { icon: Eye, name: 'Eye Care', desc: 'Keep your vision and eye health in focus.', color: 'green' },
  { icon: Stethoscope, name: 'General Medicine', desc: 'Everyday care for your overall health.', color: 'teal' }
];

const articles = [
  { category: 'HEALTHY LIVING', title: 'Small daily habits for a healthier life', read: '5 min read', image: 'photo-1506126613408-eca07ce68773', tone: 'article-one' },
  { category: 'HEART HEALTH', title: 'Simple ways to take care of your heart', read: '4 min read', image: 'photo-1493836512294-502baa1986e2', tone: 'article-two' },
  { category: 'WELLNESS', title: 'Why good sleep matters for your wellbeing', read: '6 min read', image: 'photo-1511295742362-92c96b8d4a9a', tone: 'article-three' }
];

function Logo({ light = false }) {
  return (
    <a className={`brand ${light ? 'brand-light' : ''}`} href="#home" aria-label="InfinityCare home">
      <span className="brand-symbol">
        <svg viewBox="0 0 54 38" role="img" aria-label="InfinityCare infinity medical logo">
          <path d="M27 19 C18 5 4 5 4 18 C4 31 18 32 27 19 C36 6 50 6 50 19 C50 32 36 32 27 19Z"
            fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M27 11 V27 M19 19 H35" fill="none" stroke="#c94747" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </span>
      <span className="brand-name">Infinity<span>Care</span></span>
    </a>
  );
}

function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <div className={`section-heading ${centered ? 'centered' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function AppointmentModal({ doctor, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', date: '', time: '', mode: 'In-person', reason: ''
  });

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="appointment-modal" role="dialog" aria-modal="true"
        aria-labelledby="appointment-title" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={21} />
        </button>
        {submitted ? (
          <div className="confirmation">
            <span className="confirmation-icon"><CheckCircle2 size={42} /></span>
            <span className="eyebrow">REQUEST RECEIVED</span>
            <h2>Thank you, {form.name}!</h2>
            <p>Your appointment request has been prepared for {doctor?.name || 'our care team'}.</p>
            <p className="demo-note">This is a frontend demo. Your request has not been sent to a clinic or saved to a server.</p>
            <button className="btn btn-primary" onClick={onClose}>Back to website</button>
          </div>
        ) : (
          <>
            <span className="eyebrow">YOUR HEALTH COMES FIRST</span>
            <h2 id="appointment-title">Book an appointment</h2>
            <p className="modal-intro">
              {doctor ? `Request a visit with ${doctor.name}.` : 'Tell us a little about yourself and your preferred appointment.'}
            </p>
            <form className="appointment-form" onSubmit={submit}>
              <label>Full name<input name="name" value={form.name} onChange={update} placeholder="Your full name" required /></label>
              <div className="form-row">
                <label>Email address<input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required /></label>
                <label>Phone number<input name="phone" type="tel" value={form.phone} onChange={update} placeholder="+91" required /></label>
              </div>
              <div className="form-row">
                <label>Preferred date<input name="date" type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={update} required /></label>
                <label>Preferred time
                  <select name="time" value={form.time} onChange={update} required>
                    <option value="">Choose time</option>
                    <option>10:00 AM</option><option>11:30 AM</option>
                    <option>12:00 PM</option><option>2:30 PM</option>
                    <option>4:00 PM</option><option>5:30 PM</option>
                  </select>
                </label>
              </div>
              <label>Appointment type
                <select name="mode" value={form.mode} onChange={update}>
                  <option>In-person</option><option>Online consultation</option>
                </select>
              </label>
              <label>Reason for visit<textarea name="reason" value={form.reason} onChange={update} placeholder="Briefly describe what you need help with (optional)" rows="3" /></label>
              <button className="btn btn-primary submit-btn" type="submit">Request appointment <ArrowRight size={18} /></button>
              <p className="privacy-note"><ShieldCheck size={15} /> Demo form only. Do not enter sensitive medical information.</p>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

function DoctorCard({ doctor, onBook }) {
  return (
    <article className="doctor-card">
      <div className={`doctor-avatar avatar-${doctor.color}`}>
        <span>{doctor.initials}</span>
        <span className="doctor-online" title="Availability shown for demonstration" />
      </div>
      <div className="doctor-info">
        <div className="doctor-rating"><span>★</span> {doctor.rating} <span className="review-count">({doctor.reviews} reviews)</span></div>
        <h3>{doctor.name}</h3>
        <p className="doctor-specialty">{doctor.specialty}</p>
        <p className="doctor-qualification">{doctor.qualification}</p>
        <div className="doctor-meta"><span><Clock3 size={15} /> {doctor.experience} experience</span></div>
        <div className="doctor-availability"><span className="availability-dot" /> Sample availability: {doctor.availability}</div>
      </div>
      <div className="doctor-bottom">
        <div><span className="fee-label">Consultation fee</span><strong>₹{doctor.fee}</strong></div>
        <button className="btn btn-outline btn-small" onClick={() => onBook(doctor)}>Book visit <ArrowUpRight size={16} /></button>
      </div>
    </article>
  );
}

export default function App() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [appointmentDoctor, setAppointmentDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredDoctors = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return doctors.filter(doctor => {
      const matchesTerm = !term ||
        `${doctor.name} ${doctor.specialty} ${doctor.qualification}`.toLowerCase().includes(term);
      const matchesCategory = activeCategory === 'All' || doctor.specialty === activeCategory;
      return matchesTerm && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  function openBooking(doctor = null) {
    setAppointmentDoctor(doctor);
    document.body.style.overflow = 'hidden';
  }

  function closeBooking() {
    setAppointmentDoctor(null);
    document.body.style.overflow = '';
  }

  function goToDoctors() {
    document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="site-shell" id="home">
      <div className="topbar">
        <div className="container topbar-inner">
          <span><Heart size={14} fill="currentColor" /> Compassionate care. Every step of the way.</span>
          <a href="#contact"><Phone size={14} /> Need help? Contact us</a>
        </div>
      </div>

      <header className="site-header">
        <div className="container nav-inner">
          <Logo />
          <button className="mobile-menu-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle navigation">
            {mobileMenu ? <X /> : <Menu />}
          </button>
          <nav className={`main-nav ${mobileMenu ? 'nav-open' : ''}`} aria-label="Main navigation">
            <a href="#home" onClick={() => setMobileMenu(false)}>Home</a>
            <a href="#services" onClick={() => setMobileMenu(false)}>Our services</a>
            <a href="#doctors" onClick={() => setMobileMenu(false)}>Find a doctor</a>
            <a href="#about" onClick={() => setMobileMenu(false)}>About us</a>
            <a href="#health-library" onClick={() => setMobileMenu(false)}>Health library</a>
            <button className="btn btn-primary nav-cta" onClick={() => { setMobileMenu(false); openBooking(); }}>
              Book appointment <ArrowUpRight size={17} />
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="hero-badge"><span className="badge-pulse" /> YOUR WELLBEING, OUR PRIORITY</div>
              <h1>Better health.<br />A <span>brighter</span> you.</h1>
              <p className="hero-description">Healthcare that puts you first. Find trusted doctors, explore expert guidance and take the next step towards feeling your best.</p>
              <div className="hero-actions">
                <button className="btn btn-primary btn-large" onClick={goToDoctors}>Find your doctor <ArrowRight size={19} /></button>
                <a className="text-link" href="#services">Explore our services <ArrowDownRight size={18} /></a>
              </div>
              <div className="hero-trust">
                <div className="trust-avatars"><span>A</span><span>M</span><span>S</span><span>+</span></div>
                <div><div className="trust-stars">★★★★★</div><p>Care designed around <strong>you</strong></p></div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-frame">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85"
                  alt="Healthcare professional ready to help patients" />
                <div className="image-overlay" />
                <div className="image-label"><span className="image-label-icon"><HeartPulse size={21} /></span><div><strong>Care that connects</strong><small>Here for your health journey</small></div></div>
              </div>
              <div className="floating-card floating-card-top"><span className="floating-icon"><ShieldCheck size={22} /></span><div><strong>Care you can trust</strong><small>Your wellbeing matters</small></div></div>
              <div className="floating-card floating-card-bottom"><span className="floating-icon floating-icon-red"><CalendarDays size={22} /></span><div><strong>Ready when you are</strong><small>Request an appointment</small></div><ArrowUpRight size={17} /></div>
              <div className="hero-decor"><svg viewBox="0 0 100 100"><path d="M50 5 C30 30 5 30 5 50 C5 75 30 75 50 50 C70 25 95 25 95 50 C95 75 70 75 50 50 C30 25 5 25 5 50 C5 75 30 75 50 95" fill="none" stroke="currentColor" strokeWidth="2" /></svg></div>
            </div>
          </div>
          <div className="container hero-bottom">
            <span><ShieldCheck size={18} /> Patient-first approach</span>
            <span><HeartPulse size={18} /> Whole-person wellness</span>
            <span><MessageCircle size={18} /> Friendly guidance</span>
            <span><Video size={18} /> Online care options</span>
          </div>
        </section>

        <section className="search-section" aria-label="Find healthcare">
          <div className="container search-panel">
            <div className="search-intro"><span className="eyebrow">START YOUR CARE JOURNEY</span><h2>What can we help with?</h2></div>
            <form className="doctor-search" onSubmit={e => { e.preventDefault(); goToDoctors(); }}>
              <Search size={20} />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Doctor, specialty or health need..." aria-label="Search doctors" />
              <button className="btn btn-primary" type="submit">Search doctors</button>
            </form>
            <div className="popular-searches"><span>Popular:</span>{['Cardiologist', 'Dermatologist', 'General Physician'].map(item => <button key={item} onClick={() => { setSearchTerm(item); setActiveCategory('All'); goToDoctors(); }}>{item}</button>)}</div>
          </div>
        </section>

        <section className="section services-section" id="services">
          <div className="container">
            <SectionHeading eyebrow="CARE FOR EVERY YOU" title="Healthcare for every part of life" description="From everyday health needs to specialist guidance, discover care that starts with you." centered />
            <div className="services-grid">
              {services.map(({ icon: Icon, name, desc, color }) => (
                <a href="#doctors" className="service-card" key={name} onClick={() => setSearchTerm(name === 'General Medicine' ? 'General Physician' : name.replace(' Care', ''))}>
                  <span className={`service-icon service-${color}`}><Icon size={26} strokeWidth={1.8} /></span>
                  <h3>{name}</h3><p>{desc}</p>
                  <span className="service-link">Explore care <ArrowUpRight size={16} /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section doctors-section" id="doctors">
          <div className="container">
            <div className="doctors-heading-row">
              <SectionHeading eyebrow="MEET YOUR CARE TEAM" title="People who put you first" description="Explore our sample doctor profiles and request an appointment." />
              <a href="#doctors" className="text-link doctors-view-link">Browse doctors <ArrowRight size={18} /></a>
            </div>
            <div className="doctor-filters">
              <span>Find your specialist</span>
              <div className="filter-select-wrap"><select aria-label="Filter doctors by specialty" value={activeCategory} onChange={e => setActiveCategory(e.target.value)}><option>All</option><option>Cardiologist</option><option>Dermatologist</option><option>General Physician</option></select><ChevronDown size={16} /></div>
            </div>
            <div className="doctors-grid">
              {filteredDoctors.length ? filteredDoctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} onBook={openBooking} />) : (
                <div className="empty-results"><Search size={26} /><h3>No matching doctor found</h3><p>Try a different name or specialty.</p><button className="btn btn-outline" onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}>Clear search</button></div>
              )}
            </div>
            <p className="demo-note section-demo-note">Doctor names, ratings, fees and availability above are illustrative demo content, not verified medical listings.</p>
          </div>
        </section>

        <section className="about-section section" id="about">
          <div className="container about-grid">
            <div className="about-visual">
              <div className="about-image-main"><img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85" alt="Medical professional discussing patient care" loading="lazy" /></div>
              <div className="about-sticker"><HeartPulse size={25} /><strong>Care with<br />compassion</strong></div>
              <div className="about-image-small"><img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=85" alt="Healthcare professional" loading="lazy" /></div>
            </div>
            <div className="about-copy">
              <SectionHeading eyebrow="THE INFINITYCARE DIFFERENCE" title="Healthcare should feel human." description="We believe better health begins with feeling heard, understood and supported." />
              <div className="about-points">
                <div><span><CheckCircle2 size={19} /></span><div><h3>Care built around you</h3><p>Make informed choices with clear, approachable health guidance.</p></div></div>
                <div><span><CheckCircle2 size={19} /></span><div><h3>Support at every step</h3><p>Find the information and services you need to plan your next step.</p></div></div>
                <div><span><CheckCircle2 size={19} /></span><div><h3>Wellness beyond appointments</h3><p>Discover practical resources to support healthier everyday habits.</p></div></div>
              </div>
              <a className="btn btn-outline" href="#health-library">Discover our approach <ArrowRight size={18} /></a>
            </div>
          </div>
        </section>

        <section className="section health-library-section" id="health-library">
          <div className="container">
            <div className="doctors-heading-row">
              <SectionHeading eyebrow="THE WELLNESS JOURNAL" title="Knowledge is part of care" description="Explore approachable ideas for looking after your everyday wellbeing." />
              <a className="text-link doctors-view-link" href="#health-library">Explore health topics <ArrowRight size={18} /></a>
            </div>
            <div className="articles-grid">
              {articles.map(article => (
                <article className="article-card" key={article.title}>
                  <div className={`article-image ${article.tone}`} style={{ backgroundImage: `url(https://images.unsplash.com/${article.image}?auto=format&fit=crop&w=700&q=80)` }} role="img" aria-label={article.category} />
                  <div className="article-content"><span className="article-category">{article.category}</span><h3>{article.title}</h3><div className="article-meta"><span><Clock3 size={14} /> {article.read}</span><a href="#health-disclaimer" aria-label={`Read about ${article.title}`}><ArrowUpRight size={19} /></a></div></div>
                </article>
              ))}
            </div>
            <p className="demo-note">Health articles are illustrative placeholders. This site does not provide individual diagnosis or treatment advice.</p>
          </div>
        </section>

        <section className="cta-section">
          <div className="container cta-inner">
            <div className="cta-icon"><Sparkles size={30} /></div>
            <div className="cta-copy"><span className="eyebrow">YOUR NEXT STEP STARTS HERE</span><h2>Your health journey deserves a partner.</h2><p>Start exploring care options and take a confident step towards your wellbeing.</p></div>
            <button className="btn btn-white" onClick={() => openBooking()}>Request an appointment <ArrowRight size={18} /></button>
            <div className="cta-decoration"><HeartPulse size={150} strokeWidth={0.6} /></div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="container contact-grid">
            <div><SectionHeading eyebrow="WE'RE HERE TO HELP" title="Let's talk about your next step" description="Have a question about the platform? Reach out using the contact details below." /></div>
            <div className="contact-items">
              <div className="contact-item"><span><Mail size={21} /></span><div><small>Email</small><a href="mailto:hello@infinitycare.example">hello@infinitycare.example</a></div></div>
              <div className="contact-item"><span><Phone size={21} /></span><div><small>Phone</small><p>Contact details coming soon</p></div></div>
              <div className="contact-item"><span><MapPin size={21} /></span><div><small>Location</small><p>Online healthcare platform</p></div></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand-col"><Logo light /><p>Thoughtful healthcare, useful guidance and support for every step of your wellbeing journey.</p><div className="social-links"><a href="#contact" aria-label="Facebook"><Facebook size={18} /></a><a href="#contact" aria-label="Instagram"><Instagram size={18} /></a><a href="#contact" aria-label="LinkedIn"><Linkedin size={18} /></a></div></div>
          <div className="footer-links"><h3>Explore</h3><a href="#services">Our services</a><a href="#doctors">Find a doctor</a><a href="#about">About InfinityCare</a><a href="#health-library">Health library</a></div>
          <div className="footer-links"><h3>Patient support</h3><a href="#contact">Contact us</a><a href="#doctors">Appointments</a><a href="#health-disclaimer">Health disclaimer</a><a href="#home">Back to top ↑</a></div>
          <div className="footer-newsletter"><h3>Wellness, in your inbox</h3><p>Helpful reminders and health inspiration, when available.</p><button className="btn btn-outline footer-contact-btn" onClick={() => window.location.href = 'mailto:hello@infinitycare.example'}>Contact our team <ArrowRight size={16} /></button></div>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} InfinityCare. All rights reserved.</span><span id="health-disclaimer">General information only — not a substitute for professional medical advice.</span></div>
      </footer>

      {appointmentDoctor && <AppointmentModal doctor={appointmentDoctor} onClose={closeBooking} />}
      {appointmentDoctor === null && null}
      <button className="floating-help" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Contact InfinityCare"><MessageCircle size={22} /></button>
    </div>
  );
}
