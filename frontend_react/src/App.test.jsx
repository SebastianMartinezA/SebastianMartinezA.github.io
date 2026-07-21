import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const mockTrackEvent = vi.hoisted(() => vi.fn());

vi.mock('./analytics', () => ({
  trackEvent: mockTrackEvent,
}));

let intersectionCallback;
let intersectionOptions;
let intersectionObserver;

class MockIntersectionObserver {
  constructor(callback, options) {
    intersectionCallback = callback;
    intersectionOptions = options;
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
    intersectionObserver = this;
  }
}

const createStorageMock = () => {
  let store = {};
  return {
    clear: vi.fn(() => {
      store = {};
    }),
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
  };
};

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: createStorageMock(),
  });
  window.localStorage.clear();
  window.history.replaceState({}, '', '/');
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.lang = 'en';
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
  vi.stubGlobal('navigator', {
    ...window.navigator,
    language: 'es-AR',
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  });
  intersectionCallback = undefined;
  intersectionOptions = undefined;
  intersectionObserver = undefined;
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  mockTrackEvent.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test('switches the portfolio copy between Spanish and English', async () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Sebastian Martinez' })).toBeInTheDocument();
  expect(screen.getByText(/Backend Engineer en el equipo de Sessions de Mercado Libre/)).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Cambiar idioma a inglés' }));

  expect(screen.getByText(/Backend Engineer on Mercado Libre’s Sessions team/)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  expect(document.documentElement.lang).toBe('en');
  expect(window.localStorage.getItem('portfolio-language')).toBe('en');
  expect(new URLSearchParams(window.location.search).get('lang')).toBe('en');
});

test('uses a shareable language query and preserves attribution and hash on toggle', async () => {
  window.localStorage.setItem('portfolio-language', 'es');
  window.history.replaceState({}, '', '/?utm_source=linkedin&lang=en#projects');

  render(<App />);

  expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  expect(document.documentElement.lang).toBe('en');

  const englishResume = screen.getByRole('link', { name: 'Resume (opens in new tab)' });
  expect(englishResume).toHaveAttribute('href', expect.stringMatching(/ResumeSebastianEN/));

  await userEvent.click(screen.getByRole('button', { name: 'Switch language to Spanish' }));

  const params = new URLSearchParams(window.location.search);
  expect(params.get('lang')).toBe('es');
  expect(params.get('utm_source')).toBe('linkedin');
  expect(window.location.hash).toBe('#projects');
  expect(screen.getByRole('link', { name: 'CV (abre en nueva pestaña)' })).toHaveAttribute(
    'href',
    expect.stringMatching(/ResumeSebastian\.pdf$/),
  );
});

test('ignores an unsupported language query and replaces it with the detected language', () => {
  window.history.replaceState({}, '', '/?lang=fr&utm_medium=cv');

  render(<App />);

  const params = new URLSearchParams(window.location.search);
  expect(document.documentElement.lang).toBe('es');
  expect(params.get('lang')).toBe('es');
  expect(params.get('utm_medium')).toBe('cv');
});

test('toggles and persists the visual theme', async () => {
  render(<App />);

  expect(document.documentElement).toHaveAttribute('data-theme', 'light');

  await userEvent.click(screen.getByRole('button', { name: 'Cambiar a modo oscuro' }));

  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  expect(window.localStorage.getItem('portfolio-theme')).toBe('dark');
  expect(screen.getByRole('button', { name: 'Cambiar a modo claro' })).toBeInTheDocument();
});

test('copies the contact email with clear feedback', async () => {
  render(<App />);

  await userEvent.click(screen.getByRole('button', { name: 'Copiar email' }));

  expect(navigator.clipboard.writeText).toHaveBeenCalledWith('sebas@smar.ar');
  expect(screen.getByText('Copiado')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Copiado' })).toBeInTheDocument();
});

test('points the hero contact call to action to the contact section', () => {
  render(<App />);

  expect(screen.getByRole('link', { name: 'Contactarme' })).toHaveAttribute('href', '#contact');
});

test('opens a compact mobile menu with navigation and preference actions', async () => {
  render(<App />);

  expect(screen.queryByRole('navigation', { name: 'Navegación móvil' })).not.toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));

  expect(screen.getByRole('navigation', { name: 'Navegación móvil' })).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: 'Sobre mí' })).toHaveLength(2);
  expect(screen.getAllByRole('link', { name: 'Impacto' })).toHaveLength(2);
  expect(screen.getAllByRole('link', { name: 'Tecnologías' })).toHaveLength(2);
  expect(screen.getAllByRole('link', { name: 'IA' })).toHaveLength(2);
  expect(screen.getAllByRole('link', { name: 'Formación' })).toHaveLength(2);
  expect(screen.getAllByRole('link', { name: 'Proyectos' })).toHaveLength(2);
  expect(screen.getAllByRole('link', { name: 'Contacto' })).toHaveLength(2);
  expect(screen.queryByRole('link', { name: 'Qué hago' })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Intereses' })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Escritos' })).not.toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: 'Cambiar idioma a inglés' })).toHaveLength(2);
  expect(screen.getByRole('button', { name: 'Cerrar menú' })).toBeInTheDocument();
});

test('renders career progression, formation, projects, citizenship, and updated tech stack', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Formación' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Ingeniería en Informática' })).toBeInTheDocument();
  expect(screen.getByText('Universidad de Morón · 2019 – graduación estimada 2026')).toBeInTheDocument();
  expect(screen.getByText('Doble ciudadanía AR/IT · relocation y oportunidades en la UE')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Trayectoria' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Sr. Software Engineer' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'SSr. Software Engineer' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Idiomas' })).toBeInTheDocument();
  expect(screen.getByText('Español')).toBeInTheDocument();
  expect(screen.getByText('Bilingüe')).toBeInTheDocument();
  expect(screen.getByText('Swagger/OpenAPI')).toBeInTheDocument();
  expect(screen.getByText('Pub/Sub')).toBeInTheDocument();
  expect(screen.getAllByText('BigQuery')).toHaveLength(2);
  expect(screen.getByText('OpenTelemetry')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'IA y Productividad' })).toBeInTheDocument();
  expect(screen.getByText(/Referente de IA en mi equipo/)).toBeInTheDocument();
  expect(screen.getByText('10+')).toBeInTheDocument();
  expect(screen.getByText('plugins publicados')).toBeInTheDocument();
  expect(screen.getByText('Claude Code')).toBeInTheDocument();
  expect(screen.getByText('Multi-agent workflows')).toBeInTheDocument();
  expect(screen.getByText(/primer Workshop de IA del equipo/)).toBeInTheDocument();
  expect(screen.queryByText('Kotlin')).not.toBeInTheDocument();
  expect(screen.queryByText('gRPC')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Proyectos' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Authprocess' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Banking Sessions México' })).toBeInTheDocument();
  expect(screen.getByText(/Diseñé el modelo de unicidad de sesión cross-domain/)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'SSO de Banco' })).toBeInTheDocument();
  expect(screen.getByText(/Diseñé la estrategia de migración de los datos actuales/)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Device Signing Recovery' })).toBeInTheDocument();
  expect(screen.getByText(/Definí los SLOs y el esquema de canary/)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Proyectos personales' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Automatización de ventana IoT' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Escritos' })).not.toBeInTheDocument();
});

test('presents impact bullets as prominent metrics', () => {
  render(<App />);

  expect(screen.getByText('3M+')).toBeInTheDocument();
  expect(screen.getByText('1M+')).toBeInTheDocument();
  expect(screen.getByText('sesiones/día')).toBeInTheDocument();
  expect(screen.getByText('enrolamientos/día')).toBeInTheDocument();
  expect(screen.getByText('99.99%')).toBeInTheDocument();
  expect(screen.getByText('uptime SLO')).toBeInTheDocument();
  expect(screen.getByText('Objetivo de disponibilidad en servicios críticos')).toBeInTheDocument();
  expect(screen.getByText('500K+')).toBeInTheDocument();
  expect(screen.getByText('SSO/día')).toBeInTheDocument();
  expect(screen.getByText('Canjes de nonce SSO móvil')).toBeInTheDocument();
});

test('repeats GitHub and LinkedIn calls to action in contact', () => {
  render(<App />);

  expect(screen.getAllByRole('link', { name: 'GitHub (abre en nueva pestaña)' })).toHaveLength(2);
  expect(screen.getAllByRole('link', { name: 'LinkedIn (abre en nueva pestaña)' })).toHaveLength(2);
});

test('discloses optional cookieless analytics in the footer', () => {
  render(<App />);

  expect(
    screen.getByText(/analítica de uso opcional.*visitas e interacciones.*sin cookies ni almacenamiento local.*sin grabación de sesiones/i)
  ).toBeInTheDocument();
});

test('tracks each visible section only once', () => {
  render(<App />);

  expect(intersectionOptions).toEqual({ threshold: 0.25 });
  document.querySelectorAll('.portfolio-section').forEach((section) => {
    expect(intersectionObserver.observe).toHaveBeenCalledWith(section);
  });

  const aboutSection = document.querySelector('#about');
  intersectionCallback([{ target: aboutSection, isIntersecting: true }]);
  expect(mockTrackEvent).toHaveBeenCalledWith('section_viewed', { section: 'about' });
  expect(mockTrackEvent).toHaveBeenCalledTimes(1);

  intersectionCallback([{ target: aboutSection, isIntersecting: true }]);
  expect(mockTrackEvent).toHaveBeenCalledTimes(1);
});
