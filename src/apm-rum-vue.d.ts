declare module '@elastic/apm-rum-vue' {
  import type { Plugin } from 'vue';
  import type { Router } from 'vue-router';
  
  export interface ApmConfig {
    serviceName: string;
    serverUrl: string;
    secretToken?: string;
    environment?: string;
    active?: boolean;
    distributedTracingOrigins?: string[];
    propagateTracestate?: boolean;
    distributedTracing?: boolean;
  }
  
  export interface ApmPluginOptions {
    router?: Router;
    config: ApmConfig;
  }
  
  export const ApmVuePlugin: Plugin;
}

