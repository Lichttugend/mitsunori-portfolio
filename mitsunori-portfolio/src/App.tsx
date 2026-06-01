import './App.css'
import profileImg from './assets/profile.jpg'

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/lichttugend',
    icon: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/mitsunoriito',
    icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/lichttugend',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
  },
]

const skills = [
  'React', 'TypeScript', 'JavaScript', 'CSS', 'HTML',
  'Vite', 'Node.js', 'Git', 'Python',
]

const languages = [
  { name: 'Japanese', level: 'Native' },
  { name: 'German', level: 'Intermediate' },
  { name: 'English', level: 'Conversational' },
  { name: 'Norwegian', level: 'Beginner' },
]

const works = [
  {
    title: 'Portfolio Site',
    description: 'このポートフォリオサイト。React + Vite + TypeScript で構築。',
    tags: ['React', 'TypeScript', 'Vite'],
    url: '',
  },
]

function App() {
  return (
    <>
      <nav id="navbar">
        <span className="nav-brand">Mitsunori</span>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#works">Works</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#languages">Languages</a></li>
          <li><a href="#social">Connect</a></li>
        </ul>
      </nav>

      <section id="hero">
        <img src={profileImg} alt="Mitsunori" className="profile-img" />
        <p className="hero-eyebrow">Hi, I'm</p>
        <h1>Mitsunori</h1>
        <p className="hero-subtitle">Aspiring AI Developer based in Berlin</p>
      </section>

      <section id="about">
        <h2>About</h2>
        <p className="section-text">
          Hi, I'm Mitsunori Ito.<br />
          A developer based in Berlin, originally from Fukuoka, Japan.<br />
          I'm in the middle of a career transition into software development. <br />
          When I'm not coding, I'm raising my son in Berlin.
        </p>
      </section>

      <section id="works">
        <h2>Works</h2>
        <div className="works-grid">
          {works.map(work => (
            <article key={work.title} className="work-card">
              <h3 className="work-title">{work.title}</h3>
              <p className="work-desc">{work.description}</p>
              <div className="work-tags">
                {work.tags.map(tag => (
                  <span key={tag} className="work-tag">{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>


      <section id="skills">
        <h2>Skills</h2>
        <div className="skills-grid">
          {skills.map(skill => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </section>

      <section id="languages">
        <h2>Languages</h2>
        <div className="languages-list">
          {languages.map(lang => (
            <div key={lang.name} className="language-item">
              <span className="language-name">{lang.name}</span>
              <span className="language-level">{lang.level}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="social">
        <h2>Connect</h2>
        <div className="social-links">
          {socialLinks.map(link => (
            <a
              key={link.name}
              href={link.url}
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={link.icon} />
              </svg>
              <span>{link.name}</span>
            </a>
          ))}
        </div>
      </section>

      <footer id="footer">
        <p>© 2025 Mitsunori</p>
      </footer>
    </>
  )
}

export default App
