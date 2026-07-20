import { beforeEach, expect, test, vi } from 'vitest';

import { ANALYTICS_OPTIONS } from './analytics';

const mockPosthogCapture = vi.hoisted(() => vi.fn());

vi.mock('posthog-js', () => ({
  default: {
    __loaded: false,
    init: vi.fn(),
    capture: mockPosthogCapture,
  },
}));

beforeEach(() => {
  vi.resetModules();
  mockPosthogCapture.mockClear();
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN = 'test-ph-key';
  import.meta.env.VITE_PUBLIC_POSTHOG_HOST = 'https://eu.i.posthog.com';
});

test('keeps optional analytics cookieless and memory-only', () => {
  expect(ANALYTICS_OPTIONS).toMatchObject({
    persistence: 'memory',
    autocapture: false,
    disable_session_recording: true,
    person_profiles: 'identified_only',
  });
});

test('captures UTM params from the initial URL', async () => {
  history.replaceState(
    {},
    '',
    '/?utm_source=test_source&utm_medium=test_medium&utm_campaign=test_campaign&utm_term=test_term&utm_content=test_content',
  );

  const analytics = await import('./analytics');

  expect(analytics.INITIAL_UTM_PARAMS).toEqual({
    utm_source: 'test_source',
    utm_medium: 'test_medium',
    utm_campaign: 'test_campaign',
    utm_term: 'test_term',
    utm_content: 'test_content',
  });
});

test('merges UTM params into events while caller properties win', async () => {
  history.replaceState({}, '', '/?utm_source=original&utm_medium=cpc');
  const analytics = await import('./analytics');

  analytics.trackEvent('test_event', {
    utm_source: 'caller_wins',
    custom_prop: 'custom_value',
  });

  await vi.waitFor(() => {
    expect(mockPosthogCapture).toHaveBeenCalledWith('test_event', {
      utm_source: 'caller_wins',
      utm_medium: 'cpc',
      custom_prop: 'custom_value',
    });
  });
});
