import { describe, test, expect, beforeEach, vi } from 'vitest';
import type { App } from 'vue';

vi.mock('@elastic/apm-rum-vue', () => ({
  ApmVuePlugin: { __apm: true },
}));

// Import after mock
import { registerPlugins } from '@/plugins';
import { ApmVuePlugin as Sentinel } from '@elastic/apm-rum-vue';

describe('APM toggle via env', () => {
  const used: unknown[] = [];
  const appStub = {
    use: (plugin: unknown) => {
      used.push(plugin);
      return appStub as unknown as App;
    },
  } as unknown as App;

  beforeEach(() => {
    used.length = 0;
    // Prefer window.__ENV__ for deterministic tests
    window.__ENV__ = {
      VITE_APP_APM_SERVER_URL: 'http://localhost:8200',
    };
  });

  test('does not register APM when VITE_APP_APM_ACTIVE is false', () => {
    window.__ENV__!.VITE_APP_APM_ACTIVE = 'false';
    registerPlugins(appStub);
    const hasApm = used.includes(Sentinel);
    expect(hasApm).toBe(false);
  });

  test('registers APM when VITE_APP_APM_ACTIVE is true', () => {
    window.__ENV__!.VITE_APP_APM_ACTIVE = 'true';
    registerPlugins(appStub);
    const hasApm = used.includes(Sentinel);
    expect(hasApm).toBe(true);
  });
});
