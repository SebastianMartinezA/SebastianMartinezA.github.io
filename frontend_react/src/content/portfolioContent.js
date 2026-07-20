import resumeUrl from '../assets/ResumeSebastian.pdf';

export const EMAIL = 'sebas@smar.ar';
export const GITHUB_URL = 'https://github.com/SebastianMartinezA';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/smartinezamaray/';
export const RESUME_URL = resumeUrl;

export const LANGUAGES = [
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'en', label: 'EN', name: 'English' },
];

export const translations = {
  es: {
    meta: {
      title: 'Sebastian Martinez · Senior Software Engineer en Mercado Libre',
    },
    nav: {
      about: 'Sobre mí',
      impact: 'Impacto',
      tech: 'Tecnologías',
      ai: 'IA',
      formation: 'Formación',
      projects: 'Proyectos',
      writing: 'Escritos',
      contact: 'Contacto',
    },
    controls: {
      skip: 'Saltar al contenido',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      switchLanguage: 'Cambiar idioma a inglés',
      switchToDark: 'Cambiar a modo oscuro',
      switchToLight: 'Cambiar a modo claro',
      copyEmail: 'Copiar email',
      copied: 'Copiado',
      copyFailed: 'No se pudo copiar',
      opensInNewTab: 'abre en nueva pestaña',
      primaryNavigation: 'Navegación principal',
      preferences: 'Preferencias',
      mobileNavigation: 'Navegación móvil',
      mobilePreferences: 'Preferencias móviles',
    },
    hero: {
      eyebrow: 'Backend, seguridad y escala',
      name: 'Sebastian Martinez',
      role: 'Senior Software Engineer',
      body: 'APIs core de autenticación mobile y web para cientos de millones de usuarios en LatAm. Sessions, Device Signing y banking sessions en Mercado Libre.',
      primaryCta: 'Contactarme',
      githubCta: 'GitHub',
      linkedinCta: 'LinkedIn',
      resumeCta: 'CV',
      availability: 'Buenos Aires · remoto, híbrido o presencial',
      citizenship: 'Doble ciudadanía AR/IT · disponible para EU',
    },
    about: {
      title: 'Sobre mí',
      body: 'Backend Engineer en el equipo de Sessions de Mercado Libre. Mantengo las APIs core de autenticación mobile y web en Go y Java que sostienen la sesión de cientos de millones de usuarios en LatAm — incluyendo SSO con Mercado Pago, scoped sessions, Device Signing y banking sessions para México. Me especializo en servicios de misión crítica donde la disponibilidad, la performance y la seguridad no son negociables. También soy referente de IA en mi equipo: construyo agentes, workflows y herramientas internas que aceleran el desarrollo.',
    },
    impact: {
      title: 'Impacto',
      stats: [
        { value: '3M+', unit: 'sesiones/día', label: 'Autenticación mobile y web en toda LatAm' },
        { value: '1M+', unit: 'enrolamientos/día', label: 'Device Signing para mobile' },
        { value: '99.99%', unit: 'uptime SLO', label: 'Objetivo de disponibilidad en servicios críticos' },
        { value: '500K+', unit: 'SSO/día', label: 'Canjes de nonce SSO mobile' },
      ],
    },
    tech: {
      title: 'Tecnologías',
      groups: [
        { label: 'Lenguajes', items: ['Go', 'Java'] },
        { label: 'Backend', items: ['REST', 'Spring Boot', 'Vert.x', 'JWT', 'Swagger/OpenAPI'] },
        { label: 'Mensajería y eventos', items: ['Kafka', 'Pub/Sub', 'Event Streaming'] },
        { label: 'Datos e infra', items: ['Redis', 'SQL', 'NoSQL', 'Docker', 'GCP', 'BigQuery'] },
        { label: 'Observabilidad', items: ['Datadog', 'Grafana', 'NewRelic', 'OpenTelemetry'] },
      ],
    },
    ai: {
      title: 'IA y Productividad',
      intro: 'Referente de IA en mi equipo. Construyo agentes, workflows y herramientas internas que aceleran a todo el equipo de Sessions.',
      stats: [
        { value: '10+', unit: 'plugins publicados', label: 'Marketplace interno de Claude Code para el equipo' },
        { value: '4x', unit: 'velocidad dev', label: 'Desarrollo de features con AI-assisted coding' },
        { value: '1', unit: 'agente RAG', label: 'Knowledge base interna autoactualizada' },
        { value: '3', unit: 'automatizaciones', label: 'Workflows en producción usados por el equipo' },
      ],
      stackTitle: 'Stack de IA',
      stack: ['Claude Code', 'Cursor', 'Codex', 'Windsurf', 'RAG', 'MCP', 'n8n', 'Multi-agent workflows'],
      highlightsTitle: 'Destacados',
      highlights: [
        'Diseñé y mantengo el marketplace de plugins de Claude Code de mi equipo: 10 plugins en producción, incluyendo debate multi-agente, ejecución de Codex/Gemini, generación de PR descriptions y resúmenes diarios.',
        'Construí un agente RAG sobre la knowledge base del dominio, autoactualizado semanalmente, en uso por la jerarquía del equipo.',
        'Lideré el primer feature AI-assisted del equipo de extremo a extremo: del RFC a producción, con métricas de 4x velocidad de desarrollo y 2x time-to-prod.',
        'Presenté en el primer Workshop de IA del equipo (audiencia de 50+ personas entre Sessions, Reauth, BI y Security).',
      ],
    },
    formation: {
      title: 'Formación',
      educationTitle: 'Educación',
      languagesTitle: 'Idiomas',
      degree: 'Ingeniería en Informática',
      institution: 'Universidad de Morón · 2019 – 2026',
      languages: [
        { name: 'Español', level: 'Nativo' },
        { name: 'Inglés', level: 'Bilingüe' },
        { name: 'Alemán', level: 'Básico' },
      ],
    },
    projects: {
      title: 'Proyectos',
      professionalTitle: 'Profesionales',
      sideTitle: 'Proyectos personales',
      roleLabel: 'Mi rol',
      items: [
        {
          title: 'Banking Sessions México',
          description: 'Diseño e implementación de sesiones bancarias para Mercado Pago México: creación, validación, unicidad, extensión, expiración y hard logout cross-domain.',
          role: 'Diseñé el modelo de unicidad de sesión cross-domain y el contrato de hard logout.',
          tags: ['Go', 'JWT', 'REST', 'BigQuery'],
        },
        {
          title: 'Device Signing Recovery',
          description: 'Lideré la fase 1 de reparación de un incidente que afectó cientos de miles de dispositivos en LatAm, definiendo SLOs de 99.99% y canary con rollback automático.',
          role: 'Definí los SLOs y el esquema de canary con rollback automático en la fase 1 del recovery.',
          tags: ['Go', 'Datadog', 'Incident Response'],
        },
      ],
      sideItems: [
        {
          title: 'Automatización de ventana IoT',
          description: 'Sistema de control automático de ventana/persiana con sensores magnéticos, sensor de temperatura y control por voz.',
          tags: ['Raspberry Pi', 'Python', 'IoT', 'Google Home'],
        },
      ],
    },
    writing: {
      title: 'Escritos',
      isVisible: false,
      items: [],
    },
    contact: {
      title: 'Contacto',
      body: 'Si querés hablar sobre backend, seguridad, automatización o una oportunidad interesante, escribime.',
      socialLabel: 'También podés encontrarme en',
    },
    footer: '© 2026 Sebastian Martinez',
    privacy: 'La analítica de uso opcional, cuando está configurada, envía visitas e interacciones a PostHog con identificadores solo en memoria: sin cookies ni almacenamiento local y sin grabación de sesiones.',
  },
  en: {
    meta: {
      title: 'Sebastian Martinez · Senior Software Engineer at Mercado Libre',
    },
    nav: {
      about: 'About',
      impact: 'Impact',
      tech: 'Technologies',
      ai: 'AI',
      formation: 'Education',
      projects: 'Projects',
      writing: 'Writing',
      contact: 'Contact',
    },
    controls: {
      skip: 'Skip to content',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      switchLanguage: 'Switch language to Spanish',
      switchToDark: 'Switch to dark mode',
      switchToLight: 'Switch to light mode',
      copyEmail: 'Copy email address',
      copied: 'Copied',
      copyFailed: 'Could not copy',
      opensInNewTab: 'opens in new tab',
      primaryNavigation: 'Primary navigation',
      preferences: 'Preferences',
      mobileNavigation: 'Mobile navigation',
      mobilePreferences: 'Mobile preferences',
    },
    hero: {
      eyebrow: 'Backend, security and scale',
      name: 'Sebastian Martinez',
      role: 'Senior Software Engineer',
      body: 'Core mobile and web authentication APIs for hundreds of millions of users across LatAm. Sessions, Device Signing, and banking sessions at Mercado Libre.',
      primaryCta: 'Contact me',
      githubCta: 'GitHub',
      linkedinCta: 'LinkedIn',
      resumeCta: 'Resume',
      availability: 'Buenos Aires · remote, hybrid or on-site',
      citizenship: 'Dual AR/IT citizenship · available for EU',
    },
    about: {
      title: 'About',
      body: 'Backend Engineer on Mercado Libre’s Sessions team. I maintain the core mobile and web authentication APIs in Go and Java that support the sessions of hundreds of millions of users across LatAm — including SSO with Mercado Pago, scoped sessions, Device Signing, and banking sessions for Mexico. I specialize in mission-critical services where availability, performance, and security are non-negotiable. I am also the AI lead on my team: I build agents, workflows, and internal tools that accelerate development.',
    },
    impact: {
      title: 'Impact',
      stats: [
        { value: '3M+', unit: 'sessions/day', label: 'Mobile and web authentication across LatAm' },
        { value: '1M+', unit: 'enrollments/day', label: 'Device Signing for mobile' },
        { value: '99.99%', unit: 'uptime SLO', label: 'Availability target for critical services' },
        { value: '500K+', unit: 'SSO/day', label: 'Mobile SSO nonce exchanges' },
      ],
    },
    tech: {
      title: 'Technologies',
      groups: [
        { label: 'Programming languages', items: ['Go', 'Java'] },
        { label: 'Backend', items: ['REST', 'Spring Boot', 'Vert.x', 'JWT', 'Swagger/OpenAPI'] },
        { label: 'Messaging and events', items: ['Kafka', 'Pub/Sub', 'Event Streaming'] },
        { label: 'Data and infra', items: ['Redis', 'SQL', 'NoSQL', 'Docker', 'GCP', 'BigQuery'] },
        { label: 'Observability', items: ['Datadog', 'Grafana', 'NewRelic', 'OpenTelemetry'] },
      ],
    },
    ai: {
      title: 'AI and Productivity',
      intro: 'AI lead on my team. I build agents, workflows, and internal tools that accelerate the entire Sessions team.',
      stats: [
        { value: '10+', unit: 'published plugins', label: 'Internal Claude Code marketplace for the team' },
        { value: '4x', unit: 'dev speed', label: 'Feature development with AI-assisted coding' },
        { value: '1', unit: 'RAG agent', label: 'Auto-updated internal knowledge base' },
        { value: '3', unit: 'automations', label: 'Production workflows used by the team' },
      ],
      stackTitle: 'AI stack',
      stack: ['Claude Code', 'Cursor', 'Codex', 'Windsurf', 'RAG', 'MCP', 'n8n', 'Multi-agent workflows'],
      highlightsTitle: 'Highlights',
      highlights: [
        'I designed and maintain my team’s Claude Code plugin marketplace: 10 plugins in production, including multi-agent debate, Codex/Gemini execution, PR description generation, and daily summaries.',
        'I built a RAG agent over the domain knowledge base, auto-updated weekly and used by the team hierarchy.',
        'I led the team’s first AI-assisted feature end to end: from RFC to production, with 4x development speed and 2x time-to-prod metrics.',
        'I presented at the team’s first AI Workshop (50+ people across Sessions, Reauth, BI, and Security).',
      ],
    },
    formation: {
      title: 'Education',
      educationTitle: 'Background',
      languagesTitle: 'Languages',
      degree: 'Computer Engineering',
      institution: 'Universidad de Morón · 2019 – 2026',
      languages: [
        { name: 'Spanish', level: 'Native' },
        { name: 'English', level: 'Bilingual' },
        { name: 'German', level: 'Basic' },
      ],
    },
    projects: {
      title: 'Projects',
      professionalTitle: 'Professional',
      sideTitle: 'Side projects',
      roleLabel: 'My role',
      items: [
        {
          title: 'Banking Sessions Mexico',
          description: 'Design and implementation of banking sessions for Mercado Pago Mexico: creation, validation, uniqueness, extension, expiration, and cross-domain hard logout.',
          role: 'I designed the cross-domain session uniqueness model and the hard logout contract.',
          tags: ['Go', 'JWT', 'REST', 'BigQuery'],
        },
        {
          title: 'Device Signing Recovery',
          description: 'Led phase 1 recovery for an incident that affected hundreds of thousands of devices across LatAm, defining 99.99% SLOs and canaries with automatic rollback.',
          role: 'I defined the SLOs and canary strategy with automatic rollback during phase 1 of the recovery.',
          tags: ['Go', 'Datadog', 'Incident Response'],
        },
      ],
      sideItems: [
        {
          title: 'IoT Window Automation',
          description: 'Automatic window/blind control system with magnetic sensors, temperature sensing, and voice control.',
          tags: ['Raspberry Pi', 'Python', 'IoT', 'Google Home'],
        },
      ],
    },
    writing: {
      title: 'Writing',
      isVisible: false,
      items: [],
    },
    contact: {
      title: 'Contact',
      body: 'If you want to talk about backend, security, automation or an interesting opportunity, send me a note.',
      socialLabel: 'You can also find me on',
    },
    footer: '© 2026 Sebastian Martinez',
    privacy: 'Optional usage analytics, when configured, sends pageviews and interactions to PostHog with memory-only identifiers: no cookies or local storage, and no session recording.',
  },
};
