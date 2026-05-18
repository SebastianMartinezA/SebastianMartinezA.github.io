const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

let posthogPromise;

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
            defaults: '2026-01-30',
            autocapture: false,
            capture_pageview: true,
            capture_pageleave: false,
            disable_external_dependency_loading: true,
            disable_session_recording: true,
            disable_surveys: true,
            advanced_disable_flags: true,
            advanced_disable_feature_flags: true,
            person_profiles: 'identified_only',
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

  void initAnalytics().then((posthog) => {
    posthog?.capture(eventName, properties);
  });
};
