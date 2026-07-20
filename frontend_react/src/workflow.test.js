import { readFileSync } from 'node:fs';

import { expect, test } from 'vitest';

test('does not persist the write-scoped checkout credential during build steps', () => {
  const workflow = readFileSync('../.github/workflows/workflow.yml', 'utf8');

  expect(workflow).toContain('persist-credentials: false');
  expect(workflow).toContain('JamesIves/github-pages-deploy-action@8817a56e5bfec6e2b08345c81f4d422db53a2cdc');
});

test('keeps write permission out of the build job and deploys a verified artifact', () => {
  const workflow = readFileSync('../.github/workflows/workflow.yml', 'utf8');

  expect(workflow).toMatch(/permissions:\s*\n\s+contents: read/);
  expect(workflow).toContain('uses: actions/upload-artifact@v4');
  expect(workflow).toMatch(/deploy:\s*\n\s+needs: build/);
  expect(workflow).toMatch(/deploy:[\s\S]*permissions:\s*\n\s+contents: write/);
  expect(workflow).toContain('uses: actions/download-artifact@v4');
});
