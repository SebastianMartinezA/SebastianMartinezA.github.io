import React, { useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  FiActivity,
  FiBookOpen,
  FiBriefcase,
  FiCopy,
  FiCpu,
  FiDownload,
  FiGithub,
  FiLayers,
  FiLinkedin,
  FiMail,
  FiMenu,
  FiMoon,
  FiSun,
  FiTerminal,
  FiX,
} from 'react-icons/fi';
import './App.scss';
import { trackEvent } from './analytics';
import {
  EMAIL,
  GITHUB_URL,
  LANGUAGES,
  LINKEDIN_URL,
  RESUME_URL,
  translations,
} from './content/portfolioContent';

const STORAGE_KEYS = {
  language: 'portfolio-language',
  theme: 'portfolio-theme',
};

const getStoredValue = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const getInitialLanguage = () => {
  const stored = getStoredValue(STORAGE_KEYS.language);
  if (stored && translations[stored]) return stored;

  const browserLanguage = navigator.language?.toLowerCase() || '';
  return browserLanguage.startsWith('en') ? 'en' : 'es';
};

const getInitialTheme = () => {
  const stored = getStoredValue(STORAGE_KEYS.theme);
  if (stored === 'dark' || stored === 'light') return stored;

  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

const persistValue = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable in private or hardened browser contexts.
  }
};

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const getCurrentHashId = () => {
  const hash = window.location.hash.slice(1);
  if (!hash) return 'top';

  try {
    return decodeURIComponent(hash);
  } catch {
    return hash;
  }
};

const Section = ({ id, icon: Icon, title, children }) => (
  <section className="portfolio-section" id={id} aria-labelledby={`${id}-title`}>
    <div className="section-marker" aria-hidden="true">
      <Icon />
    </div>
    <div className="section-content">
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </div>
  </section>
);

const App = () => {
  const [language, setLanguage] = useState(getInitialLanguage);
  const [theme, setTheme] = useState(getInitialTheme);
  const [copyState, setCopyState] = useState('idle');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(getCurrentHashId);
  const t = translations[language];

  const navItems = useMemo(
    () => {
      const items = [
        ['about', t.nav.about],
        ['impact', t.nav.impact],
        ['tech', t.nav.tech],
        ['ai', t.nav.ai],
        ['formation', t.nav.formation],
        ['projects', t.nav.projects],
      ];

      if (t.writing.isVisible) {
        items.push(['writing', t.nav.writing]);
      }

      items.push(['contact', t.nav.contact]);
      return items;
    },
    [t],
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.meta.title;
    persistValue(STORAGE_KEYS.language, language);
  }, [language, t.meta.title]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    persistValue(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    const id = getCurrentHashId();
    if (id === 'top') return undefined;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
      setActiveSection(id);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handleHashChange = () => setActiveSection(getCurrentHashId());

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (copyState === 'idle') return undefined;
    const timeout = window.setTimeout(() => setCopyState('idle'), 1800);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const viewedSections = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        if (!entry.isIntersecting || !sectionId || viewedSections.has(sectionId)) return;

        viewedSections.add(sectionId);
        trackEvent('section_viewed', { section: sectionId });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.25 });

    document.querySelectorAll('.portfolio-section').forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const nextLanguage = language === 'es' ? 'en' : 'es';
  const isDark = theme === 'dark';
  const copyLabel = copyState === 'copied'
    ? t.controls.copied
    : copyState === 'failed'
      ? t.controls.copyFailed
      : t.controls.copyEmail;

  const handleLanguageToggle = (placement) => {
    trackEvent('language_toggle', {
      from: language,
      to: nextLanguage,
      placement,
    });
    setLanguage(nextLanguage);
  };

  const applyTheme = (nextThemeValue) => {
    document.documentElement.dataset.theme = nextThemeValue;
    setTheme(nextThemeValue);
  };

  const handleThemeToggle = (event) => {
    const nextThemeValue = isDark ? 'light' : 'dark';
    const supportsViewTransition = typeof document.startViewTransition === 'function';
    trackEvent('theme_toggle', {
      from: theme,
      to: nextThemeValue,
    });

    if (!supportsViewTransition || prefersReducedMotion()) {
      applyTheme(nextThemeValue);
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => applyTheme(nextThemeValue));
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 450,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      })
      .catch(() => {});
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      trackEvent('email_copy', { status: 'success' });
      setCopyState('copied');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = EMAIL;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        const copied = document.execCommand('copy');
        trackEvent('email_copy', { status: copied ? 'success' : 'failed', fallback: true });
        setCopyState(copied ? 'copied' : 'failed');
      } catch {
        trackEvent('email_copy', { status: 'failed', fallback: true });
        setCopyState('failed');
      } finally {
        textarea.remove();
      }
    }
  };

  return (
    <div className="portfolio-shell">
      <a className="skip-link" href="#main">
        {t.controls.skip}
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label={language === 'es' ? 'Volver al inicio' : 'Back to top'}>
          Sebastian Martinez
        </a>

        <nav className="site-nav" aria-label={t.controls.primaryNavigation}>
          {navItems.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeSection === id ? 'location' : undefined}
              onClick={() => trackEvent('nav_click', { target: id, label, placement: 'desktop' })}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="header-actions" aria-label={t.controls.preferences}>
          <button
            className="icon-button"
            type="button"
            onClick={() => handleLanguageToggle('header')}
            aria-label={t.controls.switchLanguage}
          >
            <span>{LANGUAGES.find((item) => item.code === nextLanguage).label}</span>
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={handleThemeToggle}
            aria-label={isDark ? t.controls.switchToLight : t.controls.switchToDark}
          >
            {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
          </button>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? t.controls.closeMenu : t.controls.openMenu}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>

        {menuOpen && (
          <div className="mobile-menu" id="mobile-menu">
            <nav aria-label={t.controls.mobileNavigation}>
              {navItems.map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  aria-current={activeSection === id ? 'location' : undefined}
                  onClick={() => {
                    trackEvent('nav_click', { target: id, label, placement: 'mobile' });
                    setMenuOpen(false);
                  }}
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="mobile-menu-actions" aria-label={t.controls.mobilePreferences}>
              <button
                className="icon-button"
                type="button"
                onClick={() => {
                  handleLanguageToggle('mobile_menu');
                  setMenuOpen(false);
                }}
                aria-label={t.controls.switchLanguage}
              >
                <span>{LANGUAGES.find((item) => item.code === nextLanguage).label}</span>
              </button>
              <button
                className="icon-button"
                type="button"
                onClick={(event) => {
                  handleThemeToggle(event);
                  setMenuOpen(false);
                }}
                aria-label={isDark ? t.controls.switchToLight : t.controls.switchToDark}
              >
                {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
              </button>
            </div>
          </div>
        )}
      </header>

      <main id="main" className="portfolio-main" tabIndex="-1">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1 id="hero-title">{t.hero.name}</h1>
            <p className="hero-role">{t.hero.role}</p>
            <p className="hero-body">{t.hero.body}</p>
            <div className="availability-list">
              <p className="availability">{t.hero.availability}</p>
              <p className="availability">{t.hero.citizenship}</p>
            </div>

            <div className="hero-actions">
              <a
                className="button button-primary"
                href="#contact"
                onClick={() => trackEvent('contact_cta_click', { placement: 'hero' })}
              >
                <FiMail aria-hidden="true" />
                {t.hero.primaryCta}
              </a>
              <a
                className="button button-secondary"
                href={GITHUB_URL}
                rel="noreferrer"
                target="_blank"
                aria-label={`${t.hero.githubCta} (${t.controls.opensInNewTab})`}
                onClick={() => trackEvent('github_click', { placement: 'hero' })}
              >
                <FiGithub aria-hidden="true" />
                {t.hero.githubCta}
              </a>
              <a
                className="button button-secondary"
                href={LINKEDIN_URL}
                rel="noreferrer"
                target="_blank"
                aria-label={`${t.hero.linkedinCta} (${t.controls.opensInNewTab})`}
                onClick={() => trackEvent('linkedin_click', { placement: 'hero' })}
              >
                <FiLinkedin aria-hidden="true" />
                {t.hero.linkedinCta}
              </a>
              <a
                className="button button-secondary"
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer"
                aria-label={`${t.hero.resumeCta} (${t.controls.opensInNewTab})`}
                onClick={() => trackEvent('resume_click', { placement: 'hero' })}
              >
                <FiDownload aria-hidden="true" />
                {t.hero.resumeCta}
              </a>
            </div>
          </div>

          <div className="terminal-mark" aria-hidden="true">
            <div className="terminal-glyph">
              <FiTerminal />
              <span />
            </div>
            <div className="terminal-lines">
              <span>auth.session.validate()</span>
              <span>jwt.rotate(keys)</span>
              <span>fraud.signals.score()</span>
            </div>
          </div>
        </section>

        <Section id="about" icon={FiBriefcase} title={t.about.title}>
          <p>{t.about.body}</p>
          <div className="career-progression">
            <h3 className="subsection-title">{t.about.experienceTitle}</h3>
            <ol className="career-list">
              {t.about.experience.map((item) => (
                <li key={`${item.company}-${item.role}`}>
                  <div>
                    <h4>{item.role}</h4>
                    <p>{item.company}</p>
                  </div>
                  <time>{item.period}</time>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        <Section id="impact" icon={FiActivity} title={t.impact.title}>
          <div className="impact-stats">
            {t.impact.stats.map((stat) => (
              <article className="stat-card" key={`${stat.value}-${stat.label}`}>
                <p className="stat-value">
                  <span>{stat.value}</span>
                  <span className="stat-unit">{stat.unit}</span>
                </p>
                <p>{stat.label}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="tech" icon={FiLayers} title={t.tech.title}>
          <div className="tech-groups">
            {t.tech.groups.map((group) => (
              <div className="tech-group" key={group.label}>
                <h3>{group.label}</h3>
                <div className="chip-row">
                  {group.items.map((item) => (
                    <span className="chip" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="ai" icon={FiCpu} title={t.ai.title}>
          <p>{t.ai.intro}</p>
          <div className="ai-stats">
            {t.ai.stats.map((stat) => (
              <article className="stat-card" key={`${stat.value}-${stat.label}`}>
                <p className="stat-value">
                  <span>{stat.value}</span>
                  <span className="stat-unit">{stat.unit}</span>
                </p>
                <p>{stat.label}</p>
              </article>
            ))}
          </div>
          <div className="ai-block">
            <h3 className="subsection-title">{t.ai.stackTitle}</h3>
            <div className="chip-row">
              {t.ai.stack.map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="ai-block">
            <h3 className="subsection-title">{t.ai.highlightsTitle}</h3>
            <ul className="highlight-list">
              {t.ai.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </Section>

        <Section id="formation" icon={FiBookOpen} title={t.formation.title}>
          <div className="formation-grid">
            <div className="formation-column">
              <h3>{t.formation.educationTitle}</h3>
              <div className="education-entry">
                <h4>{t.formation.degree}</h4>
                <p>{t.formation.institution}</p>
              </div>
            </div>
            <div className="formation-column">
              <h3>{t.formation.languagesTitle}</h3>
              <ul className="language-list">
                {t.formation.languages.map((item) => (
                  <li key={item.name}>
                    <span>{item.name}</span>
                    <span aria-hidden="true">·</span>
                    <small>{item.level}</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="projects" icon={FiTerminal} title={t.projects.title}>
          <h3 className="subsection-title">{t.projects.professionalTitle}</h3>
          <div className="project-grid project-grid-professional">
            {t.projects.items.map((project) => (
              <article className="project-card" key={project.title}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p className="project-role">
                  <strong>{t.projects.roleLabel}:</strong> {project.role}
                </p>
                <div className="chip-row">
                  {project.tags.map((tag) => (
                    <span className="chip" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          {t.projects.sideItems.length > 0 && (
            <div className="side-projects">
              <h3 className="subsection-title">{t.projects.sideTitle}</h3>
              <div className="side-project-grid">
                {t.projects.sideItems.map((project) => (
                  <article className="project-card side-project-card" key={project.title}>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="chip-row">
                      {project.tags.map((tag) => (
                        <span className="chip" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </Section>

        {t.writing.isVisible && t.writing.items.length > 0 && (
          <Section id="writing" icon={FiTerminal} title={t.writing.title}>
            <div className="project-grid">
              {t.writing.items.map((item) => (
                <article className="project-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </Section>
        )}

        <Section id="contact" icon={FiMail} title={t.contact.title}>
          <p>{t.contact.body}</p>
          <div className="contact-card">
            <a
              href={`mailto:${EMAIL}`}
              onClick={() => trackEvent('contact_email_click', { placement: 'contact' })}
            >
              <FiMail aria-hidden="true" />
              <span>{EMAIL}</span>
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label={copyLabel}
              aria-live="polite"
              aria-atomic="true"
            >
              <FiCopy aria-hidden="true" />
              {copyLabel}
            </button>
          </div>
          <nav className="contact-socials" aria-label={t.contact.socialLabel}>
            <a
              className="button button-secondary"
              href={GITHUB_URL}
              rel="noreferrer"
              target="_blank"
              aria-label={`${t.hero.githubCta} (${t.controls.opensInNewTab})`}
              onClick={() => trackEvent('github_click', { placement: 'contact' })}
            >
              <FiGithub aria-hidden="true" />
              {t.hero.githubCta}
            </a>
            <a
              className="button button-secondary"
              href={LINKEDIN_URL}
              rel="noreferrer"
              target="_blank"
              aria-label={`${t.hero.linkedinCta} (${t.controls.opensInNewTab})`}
              onClick={() => trackEvent('linkedin_click', { placement: 'contact' })}
            >
              <FiLinkedin aria-hidden="true" />
              {t.hero.linkedinCta}
            </a>
          </nav>
        </Section>
      </main>

      <footer className="site-footer">
        <p>{t.footer}</p>
        <p>{t.privacy}</p>
      </footer>
    </div>
  );
};

export default App;
