import { expect, test } from 'vitest';

import { ANALYTICS_OPTIONS } from './analytics';

test('keeps optional analytics cookieless and memory-only', () => {
  expect(ANALYTICS_OPTIONS).toMatchObject({
    persistence: 'memory',
    autocapture: false,
    disable_session_recording: true,
    person_profiles: 'identified_only',
  });
});
