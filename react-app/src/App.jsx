import { useState } from 'react';

const navigation = [
  ['About', 'about.html'],
  ['Programs', 'programs.html'],
  ['Admissions', 'admissions.html'],
  ['Faculty', 'faculty.html'],
  ['Campus', 'campus.html'],
  ['Notices', 'notices.html'],
  ['Contact', 'contact.html'],
];

const magazines = {
  '2024-25': {
    label: '2024-25 edition',
    file: '/IIEE%20Chronicles%202024-25.pdf',
  },
  '2025-26': {
    label: '2025-26 edition',
    file: '/IIEE%20Chronicles%202025-26%20(2).pdf',
  },
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [magazine, setMagazine] = useState(null);

  return (
    <div className="app-shell">
      <div className="topbar">
        <span>+92 21 99244218-20</span>
        <span>info@iiee.edu.pk</span>
      </div>

      <header className="site-header">
        <a className="brand" href="/" aria-label="IIEE home">
          <img src="/IIEE_logo_transparent.png" alt="IIEE crest" />
          <span>
            <strong>Institute of Industrial Electronics Engineering</strong>
            <small>Think beyond limits</small>
          </span>
        </a>
        <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen}>
          Menu
        </button>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
          <a className="active" href="/">Home</a>
          {navigation.map(([label, href]) => <a href={`/${href}`} key={label}>{label}</a>)}
        </nav>
        <a className="apply-button" href="/admissions.html">Apply Now</a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="kicker">Pakistan&apos;s first dedicated industrial electronics institute</p>
            <h1>Engineering the systems that move industry forward.</h1>
            <p className="hero-lede">A laboratory-led education in industrial electronics, automation, embedded systems, control, and energy.</p>
            <div className="hero-actions">
              <a className="apply-button" href="/admissions.html">Apply Now</a>
              <a className="outline-button" href="/programs.html">Explore the program</a>
            </div>
            <div className="stats" aria-label="Institution facts">
              <div><strong>1989</strong><span>Founded</span></div>
              <div><strong>50+</strong><span>Seats / year</span></div>
              <div><strong>PEC</strong><span>Accredited</span></div>
            </div>
          </div>

          <section className="shelf" aria-label="IIEE Chronicles magazines">
            <div className="shelf-frame">
              <div className="shelf-row">
                <i className="book navy" /><i className="book ice" /><MagazineButton edition="2024-25" onOpen={setMagazine} /><i className="book amber" /><i className="book navy short" />
              </div>
              <div className="shelf-row lower">
                <i className="book ice short" /><i className="book navy" /><i className="book amber short" /><MagazineButton edition="2025-26" onOpen={setMagazine} /><i className="book ice" />
              </div>
            </div>
            <button className="read-link" type="button" onClick={() => setMagazine('2024-25')}>Read IIEE Chronicles</button>
          </section>
        </section>

        <section className="editorial-band">
          <span className="section-number">01</span>
          <div><h2>A compact institution with an outsized industrial purpose.</h2><p>IIEE connects rigorous engineering foundations to practical work in the systems that keep modern industry moving.</p></div>
        </section>
      </main>

      <footer className="site-footer">
        <div><strong>IIEE</strong><p>Institute of Industrial Electronics Engineering</p></div>
        <div><span>Quick links</span><a href="/about.html">About</a><a href="/programs.html">Programs</a><a href="/contact.html">Contact</a></div>
        <div><span>Campus</span><p>Gulshan-e-Iqbal, Karachi</p><a href="mailto:info@iiee.edu.pk">info@iiee.edu.pk</a></div>
      </footer>

      {magazine && <MagazineReader edition={magazine} onClose={() => setMagazine(null)} />}
    </div>
  );
}

function MagazineButton({ edition, onOpen }) {
  return <button className="magazine" type="button" onClick={() => onOpen(edition)}><strong>IIEE<br />Chronicles</strong><small>{magazines[edition].label}</small></button>;
}

function MagazineReader({ edition, onClose }) {
  const item = magazines[edition];
  return (
    <div className="reader-overlay" role="dialog" aria-modal="true" aria-label={`${item.label} magazine`}>
      <div className="reader-window">
        <div className="reader-header"><div><span className="kicker">IIEE Chronicles</span><h2>{item.label}</h2></div><button className="close-button" type="button" onClick={onClose} aria-label="Close magazine">Close</button></div>
        <div className="reader-book"><iframe title={`IIEE Chronicles ${edition}`} src={item.file} /></div>
        <div className="reader-footer"><span>Use the PDF viewer controls to read and turn pages.</span><a className="outline-button" href={item.file} target="_blank" rel="noreferrer">Open PDF</a></div>
      </div>
    </div>
  );
}

export default App;
