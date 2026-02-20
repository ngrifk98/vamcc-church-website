import { useState, useEffect } from "react";

// ============================================================
// CHURCH WEBSITE — VAMCC
// Stack: React (frontend) | Node.js/Express + PostgreSQL (backend)
// ============================================================

const PAGES = { HOME: "home", REGISTER: "register", LOGIN: "login", PROFILE: "profile", CHATBOT: "chatbot", CHATBOT_REGISTER: "chatbot-register", CHATBOT_EVENTS: "chatbot-events", CHATBOT_UPDATE: "chatbot-update" };

// ── Fake auth state (replace with real API calls) ──────────────
function useAuth() {
  const [user, setUser] = useState(null);
  const login = async (email, password) => {
    // TODO: replace with fetch('/api/auth/login', { method:'POST', body: JSON.stringify({email,password}) })
    if (email && password) { setUser({ id: 1, name: "Nick Kingston", email, role: "Member", joinedDate: "2024-01-15", phone: "(555) 123-4567", address: "123 Faith St, Dallas TX" }); return true; }
    return false;
  };
  const register = async (data) => {
    // TODO: replace with fetch('/api/auth/register', { method:'POST', body: JSON.stringify(data) })
    setUser({ ...data, id: Date.now(), role: "Member", joinedDate: new Date().toISOString().split("T")[0] });
    return true;
  };
  const logout = () => setUser(null);
  return { user, login, register, logout };
}

// ── Styles ─────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #F7F3EC;
    --gold: #C9952A;
    --gold-light: #E8B84B;
    --deep: #1A1208;
    --brown: #3D2B0E;
    --text: #2C1F0A;
    --muted: #7A6245;
    --white: #FFFFFF;
    --card-bg: rgba(255,255,255,0.85);
    --radius: 2px;
  }

  body { font-family: 'Lato', sans-serif; background: var(--cream); color: var(--text); }

  /* NAV */
  .nav {
    background: var(--deep);
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 68px;
    position: sticky; top: 0; z-index: 100;
    border-bottom: 2px solid var(--gold);
  }
  .nav-brand {
    font-family: 'Playfair Display', serif;
    color: var(--gold);
    font-size: 1.4rem;
    letter-spacing: 0.02em;
    cursor: pointer;
  }
  .nav-links { display: flex; gap: 0.25rem; align-items: center; }
  .nav-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'Lato', sans-serif;
    font-size: 0.85rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: #C8B89A; padding: 0.5rem 1rem;
    transition: color 0.2s;
  }
  .nav-btn:hover, .nav-btn.active { color: var(--gold-light); }
  .nav-btn.cta {
    background: var(--gold); color: var(--deep);
    font-weight: 700; border-radius: var(--radius);
    margin-left: 0.5rem;
  }
  .nav-btn.cta:hover { background: var(--gold-light); }

  /* HERO */
  .hero {
    min-height: 88vh;
    background:
      linear-gradient(160deg, rgba(26,18,8,0.75) 0%, rgba(61,43,14,0.55) 60%, rgba(201,149,42,0.15) 100%),
      url('https://dallastamilcatholics.org/templates/dallas/images/faith.jpg') center/cover no-repeat;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 4rem 2rem;
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 80%, rgba(201,149,42,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-eyebrow {
    font-family: 'Lato', sans-serif;
    font-size: 0.75rem; letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--gold-light); margin-bottom: 1.25rem;
    animation: fadeUp 0.8s ease both;
  }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.8rem, 7vw, 5.5rem);
    color: var(--white);
    line-height: 1.1;
    max-width: 800px;
    animation: fadeUp 0.8s 0.15s ease both;
  }
  .hero-title em { color: var(--gold-light); font-style: italic; }
  .hero-sub {
    color: #D4C4A8; font-size: 1.1rem; font-weight: 300;
    max-width: 520px; line-height: 1.7; margin-top: 1.5rem;
    animation: fadeUp 0.8s 0.3s ease both;
  }
  .hero-actions {
    display: flex; gap: 1rem; margin-top: 2.5rem; flex-wrap: wrap; justify-content: center;
    animation: fadeUp 0.8s 0.45s ease both;
  }
  .btn-primary {
    background: var(--gold); color: var(--deep);
    border: none; cursor: pointer;
    font-family: 'Lato', sans-serif; font-weight: 700;
    font-size: 0.85rem; letter-spacing: 0.12em; text-transform: uppercase;
    padding: 0.9rem 2.2rem; border-radius: var(--radius);
    transition: background 0.2s, transform 0.15s;
  }
  .btn-primary:hover { background: var(--gold-light); transform: translateY(-1px); }
  .btn-outline {
    background: transparent;
    border: 1.5px solid rgba(200,184,154,0.5);
    color: #C8B89A; cursor: pointer;
    font-family: 'Lato', sans-serif; font-weight: 400;
    font-size: 0.85rem; letter-spacing: 0.12em; text-transform: uppercase;
    padding: 0.9rem 2.2rem; border-radius: var(--radius);
    transition: border-color 0.2s, color 0.2s;
  }
  .btn-outline:hover { border-color: var(--gold-light); color: var(--gold-light); }

  /* SERVICE TIMES */
  .services-bar {
    background: var(--brown);
    display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap;
    padding: 1.5rem 2rem;
  }
  .service-item { text-align: center; }
  .service-label { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); }
  .service-time { font-family: 'Playfair Display', serif; color: var(--white); font-size: 1.1rem; margin-top: 0.2rem; }

  /* SECTIONS */
  .section { padding: 5rem 2rem; max-width: 1100px; margin: 0 auto; }
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    color: var(--brown);
    margin-bottom: 0.5rem;
  }
  .section-title em { color: var(--gold); font-style: italic; }
  .divider { width: 60px; height: 2px; background: var(--gold); margin: 1rem 0 2rem; }

  /* CARDS */
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
  .card {
    background: var(--card-bg);
    border: 1px solid rgba(201,149,42,0.2);
    border-radius: var(--radius);
    padding: 2rem;
    backdrop-filter: blur(4px);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(61,43,14,0.12); }
  .card-icon { font-size: 2rem; margin-bottom: 1rem; }
  .card h3 { font-family: 'Playfair Display', serif; color: var(--brown); font-size: 1.2rem; margin-bottom: 0.5rem; }
  .card p { color: var(--muted); font-size: 0.9rem; line-height: 1.6; }

  /* FORM */
  .form-page {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--cream) 0%, #EDE5D4 100%);
    display: flex; align-items: center; justify-content: center;
    padding: 2rem;
  }
  .form-card {
    background: var(--white);
    border: 1px solid rgba(201,149,42,0.25);
    border-radius: 4px;
    padding: 3rem 2.5rem;
    width: 100%; max-width: 480px;
    box-shadow: 0 20px 60px rgba(26,18,8,0.1);
  }
  .form-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem; color: var(--brown);
    margin-bottom: 0.25rem;
  }
  .form-sub { color: var(--muted); font-size: 0.88rem; margin-bottom: 2rem; }
  .form-group { margin-bottom: 1.25rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  label { display: block; font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.4rem; }
  input, select {
    width: 100%; padding: 0.75rem 1rem;
    border: 1.5px solid #E0D5C5;
    border-radius: var(--radius);
    font-family: 'Lato', sans-serif; font-size: 0.95rem;
    color: var(--text); background: #FDFAF6;
    transition: border-color 0.2s;
    outline: none;
  }
  input:focus, select:focus { border-color: var(--gold); }
  .form-btn {
    width: 100%; padding: 0.9rem;
    background: var(--gold); color: var(--deep);
    border: none; cursor: pointer;
    font-family: 'Lato', sans-serif; font-weight: 700;
    font-size: 0.9rem; letter-spacing: 0.1em; text-transform: uppercase;
    border-radius: var(--radius); margin-top: 0.5rem;
    transition: background 0.2s;
  }
  .form-btn:hover { background: var(--gold-light); }
  .form-switch { text-align: center; margin-top: 1.25rem; color: var(--muted); font-size: 0.85rem; }
  .form-switch button { background: none; border: none; color: var(--gold); cursor: pointer; font-weight: 700; }
  .alert { padding: 0.75rem 1rem; border-radius: var(--radius); margin-bottom: 1rem; font-size: 0.88rem; }
  .alert.error { background: #FFF0F0; border: 1px solid #F5C6C6; color: #C0392B; }
  .alert.success { background: #F0FFF4; border: 1px solid #A3E6B8; color: #1B6B38; }

  /* PROFILE */
  .profile-page {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--cream) 0%, #EDE5D4 100%);
    padding: 2rem;
  }
  .profile-header {
    background: var(--deep);
    border-bottom: 2px solid var(--gold);
    border-radius: 4px 4px 0 0;
    padding: 2.5rem;
    display: flex; align-items: center; gap: 1.5rem;
    max-width: 800px; margin: 0 auto;
  }
  .avatar {
    width: 72px; height: 72px; border-radius: 50%;
    background: var(--gold); display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--deep);
    flex-shrink: 0;
  }
  .profile-name { font-family: 'Playfair Display', serif; color: var(--white); font-size: 1.6rem; }
  .profile-role { color: var(--gold); font-size: 0.78rem; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 0.25rem; }
  .profile-body {
    background: var(--white);
    border: 1px solid rgba(201,149,42,0.2);
    border-top: none; border-radius: 0 0 4px 4px;
    padding: 2.5rem;
    max-width: 800px; margin: 0 auto;
  }
  .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .profile-field label { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
  .profile-field p { color: var(--text); font-size: 0.95rem; margin-top: 0.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid #F0E8D8; }
  .profile-actions { display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; }
  .badge { display: inline-block; background: rgba(201,149,42,0.12); color: var(--gold); font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.3rem 0.75rem; border-radius: 100px; border: 1px solid rgba(201,149,42,0.3); }

  /* CHATBOT */
  .chatbot-page { min-height: 100vh; background: linear-gradient(135deg, var(--cream) 0%, #EDE5D4 100%); display: flex; align-items: center; justify-content: center; padding: 2rem; }
  .chatbot-card { background: var(--white); border: 2px solid var(--gold); border-radius: 8px; padding: 3rem 2.5rem; width: 100%; max-width: 480px; box-shadow: 0 20px 60px rgba(26,18,8,0.15); text-align: center; }
  .chatbot-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--brown); margin-bottom: 1rem; }
  .chatbot-greeting { color: var(--muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem; }
  .chatbot-button { width: 100%; padding: 1.2rem; margin-bottom: 1rem; background: var(--gold); color: var(--deep); border: none; cursor: pointer; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 0.9rem; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 4px; transition: background 0.2s, transform 0.15s; }
  .chatbot-button:hover { background: var(--gold-light); transform: translateY(-2px); }
  .chatbot-back { margin-top: 2rem; }
  .back-btn { background: none; border: 1.5px solid var(--muted); color: var(--muted); cursor: pointer; font-family: 'Lato', sans-serif; font-size: 0.85rem; letter-spacing: 0.1em; padding: 0.6rem 1.5rem; border-radius: 4px; transition: border-color 0.2s, color 0.2s; }
  .back-btn:hover { border-color: var(--gold); color: var(--gold); }
  .events-list { text-align: left; }
  .event-item { background: #F9F7F4; border-left: 3px solid var(--gold); padding: 1.2rem; margin-bottom: 1rem; border-radius: 4px; }
  .event-title { font-family: 'Playfair Display', serif; color: var(--brown); font-size: 1rem; margin-bottom: 0.3rem; font-weight: 700; }
  .event-datetime { font-size: 0.85rem; color: var(--gold); margin-bottom: 0.4rem; }
  .event-description { font-size: 0.85rem; color: var(--muted); }
  .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
  textarea { width: 100%; padding: 0.75rem 1rem; border: 1.5px solid #E0D5C5; border-radius: 2px; font-family: 'Lato', sans-serif; font-size: 0.95rem; color: var(--text); background: #FDFAF6; resize: vertical; min-height: 80px; }
  textarea:focus { border-color: var(--gold); outline: none; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fade-in { animation: fadeUp 0.5s ease both; }

  /* FOOTER */
  .footer { background: var(--deep); color: #8A7A62; text-align: center; padding: 2rem; font-size: 0.82rem; border-top: 1px solid rgba(201,149,42,0.2); }
  .footer strong { color: var(--gold); font-family: 'Playfair Display', serif; }
`;

// ── Components ─────────────────────────────────────────────────

function Nav({ page, setPage, user, logout }) {
  return (
    <nav className="nav">
      <div className="nav-brand" onClick={() => setPage(PAGES.HOME)}>✝ VAMCC</div>
      <div className="nav-links">
        <button className={`nav-btn ${page === PAGES.HOME ? "active" : ""}`} onClick={() => setPage(PAGES.HOME)}>Home</button>
        <button className={`nav-btn ${[PAGES.CHATBOT, PAGES.CHATBOT_REGISTER, PAGES.CHATBOT_EVENTS, PAGES.CHATBOT_UPDATE].includes(page) ? "active" : ""}`} onClick={() => setPage(PAGES.CHATBOT)}>Chat</button>
        {user ? (
          <>
            <button className={`nav-btn ${page === PAGES.PROFILE ? "active" : ""}`} onClick={() => setPage(PAGES.PROFILE)}>My Profile</button>
            <button className="nav-btn cta" onClick={() => { logout(); setPage(PAGES.HOME); }}>Sign Out</button>
          </>
        ) : (
          <>
            <button className={`nav-btn ${page === PAGES.LOGIN ? "active" : ""}`} onClick={() => setPage(PAGES.LOGIN)}>Sign In</button>
            <button className="nav-btn cta" onClick={() => setPage(PAGES.REGISTER)}>Join Us</button>
          </>
        )}
      </div>
    </nav>
  );
}

function HomePage({ setPage, user }) {
  return (
    <>
      <div className="hero">
        <div className="hero-eyebrow">Welcome to Our Family</div>
        <h1 className="hero-title">Where <em>Faith</em> Meets<br />Community</h1>
        <p className="hero-sub">A place of grace, hope, and belonging. Join thousands of families growing together in faith every Sunday.</p>
        <div className="hero-actions">
          {user ? (
            <button className="btn-primary" onClick={() => setPage(PAGES.PROFILE)}>My Member Profile</button>
          ) : (
            <>
              <button className="btn-primary" onClick={() => setPage(PAGES.REGISTER)}>Become a Member</button>
              <button className="btn-outline" onClick={() => setPage(PAGES.LOGIN)}>Member Sign In</button>
            </>
          )}
        </div>
      </div>

      <div className="services-bar">
        {[["Saturday Mass", "6:30 PM - 10 PM CST (2nd & 4th Sat)"], ["Bible Study", "Wed 7:00 PM"], ["Youth Group", "Fri 6:30 PM"], ["Prayer Meeting", "Sat 8:00 AM"]].map(([label, time]) => (
          <div className="service-item" key={label}>
            <div className="service-label">{label}</div>
            <div className="service-time">{time}</div>
          </div>
        ))}
      </div>

      <div className="section">
        <h2 className="section-title">Life at <em>VAMCC</em></h2>
        <div className="divider" />
        <div className="cards">
          {[
            ["🙏", "Saturday Worship", "Experience powerful, Spirit-led worship services designed for the whole family to encounter God together."],
            ["📖", "Bible Study", "Deep dive into scripture with our mid-week groups. Whether you're new or seasoned, there's a seat for you."],
            ["🤝", "Community Groups", "Build lasting friendships through our neighborhood small groups, serving together and growing in faith."],
            ["❤️", "Outreach & Missions", "We serve our city and the world. Join our teams making a tangible difference in people's lives."],
            ["🎵", "Worship Arts", "Use your gifts in music, media, and creative arts to serve and inspire the congregation."],
            ["👶", "Family Ministry", "Dedicated programs for children, youth, and young adults—faith formation at every stage of life."],
          ].map(([icon, title, desc]) => (
            <div className="card" key={title}>
              <div className="card-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <strong>VAMCC</strong> · 456 Church Lane, Dallas, TX 75001 · (214) 555-0100<br />
        <span style={{ marginTop: "0.5rem", display: "block" }}>© 2025 VAMCC. Built with ♥ for our congregation.</span>
      </footer>
    </>
  );
}

function RegisterPage({ onRegister, setPage }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) { setError("Please fill in all required fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    const ok = await onRegister({ name: `${form.firstName} ${form.lastName}`, email: form.email, phone: form.phone, address: form.address });
    setLoading(false);
    if (ok) setPage(PAGES.PROFILE);
    else setError("Registration failed. Please try again.");
  };

  return (
    <div className="form-page">
      <div className="form-card fade-in">
        <div className="form-title">Join Our Church</div>
        <div className="form-sub">Create your member account to access events, groups & updates.</div>
        {error && <div className="alert error">{error}</div>}
        <div className="form-row">
          <div className="form-group"><label>First Name *</label><input name="firstName" value={form.firstName} onChange={handle} placeholder="Nick" /></div>
          <div className="form-group"><label>Last Name *</label><input name="lastName" value={form.lastName} onChange={handle} placeholder="Kingston" /></div>
        </div>
        <div className="form-group"><label>Email Address *</label><input name="email" type="email" value={form.email} onChange={handle} placeholder="nick@email.com" /></div>
        <div className="form-group"><label>Phone Number</label><input name="phone" value={form.phone} onChange={handle} placeholder="(555) 123-4567" /></div>
        <div className="form-group"><label>Home Address</label><input name="address" value={form.address} onChange={handle} placeholder="123 Faith St, Dallas TX" /></div>
        <div className="form-row">
          <div className="form-group"><label>Password *</label><input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" /></div>
          <div className="form-group"><label>Confirm *</label><input name="confirm" type="password" value={form.confirm} onChange={handle} placeholder="••••••••" /></div>
        </div>
        <button className="form-btn" onClick={submit} disabled={loading}>{loading ? "Creating Account…" : "Create Member Account"}</button>
        <div className="form-switch">Already a member? <button onClick={() => setPage(PAGES.LOGIN)}>Sign In</button></div>
      </div>
    </div>
  );
}

function LoginPage({ onLogin, setPage }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.email || !form.password) { setError("Please enter your email and password."); return; }
    setLoading(true); setError("");
    const ok = await onLogin(form.email, form.password);
    setLoading(false);
    if (ok) setPage(PAGES.PROFILE);
    else setError("Invalid email or password.");
  };

  return (
    <div className="form-page">
      <div className="form-card fade-in">
        <div className="form-title">Welcome Back</div>
        <div className="form-sub">Sign in to your member account.</div>
        {error && <div className="alert error">{error}</div>}
        <div className="form-group"><label>Email Address</label><input name="email" type="email" value={form.email} onChange={handle} placeholder="nick@email.com" /></div>
        <div className="form-group"><label>Password</label><input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" /></div>
        <button className="form-btn" onClick={submit} disabled={loading}>{loading ? "Signing In…" : "Sign In"}</button>
        <div className="form-switch">Not a member yet? <button onClick={() => setPage(PAGES.REGISTER)}>Join Us</button></div>
      </div>
    </div>
  );
}

function ProfilePage({ user, setPage }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [saved, setSaved] = useState(false);

  const save = () => {
    // TODO: replace with fetch(`/api/members/${user.id}`, { method:'PUT', body: JSON.stringify(form) })
    setEditing(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="avatar">{user.name?.[0]?.toUpperCase()}</div>
        <div>
          <div className="profile-name">{user.name}</div>
          <div className="profile-role">{user.role}</div>
          <div style={{ marginTop: "0.5rem" }}><span className="badge">Active Member</span></div>
        </div>
      </div>

      <div className="profile-body fade-in">
        {saved && <div className="alert success">✓ Profile updated successfully!</div>}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: "var(--brown)" }}>Member Information</h3>
          <button className="btn-primary" style={{ padding: "0.6rem 1.5rem", fontSize: "0.8rem" }} onClick={() => editing ? save() : setEditing(true)}>
            {editing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        {editing ? (
          <>
            <div className="profile-grid">
              {[["Full Name", "name"], ["Email", "email"], ["Phone", "phone"], ["Address", "address"]].map(([label, key]) => (
                <div className="form-group" key={key}>
                  <label>{label}</label>
                  <input value={form[key] || ""} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
            </div>
            <button className="btn-outline" style={{ marginTop: "0.5rem", padding: "0.6rem 1.5rem", fontSize: "0.8rem" }} onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <div className="profile-grid">
            {[["Full Name", user.name], ["Email", user.email], ["Phone", user.phone || "Not provided"], ["Address", user.address || "Not provided"], ["Member Since", user.joinedDate], ["Role", user.role]].map(([label, val]) => (
              <div className="profile-field" key={label}>
                <label>{label}</label>
                <p>{val}</p>
              </div>
            ))}
          </div>
        )}

        <div className="profile-actions">
          <button className="btn-outline" style={{ padding: "0.6rem 1.5rem", fontSize: "0.8rem" }} onClick={() => setPage(PAGES.HOME)}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}

// ── Chatbot Components ──────────────────────────────────

function ChatbotPage({ setPage }) {
  return (
    <div className="chatbot-page">
      <div className="chatbot-card fade-in">
        <div className="chatbot-title">Welcome! How can we help?</div>
        <p className="chatbot-greeting">Welcome to VAMCC! We're here to make it easy for you to connect with our church community.</p>
        <button className="chatbot-button" onClick={() => setPage(PAGES.CHATBOT_REGISTER)}>📋 Register as a Church Member</button>
        <button className="chatbot-button" onClick={() => setPage(PAGES.CHATBOT_EVENTS)}>📅 View Upcoming Events</button>
        <div className="chatbot-back">
          <button className="back-btn" onClick={() => setPage(PAGES.HOME)}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}

function ChatbotMemberRegistration({ setPage, setUpdateMemberID, setDuplicateMemberData }) {
  const COUNTRY_CODES = ["+1", "+44", "+91", "+81", "+86", "+33", "+39", "+34", "+49", "+61"];
  const [form, setForm] = useState({
    fullName: "", countryCode: "+1", phoneNumber: "", email: "",
    dateOfBirthMonth: "", dateOfBirthDate: "", parishName: "", city: "", state: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateMemberID, setDuplicateMemberID] = useState(null);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError(""); setSuccess(false);
    if (!form.fullName || !form.phoneNumber || !form.email) {
      setError("Full Name, Phone Number, and Email are required.");
      return;
    }
    if (form.dateOfBirthMonth < 1 || form.dateOfBirthMonth > 12 || form.dateOfBirthDate < 1 || form.dateOfBirthDate > 31) {
      setError("Please enter a valid month (1-12) and date (1-31).");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/members/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (response.status === 409) {
        setIsDuplicate(true);
        setDuplicateMemberID(data.memberID);
        setError(data.error);
        // Fetch the full member data for update form
        const memberResponse = await fetch(`http://localhost:4000/api/members/by-phone?countryCode=${encodeURIComponent(form.countryCode)}&phoneNumber=${encodeURIComponent(form.phoneNumber)}`);
        if (memberResponse.ok) {
          const memberData = await memberResponse.json();
          setDuplicateMemberData(memberData);
        }
      } else if (response.ok) {
        setSuccess(true);
        setForm({ fullName: "", countryCode: "+1", phoneNumber: "", email: "", dateOfBirthMonth: "", dateOfBirthDate: "", parishName: "", city: "", state: "" });
        setTimeout(() => setPage(PAGES.CHATBOT), 2000);
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    }
    setLoading(false);
  };

  const handleUpdateRecord = () => {
    setUpdateMemberID(duplicateMemberID);
    setPage(PAGES.CHATBOT_UPDATE);
  };

  if (isDuplicate) {
    return (
      <div className="chatbot-page">
        <div className="chatbot-card fade-in">
          <div className="chatbot-title">Hold On! 📞</div>
          <div className="alert error">{error}</div>
          <p className="chatbot-greeting">We found an existing record with this phone number. Would you like to update your information?</p>
          <button className="chatbot-button" onClick={handleUpdateRecord}>Yes, Update My Record</button>
          <button className="chatbot-button" style={{ background: "var(--muted)" }} onClick={() => { setIsDuplicate(false); setError(""); setForm({ fullName: "", countryCode: "+1", phoneNumber: "", email: "", dateOfBirthMonth: "", dateOfBirthDate: "", parishName: "", city: "", state: "" }); }}>No, Try Different Number</button>
          <div className="chatbot-back">
            <button className="back-btn" onClick={() => setPage(PAGES.CHATBOT)}>← Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbot-page">
      <div className="form-card fade-in">
        <div className="form-title">Member Registration</div>
        <div className="form-sub">We'd love to know more about you!</div>
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">✓ Welcome to our church family!</div>}

        <div className="form-group"><label>Full Name of Head of Household *</label><input name="fullName" value={form.fullName} onChange={handle} placeholder="John Smith" /></div>

        <div className="form-row">
          <div className="form-group"><label>Country Code *</label><select name="countryCode" value={form.countryCode} onChange={handle}>{COUNTRY_CODES.map(cc => <option key={cc} value={cc}>{cc}</option>)}</select></div>
          <div className="form-group"><label>Phone Number *</label><input name="phoneNumber" value={form.phoneNumber} onChange={handle} placeholder="555-123-4567" /></div>
        </div>

        <div className="form-group"><label>Email Address *</label><input name="email" type="email" value={form.email} onChange={handle} placeholder="john@example.com" /></div>

        <div className="form-row">
          <div className="form-group"><label>Date of Birth Month (1-12) *</label><input name="dateOfBirthMonth" type="number" min="1" max="12" value={form.dateOfBirthMonth} onChange={handle} placeholder="3" /></div>
          <div className="form-group"><label>Date (1-31) *</label><input name="dateOfBirthDate" type="number" min="1" max="31" value={form.dateOfBirthDate} onChange={handle} placeholder="15" /></div>
        </div>

        <div className="form-group"><label>Parish Name (Optional)</label><input name="parishName" value={form.parishName} onChange={handle} placeholder="St. Mary's" /></div>

        <div className="form-row">
          <div className="form-group"><label>City (Optional)</label><input name="city" value={form.city} onChange={handle} placeholder="Dallas" /></div>
          <div className="form-group"><label>State (Optional)</label><input name="state" value={form.state} onChange={handle} placeholder="TX" /></div>
        </div>

        <button className="form-btn" onClick={submit} disabled={loading}>{loading ? "Registering…" : "Submit Registration"}</button>
        <div className="form-switch"><button onClick={() => { setPage(PAGES.CHATBOT); setError(""); }}>← Back</button></div>
      </div>
    </div>
  );
}

function UpdateMemberForm({ memberID, memberData, setPage }) {
  const COUNTRY_CODES = ["+1", "+44", "+91", "+81", "+86", "+33", "+39", "+34", "+49", "+61"];
  const [form, setForm] = useState(memberData || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.fullName || !form.phoneNumber || !form.email) {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true); setError("");
    try {
      const response = await fetch(`http://localhost:4000/api/members/${form.memberid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setPage(PAGES.CHATBOT), 2000);
      } else {
        const data = await response.json();
        setError(data.error || "Update failed.");
      }
    } catch (err) {
      setError("Connection error.");
    }
    setSaving(false);
  };

  if (!form) return <div className="chatbot-page"><div className="chatbot-card">Loading...</div></div>;

  return (
    <div className="chatbot-page">
      <div className="form-card fade-in">
        <div className="form-title">Update Your Information</div>
        <div className="form-sub">Make any changes to your member record.</div>
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">✓ Your information has been updated!</div>}

        <div className="form-group"><label>Full Name *</label><input name="fullName" value={form.fullName} onChange={handle} /></div>

        <div className="form-row">
          <div className="form-group"><label>Country Code *</label><select name="countryCode" value={form.countryCode} onChange={handle}>{COUNTRY_CODES.map(cc => <option key={cc} value={cc}>{cc}</option>)}</select></div>
          <div className="form-group"><label>Phone Number *</label><input name="phoneNumber" value={form.phoneNumber} onChange={handle} /></div>
        </div>

        <div className="form-group"><label>Email Address *</label><input name="email" type="email" value={form.email} onChange={handle} /></div>

        <div className="form-row">
          <div className="form-group"><label>Date of Birth Month (1-12) *</label><input name="dateOfBirthMonth" type="number" min="1" max="12" value={form.dateOfBirthMonth || ""} onChange={handle} /></div>
          <div className="form-group"><label>Date (1-31) *</label><input name="dateOfBirthDate" type="number" min="1" max="31" value={form.dateOfBirthDate || ""} onChange={handle} /></div>
        </div>

        <div className="form-group"><label>Parish Name (Optional)</label><input name="parishName" value={form.parishName || ""} onChange={handle} /></div>

        <div className="form-row">
          <div className="form-group"><label>City (Optional)</label><input name="city" value={form.city || ""} onChange={handle} /></div>
          <div className="form-group"><label>State (Optional)</label><input name="state" value={form.state || ""} onChange={handle} /></div>
        </div>

        <button className="form-btn" onClick={submit} disabled={saving}>{saving ? "Updating…" : "Save Changes"}</button>
        <div className="form-switch"><button onClick={() => setPage(PAGES.CHATBOT)}>← Back</button></div>
      </div>
    </div>
  );
}

function ChatbotEvents({ setPage }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/events");
        if (response.ok) {
          setEvents(await response.json());
        } else {
          setError("Could not load events.");
        }
      } catch {
        setError("Connection error.");
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="chatbot-page"><div className="chatbot-card">Loading events...</div></div>;
  if (error) return <div className="chatbot-page"><div className="chatbot-card"><div className="alert error">{error}</div><button className="back-btn" onClick={() => setPage(PAGES.CHATBOT)}>← Back</button></div></div>;

  return (
    <div className="chatbot-page">
      <div className="form-card fade-in" style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <div className="form-title">📅 Upcoming Events</div>
        <div className="form-sub">Next 10 events at VAMCC</div>
        <div className="events-list">
          {events.map(event => (
            <div className="event-item" key={event.id}>
              <div className="event-title">{event.title}</div>
              <div className="event-datetime">{event.date} at {event.time}</div>
              <div className="event-description">{event.description}</div>
            </div>
          ))}
        </div>
        <div className="chatbot-back">
          <button className="back-btn" onClick={() => setPage(PAGES.CHATBOT)}>← Back to Menu</button>
        </div>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState(PAGES.HOME);
  const [updateMemberID, setUpdateMemberID] = useState(null);
  const [duplicateMemberData, setDuplicateMemberData] = useState(null);
  const { user, login, register, logout } = useAuth();

  useEffect(() => {
    if (user && page === PAGES.LOGIN) setPage(PAGES.PROFILE);
  }, [user]);

  return (
    <>
      <style>{styles}</style>
      <Nav page={page} setPage={setPage} user={user} logout={logout} />
      {page === PAGES.HOME && <HomePage setPage={setPage} user={user} />}
      {page === PAGES.REGISTER && <RegisterPage onRegister={register} setPage={setPage} />}
      {page === PAGES.LOGIN && <LoginPage onLogin={login} setPage={setPage} />}
      {page === PAGES.PROFILE && user && <ProfilePage user={user} setPage={setPage} />}
      {page === PAGES.PROFILE && !user && <LoginPage onLogin={login} setPage={setPage} />}
      {page === PAGES.CHATBOT && <ChatbotPage setPage={setPage} />}
      {page === PAGES.CHATBOT_REGISTER && <ChatbotMemberRegistration setPage={setPage} setUpdateMemberID={setUpdateMemberID} setDuplicateMemberData={setDuplicateMemberData} />}
      {page === PAGES.CHATBOT_EVENTS && <ChatbotEvents setPage={setPage} />}
      {page === PAGES.CHATBOT_UPDATE && <UpdateMemberForm memberID={updateMemberID} memberData={duplicateMemberData} setPage={setPage} />}
    </>
  );
}
