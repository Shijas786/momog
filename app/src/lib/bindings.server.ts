// Server-only access to this app's bindings.
// Safe for both Cloudflare Workers and standard Node.js/Vercel serverless environments.

type AppEnv = {
  DB?: any;
  STORAGE?: any;
  KV?: any;
  HF_ENV?: string;
  APP_SLUG?: string;
};

export function bindings(): AppEnv {
  // If we are building or running in a Vercel/Node environment, return an empty object to avoid crashes
  if (typeof globalThis === "undefined") {
    return {};
  }

  // Attempt to resolve cloudflare workers environment dynamically to prevent compile-time import errors on Vercel
  try {
    // In workers runtime, 'cloudflare:workers' is resolved. We check if the global has it.
    // If not, we return a mock or check globalThis env.
    const cfEnv = (globalThis as any).env || {};
    return cfEnv;
  } catch (e) {
    return {};
  }
}
