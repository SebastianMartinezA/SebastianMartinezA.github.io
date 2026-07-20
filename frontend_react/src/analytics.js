const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

let posthogPromise;

const UTM_PARAM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

const readInitialUtmParams = () => {
  if (typeof window === 'undefined') return {};

  const searchParams = new URLSearchParams(window.location.search);
  return UTM_PARAM_KEYS.reduce((params, key) => {
    const value = searchParams.get(key);
    if (value) params[key] = value;
    return params;
  }, {});
};

// Capture campaign context once, without persisting it between visits.
export const INITIAL_UTM_PARAMS = readInitialUtmParams();

export const ANALYTICS_OPTIONS = {
  defaults: '2026-01-30',
  persistence: 'memory',
  autocapture: false,
  capture_pageview: true,
  capture_pageleave: false,
  disable_external_dependency_loading: true,
  disable_session_recording: true,
  disable_surveys: true,
  advanced_disable_flags: true,
  advanced_disable_feature_flags: true,
  person_profiles: 'identified_only',
};

export const initAnalytics = () => {
  if (!posthogKey || typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if (!posthogPromise) {
    posthogPromise = import('posthog-js')
      .then(({ default: posthog }) => {
        if (!posthog.__loaded) {
          posthog.init(posthogKey, {
            api_host: posthogHost,
            ...ANALYTICS_OPTIONS,
          });
        }

        return posthog;
      })
      .catch(() => null);
  }

  return posthogPromise;
};

export const trackEvent = (eventName, properties = {}) => {
  if (!posthogKey) return;

  const eventProperties = {
    ...INITIAL_UTM_PARAMS,
    ...properties,
  };

  void initAnalytics().then((posthog) => {
    posthog?.capture(eventName, eventProperties);
  });
};
