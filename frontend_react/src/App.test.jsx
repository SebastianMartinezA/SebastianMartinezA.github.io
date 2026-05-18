import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

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
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.lang = 'en';
  vi.stubGlobal('navigator', {
    ...window.navigator,
    language: 'es-AR',
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  });
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

test('renders formation, projects, citizenship, and updated tech stack', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Formación' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Ingeniería en Informática' })).toBeInTheDocument();
  expect(screen.getByText('Universidad de Morón · 2019 – 2026')).toBeInTheDocument();
  expect(screen.getByText('Doble ciudadanía AR/IT · disponible para EU')).toBeInTheDocument();
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
  expect(screen.getByRole('heading', { name: 'Banking Sessions México' })).toBeInTheDocument();
  expect(screen.getByText(/Diseñé el modelo de unicidad de sesión cross-domain/)).toBeInTheDocument();
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
  expect(screen.getByText('Canjes de nonce SSO mobile')).toBeInTheDocument();
});

test('repeats GitHub and LinkedIn calls to action in contact', () => {
  render(<App />);

  expect(screen.getAllByRole('link', { name: 'GitHub (abre en nueva pestaña)' })).toHaveLength(2);
  expect(screen.getAllByRole('link', { name: 'LinkedIn (abre en nueva pestaña)' })).toHaveLength(2);
});
