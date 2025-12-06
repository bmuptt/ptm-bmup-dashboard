/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../stores'
import router from '../router'
import { ApmVuePlugin } from '@elastic/apm-rum-vue'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  // Check if APM is enabled
  const apmServerUrl = import.meta.env.VITE_APP_APM_SERVER_URL;
  const apmEnabled = apmServerUrl && apmServerUrl !== 'undefined' && apmServerUrl !== '';

  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(VueSweetalert2);

  // Only initialize APM if enabled
  if (apmEnabled) {
    app.use(ApmVuePlugin, {
      router,
      config: {
        serviceName: 'ptm-bmup-dashboard',
        serverUrl: apmServerUrl,
        // apiKey: import.meta.env.VITE_APP_APM_API_KEY_DASHBOARD || '',
        environment: import.meta.env.VITE_APP_NODE_ENV || 'development',
        active: true,
        distributedTracingOrigins: [
          import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:3000',
          import.meta.env.VITE_APP_BACKEND_URL_SETTING || 'http://localhost:3200',
          import.meta.env.VITE_APP_BACKEND_URL_FINANCE || 'http://localhost:3300',
        ],
        propagateTracestate: true,
        distributedTracing: true,
      }
    });
  }
}
